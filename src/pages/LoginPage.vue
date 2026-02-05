<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">ورود به سامانه</h2>
      <p class="text-sm opacity-70">برای دسترسی به پنل پشتیبانی یا مدیریت وارد شوید.</p>
      <form class="space-y-4 mt-4" @submit.prevent="handleLogin">
        <input v-model="username" class="input input-bordered w-full" placeholder="نام کاربری" />
        <input v-model="password" type="password" class="input input-bordered w-full" placeholder="رمز عبور" />
        <button class="btn btn-primary w-full" :class="{ loading: authStore.loading }" type="submit">
          ورود
        </button>
      </form>
      <div v-if="authStore.error" class="alert alert-error mt-4">
        <span>{{ authStore.error }}</span>
      </div>
      <div class="divider">حساب‌های نمونه</div>
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span>مدیر:</span>
          <span>admin / admin</span>
        </div>
        <div class="flex justify-between">
          <span>حامی:</span>
          <span>support / support</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    const user = await authStore.login(username.value, password.value)
    router.push(user.role === 'ADMIN' ? '/admin/overview' : '/app/dashboard')
  } catch {
    // handled in store
  }
}
</script>
