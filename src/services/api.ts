import type {
  Alert,
  Gate,
  GateEvent,
  GateEventFilters,
  Operation,
  SurgicalObjectType,
  User
} from '../types'
import {
  mockAuthLogin,
  mockCreateGate,
  mockCreateGateEvent,
  mockCreateObjectType,
  mockCreateUser,
  mockDeleteGate,
  mockDeleteObjectType,
  mockDeleteUser,
  mockGetAlerts,
  mockGetEventById,
  mockGetEvents,
  mockGetGates,
  mockGetObjectTypes,
  mockGetOperationById,
  mockGetOperations,
  mockGetUsers,
  mockUpdateGate,
  mockUpdateObjectType,
  mockUpdateUser
} from './mock'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''

const fetchJson = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!response.ok) {
    throw new Error('خطا در ارتباط با سرور')
  }
  return (await response.json()) as T
}

export const authLogin = (username: string, password: string) =>
  useMock ? mockAuthLogin(username, password) : fetchJson<User>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  })

export const getOperations = () =>
  useMock ? mockGetOperations() : fetchJson<Operation[]>('/operations')

export const getOperationById = (id: string) =>
  useMock ? mockGetOperationById(id) : fetchJson<Operation>(`/operations/${id}`)

export const getGates = () =>
  useMock ? mockGetGates() : fetchJson<Gate[]>('/gates')

export const getObjectTypes = () =>
  useMock ? mockGetObjectTypes() : fetchJson<SurgicalObjectType[]>('/object-types')

export const getEvents = (filters?: GateEventFilters) =>
  useMock ? mockGetEvents(filters) : fetchJson<GateEvent[]>('/events')

export const getEventById = (id: string) =>
  useMock ? mockGetEventById(id) : fetchJson<GateEvent>(`/events/${id}`)

export const createGateEvent = (payload: GateEvent) =>
  useMock ? mockCreateGateEvent(payload) : fetchJson<GateEvent>('/events', {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const getAlerts = () =>
  useMock ? mockGetAlerts() : fetchJson<Alert[]>('/alerts')

export const getUsers = () =>
  useMock ? mockGetUsers() : fetchJson<User[]>('/users')

export const createUser = (payload: User) =>
  useMock ? mockCreateUser(payload) : fetchJson<User>('/users', {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const updateUser = (payload: User) =>
  useMock ? mockUpdateUser(payload) : fetchJson<User>(`/users/${payload.id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })

export const deleteUser = (id: string) =>
  useMock ? mockDeleteUser(id) : fetchJson<void>(`/users/${id}`, { method: 'DELETE' })

export const createGate = (payload: Gate) =>
  useMock ? mockCreateGate(payload) : fetchJson<Gate>('/gates', {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const updateGate = (payload: Gate) =>
  useMock ? mockUpdateGate(payload) : fetchJson<Gate>(`/gates/${payload.id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })

export const deleteGate = (id: string) =>
  useMock ? mockDeleteGate(id) : fetchJson<void>(`/gates/${id}`, { method: 'DELETE' })

export const createObjectType = (payload: SurgicalObjectType) =>
  useMock ? mockCreateObjectType(payload) : fetchJson<SurgicalObjectType>('/object-types', {
    method: 'POST',
    body: JSON.stringify(payload)
  })

export const updateObjectType = (payload: SurgicalObjectType) =>
  useMock ? mockUpdateObjectType(payload) : fetchJson<SurgicalObjectType>(`/object-types/${payload.id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  })

export const deleteObjectType = (id: string) =>
  useMock ? mockDeleteObjectType(id) : fetchJson<void>(`/object-types/${id}`, { method: 'DELETE' })
