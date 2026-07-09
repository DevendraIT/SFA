/**
 * AI Lead Engine Module — Validators
 */
import { z } from 'zod';

// Imports
export const createImportSchema = z.object({
  fileName: z.string().min(1).optional(),
  originalName: z.string().min(1).optional(),
});

export const manualProspectSchema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
});

export const apiImportSchema = z.object({
  prospects: z.array(manualProspectSchema).min(1).max(500),
});

// Prospects
export const prospectQuerySchema = z.object({
  page: z.string().optional().transform(Number),
  limit: z.string().optional().transform(Number),
  status: z.enum(['UNQUALIFIED', 'COLD', 'WARM', 'HOT', 'SPAM', 'DISQUALIFIED']).optional(),
  campaignId: z.string().uuid().optional(),
});

// Campaigns
export const createCampaignSchema = z.object({
  name: z.string().min(3).max(100),
  subject: z.string().min(3).max(255),
  templateBody: z.string().min(10),
  scheduledAt: z.string().datetime().optional(),
});

export const updateCampaignSchema = z.object({
  name: z.string().min(3).max(100).optional(),
  subject: z.string().min(3).max(255).optional(),
  templateBody: z.string().min(10).optional(),
  status: z.enum(['DRAFT', 'SCHEDULED', 'RUNNING', 'CANCELLED']).optional(),
  scheduledAt: z.string().datetime().optional(),
});

// Campaign Prospects
export const addProspectsToCampaignSchema = z.object({
  prospectIds: z.array(z.string().uuid()).min(1),
});

// Recipient filter for bulk generation
export const recipientFilterSchema = z.object({
  qualificationStatus: z.array(z.enum(['UNQUALIFIED','COLD','WARM','HOT'])).optional(),
  country:    z.string().optional(),
  company:    z.string().optional(),
  jobTitle:   z.string().optional(),
  importJobId: z.string().uuid().optional(),
});

// Campaign Scheduling
export const scheduleCampaignSchema = z.object({
  scheduledAt: z.string().datetime(),
});

// Test Email
export const testEmailSchema = z.object({
  email: z.string().email(),
});

// Email Template
export const createTemplateSchema = z.object({
  name:      z.string().min(1).max(100),
  subject:   z.string().min(3).max(255),
  body:      z.string().min(10),
  variables: z.array(z.string()).optional(),
});

export const updateTemplateSchema = createTemplateSchema.partial();

// Campaign status filter query
export const campaignQuerySchema = z.object({
  page:   z.string().optional().transform(Number),
  limit:  z.string().optional().transform(Number),
  status: z.enum(['DRAFT','SCHEDULED','RUNNING','COMPLETED','CANCELLED','FAILED']).optional(),
});

// Tracking Webhook (depends on provider, e.g. SendGrid/Mailgun)
export const emailWebhookSchema = z.object({
  // Highly provider specific; basic generic schema for now
  events: z.array(
    z.object({
      email: z.string().email(),
      event: z.string(), // opened, clicked, delivered, bounced
      message_id: z.string().optional(),
      timestamp: z.number().optional(),
    })
  )
});
