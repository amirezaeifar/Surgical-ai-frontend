<template>
  <div class="drawer lg:drawer-open">
    <input id="admin-drawer" type="checkbox" class="drawer-toggle" v-model="uiStore.drawerOpen" />
    <div class="drawer-content flex flex-col">
      <AppNavbar />
      <main class="p-6">
        <RouterView />
      </main>
    </div>
    <div class="drawer-side">
      <label for="admin-drawer" class="drawer-overlay"></label>
      <AppSidebar role="ADMIN" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '../components/AppNavbar.vue'
import AppSidebar from '../components/AppSidebar.vue'
import { useUiStore } from '../stores/ui'

const uiStore = useUiStore()
uiStore.initTheme()
</script>
