<template>
  <div class="drawer drawer-end lg:drawer-open min-h-screen w-full bg-base-200">
    <input id="supporter-drawer" type="checkbox" class="drawer-toggle" v-model="uiStore.drawerOpen" />
    <div class="drawer-content min-h-screen flex flex-col">
      <AppNavbar class="shrink-0" drawer-id="supporter-drawer" />
      <main class="flex-1 overflow-y-auto">
        <div class="p-4 md:p-6">
          <RouterView />
        </div>
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
