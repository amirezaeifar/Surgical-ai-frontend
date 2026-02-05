<template>
  <div class="space-y-6" v-if="operation">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-semibold">جزئیات عملیات {{ operation.caseNumber }}</h2>
        <p class="text-sm opacity-70">{{ operation.orRoom }} · {{ operation.surgeon }}</p>
      </div>
      <div class="flex items-center gap-3">
        <Badge :label="statusLabel(operation.status)" :variant="statusVariant(operation.status)" />
        <button class="btn btn-primary" @click="createModalOpen = true">ثبت رویداد جدید</button>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="card bg-base-200">
        <div class="card-body">
          <h3 class="card-title">تراز اقلام</h3>
          <DataTable :headers="['نوع ابزار', 'تحویل شده', 'برگشت شده', 'مانده']">
            <tr v-for="item in balanceRows" :key="item.objectTypeId">
              <td>{{ item.objectTypeName }}</td>
              <td>{{ item.issued }}</td>
              <td>{{ item.returned }}</td>
              <td>
                <span :class="item.remaining > 0 ? 'text-error' : 'text-success'">
                  {{ item.remaining }}
                </span>
              </td>
            </tr>
          </DataTable>
        </div>
      </div>

      <div class="card bg-base-200">
        <div class="card-body">
          <h3 class="card-title">خط زمانی رویدادها</h3>
          <Timeline :events="timelineItems" />
        </div>
      </div>
    </div>

    <ConfirmItemsModal
      :open="itemsModalOpen"
      :items="draftItems"
      @update="draftItems = $event"
      @close="itemsModalOpen = false"
      @confirm="itemsModalOpen = false"
    />
    <dialog class="modal" :open="createModalOpen">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">ثبت رویداد جدید</h3>
        <div class="space-y-3">
          <select v-model="selectedGateId" class="select select-bordered w-full">
            <option disabled value="">انتخاب گیت</option>
            <option v-for="gate in dataStore.gates" :key="gate.id" :value="gate.id">{{ gate.name }}</option>
          </select>
          <select v-model="selectedAction" class="select select-bordered w-full">
            <option value="ISSUE">تحویل</option>
            <option value="RETURN">عودت</option>
            <option value="TRANSFER">انتقال</option>
            <option value="CLEAN_IN">ورود کلین‌روم</option>
            <option value="CLEAN_OUT">خروج کلین‌روم</option>
            <option value="AUDIT_CHECK">ممیزی</option>
          </select>
          <textarea v-model="notes" class="textarea textarea-bordered" placeholder="یادداشت"></textarea>
          <button class="btn btn-outline" @click="openItemsModal">تنظیم اقلام شناسایی‌شده</button>
        </div>
        <div class="modal-action">
          <button class="btn" @click="createModalOpen = false">انصراف</button>
          <button class="btn btn-primary" @click="submitEvent">ثبت</button>
        </div>
      </div>
    </dialog>
  </div>
  <EmptyState v-else title="عملیات یافت نشد" description="شناسه عملیات معتبر نیست." />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useDataStore } from '../../stores/data'
import { useAuthStore } from '../../stores/auth'
import DataTable from '../../components/DataTable.vue'
import Badge from '../../components/Badge.vue'
import Timeline from '../../components/Timeline.vue'
import EmptyState from '../../components/EmptyState.vue'
import ConfirmItemsModal from '../../components/ConfirmItemsModal.vue'
import type { DetectedItem, Operation } from '../../types'

const route = useRoute()
const dataStore = useDataStore()
const authStore = useAuthStore()

const operationId = route.params.id as string
const operation = ref<Operation | null>(null)

const createModalOpen = ref(false)
const itemsModalOpen = ref(false)
const selectedGateId = ref('')
const selectedAction = ref('ISSUE')
const notes = ref('')
const draftItems = ref<DetectedItem[]>([])

onMounted(async () => {
  await Promise.all([dataStore.loadEvents({ operationId }), dataStore.loadGates(), dataStore.loadObjectTypes()])
  operation.value = await dataStore.loadOperationById(operationId)
  if (!draftItems.value.length) {
    draftItems.value = dataStore.objectTypes.map((item) => ({
      objectTypeId: item.id,
      objectTypeName: item.name,
      count: 0,
      confidence: 0.9
    }))
  }
})

const operationEvents = computed(() => dataStore.events.filter((event) => event.operationId === operationId))

const balanceRows = computed(() => {
  return dataStore.objectTypes.map((type) => {
    const issued = operationEvents.value
      .filter((event) => event.action === 'ISSUE')
      .reduce((sum, event) => sum + (event.detectedItems.find((item) => item.objectTypeId === type.id)?.count || 0), 0)
    const returned = operationEvents.value
      .filter((event) => event.action === 'RETURN')
      .reduce((sum, event) => sum + (event.detectedItems.find((item) => item.objectTypeId === type.id)?.count || 0), 0)
    return {
      objectTypeId: type.id,
      objectTypeName: type.name,
      issued,
      returned,
      remaining: issued - returned
    }
  })
})

const timelineItems = computed(() =>
  operationEvents.value.map((event) => ({
    id: event.id,
    timestamp: event.timestamp,
    actionLabel: actionLabel(event.action),
    description: `${event.gateName} · ${event.userName}`
  }))
)

const openItemsModal = () => {
  itemsModalOpen.value = true
}

const submitEvent = async () => {
  if (!selectedGateId.value) return
  const gate = dataStore.gates.find((item) => item.id === selectedGateId.value)
  if (!gate || !operation.value || !authStore.currentUser) return

  const payload = {
    id: `ev-${Date.now()}`,
    timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
    gateId: gate.id,
    gateName: gate.name,
    userId: authStore.currentUser.id,
    userName: authStore.currentUser.name,
    operationId: operation.value.id,
    action: selectedAction.value as any,
    detectedItems: draftItems.value,
    verification: 'USER_CONFIRMED' as const,
    notes: notes.value
  }

  await dataStore.createEvent(payload)
  await dataStore.loadEvents({ operationId })
  createModalOpen.value = false
}

const statusLabel = (value: string) => {
  const map: Record<string, string> = {
    SCHEDULED: 'برنامه‌ریزی‌شده',
    IN_PROGRESS: 'در جریان',
    CLOSED: 'بسته‌شده'
  }
  return map[value] || value
}

const statusVariant = (value: string) => {
  const map: Record<string, 'info' | 'success' | 'neutral'> = {
    SCHEDULED: 'info',
    IN_PROGRESS: 'success',
    CLOSED: 'neutral'
  }
  return map[value] || 'neutral'
}

const actionLabel = (action: string) => {
  const map: Record<string, string> = {
    ISSUE: 'تحویل',
    TRANSFER: 'انتقال',
    RETURN: 'عودت',
    CLEAN_IN: 'ورود کلین‌روم',
    CLEAN_OUT: 'خروج کلین‌روم',
    AUDIT_CHECK: 'ممیزی',
    EXCEPTION: 'استثنا'
  }
  return map[action] || action
}
</script>
