<template>
  <div class="min-h-screen bg-base-200 p-6">
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-semibold">حالت کیوسک گیت</h2>
        <div class="badge badge-primary">مرحله {{ step }} از 6</div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body space-y-4">
          <div v-if="step === 1" class="space-y-4">
            <h3 class="text-lg font-semibold">انتخاب گیت</h3>
            <select v-model="selectedGateId" class="select select-bordered w-full">
              <option disabled value="">گیت را انتخاب کنید</option>
              <option v-for="gate in dataStore.gates" :key="gate.id" :value="gate.id">{{ gate.name }}</option>
            </select>
          </div>

          <div v-else-if="step === 2" class="space-y-4">
            <h3 class="text-lg font-semibold">انتخاب کاربر و عملیات</h3>
            <select v-model="selectedUserId" class="select select-bordered w-full">
              <option disabled value="">حامی را انتخاب کنید</option>
              <option v-for="user in dataStore.users" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
            <select v-model="selectedOperationId" class="select select-bordered w-full">
              <option disabled value="">عملیات را انتخاب کنید</option>
              <option v-for="operation in dataStore.operations" :key="operation.id" :value="operation.id">
                {{ operation.caseNumber }} - {{ operation.orRoom }}
              </option>
            </select>
          </div>

          <div v-else-if="step === 3" class="space-y-4">
            <h3 class="text-lg font-semibold">ثبت تصویر</h3>
            <div class="grid gap-4 sm:grid-cols-2">
              <button
                v-for="image in images"
                :key="image"
                class="btn btn-outline h-32"
                @click="selectImage(image)"
              >
                انتخاب تصویر نمونه
              </button>
            </div>
            <div v-if="kioskStore.capturedImageMock" class="mt-4">
              <img :src="kioskStore.capturedImageMock" class="rounded-box w-full h-64 object-cover" />
            </div>
          </div>

          <div v-else-if="step === 4" class="space-y-4">
            <h3 class="text-lg font-semibold">تشخیص خودکار</h3>
            <button class="btn btn-primary" @click="runDetection">اجرای تشخیص</button>
            <DataTable :headers="['نوع ابزار', 'تعداد', 'اعتماد']">
              <tr v-for="item in kioskStore.mlDetectionMock" :key="item.objectTypeId">
                <td>{{ item.objectTypeName }}</td>
                <td>{{ item.count }}</td>
                <td>{{ Math.round(item.confidence * 100) }}%</td>
              </tr>
            </DataTable>
          </div>

          <div v-else-if="step === 5" class="space-y-4">
            <h3 class="text-lg font-semibold">تایید نهایی</h3>
            <DataTable :headers="['نوع ابزار', 'تعداد', 'عملیات']">
              <tr v-for="item in kioskStore.confirmedItems" :key="item.objectTypeId">
                <td>{{ item.objectTypeName }}</td>
                <td>{{ item.count }}</td>
                <td class="flex gap-2">
                  <button class="btn btn-xs" @click="updateCount(item.objectTypeId, -1)">-</button>
                  <button class="btn btn-xs" @click="updateCount(item.objectTypeId, 1)">+</button>
                </td>
              </tr>
            </DataTable>
          </div>

          <div v-else-if="step === 6" class="space-y-4">
            <h3 class="text-lg font-semibold">ثبت شد!</h3>
            <p class="text-sm opacity-70">رویداد با موفقیت ثبت شد. می‌توانید رویداد بعدی را شروع کنید.</p>
            <button class="btn btn-primary" @click="resetFlow">رویداد بعدی</button>
          </div>

          <div class="flex justify-between">
            <button class="btn btn-ghost" :disabled="step === 1 || step === 6" @click="step--">بازگشت</button>
            <button
              v-if="step < 5"
              class="btn btn-primary"
              :disabled="!canProceed"
              @click="step++"
            >
              ادامه
            </button>
            <button v-else-if="step === 5" class="btn btn-primary" @click="submitEvent">ثبت رویداد</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useDataStore } from '../../stores/data'
import { useKioskStore } from '../../stores/kiosk'
import DataTable from '../../components/DataTable.vue'

const dataStore = useDataStore()
const kioskStore = useKioskStore()
const step = ref(1)

const selectedGateId = ref('')
const selectedUserId = ref('')
const selectedOperationId = ref('')

const images = [
  'https://images.unsplash.com/photo-1580281657521-3e1c04d5c7d5?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&w=800&q=60',
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=60'
]

onMounted(async () => {
  await Promise.all([dataStore.loadGates(), dataStore.loadOperations(), dataStore.loadUsers(), dataStore.loadObjectTypes()])
})

const canProceed = computed(() => {
  if (step.value === 1) return Boolean(selectedGateId.value)
  if (step.value === 2) return Boolean(selectedUserId.value && selectedOperationId.value)
  if (step.value === 3) return Boolean(kioskStore.capturedImageMock)
  if (step.value === 4) return kioskStore.mlDetectionMock.length > 0
  return true
})

const selectImage = (image: string) => {
  kioskStore.capturedImageMock = image
}

const runDetection = () => {
  kioskStore.mlDetectionMock = dataStore.objectTypes.map((type) => ({
    objectTypeId: type.id,
    objectTypeName: type.name,
    count: Math.floor(Math.random() * 5) + 1,
    confidence: 0.85
  }))
  kioskStore.confirmedItems = [...kioskStore.mlDetectionMock]
}

const updateCount = (id: string, delta: number) => {
  kioskStore.confirmedItems = kioskStore.confirmedItems.map((item) =>
    item.objectTypeId === id ? { ...item, count: Math.max(0, item.count + delta) } : item
  )
}

const submitEvent = async () => {
  const gate = dataStore.gates.find((g) => g.id === selectedGateId.value)
  const user = dataStore.users.find((u) => u.id === selectedUserId.value)
  const operation = dataStore.operations.find((o) => o.id === selectedOperationId.value)
  if (!gate || !user || !operation) return

  const unchanged = JSON.stringify(kioskStore.confirmedItems) === JSON.stringify(kioskStore.mlDetectionMock)
  await dataStore.createEvent({
    id: `kiosk-${Date.now()}`,
    timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
    gateId: gate.id,
    gateName: gate.name,
    userId: user.id,
    userName: user.name,
    operationId: operation.id,
    action: gate.type === 'OR_ISSUE' ? 'ISSUE' : 'RETURN',
    detectedItems: kioskStore.confirmedItems,
    mlRaw: { items: kioskStore.mlDetectionMock },
    verification: unchanged ? 'USER_CONFIRMED' : 'USER_CORRECTED',
    imageUrl: kioskStore.capturedImageMock || undefined
  })
  step.value = 6
}

const resetFlow = () => {
  step.value = 1
  selectedGateId.value = ''
  selectedUserId.value = ''
  selectedOperationId.value = ''
  kioskStore.reset()
}
</script>
