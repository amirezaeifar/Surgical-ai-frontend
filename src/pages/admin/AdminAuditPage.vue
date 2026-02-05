<template>
  <div class="space-y-6">
    <PageHeader title="لاگ ممیزی" subtitle="بازبینی رویدادهای ثبت شده به تفکیک گیت">
      <template #actions>
        <RouterLink to="/admin/reports" class="btn btn-ghost btn-sm">گزارش‌ها</RouterLink>
      </template>
    </PageHeader>
    <DataTable :headers="['زمان', 'عملیات', 'گیت', 'اقدام', 'تایید']">
      <tr v-for="event in dataStore.events" :key="event.id">
        <td>{{ event.timestamp }}</td>
        <td>{{ event.operationId }}</td>
        <td>{{ event.gateName }}</td>
        <td>{{ actionLabel(event.action) }}</td>
        <td>{{ verificationLabel(event.verification) }}</td>
      </tr>
    </DataTable>
    <EmptyState
      v-if="!dataStore.events.length"
      title="لاگی برای نمایش وجود ندارد"
      description="پس از ثبت رویدادها، لاگ ممیزی تکمیل می‌شود."
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useDataStore } from '../../stores/data'
import DataTable from '../../components/DataTable.vue'
import EmptyState from '../../components/EmptyState.vue'
import PageHeader from '../../components/PageHeader.vue'

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
