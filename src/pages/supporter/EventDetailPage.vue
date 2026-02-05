<template>
  <div class="space-y-6" v-if="event">
    <PageHeader :title="`جزئیات رویداد ${event.id}`" :subtitle="`${event.timestamp} · ${event.gateName}`">
      <template #actions>
        <RouterLink to="/app/events" class="btn btn-ghost btn-sm">بازگشت به رویدادها</RouterLink>
        <RouterLink :to="`/app/operations/${event.operationId}`" class="btn btn-outline btn-sm">
          مشاهده عملیات
        </RouterLink>
        <Badge :label="verificationLabel(event.verification)" :variant="verificationVariant(event.verification)" />
      </template>
    </PageHeader>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="card bg-base-200">
        <div class="card-body">
          <h3 class="card-title">تصویر ثبت شده</h3>
          <img
            :src="event.imageUrl || placeholder"
            alt="تصویر رویداد"
            class="rounded-box object-cover w-full h-60"
          />
        </div>
      </div>
      <div class="card bg-base-200">
        <div class="card-body">
          <h3 class="card-title">اقلام شناسایی‌شده</h3>
          <DataTable :headers="['نوع ابزار', 'تعداد', 'اعتماد']">
            <tr v-for="item in event.detectedItems" :key="item.objectTypeId">
              <td>{{ item.objectTypeName }}</td>
              <td>{{ item.count }}</td>
              <td>{{ Math.round(item.confidence * 100) }}%</td>
            </tr>
          </DataTable>
        </div>
      </div>
    </div>

    <div class="card bg-base-200">
      <div class="card-body">
        <h3 class="card-title">جزئیات متادیتا</h3>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <span class="font-semibold">عملیات:</span>
            <RouterLink class="link" :to="`/app/operations/${event.operationId}`">
              {{ operationLabel(event.operationId) }}
            </RouterLink>
          </div>
          <div><span class="font-semibold">حامی:</span> {{ event.userName }}</div>
          <div><span class="font-semibold">اقدام:</span> {{ actionLabel(event.action) }}</div>
          <div><span class="font-semibold">یادداشت:</span> {{ event.notes || '—' }}</div>
        </div>
      </div>
    </div>
  </div>
  <EmptyState v-else title="رویداد یافت نشد" description="شناسه رویداد معتبر نیست." />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useDataStore } from '../../stores/data'
import DataTable from '../../components/DataTable.vue'
import Badge from '../../components/Badge.vue'
import EmptyState from '../../components/EmptyState.vue'
import PageHeader from '../../components/PageHeader.vue'
import type { GateEvent } from '../../types'

const route = useRoute()
const dataStore = useDataStore()
const event = ref<GateEvent | null>(null)

const placeholder = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a1?auto=format&fit=crop&w=800&q=60'

onMounted(async () => {
  await Promise.all([dataStore.loadEvents(), dataStore.loadOperations()])
  const eventId = route.params.id as string
  event.value = (await dataStore.loadEventById(eventId)) ?? null
})

const operationLabel = (operationId: string) => {
  const operation = dataStore.operations.find((op) => op.id === operationId)
  return operation ? operation.caseNumber : 'نامشخص'
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

const verificationLabel = (value: string) => {
  const map: Record<string, string> = {
    AUTO_ACCEPTED: 'خودکار',
    USER_CONFIRMED: 'تایید کاربر',
    USER_CORRECTED: 'اصلاح کاربر'
  }
  return map[value] || value
}

const verificationVariant = (value: string) => {
  const map: Record<string, 'info' | 'success' | 'warning'> = {
    AUTO_ACCEPTED: 'info',
    USER_CONFIRMED: 'success',
    USER_CORRECTED: 'warning'
  }
  return map[value] || 'info'
}
</script>
