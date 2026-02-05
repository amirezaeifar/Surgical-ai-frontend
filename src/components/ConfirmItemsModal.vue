<template>
  <dialog class="modal" :open="open">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">تایید و اصلاح اقلام شناسایی‌شده</h3>
      <div class="space-y-3">
        <div v-for="item in items" :key="item.objectTypeId" class="flex items-center justify-between gap-3">
          <div>
            <div class="font-semibold">{{ item.objectTypeName }}</div>
            <div class="text-xs opacity-60">اعتماد: {{ Math.round(item.confidence * 100) }}%</div>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn btn-sm" @click="updateCount(item.objectTypeId, -1)">-</button>
            <span class="w-10 text-center">{{ item.count }}</span>
            <button class="btn btn-sm" @click="updateCount(item.objectTypeId, 1)">+</button>
          </div>
        </div>
      </div>
      <div class="modal-action">
        <button class="btn" @click="$emit('close')">بستن</button>
        <button class="btn btn-primary" @click="$emit('confirm')">ذخیره</button>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import type { DetectedItem } from '../types'

const props = defineProps<{ open: boolean; items: DetectedItem[] }>()
const emit = defineEmits<{ (e: 'update', value: DetectedItem[]): void; (e: 'close'): void; (e: 'confirm'): void }>()

const updateCount = (id: string, delta: number) => {
  const updated = props.items.map((item) => {
    if (item.objectTypeId === id) {
      return { ...item, count: Math.max(0, item.count + delta) }
    }
    return item
  })
  emit('update', updated)
}
</script>
