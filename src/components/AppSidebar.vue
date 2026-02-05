<template>
  <aside class="menu w-72 min-h-full bg-base-200 p-4">
    <div class="mb-6">
      <div class="text-xl font-bold">سامانه رهگیری جراحی</div>
      <div class="text-sm opacity-70">چندگیت - نسخه نمایشی</div>
    </div>

    <ul class="menu gap-1">
      <li class="menu-title">پشتیبانی</li>
      <li><RouterLink to="/app/dashboard">داشبورد</RouterLink></li>
      <li><RouterLink to="/app/operations">عملیات</RouterLink></li>
      <li><RouterLink to="/app/events">رویدادها</RouterLink></li>
      <li><RouterLink to="/app/reconciliation">تطبیق کلین‌روم</RouterLink></li>
      <li><RouterLink to="/app/gates">گیت‌ها</RouterLink></li>
      <li><RouterLink to="/kiosk">حالت کیوسک</RouterLink></li>
    </ul>

    <div v-if="role === 'ADMIN'" class="mt-6">
      <div class="menu-title">مدیریت</div>
      <ul class="menu gap-1">
        <li><RouterLink to="/admin/overview">نمای کلی</RouterLink></li>
        <li><RouterLink to="/admin/users">کاربران</RouterLink></li>
        <li><RouterLink to="/admin/gates">گیت‌ها</RouterLink></li>
        <li><RouterLink to="/admin/object-types">انواع ابزار</RouterLink></li>
        <li><RouterLink to="/admin/reports">گزارش‌ها</RouterLink></li>
        <li><RouterLink to="/admin/audit">لاگ ممیزی</RouterLink></li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Role } from '../types'

defineProps<{ role: Role }>()
</script>
