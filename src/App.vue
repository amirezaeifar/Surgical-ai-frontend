<template>
  <div class="min-h-screen bg-base-100">
    <RouterView />
    <Toasts />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toasts from './components/Toasts.vue'
</script>
