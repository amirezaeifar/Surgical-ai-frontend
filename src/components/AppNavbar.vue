<template>
  <div class="navbar bg-base-200 px-4">
    <div class="flex-none lg:hidden">
      <label :for="drawerId" class="btn btn-ghost btn-circle">
        <span class="text-2xl">☰</span>
      </label>
    </div>
    <div class="flex-1">
      <div class="text-lg font-semibold">مرکز کنترل رهگیری</div>
    </div>
    <div class="flex items-center gap-3">
      <div class="hidden md:flex items-center gap-2">
        <RouterLink to="/kiosk" class="btn btn-primary btn-sm">ثبت رویداد جدید</RouterLink>
        <RouterLink to="/kiosk" class="btn btn-ghost btn-sm">حالت کیوسک</RouterLink>
      </div>
      <button class="btn btn-ghost" @click="uiStore.toggleTheme()">
        {{ uiStore.theme === 'light' ? 'حالت تیره' : 'حالت روشن' }}
      </button>
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost">
          {{ authStore.currentUser?.name || 'کاربر' }}
        </div>
        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          <li class="text-sm px-2 py-1">نقش: {{ authStore.currentUser?.role === 'ADMIN' ? 'مدیر' : 'حامی' }}</li>
          <li><button @click="handleLogout">خروج</button></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'
import { RouterLink, useRouter } from 'vue-router'

const authStore = useAuthStore()
const uiStore = useUiStore()
const router = useRouter()

defineProps<{
  drawerId: string
}>()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
