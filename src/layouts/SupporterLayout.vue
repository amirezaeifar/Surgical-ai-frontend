<template>
  <div class="drawer lg:drawer-open">
    <input id="supporter-drawer" type="checkbox" class="drawer-toggle" v-model="uiStore.drawerOpen" />
    <div class="drawer-content flex flex-col">
      <AppNavbar />
      <main class="p-6">
        <RouterView />
      </main>
    </div>
    <div class="drawer-side">
      <label for="supporter-drawer" class="drawer-overlay"></label>
      <AppSidebar :role="authStore.currentUser?.role || 'SUPPORTER'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'
import AppSidebar from '../components/AppSidebar.vue'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'

const authStore = useAuthStore()
const uiStore = useUiStore()
uiStore.initTheme()
</script>
