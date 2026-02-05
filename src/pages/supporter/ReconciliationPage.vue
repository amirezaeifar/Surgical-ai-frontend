<template>
  <div class="space-y-6">
    <PageHeader title="تطبیق کلین‌روم" subtitle="کنترل مغایرت اقلام و ثبت رویدادهای استثنا">
      <template #actions>
        <button class="btn btn-outline btn-sm" @click="refresh">بازآوری</button>
      </template>
    </PageHeader>

    <DataTable :headers="['عملیات', 'ابزار', 'مانده', 'آخرین محل ثبت شده', 'اقدام']">
      <tr v-for="row in reconciliationRows" :key="row.key">
        <td>
          <RouterLink class="link" :to="`/app/operations/${row.operationId}`">
            {{ row.caseNumber }}
          </RouterLink>
        </td>
        <td>{{ row.objectTypeName }}</td>
        <td class="text-error font-semibold">{{ row.remaining }}</td>
        <td>
          <RouterLink v-if="row.lastEventId" class="link" :to="`/app/events/${row.lastEventId}`">
            {{ row.lastSeen }}
          </RouterLink>
          <span v-else>{{ row.lastSeen }}</span>
        </td>
        <td>
          <button class="btn btn-sm" @click="openException(row)">ایجاد رویداد استثنا</button>
        </td>
      </tr>
    </DataTable>

    <EmptyState
      v-if="!reconciliationRows.length"
      title="هیچ مورد مشکوکی یافت نشد"
      description="همه اقلام در تعادل هستند."
    />

    <dialog class="modal" :open="exceptionModalOpen">
      <div class="modal-box">
        <h3 class="font-bold text-lg">رویداد استثنا</h3>
        <p class="text-sm opacity-70">ثبت توضیحات و تایید مدیر الزامی است.</p>
        <textarea v-model="exceptionNotes" class="textarea textarea-bordered mt-4" placeholder="توضیحات"></textarea>
        <label class="label cursor-pointer gap-2 justify-start">
          <input v-model="managerConfirm" type="checkbox" class="checkbox" />
          <span class="label-text">تایید مدیر را دارم</span>
        </label>
        <div class="modal-action">
          <button class="btn" @click="exceptionModalOpen = false">انصراف</button>
          <button class="btn btn-primary" :disabled="!managerConfirm" @click="submitException">
            ثبت رویداد
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDataStore } from '../../stores/data'
import { useAuthStore } from '../../stores/auth'
import { RouterLink } from 'vue-router'
import DataTable from '../../components/DataTable.vue'
import EmptyState from '../../components/EmptyState.vue'
import PageHeader from '../../components/PageHeader.vue'
import type { DetectedItem } from '../../types'

const dataStore = useDataStore()
const authStore = useAuthStore()

const exceptionModalOpen = ref(false)
const exceptionNotes = ref('')
const managerConfirm = ref(false)
const selectedRow = ref<any>(null)

const refresh = async () => {
  await Promise.all([dataStore.loadEvents(), dataStore.loadOperations(), dataStore.loadObjectTypes(), dataStore.loadGates()])
}

onMounted(refresh)

const reconciliationRows = computed(() => {
  const rows: {
    key: string
    caseNumber: string
    operationId: string
    objectTypeId: string
    objectTypeName: string
    remaining: number
    lastSeen: string
    lastEventId?: string
  }[] = []
  dataStore.operations.forEach((operation) => {
    dataStore.objectTypes.forEach((type) => {
      const issued = dataStore.events
        .filter((event) => event.operationId === operation.id && event.action === 'ISSUE')
        .reduce((sum, event) => sum + (event.detectedItems.find((item) => item.objectTypeId === type.id)?.count || 0), 0)
      const returned = dataStore.events
        .filter((event) => event.operationId === operation.id && event.action === 'RETURN')
        .reduce((sum, event) => sum + (event.detectedItems.find((item) => item.objectTypeId === type.id)?.count || 0), 0)
      const remaining = issued - returned
      if (remaining > 0) {
        const lastEvent = dataStore.events
          .filter((event) => event.operationId === operation.id)
          .find((event) => event.detectedItems.some((item) => item.objectTypeId === type.id))
        rows.push({
          key: `${operation.id}-${type.id}`,
          caseNumber: operation.caseNumber,
          operationId: operation.id,
          objectTypeId: type.id,
          objectTypeName: type.name,
          remaining,
          lastSeen: lastEvent ? `${lastEvent.gateName} · ${lastEvent.timestamp}` : 'نامشخص',
          lastEventId: lastEvent?.id
        })
      }
    })
  })
  return rows
})

const openException = (row: any) => {
  selectedRow.value = row
  exceptionModalOpen.value = true
}

const submitException = async () => {
  if (!selectedRow.value || !authStore.currentUser) return
  const items: DetectedItem[] = [
    {
      objectTypeId: selectedRow.value.objectTypeId || 'unknown',
      objectTypeName: selectedRow.value.objectTypeName,
      count: selectedRow.value.remaining,
      confidence: 1
    }
  ]
  await dataStore.createEvent({
    id: `ex-${Date.now()}`,
    timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
    gateId: 'g3',
    gateName: 'گیت کلین‌روم',
    userId: authStore.currentUser.id,
    userName: authStore.currentUser.name,
    operationId: dataStore.operations.find((op) => op.caseNumber === selectedRow.value.caseNumber)?.id || '',
    action: 'EXCEPTION',
    detectedItems: items,
    verification: 'USER_CONFIRMED',
    notes: exceptionNotes.value
  })
  exceptionModalOpen.value = false
  exceptionNotes.value = ''
  managerConfirm.value = false
  await refresh()
}
</script>
