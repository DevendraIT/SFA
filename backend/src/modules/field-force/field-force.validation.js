import { z } from 'zod';

export const checkInSchema = z.object({
  body: z.object({
    location: z.object({
      lat: z.number().optional(),
      lng: z.number().optional(),
      address: z.string().optional(),
    }).optional(),
  }),
});

export const planVisitSchema = z.object({
  body: z.object({
    leadId: z.string().uuid().optional(),
    title: z.string().min(1),
    type: z.enum(['COLD_CALL', 'FOLLOW_UP', 'MEETING', 'DEMO']).optional(),
    scheduledAt: z.string().datetime(),
    location: z.record(z.any()).optional(),
    notes: z.string().optional(),
  }),
});

export const completeVisitSchema = z.object({
  body: z.object({
    notes: z.string().optional(),
    photoUrl: z.string().url().optional(),
  }),
});

export const logExpenseSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    category: z.enum(['TRAVEL', 'MEALS', 'ACCOMMODATION', 'OTHER']),
    date: z.string().datetime(),
    notes: z.string().optional(),
    receiptUrl: z.string().url().optional(),
  }),
});
