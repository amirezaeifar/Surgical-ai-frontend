import type { MockDatabase } from '../types'

export const initialMockData: MockDatabase = {
  users: [
    { id: 'u1', name: 'مدیر سیستم', role: 'ADMIN', badgeId: 'A-100', department: 'مدیریت' },
    { id: 'u2', name: 'حامی شیفت صبح', role: 'SUPPORTER', badgeId: 'S-210', department: 'استریل' },
    { id: 'u3', name: 'حامی شیفت شب', role: 'SUPPORTER', badgeId: 'S-310', department: 'اتاق عمل' }
  ],
  gates: [
    {
      id: 'g1',
      name: 'گیت ورودی اتاق عمل ۱',
      location: 'طبقه ۲ - OR-1',
      type: 'OR_ISSUE',
      deviceId: 'DEV-OR1',
      isActive: true
    },
    {
      id: 'g2',
      name: 'گیت خروجی اتاق عمل ۲',
      location: 'طبقه ۲ - OR-2',
      type: 'OR_RETURN',
      deviceId: 'DEV-OR2',
      isActive: true
    },
    {
      id: 'g3',
      name: 'گیت کلین‌روم',
      location: 'طبقه ۱ - Clean',
      type: 'CLEAN_ROOM',
      deviceId: 'DEV-CLN',
      isActive: true
    },
    {
      id: 'g4',
      name: 'گیت انتقال بین بخش',
      location: 'طبقه ۳ - Transfer',
      type: 'TRANSFER',
      deviceId: 'DEV-TRF',
      isActive: false
    }
  ],
  operations: [
    {
      id: 'op1',
      caseNumber: 'CS-1403-001',
      orRoom: 'OR-1',
      surgeon: 'دکتر احمدی',
      scheduledStart: '2024/08/01 08:00',
      status: 'IN_PROGRESS'
    },
    {
      id: 'op2',
      caseNumber: 'CS-1403-002',
      orRoom: 'OR-2',
      surgeon: 'دکتر رضایی',
      scheduledStart: '2024/08/01 10:30',
      status: 'SCHEDULED'
    },
    {
      id: 'op3',
      caseNumber: 'CS-1403-003',
      orRoom: 'OR-3',
      surgeon: 'دکتر موسوی',
      scheduledStart: '2024/08/01 14:00',
      status: 'CLOSED'
    }
  ],
  objectTypes: [
    { id: 'ot1', name: 'پنس جراحی', tracking: 'COUNT_BASED' },
    { id: 'ot2', name: 'قیچی جراحی', tracking: 'COUNT_BASED' },
    { id: 'ot3', name: 'اسکالپل', tracking: 'INDIVIDUAL_ID' },
    { id: 'ot4', name: 'گاز استریل', tracking: 'COUNT_BASED' }
  ],
  events: [
    {
      id: 'ev1',
      timestamp: '2024/08/01 08:10',
      gateId: 'g1',
      gateName: 'گیت ورودی اتاق عمل ۱',
      userId: 'u2',
      userName: 'حامی شیفت صبح',
      operationId: 'op1',
      action: 'ISSUE',
      detectedItems: [
        { objectTypeId: 'ot1', objectTypeName: 'پنس جراحی', count: 12, confidence: 0.92 },
        { objectTypeId: 'ot2', objectTypeName: 'قیچی جراحی', count: 6, confidence: 0.88 },
        { objectTypeId: 'ot4', objectTypeName: 'گاز استریل', count: 20, confidence: 0.95 }
      ],
      verification: 'USER_CONFIRMED',
      imageUrl: 'https://images.unsplash.com/photo-1580281657521-3e1c04d5c7d5?auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 'ev2',
      timestamp: '2024/08/01 11:15',
      gateId: 'g2',
      gateName: 'گیت خروجی اتاق عمل ۲',
      userId: 'u2',
      userName: 'حامی شیفت صبح',
      operationId: 'op2',
      action: 'RETURN',
      detectedItems: [
        { objectTypeId: 'ot1', objectTypeName: 'پنس جراحی', count: 8, confidence: 0.9 },
        { objectTypeId: 'ot2', objectTypeName: 'قیچی جراحی', count: 4, confidence: 0.86 }
      ],
      verification: 'USER_CORRECTED',
      notes: 'یک قلم اضافه ثبت شد',
      imageUrl: 'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&w=800&q=60'
    },
    {
      id: 'ev3',
      timestamp: '2024/08/01 16:00',
      gateId: 'g3',
      gateName: 'گیت کلین‌روم',
      userId: 'u3',
      userName: 'حامی شیفت شب',
      operationId: 'op1',
      action: 'CLEAN_IN',
      detectedItems: [
        { objectTypeId: 'ot1', objectTypeName: 'پنس جراحی', count: 10, confidence: 0.91 },
        { objectTypeId: 'ot4', objectTypeName: 'گاز استریل', count: 18, confidence: 0.93 }
      ],
      verification: 'AUTO_ACCEPTED'
    }
  ],
  alerts: [
    {
      id: 'al1',
      type: 'MISSING_ITEM',
      severity: 'HIGH',
      message: 'در عملیات CS-1403-001 دو عدد پنس برگشت نشده است.',
      createdAt: '2024/08/01 16:30',
      relatedOperationId: 'op1',
      relatedEventId: 'ev3'
    },
    {
      id: 'al2',
      type: 'MISMATCH_COUNT',
      severity: 'MEDIUM',
      message: 'اختلاف تعداد در گیت خروجی اتاق عمل ۲ ثبت شد.',
      createdAt: '2024/08/01 11:20',
      relatedOperationId: 'op2',
      relatedEventId: 'ev2'
    }
  ]
}
