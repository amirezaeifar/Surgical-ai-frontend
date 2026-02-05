<template>
  <aside class="w-72 min-h-full bg-base-200 p-4">
    <div class="mb-6">
      <div class="text-xl font-bold">سامانه رهگیری جراحی</div>
      <div class="text-sm opacity-70">چندگیت - نسخه نمایشی</div>
    </div>

    <ul class="menu menu-lg rounded-box gap-1">
      <li class="menu-title">پشتیبان</li>
      <li><RouterLink to="/app/dashboard" active-class="active">داشبورد</RouterLink></li>
      <li><RouterLink to="/app/operations" active-class="active">عملیات</RouterLink></li>
      <li><RouterLink to="/app/events" active-class="active">رویدادها</RouterLink></li>
      <li><RouterLink to="/app/reconciliation" active-class="active">تطبیق کلین‌روم</RouterLink></li>
      <li><RouterLink to="/app/gates" active-class="active">گیت‌ها</RouterLink></li>
      <li><RouterLink to="/kiosk" active-class="active">حالت کیوسک</RouterLink></li>
    </ul>

    <div v-if="role === 'ADMIN'" class="mt-6">
      <div class="menu-title">مدیریت</div>
      <ul class="menu menu-lg rounded-box gap-1">
        <li><RouterLink to="/admin/overview" active-class="active">نمای کلی</RouterLink></li>
        <li><RouterLink to="/admin/users" active-class="active">کاربران</RouterLink></li>
        <li><RouterLink to="/admin/gates" active-class="active">گیت‌ها</RouterLink></li>
        <li><RouterLink to="/admin/object-types" active-class="active">انواع ابزار</RouterLink></li>
        <li><RouterLink to="/admin/reports" active-class="active">گزارش‌ها</RouterLink></li>
        <li><RouterLink to="/admin/audit" active-class="active">لاگ ممیزی</RouterLink></li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Role } from '../types'

defineProps<{ role: Role }>()
</script>
