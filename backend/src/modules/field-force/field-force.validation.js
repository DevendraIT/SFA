import { z } from 'zod';

export const checkInSchema = z.object({
  location: z.object({
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    address: z.string().optional(),
  }),
});

export const planVisitSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["COLD_CALL", "FOLLOW_UP", "MEETING", "DEMO"]).optional(),
  scheduledAt: z.string().datetime(),
  location: z.record(z.any()).optional(),
  notes: z.string().optional(),
});

export const completeVisitSchema = z.object({
  notes: z.string().optional(),
  photoUrl: z.string().url().optional(),
});


export const logExpenseSchema = z.object({
  amount: z.number().positive(),
  category: z.enum(['TRAVEL', 'MEALS', 'ACCOMMODATION', 'OTHER']),
  date: z.string().datetime(),
  notes: z.string().optional(),
  receiptUrl: z.string().url().optional(),
});

// Additional validation schemas for GET/LIST endpoints
export const filterSchema = z.object({
  query: z.object({
    skip: z.string().optional(),
    take: z.string().optional(),
    userId: z.string().uuid().optional(),
    status: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }).optional(),
});

export const darSchema = z.object({
  totalVisits: z.number().default(0),
  totalOrders: z.number().default(0),
  summary: z.string().optional(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED']).optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  referenceType: z.enum(['LEAD', 'CUSTOMER', 'VISIT', 'OTHER']).optional(),
  referenceId: z.string().uuid().optional(),
});

export const beatPlanSchema = z.object({
  title: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

export const calendarEventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  type: z.enum(['MEETING', 'CALL', 'REMINDER', 'EVENT']).optional(),
});
