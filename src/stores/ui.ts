import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

const STORAGE_KEY = 'surgical-ai-theme'

export const useUiStore = defineStore('ui', () => {
  const theme = ref<string>(localStorage.getItem(STORAGE_KEY) || 'light')
  const drawerOpen = ref(false)
  const toasts = ref<ToastMessage[]>([])

  const setTheme = (value: string) => {
    theme.value = value
    document.documentElement.setAttribute('data-theme', value)
    localStorage.setItem(STORAGE_KEY, value)
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2)
    toasts.value = [...toasts.value, { id, message, type }]
    setTimeout(() => removeToast(id), 3500)
  }

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  const initTheme = () => {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  return { theme, drawerOpen, toasts, setTheme, toggleTheme, addToast, removeToast, initTheme }
})
