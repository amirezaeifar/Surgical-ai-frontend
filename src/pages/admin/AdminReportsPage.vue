<template>
  <div class="space-y-6">
    <PageHeader title="گزارش‌ها" subtitle="خلاصه عملکرد گیت‌ها و رویدادها">
      <template #actions>
        <button class="btn btn-primary btn-sm" @click="exportCsv">خروجی CSV</button>
      </template>
    </PageHeader>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="card bg-base-200">
        <div class="card-body">
          <h3 class="card-title">جمع رویدادها بر اساس گیت</h3>
          <ul class="space-y-2">
            <li v-for="gate in dataStore.gates" :key="gate.id" class="flex justify-between">
              <span>{{ gate.name }}</span>
              <span class="font-semibold">{{ eventsByGate(gate.id) }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="card bg-base-200">
        <div class="card-body">
          <h3 class="card-title">جمع رویدادها بر اساس نوع اقدام</h3>
          <ul class="space-y-2">
            <li v-for="action in actions" :key="action" class="flex justify-between">
              <span>{{ actionLabel(action) }}</span>
              <span class="font-semibold">{{ eventsByAction(action) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <EmptyState
      v-if="!dataStore.events.length"
      title="داده‌ای برای گزارش وجود ندارد"
      description="پس از ثبت رویدادها، نمودارهای گزارش فعال می‌شوند."
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDataStore } from '../../stores/data'
import EmptyState from '../../components/EmptyState.vue'
import PageHeader from '../../components/PageHeader.vue'

const dataStore = useDataStore()
const actions = ['ISSUE', 'RETURN', 'TRANSFER', 'CLEAN_IN', 'CLEAN_OUT', 'AUDIT_CHECK', 'EXCEPTION']

onMounted(async () => {
  await Promise.all([dataStore.loadEvents(), dataStore.loadGates()])
})

const eventsByGate = (gateId: string) => dataStore.events.filter((event) => event.gateId === gateId).length

const eventsByAction = (action: string) => dataStore.events.filter((event) => event.action === action).length

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

const exportCsv = () => {
  const headers = ['id', 'timestamp', 'gate', 'operation', 'action', 'verification']
  const rows = dataStore.events.map((event) => [
    event.id,
    event.timestamp,
    event.gateName,
    event.operationId,
    actionLabel(event.action),
    event.verification
  ])
  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'reports.csv'
  link.click()
}
</script>
