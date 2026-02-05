<template>
  <ul class="timeline timeline-vertical">
    <li v-for="event in events" :key="event.id">
      <div class="timeline-start">{{ event.timestamp }}</div>
      <div class="timeline-middle">
        <div class="badge badge-primary"></div>
      </div>
      <div class="timeline-end mb-8">
        <div class="font-semibold">{{ event.actionLabel }}</div>
        <div class="text-sm opacity-70">{{ event.description }}</div>
      </div>
      <hr />
    </li>
  </ul>
</template>

<script setup lang="ts">
export interface TimelineItem {
  id: string
  timestamp: string
  actionLabel: string
  description: string
}

defineProps<{ events: TimelineItem[] }>()
</script>
