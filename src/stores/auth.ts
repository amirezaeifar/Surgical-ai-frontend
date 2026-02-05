import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types'
import { authLogin } from '../services/api'

const STORAGE_KEY = 'surgical-ai-auth'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => Boolean(currentUser.value))
  const isAdmin = computed(() => currentUser.value?.role === 'ADMIN')

  const loadFromStorage = () => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      currentUser.value = JSON.parse(raw) as User
    }
  }

  const login = async (username: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const user = await authLogin(username, password)
      currentUser.value = user
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      return user
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { currentUser, loading, error, isAuthenticated, isAdmin, login, logout, loadFromStorage }
})
