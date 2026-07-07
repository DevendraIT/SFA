import { z } from 'zod';

const uuid = (label) => z.string().uuid({ message: `Invalid ${label} ID.` });

const STATUSES     = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST', 'ARCHIVED'];
const PRIORITIES   = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
const QUALS        = ['UNQUALIFIED', 'COLD', 'WARM', 'HOT'];
const SOURCES      = ['MANUAL', 'API', 'REFERRAL', 'WEBSITE', 'SOCIAL_MEDIA', 'EVENT', 'CAMPAIGN', 'OTHER'];
const ACTIVITY_TYPES = [
  'CREATED', 'UPDATED', 'STATUS_CHANGED', 'PRIORITY_CHANGED', 'ASSIGNED',
  'NOTE_ADDED', 'NOTE_EDITED', 'NOTE_DELETED', 'NOTE_PINNED',
  'DOCUMENT_UPLOADED', 'DOCUMENT_DELETED',
  'FOLLOW_UP_SCHEDULED', 'FOLLOW_UP_COMPLETED', 'FOLLOW_UP_CANCELLED',
  'MEETING_SCHEDULED', 'MEETING_UPDATED', 'MEETING_COMPLETED', 'MEETING_CANCELLED',
  'SCORE_UPDATED', 'QUALIFICATION_CHANGED', 'CONVERTED', 'EXPORTED', 'DELETED', 'RESTORED',
];

// --------------------------------------------------
// Shared
// --------------------------------------------------

export const idParamSchema = z.object({
  id: uuid('Lead'),
});

