<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold">لاگ ممیزی</h2>
    <DataTable :headers="['زمان', 'عملیات', 'گیت', 'اقدام', 'تایید']">
      <tr v-for="event in dataStore.events" :key="event.id">
        <td>{{ event.timestamp }}</td>
        <td>{{ event.operationId }}</td>
        <td>{{ event.gateName }}</td>
        <td>{{ actionLabel(event.action) }}</td>
        <td>{{ verificationLabel(event.verification) }}</td>
      </tr>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDataStore } from '../../stores/data'
import DataTable from '../../components/DataTable.vue'

const dataStore = useDataStore()

onMounted(() => {
  dataStore.loadEvents()
})

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
</script>
