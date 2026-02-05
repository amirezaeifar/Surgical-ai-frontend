<template>
  <div class="space-y-6">
    <PageHeader title="لیست عملیات" subtitle="وضعیت آخرین جراحی‌ها و ابزارهای مرتبط">
      <template #actions>
        <RouterLink to="/kiosk" class="btn btn-primary btn-sm">ثبت رویداد جدید</RouterLink>
      </template>
    </PageHeader>

    <div class="flex items-center justify-between">
      <span class="text-sm opacity-70">{{ filteredOperations.length }} مورد</span>
      <RouterLink to="/app/events" class="btn btn-ghost btn-sm">مشاهده رویدادها</RouterLink>
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

    <DataTable :headers="['شماره کیس', 'اتاق عمل', 'جراح', 'زمان شروع', 'وضعیت', 'جزئیات', 'اقدام سریع']">
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
        <td>
          <RouterLink class="btn btn-xs btn-outline" to="/kiosk">ثبت رویداد</RouterLink>
        </td>
      </tr>
    </DataTable>

    <EmptyState
      v-if="!filteredOperations.length"
      title="عملیاتی برای نمایش وجود ندارد"
      description="با تعریف عملیات جدید یا ثبت رویداد، لیست به‌روزرسانی می‌شود."
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useDataStore } from '../../stores/data'
import DataTable from '../../components/DataTable.vue'
import FilterBar from '../../components/FilterBar.vue'
import Badge from '../../components/Badge.vue'
import EmptyState from '../../components/EmptyState.vue'
import PageHeader from '../../components/PageHeader.vue'

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
