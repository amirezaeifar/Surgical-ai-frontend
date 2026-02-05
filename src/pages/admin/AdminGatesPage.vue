<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">مدیریت گیت‌ها</h2>
      <button class="btn btn-primary" @click="openForm()">گیت جدید</button>
    </div>

    <DataTable :headers="['نام', 'مکان', 'نوع', 'دستگاه', 'وضعیت', 'عملیات']">
      <tr v-for="gate in dataStore.gates" :key="gate.id">
        <td>{{ gate.name }}</td>
        <td>{{ gate.location }}</td>
        <td>{{ typeLabel(gate.type) }}</td>
        <td>{{ gate.deviceId }}</td>
        <td>{{ gate.isActive ? 'فعال' : 'غیرفعال' }}</td>
        <td class="space-x-2">
          <button class="btn btn-xs" @click="openForm(gate)">ویرایش</button>
          <button class="btn btn-xs btn-error" @click="removeGate(gate.id)">حذف</button>
        </td>
      </tr>
    </DataTable>

    <dialog class="modal" :open="formOpen">
      <div class="modal-box">
        <h3 class="font-bold text-lg">{{ editingGate ? 'ویرایش گیت' : 'گیت جدید' }}</h3>
        <div class="space-y-3 mt-4">
          <input v-model="form.name" class="input input-bordered w-full" placeholder="نام گیت" />
          <input v-model="form.location" class="input input-bordered w-full" placeholder="مکان" />
          <select v-model="form.type" class="select select-bordered w-full">
            <option value="OR_ISSUE">تحویل اتاق عمل</option>
            <option value="OR_RETURN">عودت اتاق عمل</option>
            <option value="CLEAN_ROOM">کلین‌روم</option>
            <option value="TRANSFER">انتقال</option>
          </select>
          <input v-model="form.deviceId" class="input input-bordered w-full" placeholder="شناسه دستگاه" />
          <label class="label cursor-pointer gap-2 justify-start">
            <input v-model="form.isActive" type="checkbox" class="checkbox" />
            <span class="label-text">فعال</span>
          </label>
        </div>
        <div class="modal-action">
          <button class="btn" @click="formOpen = false">انصراف</button>
          <button class="btn btn-primary" @click="saveGate">ذخیره</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useDataStore } from '../../stores/data'
import DataTable from '../../components/DataTable.vue'
import type { Gate } from '../../types'

const dataStore = useDataStore()
const formOpen = ref(false)
const editingGate = ref<Gate | null>(null)
const form = reactive({
  id: '',
  name: '',
  location: '',
  type: 'OR_ISSUE',
  deviceId: '',
  isActive: true
})

onMounted(() => {
  dataStore.loadGates()
})

const openForm = (gate?: Gate) => {
  editingGate.value = gate || null
  form.id = gate?.id || `g-${Date.now()}`
  form.name = gate?.name || ''
  form.location = gate?.location || ''
  form.type = gate?.type || 'OR_ISSUE'
  form.deviceId = gate?.deviceId || ''
  form.isActive = gate?.isActive ?? true
  formOpen.value = true
}

const saveGate = async () => {
  const payload: Gate = {
    id: form.id,
    name: form.name,
    location: form.location,
    type: form.type as Gate['type'],
    deviceId: form.deviceId,
    isActive: form.isActive
  }
  if (editingGate.value) {
    await dataStore.updateGateItem(payload)
  } else {
    await dataStore.createGateItem(payload)
  }
  formOpen.value = false
}

const removeGate = async (id: string) => {
  await dataStore.deleteGateItem(id)
}

const typeLabel = (value: string) => {
  const map: Record<string, string> = {
    OR_ISSUE: 'تحویل اتاق عمل',
    OR_RETURN: 'عودت اتاق عمل',
    CLEAN_ROOM: 'کلین‌روم',
    TRANSFER: 'انتقال'
  }
  return map[value] || value
}
</script>
