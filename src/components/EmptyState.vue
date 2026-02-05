<template>
  <div class="card bg-base-200 p-6 text-center">
    <div class="text-lg font-semibold">{{ title }}</div>
    <div class="text-sm opacity-70 mt-2">{{ description }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; description: string }>()
</script>
