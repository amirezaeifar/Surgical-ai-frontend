import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Alert, Gate, GateEvent, GateEventFilters, Operation, SurgicalObjectType, User } from '../types'
import {
  createGate,
  createGateEvent,
  createObjectType,
  createUser,
  deleteGate,
  deleteObjectType,
  deleteUser,
  getAlerts,
  getEventById,
  getEvents,
  getGates,
  getObjectTypes,
  getOperationById,
  getOperations,
  getUsers,
  updateGate,
  updateObjectType,
  updateUser
} from '../services/api'

export const useDataStore = defineStore('data', () => {
  const operations = ref<Operation[]>([])
  const gates = ref<Gate[]>([])
  const objectTypes = ref<SurgicalObjectType[]>([])
  const events = ref<GateEvent[]>([])
  const alerts = ref<Alert[]>([])
  const users = ref<User[]>([])

  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadOperations = async () => {
    loading.value = true
    error.value = null
    try {
      operations.value = await getOperations()
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  const loadOperationById = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      return await getOperationById(id)
    } catch (err) {
      error.value = (err as Error).message
      return undefined
    } finally {
      loading.value = false
    }
  }

  const loadGates = async () => {
    loading.value = true
    error.value = null
    try {
      gates.value = await getGates()
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  const loadObjectTypes = async () => {
    loading.value = true
    error.value = null
    try {
      objectTypes.value = await getObjectTypes()
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  const loadEvents = async (filters?: GateEventFilters) => {
    loading.value = true
    error.value = null
    try {
      events.value = await getEvents(filters)
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  const loadEventById = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      return await getEventById(id)
    } catch (err) {
      error.value = (err as Error).message
      return undefined
    } finally {
      loading.value = false
    }
  }

  const loadAlerts = async () => {
    loading.value = true
    error.value = null
    try {
      alerts.value = await getAlerts()
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  const loadUsers = async () => {
    loading.value = true
    error.value = null
    try {
      users.value = await getUsers()
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  const createEvent = async (payload: GateEvent) => {
    const result = await createGateEvent(payload)
    events.value = [result, ...events.value]
    return result
  }

  const createUserItem = async (payload: User) => {
    const result = await createUser(payload)
    users.value = [result, ...users.value]
    return result
  }

  const updateUserItem = async (payload: User) => {
    const result = await updateUser(payload)
    users.value = users.value.map((item) => (item.id === payload.id ? result : item))
    return result
  }

  const deleteUserItem = async (id: string) => {
    await deleteUser(id)
    users.value = users.value.filter((item) => item.id !== id)
  }

  const createGateItem = async (payload: Gate) => {
    const result = await createGate(payload)
    gates.value = [result, ...gates.value]
    return result
  }

  const updateGateItem = async (payload: Gate) => {
    const result = await updateGate(payload)
    gates.value = gates.value.map((item) => (item.id === payload.id ? result : item))
    return result
  }

  const deleteGateItem = async (id: string) => {
    await deleteGate(id)
    gates.value = gates.value.filter((item) => item.id !== id)
  }

  const createObjectTypeItem = async (payload: SurgicalObjectType) => {
    const result = await createObjectType(payload)
    objectTypes.value = [result, ...objectTypes.value]
    return result
  }

  const updateObjectTypeItem = async (payload: SurgicalObjectType) => {
    const result = await updateObjectType(payload)
    objectTypes.value = objectTypes.value.map((item) => (item.id === payload.id ? result : item))
    return result
  }

  const deleteObjectTypeItem = async (id: string) => {
    await deleteObjectType(id)
    objectTypes.value = objectTypes.value.filter((item) => item.id !== id)
  }

  return {
    operations,
    gates,
    objectTypes,
    events,
    alerts,
    users,
    loading,
    error,
    loadOperations,
    loadOperationById,
    loadGates,
    loadObjectTypes,
    loadEvents,
    loadEventById,
    loadAlerts,
    loadUsers,
    createEvent,
    createUserItem,
    updateUserItem,
    deleteUserItem,
    createGateItem,
    updateGateItem,
    deleteGateItem,
    createObjectTypeItem,
    updateObjectTypeItem,
    deleteObjectTypeItem
  }
})
