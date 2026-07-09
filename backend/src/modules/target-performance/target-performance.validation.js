import { z } from 'zod';

export const createTargetSchema = z.object({
  body: z.object({
    userId: z.string().uuid().optional(),
    teamId: z.string().uuid().optional(),
    metric: z.enum(['REVENUE', 'VISITS', 'NEW_LEADS', 'CONVERSIONS']),
    period: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    targetValue: z.number().positive(),
  }).refine(data => data.userId || data.teamId, {
    message: "Either userId or teamId must be provided",
    path: ["userId"],
  }),
});
