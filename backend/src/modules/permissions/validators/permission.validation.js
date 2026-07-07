import { z } from 'zod';
import { 
  PERMISSION_CATEGORIES, 
  PERMISSION_TYPES, 
  PERMISSION_SCOPES, 
  PERMISSION_STATUS,
  PERMISSION_VALIDATION,
  RESERVED_PERMISSION_SLUGS
} from '../constants/permission.constants.js';

const uuidSchema = (label) => z.string().uuid({ message: `Invalid ${label} ID.` });

const permissionSlugSchema = z
  .string()
  .trim()
  .min(PERMISSION_VALIDATION.SLUG_MIN_LENGTH, `Slug must be at least ${PERMISSION_VALIDATION.SLUG_MIN_LENGTH} characters.`)
  .max(PERMISSION_VALIDATION.SLUG_MAX_LENGTH, `Slug cannot exceed ${PERMISSION_VALIDATION.SLUG_MAX_LENGTH} characters.`)
  .regex(/^[a-z0-9:_-]+$/, 'Slug must contain only lowercase letters, numbers, colons, underscores, and hyphens.')
  .refine((slug) => !RESERVED_PERMISSION_SLUGS.includes(slug), {
    message: 'Permission slug is reserved and cannot be used.',
  });

export const listPermissionSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.string().trim().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  category: z.enum(Object.values(PERMISSION_CATEGORIES)).optional(),
  type: z.enum(Object.values(PERMISSION_TYPES)).optional(),
  scope: z.enum(Object.values(PERMISSION_SCOPES)).optional(),
  status: z.enum(Object.values(PERMISSION_STATUS)).optional(),
});

export const createPermissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(PERMISSION_VALIDATION.NAME_MIN_LENGTH, `Name must be at least ${PERMISSION_VALIDATION.NAME_MIN_LENGTH} characters.`)
    .max(PERMISSION_VALIDATION.NAME_MAX_LENGTH, `Name cannot exceed ${PERMISSION_VALIDATION.NAME_MAX_LENGTH} characters.`),
  
  slug: permissionSlugSchema,
  
  description: z
    .string()
    .trim()
    .max(PERMISSION_VALIDATION.DESCRIPTION_MAX_LENGTH, `Description cannot exceed ${PERMISSION_VALIDATION.DESCRIPTION_MAX_LENGTH} characters.`)
    .optional(),
  
  category: z.enum(Object.values(PERMISSION_CATEGORIES)),
  
  type: z.enum(Object.values(PERMISSION_TYPES)),
  
  scope: z.enum(Object.values(PERMISSION_SCOPES)).default(PERMISSION_SCOPES.ORGANIZATION),
  
  status: z.enum(Object.values(PERMISSION_STATUS)).default(PERMISSION_STATUS.ACTIVE),
  
  isSystem: z.boolean().default(false),
  
  parentId: uuidSchema('Parent permission').optional().nullable(),
  
  metadata: z.record(z.any()).optional(),
});

export const updatePermissionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(PERMISSION_VALIDATION.NAME_MIN_LENGTH, `Name must be at least ${PERMISSION_VALIDATION.NAME_MIN_LENGTH} characters.`)
    .max(PERMISSION_VALIDATION.NAME_MAX_LENGTH, `Name cannot exceed ${PERMISSION_VALIDATION.NAME_MAX_LENGTH} characters.`)
    .optional(),
  
  slug: permissionSlugSchema.optional(),
  
  description: z
    .string()
    .trim()
    .max(PERMISSION_VALIDATION.DESCRIPTION_MAX_LENGTH, `Description cannot exceed ${PERMISSION_VALIDATION.DESCRIPTION_MAX_LENGTH} characters.`)
    .optional()
    .nullable(),
  
  category: z.enum(Object.values(PERMISSION_CATEGORIES)).optional(),
  
  type: z.enum(Object.values(PERMISSION_TYPES)).optional(),
  
  scope: z.enum(Object.values(PERMISSION_SCOPES)).optional(),
  
  status: z.enum(Object.values(PERMISSION_STATUS)).optional(),
  
  parentId: uuidSchema('Parent permission').optional().nullable(),
  
  metadata: z.record(z.any()).optional(),
});

export const permissionIdSchema = z.object({
  id: uuidSchema('Permission'),
});

