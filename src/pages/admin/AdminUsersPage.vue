<template>
  <div class="space-y-6">
    <PageHeader title="مدیریت کاربران" subtitle="ایجاد، ویرایش و تخصیص نقش کاربران">
      <template #actions>
        <button class="btn btn-primary btn-sm" @click="openForm()">کاربر جدید</button>
      </template>
    </PageHeader>

    <DataTable :headers="['نام', 'نقش', 'کد پرسنلی', 'دپارتمان', 'عملیات']">
      <tr v-for="user in dataStore.users" :key="user.id">
        <td>{{ user.name }}</td>
        <td>{{ user.role === 'ADMIN' ? 'مدیر' : 'حامی' }}</td>
        <td>{{ user.badgeId || '—' }}</td>
        <td>{{ user.department || '—' }}</td>
        <td class="space-x-2">
          <button class="btn btn-xs" @click="openForm(user)">ویرایش</button>
          <button class="btn btn-xs btn-error" @click="removeUser(user.id)">حذف</button>
        </td>
      </tr>
    </DataTable>

    <EmptyState
      v-if="!dataStore.users.length"
      title="کاربری ثبت نشده است"
      description="برای شروع، یک کاربر جدید اضافه کنید."
    />

    <dialog class="modal" :open="formOpen">
      <div class="modal-box">
        <h3 class="font-bold text-lg">{{ editingUser ? 'ویرایش کاربر' : 'کاربر جدید' }}</h3>
        <div class="space-y-3 mt-4">
          <input v-model="form.name" class="input input-bordered w-full" placeholder="نام" />
          <select v-model="form.role" class="select select-bordered w-full">
            <option value="SUPPORTER">حامی</option>
            <option value="ADMIN">مدیر</option>
          </select>
          <input v-model="form.badgeId" class="input input-bordered w-full" placeholder="کد پرسنلی" />
          <input v-model="form.department" class="input input-bordered w-full" placeholder="دپارتمان" />
        </div>
        <div class="modal-action">
          <button class="btn" @click="formOpen = false">انصراف</button>
          <button class="btn btn-primary" @click="saveUser">ذخیره</button>
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
import type { User } from '../../types'

const dataStore = useDataStore()
const formOpen = ref(false)
const editingUser = ref<User | null>(null)
const form = reactive({
  id: '',
  name: '',
  role: 'SUPPORTER',
  badgeId: '',
  department: ''
})

onMounted(() => {
  dataStore.loadUsers()
})

const openForm = (user?: User) => {
  editingUser.value = user || null
  form.id = user?.id || `u-${Date.now()}`
  form.name = user?.name || ''
  form.role = user?.role || 'SUPPORTER'
  form.badgeId = user?.badgeId || ''
  form.department = user?.department || ''
  formOpen.value = true
}

const saveUser = async () => {
  const payload: User = {
    id: form.id,
    name: form.name,
    role: form.role as User['role'],
    badgeId: form.badgeId || undefined,
    department: form.department || undefined
  }
  if (editingUser.value) {
    await dataStore.updateUserItem(payload)
  } else {
    await dataStore.createUserItem(payload)
  }
  formOpen.value = false
}

const removeUser = async (id: string) => {
  await dataStore.deleteUserItem(id)
}
</script>
