<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 p-6">
    <div class="w-full max-w-md">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
