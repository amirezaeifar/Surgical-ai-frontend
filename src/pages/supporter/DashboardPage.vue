<template>
  <div class="space-y-6">
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div class="stat bg-base-200 rounded-box">
        <div class="stat-title">عملیات فعال</div>
        <div class="stat-value">{{ activeOperations }}</div>
        <div class="stat-desc">در حال اجرا</div>
      </div>
      <div class="stat bg-base-200 rounded-box">
        <div class="stat-title">هشدارهای باز</div>
        <div class="stat-value">{{ alerts.length }}</div>
        <div class="stat-desc">آخرین ۲۴ ساعت</div>
      </div>
      <div class="stat bg-base-200 rounded-box">
        <div class="stat-title">رویدادهای امروز</div>
        <div class="stat-value">{{ events.length }}</div>
        <div class="stat-desc">ثبت شده</div>
      </div>
      <div class="stat bg-base-200 rounded-box">
        <div class="stat-title">اقلام گمشده</div>
        <div class="stat-value">{{ missingItems }}</div>
        <div class="stat-desc">در عملیات فعال</div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="card bg-base-200">
        <div class="card-body">
          <h3 class="card-title">هشدارهای اخیر</h3>
          <div v-if="alerts.length" class="space-y-3">
            <div
              v-for="alert in alerts"
              :key="alert.id"
              class="border border-base-300 rounded-box p-3 flex items-start justify-between"
            >
              <div>
                <div class="font-semibold">{{ alert.message }}</div>
                <div class="text-xs opacity-70">{{ alert.createdAt }}</div>
              </div>
              <Badge :label="severityLabel(alert.severity)" :variant="severityVariant(alert.severity)" />
            </div>
          </div>
          <EmptyState
            v-else
            title="هشداری ثبت نشده است"
            description="در حال حاضر همه چیز پایدار است."
          />
        </div>
      </div>

      <div class="card bg-base-200">
        <div class="card-body">
          <h3 class="card-title">رویدادهای اخیر</h3>
          <DataTable :headers="['زمان', 'گیت', 'عملیات', 'نوع اقدام']">
            <tr v-for="event in events.slice(0, 5)" :key="event.id">
              <td>{{ event.timestamp }}</td>
              <td>{{ event.gateName }}</td>
              <td>{{ operationLabel(event.operationId) }}</td>
              <td>{{ actionLabel(event.action) }}</td>
            </tr>
          </DataTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDataStore } from '../../stores/data'
import Badge from '../../components/Badge.vue'
import DataTable from '../../components/DataTable.vue'
import EmptyState from '../../components/EmptyState.vue'

const dataStore = useDataStore()

onMounted(async () => {
  await Promise.all([
    dataStore.loadOperations(),
    dataStore.loadEvents(),
    dataStore.loadAlerts()
  ])
})

const alerts = computed(() => dataStore.alerts)
const events = computed(() => dataStore.events)

const activeOperations = computed(() => dataStore.operations.filter((op) => op.status === 'IN_PROGRESS').length)

const missingItems = computed(() => {
  return dataStore.alerts.filter((alert) => alert.type === 'MISSING_ITEM').length
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

const severityLabel = (severity: string) => {
  const map: Record<string, string> = {
    HIGH: 'بالا',
    MEDIUM: 'متوسط',
    LOW: 'پایین'
  }
  return map[severity] || severity
}

const severityVariant = (severity: string) => {
  const map: Record<string, 'error' | 'warning' | 'success'> = {
    HIGH: 'error',
    MEDIUM: 'warning',
    LOW: 'success'
  }
  return map[severity] || 'info'
}
</script>
