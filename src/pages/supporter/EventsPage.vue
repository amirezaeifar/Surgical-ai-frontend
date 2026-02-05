<template>
  <div class="space-y-6">
    <PageHeader title="رویدادها" subtitle="مرور کامل رویدادهای ثبت شده">
      <template #actions>
        <RouterLink to="/kiosk" class="btn btn-primary btn-sm">ثبت رویداد جدید</RouterLink>
      </template>
    </PageHeader>

    <div class="flex items-center justify-between">
      <span class="text-sm opacity-70">{{ pagedEvents.length }} از {{ filteredEvents.length }}</span>
      <RouterLink to="/app/operations" class="btn btn-ghost btn-sm">مشاهده عملیات</RouterLink>
    </div>

    <FilterBar>
      <input v-model="filters.dateFrom" type="date" class="input input-bordered" />
      <input v-model="filters.dateTo" type="date" class="input input-bordered" />
      <select v-model="filters.gateId" class="select select-bordered">
        <option value="">همه گیت‌ها</option>
        <option v-for="gate in dataStore.gates" :key="gate.id" :value="gate.id">{{ gate.name }}</option>
      </select>
      <select v-model="filters.action" class="select select-bordered">
        <option value="">همه اقدامات</option>
        <option value="ISSUE">تحویل</option>
        <option value="RETURN">عودت</option>
        <option value="TRANSFER">انتقال</option>
        <option value="CLEAN_IN">ورود کلین‌روم</option>
        <option value="CLEAN_OUT">خروج کلین‌روم</option>
        <option value="AUDIT_CHECK">ممیزی</option>
        <option value="EXCEPTION">استثنا</option>
      </select>
      <select v-model="filters.verification" class="select select-bordered">
        <option value="">همه وضعیت‌ها</option>
        <option value="AUTO_ACCEPTED">خودکار</option>
        <option value="USER_CONFIRMED">تایید کاربر</option>
        <option value="USER_CORRECTED">اصلاح کاربر</option>
      </select>
    </FilterBar>

    <DataTable :headers="['زمان', 'گیت', 'عملیات', 'اقدام', 'تایید', 'جزئیات']">
      <tr v-for="event in pagedEvents" :key="event.id">
        <td>{{ event.timestamp }}</td>
        <td>{{ event.gateName }}</td>
        <td>
          <RouterLink class="link" :to="`/app/operations/${event.operationId}`">
            {{ operationLabel(event.operationId) }}
          </RouterLink>
        </td>
        <td>{{ actionLabel(event.action) }}</td>
        <td>{{ verificationLabel(event.verification) }}</td>
        <td>
          <RouterLink class="link" :to="`/app/events/${event.id}`">مشاهده</RouterLink>
        </td>
      </tr>
    </DataTable>

    <EmptyState
      v-if="!filteredEvents.length"
      title="رویدادی برای نمایش وجود ندارد"
      description="با ثبت رویداد جدید از حالت کیوسک، این لیست به‌روز می‌شود."
    />

    <div class="flex justify-between items-center">
      <button class="btn" :disabled="page === 1" @click="page--">قبلی</button>
      <span>صفحه {{ page }}</span>
      <button class="btn" :disabled="page * pageSize >= filteredEvents.length" @click="page++">بعدی</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useDataStore } from '../../stores/data'
import DataTable from '../../components/DataTable.vue'
import FilterBar from '../../components/FilterBar.vue'
import EmptyState from '../../components/EmptyState.vue'
import PageHeader from '../../components/PageHeader.vue'

const dataStore = useDataStore()
const filters = reactive({
  dateFrom: '',
  dateTo: '',
  gateId: '',
  action: '',
  verification: ''
})
const page = ref(1)
const pageSize = 6

onMounted(async () => {
  await Promise.all([dataStore.loadEvents(), dataStore.loadGates(), dataStore.loadOperations()])
})

watch(filters, () => {
  page.value = 1
})

const filteredEvents = computed(() => {
  return dataStore.events.filter((event) => {
    const matchesGate = filters.gateId ? event.gateId === filters.gateId : true
    const matchesAction = filters.action ? event.action === filters.action : true
    const matchesVerification = filters.verification ? event.verification === filters.verification : true
    return matchesGate && matchesAction && matchesVerification
  })
})

const pagedEvents = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredEvents.value.slice(start, start + pageSize)
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
</script>
