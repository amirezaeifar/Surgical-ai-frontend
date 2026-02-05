<template>
  <div class="overflow-x-auto rounded-box border border-base-300">
    <table class="table table-zebra w-full">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{ headers: string[] }>()
</script>
