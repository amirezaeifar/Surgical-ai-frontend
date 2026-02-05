<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">گیت‌های فعال</h2>
    </div>
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
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDataStore } from '../../stores/data'
import DataTable from '../../components/DataTable.vue'
import Badge from '../../components/Badge.vue'

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
