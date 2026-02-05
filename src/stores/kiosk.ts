import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DetectedItem, Gate, Operation, User } from '../types'

export const useKioskStore = defineStore('kiosk', () => {
  const selectedGate = ref<Gate | null>(null)
  const selectedUser = ref<User | null>(null)
  const selectedOperation = ref<Operation | null>(null)
  const capturedImageMock = ref<string | null>(null)
  const mlDetectionMock = ref<DetectedItem[]>([])
  const confirmedItems = ref<DetectedItem[]>([])

  const reset = () => {
    selectedGate.value = null
    selectedUser.value = null
    selectedOperation.value = null
    capturedImageMock.value = null
    mlDetectionMock.value = []
    confirmedItems.value = []
  }

  return {
    selectedGate,
    selectedUser,
    selectedOperation,
    capturedImageMock,
    mlDetectionMock,
    confirmedItems,
    reset
  }
})
