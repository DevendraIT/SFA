import { z } from 'zod';

// --------------------------------------------------
// Shared Helpers
// --------------------------------------------------
const codeSchema = z.string().trim().toUpperCase().max(20, 'Code cannot exceed 20 characters.').optional();
const nameSchema = (label) => z.string().trim().min(1, `${label} is required.`).max(100, `${label} cannot exceed 100 characters.`);
const uuidSchema = (label) => z.string().uuid({ message: `Invalid ${label} ID.` });

// --------------------------------------------------
// Pagination / Search Query
// --------------------------------------------------
export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.string().trim().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const listOrganizationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  sortBy: z.string().trim().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  isActive: z.coerce.boolean().optional(),
});

// --------------------------------------------------
// Organization
// --------------------------------------------------
export const createOrganizationSchema = z.object({
  name: nameSchema('Organization name'),
  isActive: z.boolean().optional().default(true),
});

export const updateOrganizationSchema = z.object({
  name: nameSchema('Organization name').optional(),
  isActive: z.boolean().optional(),
});

// --------------------------------------------------
// Company
// --------------------------------------------------
export const createCompanySchema = z.object({
  name: nameSchema('Company name'),
  code: codeSchema,
});

export const updateCompanySchema = z.object({
  name: nameSchema('Company name').optional(),
  code: codeSchema,
});

// --------------------------------------------------
// Branch
// --------------------------------------------------
export const createBranchSchema = z.object({
  companyId: uuidSchema('Company'),
  name: nameSchema('Branch name'),
  code: codeSchema,
});

export const updateBranchSchema = z.object({
  name: nameSchema('Branch name').optional(),
  code: codeSchema,
});

// --------------------------------------------------
// Department
// --------------------------------------------------
export const createDepartmentSchema = z.object({
  branchId: uuidSchema('Branch'),
  name: nameSchema('Department name'),
  code: codeSchema,
});

export const updateDepartmentSchema = z.object({
  name: nameSchema('Department name').optional(),
  code: codeSchema,
});

// --------------------------------------------------
// Territory
// --------------------------------------------------
export const createTerritorySchema = z.object({
  companyId: uuidSchema('Company').optional(),
  name: nameSchema('Territory name'),
  description: z.string().trim().max(500).optional(),
});

export const updateTerritorySchema = z.object({
  companyId: uuidSchema('Company').optional().nullable(),
  name: nameSchema('Territory name').optional(),
  description: z.string().trim().max(500).optional().nullable(),
});

// --------------------------------------------------
// ID Param
// --------------------------------------------------
export const idParamSchema = z.object({
  id: uuidSchema('Resource'),
});
