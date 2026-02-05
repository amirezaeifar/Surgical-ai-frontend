<template>
  <div class="toast toast-top toast-start z-50">
    <div
      v-for="toast in uiStore.toasts"
      :key="toast.id"
      :class="['alert', toastClass(toast.type)]"
    >
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUiStore, type ToastMessage } from '../stores/ui'

const uiStore = useUiStore()

const toastClass = (type: ToastMessage['type']) => {
  if (type === 'success') return 'alert-success'
  if (type === 'error') return 'alert-error'
  return 'alert-info'
}
</script>
