<template>
  <span :class="['badge', variantClass]">{{ label }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'success' | 'warning' | 'error' | 'info' | 'neutral'

const props = defineProps<{ label: string; variant?: Variant }>()

const variantClass = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'badge-success'
    case 'warning':
      return 'badge-warning'
    case 'error':
      return 'badge-error'
    case 'info':
      return 'badge-info'
    default:
      return 'badge-ghost'
  }
})
</script>
