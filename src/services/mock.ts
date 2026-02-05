import type {
  Alert,
  Gate,
  GateEvent,
  GateEventFilters,
  MockDatabase,
  Operation,
  SurgicalObjectType,
  User
} from '../types'
import { initialMockData } from '../mocks/data'

const STORAGE_KEY = 'surgical-ai-db'

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms))

const readDb = (): MockDatabase => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    return JSON.parse(raw) as MockDatabase
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockData))
  return JSON.parse(JSON.stringify(initialMockData)) as MockDatabase
}

const writeDb = (db: MockDatabase) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

export const mockAuthLogin = async (username: string, password: string): Promise<User> => {
  await delay()
  const db = readDb()
  if (username === 'admin' && password === 'admin') {
    return db.users.find((user) => user.role === 'ADMIN') as User
  }
  if (username === 'support' && password === 'support') {
    return db.users.find((user) => user.role === 'SUPPORTER') as User
  }
  throw new Error('نام کاربری یا رمز عبور نادرست است')
}

export const mockGetOperations = async (): Promise<Operation[]> => {
  await delay()
  return readDb().operations
}

export const mockGetOperationById = async (id: string): Promise<Operation | undefined> => {
  await delay()
  return readDb().operations.find((op) => op.id === id)
}

export const mockGetGates = async (): Promise<Gate[]> => {
  await delay()
  return readDb().gates
}

export const mockGetObjectTypes = async (): Promise<SurgicalObjectType[]> => {
  await delay()
  return readDb().objectTypes
}

export const mockGetEvents = async (filters?: GateEventFilters): Promise<GateEvent[]> => {
  await delay()
  const db = readDb()
  let events = [...db.events]
  if (filters?.gateId) {
    events = events.filter((event) => event.gateId === filters.gateId)
  }
  if (filters?.action) {
    events = events.filter((event) => event.action === filters.action)
  }
  if (filters?.verification) {
    events = events.filter((event) => event.verification === filters.verification)
  }
  if (filters?.operationId) {
    events = events.filter((event) => event.operationId === filters.operationId)
  }
  if (filters?.dateFrom) {
    events = events.filter((event) => event.timestamp >= filters.dateFrom)
  }
  if (filters?.dateTo) {
    events = events.filter((event) => event.timestamp <= filters.dateTo)
  }
  return events
}

export const mockGetEventById = async (id: string): Promise<GateEvent | undefined> => {
  await delay()
  return readDb().events.find((event) => event.id === id)
}

export const mockCreateGateEvent = async (payload: GateEvent): Promise<GateEvent> => {
  await delay()
  const db = readDb()
  db.events = [payload, ...db.events]
  writeDb(db)
  return payload
}

export const mockGetAlerts = async (): Promise<Alert[]> => {
  await delay()
  return readDb().alerts
}

export const mockGetUsers = async (): Promise<User[]> => {
  await delay()
  return readDb().users
}

export const mockCreateUser = async (user: User): Promise<User> => {
  await delay()
  const db = readDb()
  db.users = [user, ...db.users]
  writeDb(db)
  return user
}

export const mockUpdateUser = async (user: User): Promise<User> => {
  await delay()
  const db = readDb()
  db.users = db.users.map((item) => (item.id === user.id ? user : item))
  writeDb(db)
  return user
}

export const mockDeleteUser = async (id: string): Promise<void> => {
  await delay()
  const db = readDb()
  db.users = db.users.filter((item) => item.id !== id)
  writeDb(db)
}

export const mockCreateGate = async (gate: Gate): Promise<Gate> => {
  await delay()
  const db = readDb()
  db.gates = [gate, ...db.gates]
  writeDb(db)
  return gate
}

export const mockUpdateGate = async (gate: Gate): Promise<Gate> => {
  await delay()
  const db = readDb()
  db.gates = db.gates.map((item) => (item.id === gate.id ? gate : item))
  writeDb(db)
  return gate
}

export const mockDeleteGate = async (id: string): Promise<void> => {
  await delay()
  const db = readDb()
  db.gates = db.gates.filter((item) => item.id !== id)
  writeDb(db)
}

export const mockCreateObjectType = async (objectType: SurgicalObjectType): Promise<SurgicalObjectType> => {
  await delay()
  const db = readDb()
  db.objectTypes = [objectType, ...db.objectTypes]
  writeDb(db)
  return objectType
}

export const mockUpdateObjectType = async (objectType: SurgicalObjectType): Promise<SurgicalObjectType> => {
  await delay()
  const db = readDb()
  db.objectTypes = db.objectTypes.map((item) => (item.id === objectType.id ? objectType : item))
  writeDb(db)
  return objectType
}

export const mockDeleteObjectType = async (id: string): Promise<void> => {
  await delay()
  const db = readDb()
  db.objectTypes = db.objectTypes.filter((item) => item.id !== id)
  writeDb(db)
}
