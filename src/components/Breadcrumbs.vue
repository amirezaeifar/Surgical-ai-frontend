<template>
  <div class="text-sm breadcrumbs">
    <ul>
      <li>
        <RouterLink :to="homePath">خانه</RouterLink>
      </li>
      <li v-for="crumb in crumbs" :key="crumb.path">
        <RouterLink v-if="!crumb.isCurrent" :to="crumb.path">{{ crumb.title }}</RouterLink>
        <span v-else class="font-semibold">{{ crumb.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const homePath = computed(() => (route.path.startsWith('/admin') ? '/admin/overview' : '/app/dashboard'))

const crumbs = computed(() => {
  return route.matched
    .filter((record) => record.meta?.title)
    .map((record) => {
      const resolved = record.name
        ? router.resolve({ name: record.name as string, params: route.params })
        : router.resolve(record.path)
      return {
        title: record.meta?.title as string,
        path: resolved.path,
        isCurrent: resolved.path === route.path
      }
    })
    .filter((crumb) => crumb.path !== homePath.value)
})
</script>
