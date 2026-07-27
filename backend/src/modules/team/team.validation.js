import { z } from 'zod';

const nameSchema = (label) =>
  z.string().trim().min(1, `${label} is required.`).max(100, `${label} cannot exceed 100 characters.`);
const uuidSchema = (label) => z.string().uuid({ message: `Invalid ${label} ID.` });

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.string().trim().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  branchId: uuidSchema('Branch').optional(),
  departmentId: uuidSchema('Department').optional(),
  territoryId: uuidSchema('Territory').optional(),
});

export const createTeamSchema = z.object({
  branchId: uuidSchema('Branch'),
  departmentId: uuidSchema('Department').optional(),
  territoryId: uuidSchema('Territory').optional(),
  name: nameSchema('Team name'),
  description: z.string().trim().max(500).optional(),
});

export const updateTeamSchema = z.object({
  branchId: uuidSchema('Branch').optional(),
  departmentId: uuidSchema('Department').optional().nullable(),
  territoryId: uuidSchema('Territory').optional().nullable(),
  name: nameSchema('Team name').optional(),
  description: z.string().trim().max(500).optional().nullable(),
});

export const idParamSchema = z.object({
  id: uuidSchema('Team'),
});
