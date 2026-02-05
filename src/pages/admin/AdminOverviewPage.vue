<template>
  <div class="space-y-6">
    <h2 class="text-xl font-semibold">داشبورد مدیریتی</h2>
    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div class="stat bg-base-200 rounded-box">
        <div class="stat-title">کاربران</div>
        <div class="stat-value">{{ dataStore.users.length }}</div>
        <div class="stat-desc">فعال</div>
      </div>
      <div class="stat bg-base-200 rounded-box">
        <div class="stat-title">گیت‌ها</div>
        <div class="stat-value">{{ dataStore.gates.length }}</div>
        <div class="stat-desc">پیکربندی‌شده</div>
      </div>
      <div class="stat bg-base-200 rounded-box">
        <div class="stat-title">انواع ابزار</div>
        <div class="stat-value">{{ dataStore.objectTypes.length }}</div>
        <div class="stat-desc">کاتالوگ</div>
      </div>
      <div class="stat bg-base-200 rounded-box">
        <div class="stat-title">رویدادها</div>
        <div class="stat-value">{{ dataStore.events.length }}</div>
        <div class="stat-desc">ثبت شده</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDataStore } from '../../stores/data'

const dataStore = useDataStore()

onMounted(async () => {
  await Promise.all([
    dataStore.loadUsers(),
    dataStore.loadGates(),
    dataStore.loadObjectTypes(),
    dataStore.loadEvents()
  ])
})
</script>
