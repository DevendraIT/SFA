import { z } from 'zod';

// ──────────────────────────────────────────────────────
// Shared
// ──────────────────────────────────────────────────────

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const paginationSchema = z.object({
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ──────────────────────────────────────────────────────
// Workflow Rules
// ──────────────────────────────────────────────────────

// A condition is a simple JSON object: { field, operator, value }
const conditionSchema = z.object({
  field:    z.string().min(1),
  operator: z.enum(['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'contains']),
  value:    z.any(),
});

// An action describes what should happen: { type, config }
const actionSchema = z.object({
  type:   z.enum([
    'ASSIGN_USER',
    'ASSIGN_ROLE',
    'SEND_NOTIFICATION',
    'CREATE_TASK',
    'UPDATE_FIELD',
    'TRIGGER_APPROVAL',
    'EMIT_EVENT',
    'WEBHOOK',
  ]),
  config: z.record(z.any()).default({}),
});

export const createRuleSchema = z.object({
  name:        z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  eventName:   z.string().min(2),
  conditions:  z.object({
    logic: z.enum(['AND', 'OR']).default('AND'),
    rules: z.array(conditionSchema).default([]),
  }),
  actions:     z.array(actionSchema).min(1),
  isActive:    z.boolean().default(true),
});

export const updateRuleSchema = createRuleSchema.partial();

// ──────────────────────────────────────────────────────
// Approvals
// ──────────────────────────────────────────────────────

export const createApprovalChainSchema = z.object({
  name:       z.string().min(2).max(120),
  entityType: z.enum(['SALES_ORDER', 'QUOTATION', 'LEAVE_REQUEST', 'EXPENSE']),
  isActive:   z.boolean().default(true),
  steps: z.array(z.object({
    stepOrder: z.number().int().min(1),
    roleId:    z.string().uuid().optional(),
    userId:    z.string().uuid().optional(),
    isManager: z.boolean().default(false),
  })).min(1),
});

export const approvalActionSchema = z.object({
  action:  z.enum(['APPROVE', 'REJECT']),
  comment: z.string().max(500).optional(),
});

// ──────────────────────────────────────────────────────
// Manual Trigger
// ──────────────────────────────────────────────────────

export const manualTriggerSchema = z.object({
  eventName: z.string().min(2),
  payload:   z.record(z.any()).default({}),
});

