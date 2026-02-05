<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">لیست عملیات</h2>
      <span class="text-sm opacity-70">{{ filteredOperations.length }} مورد</span>
    </div>

    <FilterBar>
      <input v-model="search" class="input input-bordered" placeholder="جستجو بر اساس شماره کیس یا جراح" />
      <select v-model="status" class="select select-bordered">
        <option value="">همه وضعیت‌ها</option>
        <option value="SCHEDULED">برنامه‌ریزی‌شده</option>
        <option value="IN_PROGRESS">در جریان</option>
        <option value="CLOSED">بسته‌شده</option>
      </select>
    </FilterBar>

    <DataTable :headers="['شماره کیس', 'اتاق عمل', 'جراح', 'زمان شروع', 'وضعیت', 'جزئیات']">
      <tr v-for="operation in filteredOperations" :key="operation.id">
        <td>{{ operation.caseNumber }}</td>
        <td>{{ operation.orRoom }}</td>
        <td>{{ operation.surgeon }}</td>
        <td>{{ operation.scheduledStart }}</td>
        <td>
          <Badge :label="statusLabel(operation.status)" :variant="statusVariant(operation.status)" />
        </td>
        <td>
          <RouterLink class="link" :to="`/app/operations/${operation.id}`">مشاهده</RouterLink>
        </td>
      </tr>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useDataStore } from '../../stores/data'
import DataTable from '../../components/DataTable.vue'
import FilterBar from '../../components/FilterBar.vue'
import Badge from '../../components/Badge.vue'

const dataStore = useDataStore()
const search = ref('')
const status = ref('')

onMounted(() => {
  dataStore.loadOperations()
})

const filteredOperations = computed(() => {
  return dataStore.operations.filter((operation) => {
    const matchesSearch =
      operation.caseNumber.includes(search.value) ||
      operation.orRoom.includes(search.value) ||
      operation.surgeon.includes(search.value)
    const matchesStatus = status.value ? operation.status === status.value : true
    return matchesSearch && matchesStatus
  })
})

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
</script>
