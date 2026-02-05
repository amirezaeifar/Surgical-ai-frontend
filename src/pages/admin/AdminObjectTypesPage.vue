<template>
  <div class="space-y-6">
    <PageHeader title="مدیریت انواع ابزار" subtitle="کاتالوگ ابزارها و روش رهگیری آن‌ها">
      <template #actions>
        <button class="btn btn-primary btn-sm" @click="openForm()">نوع جدید</button>
      </template>
    </PageHeader>

    <DataTable :headers="['نام', 'نوع رهگیری', 'عملیات']">
      <tr v-for="type in dataStore.objectTypes" :key="type.id">
        <td>{{ type.name }}</td>
        <td>{{ type.tracking === 'COUNT_BASED' ? 'تعدادی' : 'شناسه یکتا' }}</td>
        <td class="space-x-2">
          <button class="btn btn-xs" @click="openForm(type)">ویرایش</button>
          <button class="btn btn-xs btn-error" @click="removeType(type.id)">حذف</button>
        </td>
      </tr>
    </DataTable>

    <EmptyState
      v-if="!dataStore.objectTypes.length"
      title="ابزاری ثبت نشده است"
      description="برای شروع، یک نوع ابزار تعریف کنید."
    />

    <dialog class="modal" :open="formOpen">
      <div class="modal-box">
        <h3 class="font-bold text-lg">{{ editingType ? 'ویرایش ابزار' : 'ابزار جدید' }}</h3>
        <div class="space-y-3 mt-4">
          <input v-model="form.name" class="input input-bordered w-full" placeholder="نام ابزار" />
          <select v-model="form.tracking" class="select select-bordered w-full">
            <option value="COUNT_BASED">تعدادی</option>
            <option value="INDIVIDUAL_ID">شناسه یکتا</option>
          </select>
        </div>
        <div class="modal-action">
          <button class="btn" @click="formOpen = false">انصراف</button>
          <button class="btn btn-primary" @click="saveType">ذخیره</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useDataStore } from '../../stores/data'
import DataTable from '../../components/DataTable.vue'
import EmptyState from '../../components/EmptyState.vue'
import PageHeader from '../../components/PageHeader.vue'
import type { SurgicalObjectType } from '../../types'

const dataStore = useDataStore()
const formOpen = ref(false)
const editingType = ref<SurgicalObjectType | null>(null)
const form = reactive({
  id: '',
  name: '',
  tracking: 'COUNT_BASED'
})

onMounted(() => {
  dataStore.loadObjectTypes()
})

const openForm = (type?: SurgicalObjectType) => {
  editingType.value = type || null
  form.id = type?.id || `ot-${Date.now()}`
  form.name = type?.name || ''
  form.tracking = type?.tracking || 'COUNT_BASED'
  formOpen.value = true
}

const saveType = async () => {
  const payload: SurgicalObjectType = {
    id: form.id,
    name: form.name,
    tracking: form.tracking as SurgicalObjectType['tracking']
  }
  if (editingType.value) {
    await dataStore.updateObjectTypeItem(payload)
  } else {
    await dataStore.createObjectTypeItem(payload)
  }
  formOpen.value = false
}

const removeType = async (id: string) => {
  await dataStore.deleteObjectTypeItem(id)
}
</script>
