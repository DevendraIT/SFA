import { z } from 'zod';
import { ROLE_STATUS, ROLE_VALIDATION, RESERVED_ROLE_NAMES } from '../constants/role.constants.js';

const uuidSchema = (label) => z.string().uuid({ message: `Invalid ${label} ID.` });

export const listRoleSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.string().trim().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  status: z.enum([ROLE_STATUS.ACTIVE, ROLE_STATUS.INACTIVE, ROLE_STATUS.SUSPENDED]).optional(),
  type: z.string().trim().optional(),
});

export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(ROLE_VALIDATION.NAME_MIN_LENGTH, `Name must be at least ${ROLE_VALIDATION.NAME_MIN_LENGTH} characters.`)
    .max(ROLE_VALIDATION.NAME_MAX_LENGTH, `Name cannot exceed ${ROLE_VALIDATION.NAME_MAX_LENGTH} characters.`)
    .refine((name) => !RESERVED_ROLE_NAMES.includes(name.toLowerCase()), {
      message: 'Role name is reserved and cannot be used.',
    }),
  description: z
    .string()
    .trim()
    .max(ROLE_VALIDATION.DESCRIPTION_MAX_LENGTH, `Description cannot exceed ${ROLE_VALIDATION.DESCRIPTION_MAX_LENGTH} characters.`)
    .optional(),
  status: z.enum([ROLE_STATUS.ACTIVE, ROLE_STATUS.INACTIVE, ROLE_STATUS.SUSPENDED]).default(ROLE_STATUS.ACTIVE),
  permissions: z
    .array(z.string().trim().min(1))
    .max(ROLE_VALIDATION.PERMISSIONS_MAX_COUNT, `Cannot exceed ${ROLE_VALIDATION.PERMISSIONS_MAX_COUNT} permissions.`)
    .optional()
    .default([]),
});

export const updateRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(ROLE_VALIDATION.NAME_MIN_LENGTH, `Name must be at least ${ROLE_VALIDATION.NAME_MIN_LENGTH} characters.`)
    .max(ROLE_VALIDATION.NAME_MAX_LENGTH, `Name cannot exceed ${ROLE_VALIDATION.NAME_MAX_LENGTH} characters.`)
    .refine((name) => !RESERVED_ROLE_NAMES.includes(name.toLowerCase()), {
      message: 'Role name is reserved and cannot be used.',
    })
    .optional(),
  description: z
    .string()
    .trim()
    .max(ROLE_VALIDATION.DESCRIPTION_MAX_LENGTH, `Description cannot exceed ${ROLE_VALIDATION.DESCRIPTION_MAX_LENGTH} characters.`)
    .optional()
    .nullable(),
  status: z.enum([ROLE_STATUS.ACTIVE, ROLE_STATUS.INACTIVE, ROLE_STATUS.SUSPENDED]).optional(),
  permissions: z
    .array(z.string().trim().min(1))
    .max(ROLE_VALIDATION.PERMISSIONS_MAX_COUNT, `Cannot exceed ${ROLE_VALIDATION.PERMISSIONS_MAX_COUNT} permissions.`)
    .optional(),
});

export const roleIdSchema = z.object({
  id: uuidSchema('Role'),
});