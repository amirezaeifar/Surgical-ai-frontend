export type Role = 'ADMIN' | 'SUPPORTER'

export interface User {
  id: string
  name: string
  role: Role
  badgeId?: string
  department?: string
}

export interface Gate {
  id: string
  name: string
  location: string
  type: 'OR_ISSUE' | 'OR_RETURN' | 'CLEAN_ROOM' | 'TRANSFER'
  deviceId: string
  isActive: boolean
}

export interface Operation {
  id: string
  caseNumber: string
  orRoom: string
  surgeon: string
  scheduledStart: string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'CLOSED'
}

export interface SurgicalObjectType {
  id: string
  name: string
  tracking: 'COUNT_BASED' | 'INDIVIDUAL_ID'
}

export interface DetectedItem {
  objectTypeId: string
  objectTypeName: string
  count: number
  confidence: number
}

export interface GateEvent {
  id: string
  timestamp: string
  gateId: string
  gateName: string
  userId: string
  userName: string
  operationId: string
  action: 'ISSUE' | 'TRANSFER' | 'RETURN' | 'CLEAN_IN' | 'CLEAN_OUT' | 'AUDIT_CHECK' | 'EXCEPTION'
  detectedItems: DetectedItem[]
  mlRaw?: { items: DetectedItem[] }
  verification: 'AUTO_ACCEPTED' | 'USER_CONFIRMED' | 'USER_CORRECTED'
  notes?: string
  imageUrl?: string
}

export interface Alert {
  id: string
  type: 'MISSING_ITEM' | 'MISMATCH_COUNT' | 'UNEXPECTED_FLOW'
  severity: 'LOW' | 'MEDIUM' | 'HIGH'
  message: string
  createdAt: string
  relatedOperationId?: string
  relatedEventId?: string
}

export interface GateEventFilters {
  dateFrom?: string
  dateTo?: string
  gateId?: string
  action?: GateEvent['action']
  verification?: GateEvent['verification']
  operationId?: string
}

export interface MockDatabase {
  users: User[]
  gates: Gate[]
  operations: Operation[]
  objectTypes: SurgicalObjectType[]
  events: GateEvent[]
  alerts: Alert[]
}
