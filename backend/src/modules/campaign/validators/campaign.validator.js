import { z } from 'zod';

export const createCampaignSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().optional(),
  campaignChannel: z.enum(['Email', 'SMS', 'WhatsApp']).optional(),
  category: z.string().min(2).optional(),
  serviceType: z.string().optional(),
  templateId: z.string().uuid('Invalid template ID').nullable().optional(),
  emailProvider: z.enum(['SMTP', 'Gmail']).optional(),
  scheduledAt: z.string().datetime().optional()
});

export const updateCampaignSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  description: z.string().optional(),
  templateId: z.string().uuid('Invalid template ID').nullable().optional(),
  emailProvider: z.enum(['SMTP', 'Gmail']).optional(),
  scheduledAt: z.string().datetime().optional()
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid Campaign ID')
});

export const listQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  status: z.enum(['Draft', 'Scheduled', 'Running', 'Paused', 'Completed', 'Cancelled']).optional(),
  campaignChannel: z.enum(['Email', 'SMS', 'WhatsApp']).optional(),
  category: z.string().optional()
});

export const webhookEmailStatusSchema = z.object({
  campaignId: z.string().uuid(),
  leadId: z.string().uuid(),
  status: z.enum(['Queued', 'Sent', 'Delivered', 'Opened', 'Clicked', 'Failed']),
  errorMessage: z.string().optional()
});

export const webhookReplySchema = z.object({
  campaignId: z.string().uuid(),
  leadId: z.string().uuid(),
  replyType: z.enum(['Interested', 'Demo', 'Pricing', 'NotInterested', 'Other', 'Demo Requested', 'Not Interested'])
});