export const listQuerySchema = z.object({
  page:           z.coerce.number().int().min(1).default(1),
  limit:          z.coerce.number().int().min(1).max(100).default(20),
  search:         z.string().trim().optional(),
  sortBy:         z.enum(['firstName', 'lastName', 'company', 'score', 'status', 'priority', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder:      z.enum(['asc', 'desc']).default('desc'),
  status:         z.enum(STATUSES).optional(),
  priority:       z.enum(PRIORITIES).optional(),
  qualification:  z.enum(QUALS).optional(),
  source:         z.enum(SOURCES).optional(),
  assignedToId:   uuid('User').optional(),
  territoryId:    uuid('Territory').optional(),
  branchId:       uuid('Branch').optional(),
  teamId:         uuid('Team').optional(),
  scoreMin:       z.coerce.number().min(0).max(100).optional(),
  scoreMax:       z.coerce.number().min(0).max(100).optional(),
  tags:           z.string().trim().optional(),
  isConverted:    z.enum(['true', 'false']).optional().transform(v => v === undefined ? undefined : v === 'true'),
  includeDeleted: z.enum(['true', 'false']).optional().transform(v => v === 'true'),
});

// --------------------------------------------------
// Create Lead
// --------------------------------------------------

export const createLeadSchema = z.object({
  firstName:     z.string().trim().min(1, 'First name is required.').max(100),
  lastName:      z.string().trim().min(1, 'Last name is required.').max(100),
  email:         z.string().trim().toLowerCase().email('Invalid email address.').optional(),
  phone:         z.string().trim().max(30).optional(),
  company:       z.string().trim().max(200).optional(),
  jobTitle:      z.string().trim().max(100).optional(),
  website:       z.string().trim().url('Invalid website URL.').optional().or(z.literal('')),
  industry:      z.string().trim().max(100).optional(),
  companySize:   z.enum(['1-10', '11-50', '51-200', '201-500', '500+']).optional(),
  source:        z.enum(SOURCES).default('MANUAL'),
  addressLine1:  z.string().trim().max(200).optional(),
  city:          z.string().trim().max(100).optional(),
  state:         z.string().trim().max(100).optional(),
  country:       z.string().trim().max(100).optional(),
  postalCode:    z.string().trim().max(20).optional(),
  priority:      z.enum(PRIORITIES).default('MEDIUM'),
  qualification: z.enum(QUALS).default('UNQUALIFIED'),
  score:         z.number().min(0).max(100).default(0),
  notes:         z.string().trim().max(5000).optional(),
  tags:          z.array(z.string().trim().max(50)).max(20).default([]),
  assignedToId:  uuid('User').optional(),
  territoryId:   uuid('Territory').optional(),
  branchId:      uuid('Branch').optional(),
  teamId:        uuid('Team').optional(),
});

// --------------------------------------------------
// Update Lead
// --------------------------------------------------

export const updateLeadSchema = z.object({
  firstName:     z.string().trim().min(1).max(100).optional(),
  lastName:      z.string().trim().min(1).max(100).optional(),
  email:         z.string().trim().toLowerCase().email().optional().nullable(),
  phone:         z.string().trim().max(30).optional().nullable(),
  company:       z.string().trim().max(200).optional().nullable(),
  jobTitle:      z.string().trim().max(100).optional().nullable(),
  website:       z.string().trim().url().optional().nullable().or(z.literal('')),
  industry:      z.string().trim().max(100).optional().nullable(),
  companySize:   z.enum(['1-10', '11-50', '51-200', '201-500', '500+']).optional().nullable(),
  source:        z.enum(SOURCES).optional(),
  addressLine1:  z.string().trim().max(200).optional().nullable(),
  city:          z.string().trim().max(100).optional().nullable(),
  state:         z.string().trim().max(100).optional().nullable(),
  country:       z.string().trim().max(100).optional().nullable(),
  postalCode:    z.string().trim().max(20).optional().nullable(),
  tags:          z.array(z.string().trim().max(50)).max(20).optional(),
  territoryId:   uuid('Territory').optional().nullable(),
  branchId:      uuid('Branch').optional().nullable(),
  teamId:        uuid('Team').optional().nullable(),
}).strict();

// --------------------------------------------------
// State transitions
// --------------------------------------------------

export const updateStatusSchema = z.object({
  status: z.enum(STATUSES),
  note:   z.string().trim().max(1000).optional(),
});

export const updatePrioritySchema = z.object({
  priority: z.enum(PRIORITIES),
});

export const updateQualificationSchema = z.object({
  qualification: z.enum(QUALS),
  note:          z.string().trim().max(1000).optional(),
});

export const updateScoreSchema = z.object({
  score: z.number().min(0).max(100),
  note:  z.string().trim().max(1000).optional(),
});

// --------------------------------------------------
// Assignment
// --------------------------------------------------

export const assignLeadSchema = z.object({
  assignedToId:   uuid('User').nullable(),
  assignmentType: z.enum(['MANUAL', 'AUTO', 'ROUND_ROBIN', 'TERRITORY_BASED', 'TEAM_BASED', 'REASSIGNED', 'UNASSIGNED']).default('MANUAL'),
  note:           z.string().trim().max(1000).optional(),
});

export const bulkAssignSchema = z.object({
  ids:            z.array(uuid('Lead')).min(1).max(500),
  assignedToId:   uuid('User').nullable(),
  assignmentType: z.enum(['MANUAL', 'AUTO', 'ROUND_ROBIN', 'TERRITORY_BASED', 'TEAM_BASED', 'REASSIGNED', 'UNASSIGNED']).default('MANUAL'),
  note:           z.string().trim().max(1000).optional(),
});

export const autoAssignSchema = z.object({
  ids:            z.array(uuid('Lead')).min(1).max(500),
  assignmentType: z.enum(['ROUND_ROBIN', 'TERRITORY_BASED', 'TEAM_BASED']),
  teamId:         uuid('Team').optional(),
  territoryId:    uuid('Territory').optional(),
});

// --------------------------------------------------
// Notes
// --------------------------------------------------

export const createNoteSchema = z.object({
  content:    z.string().trim().min(1, 'Note content is required.').max(10000),
  isPinned:   z.boolean().default(false),
  isInternal: z.boolean().default(false),
});

export const updateNoteSchema = z.object({
  content:    z.string().trim().min(1).max(10000).optional(),
  isPinned:   z.boolean().optional(),
  isInternal: z.boolean().optional(),
});

export const noteIdParamSchema = z.object({
  id:     uuid('Lead'),
  noteId: uuid('Note'),
});

// --------------------------------------------------
// Documents
// --------------------------------------------------

export const documentMetaSchema = z.object({
  name:        z.string().trim().min(1, 'Document name is required.').max(255),
  category:    z.enum(['GENERAL', 'CONTRACT', 'PROPOSAL', 'PRESENTATION', 'INVOICE', 'IDENTITY', 'OTHER']).default('GENERAL'),
  description: z.string().trim().max(1000).optional(),
});

export const documentIdParamSchema = z.object({
  id:         uuid('Lead'),
  documentId: uuid('Document'),
});

// --------------------------------------------------
// Follow-ups
// --------------------------------------------------

export const createFollowUpSchema = z.object({
  title:       z.string().trim().min(1, 'Title is required.').max(255),
  description: z.string().trim().max(2000).optional(),
  dueAt:       z.string().datetime('Invalid due date.').transform(v => new Date(v)),
  ownerId:     uuid('User').optional(), // defaults to current user
});

export const updateFollowUpSchema = z.object({
  title:       z.string().trim().min(1).max(255).optional(),
  description: z.string().trim().max(2000).optional().nullable(),
  dueAt:       z.string().datetime().transform(v => new Date(v)).optional(),
  ownerId:     uuid('User').optional(),
});

export const followUpActionSchema = z.object({
  note: z.string().trim().max(1000).optional(),
});

export const followUpIdParamSchema = z.object({
  id:          uuid('Lead'),
  followUpId:  uuid('FollowUp'),
});

// --------------------------------------------------
// Meetings
// --------------------------------------------------

export const createMeetingSchema = z.object({
  title:           z.string().trim().min(1, 'Title is required.').max(255),
  agenda:          z.string().trim().max(5000).optional(),
  location:        z.string().trim().max(500).optional(),
  meetingUrl:      z.string().trim().url('Invalid meeting URL.').optional().or(z.literal('')),
  scheduledAt:     z.string().datetime('Invalid scheduled date.').transform(v => new Date(v)),
  durationMinutes: z.number().int().min(5).max(480).default(60),
  participants:    z.array(z.object({
    userId: uuid('User').optional(),
    name:   z.string().trim().min(1).max(100),
    email:  z.string().trim().email().optional(),
    role:   z.string().trim().max(50).optional(),
  })).default([]),
});

export const updateMeetingSchema = z.object({
  title:           z.string().trim().min(1).max(255).optional(),
  agenda:          z.string().trim().max(5000).optional().nullable(),
  location:        z.string().trim().max(500).optional().nullable(),
  meetingUrl:      z.string().trim().url().optional().nullable().or(z.literal('')),
  scheduledAt:     z.string().datetime().transform(v => new Date(v)).optional(),
  durationMinutes: z.number().int().min(5).max(480).optional(),
  participants:    z.array(z.object({
    userId: uuid('User').optional(),
    name:   z.string().trim().min(1).max(100),
    email:  z.string().trim().email().optional(),
    role:   z.string().trim().max(50).optional(),
  })).optional(),
});

export const completeMeetingSchema = z.object({
  outcome:      z.string().trim().max(5000).optional(),
  meetingNotes: z.string().trim().max(10000).optional(),
});

export const cancelMeetingSchema = z.object({
  cancelReason: z.string().trim().max(1000).optional(),
});

export const meetingIdParamSchema = z.object({
  id:        uuid('Lead'),
  meetingId: uuid('Meeting'),
});

// --------------------------------------------------
// Conversion
// --------------------------------------------------

export const convertLeadSchema = z.object({
  conversionType: z.enum(['CUSTOMER', 'CONTACT', 'OPPORTUNITY']),
  notes:          z.string().trim().max(2000).optional(),
});

// --------------------------------------------------
// Bulk operations
// --------------------------------------------------

export const bulkUpdateSchema = z.object({
  ids:    z.array(uuid('Lead')).min(1).max(500),
  update: z.object({
    status:        z.enum(STATUSES).optional(),
    priority:      z.enum(PRIORITIES).optional(),
    qualification: z.enum(QUALS).optional(),
    assignedToId:  uuid('User').optional().nullable(),
    territoryId:   uuid('Territory').optional().nullable(),
    tags:          z.array(z.string().trim().max(50)).max(20).optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field to update is required.',
  }),
});

export const bulkDeleteSchema = z.object({
  ids: z.array(uuid('Lead')).min(1).max(500),
});

export const bulkStatusUpdateSchema = z.object({
  ids:    z.array(uuid('Lead')).min(1).max(500),
  status: z.enum(STATUSES),
  note:   z.string().trim().max(1000).optional(),
});

// --------------------------------------------------
// Export
// --------------------------------------------------

export const exportQuerySchema = z.object({
  format:        z.enum(['CSV', 'EXCEL']).default('CSV'),
  status:        z.enum(STATUSES).optional(),
  priority:      z.enum(PRIORITIES).optional(),
  qualification: z.enum(QUALS).optional(),
  source:        z.enum(SOURCES).optional(),
  assignedToId:  uuid('User').optional(),
  territoryId:   uuid('Territory').optional(),
  branchId:      uuid('Branch').optional(),
  teamId:        uuid('Team').optional(),
  scoreMin:      z.coerce.number().min(0).max(100).optional(),
  scoreMax:      z.coerce.number().min(0).max(100).optional(),
  tags:          z.string().trim().optional(),
  search:        z.string().trim().optional(),
  isConverted:   z.enum(['true', 'false']).optional().transform(v => v === undefined ? undefined : v === 'true'),
});

// --------------------------------------------------
// Analytics
// --------------------------------------------------

export const analyticsQuerySchema = z.object({
  from:        z.string().datetime().transform(v => new Date(v)).optional(),
  to:          z.string().datetime().transform(v => new Date(v)).optional(),
  territoryId: uuid('Territory').optional(),
  branchId:    uuid('Branch').optional(),
  teamId:      uuid('Team').optional(),
  assignedToId: uuid('User').optional(),
  groupBy:     z.enum(['day', 'week', 'month']).default('month'),
});

// --------------------------------------------------
// Activity
// --------------------------------------------------

export const activityQuerySchema = z.object({
  page:         z.coerce.number().int().min(1).default(1),
  limit:        z.coerce.number().int().min(1).max(100).default(20),
  activityType: z.enum(ACTIVITY_TYPES).optional(),
});

// --------------------------------------------------
// Export job list query
// --------------------------------------------------

export const paginationQuerySchema = z.object({
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const jobIdParamSchema = z.object({
  jobId: uuid('ExportJob'),
});
