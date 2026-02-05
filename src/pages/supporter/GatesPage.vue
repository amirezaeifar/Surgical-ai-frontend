<template>
  <div class="space-y-6">
    <PageHeader title="گیت‌های فعال" subtitle="نمایش وضعیت آخرین گیت‌های متصل">
      <template #actions>
        <RouterLink to="/app/events" class="btn btn-ghost btn-sm">رویدادهای گیت</RouterLink>
      </template>
    </PageHeader>
    <DataTable :headers="['نام گیت', 'مکان', 'نوع', 'شناسه دستگاه', 'وضعیت']">
      <tr v-for="gate in dataStore.gates" :key="gate.id">
        <td>{{ gate.name }}</td>
        <td>{{ gate.location }}</td>
        <td>{{ typeLabel(gate.type) }}</td>
        <td>{{ gate.deviceId }}</td>
        <td>
          <Badge :label="gate.isActive ? 'فعال' : 'غیرفعال'" :variant="gate.isActive ? 'success' : 'neutral'" />
        </td>
      </tr>
    </DataTable>
    <EmptyState
      v-if="!dataStore.gates.length"
      title="گیتی یافت نشد"
      description="پس از پیکربندی گیت‌ها، این بخش به‌روزرسانی می‌شود."
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDataStore } from '../../stores/data'
import { RouterLink } from 'vue-router'
import DataTable from '../../components/DataTable.vue'
import Badge from '../../components/Badge.vue'
import EmptyState from '../../components/EmptyState.vue'
import PageHeader from '../../components/PageHeader.vue'

const dataStore = useDataStore()

onMounted(() => {
  dataStore.loadGates()
})

const typeLabel = (value: string) => {
  const map: Record<string, string> = {
    OR_ISSUE: 'تحویل اتاق عمل',
    OR_RETURN: 'عودت اتاق عمل',
    CLEAN_ROOM: 'کلین‌روم',
    TRANSFER: 'انتقال'
  }
  return map[value] || value
}
</script>
