/**
 * CRM Integration Validation - Enterprise Modular Monolith
 */

import { z } from 'zod';
import { CRM_CONSTANTS } from '../constants/crm.constants.js';

export const crmValidation = {
  /**
   * CRM Configuration Schema
   */
  configureSchema: z.object({
    crmType: z.enum(CRM_CONSTANTS.SUPPORTED_CRMS, {
      required_error: 'CRM type is required',
      invalid_type_error: 'Invalid CRM type',
    }),
    apiUrl: z.string().url('Invalid API URL format'),
    apiKey: z.string().min(1, 'API key is required'),
    apiSecret: z.string().optional(),
    accessToken: z.string().optional(),
    refreshToken: z.string().optional(),
    enableWebhooks: z.boolean().default(false),
    webhookUrl: z.string().url().optional(),
    syncSchedule: z.string().optional(),
    syncEnabled: z.boolean().default(true),
    settings: z.object({
      batchSize: z.number().min(1).max(CRM_CONSTANTS.MAX_PAGE_SIZE).optional(),
      retryAttempts: z.number().min(0).max(10).optional(),
      timeoutMs: z.number().min(1000).max(120000).optional(),
    }).optional(),
  }),

  /**
   * Sync Initiation Schema
   */
  syncSchema: z.object({
    syncType: z.enum(Object.values(CRM_CONSTANTS.SYNC_TYPES), {
      required_error: 'Sync type is required',
      invalid_type_error: 'Invalid sync type',
    }),
    forceSync: z.boolean().default(false),
    batchSize: z.number().min(1).max(CRM_CONSTANTS.MAX_PAGE_SIZE).optional(),
    dateRange: z.object({
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
    }).optional(),
  }),

  /**
   * Field Mappings Schema
   */
  mappingsSchema: z.object({
    leadMappings: z.record(z.string()).optional(),
    contactMappings: z.record(z.string()).optional(),
    opportunityMappings: z.record(z.string()).optional(),
    customMappings: z.record(z.any()).optional(),
  }).refine(
    (data) => {
      // At least one mapping type must be provided
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one mapping type must be provided',
    }
  ),

  /**
   * Integration Toggle Schema
   */
  toggleSchema: z.object({
    action: z.enum(['pause', 'resume'], {
      required_error: 'Action is required',
      invalid_type_error: 'Action must be either pause or resume',
    }),
  }),

  /**
   * Webhook Event Schema
   */
  webhookEventSchema: z.object({
    eventType: z.enum(Object.values(CRM_CONSTANTS.WEBHOOK_EVENTS)),
    crmId: z.string().min(1),
    crmType: z.enum(CRM_CONSTANTS.SUPPORTED_CRMS),
    payload: z.record(z.any()),
    timestamp: z.string().datetime(),
  }),

  /**
   * Sync Log Query Schema
   */
  syncLogQuerySchema: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    syncJobId: z.string().uuid().optional(),
    level: z.enum(Object.values(CRM_CONSTANTS.LOG_LEVELS)).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),

  /**
   * CRM Entity Schema (for data validation)
   */
  leadEntitySchema: z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().optional(),
    company: z.string().optional(),
    jobTitle: z.string().optional(),
    status: z.string().optional(),
    source: z.string().optional(),
    customFields: z.record(z.any()).optional(),
  }),

  contactEntitySchema: z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    email: z.string().email(),
    phone: z.string().optional(),
    company: z.string().optional(),
    jobTitle: z.string().optional(),
    customFields: z.record(z.any()).optional(),
  }),

  opportunityEntitySchema: z.object({
    name: z.string().min(1).max(200),
    amount: z.number().min(0).optional(),
    stage: z.string().min(1),
    probability: z.number().min(0).max(100).optional(),
    expectedCloseDate: z.string().datetime().optional(),
    contactId: z.string().optional(),
    accountId: z.string().optional(),
    customFields: z.record(z.any()).optional(),
  }),

  /**
   * Batch Operation Schema
   */
  batchOperationSchema: z.object({
    operation: z.enum(['create', 'update', 'delete']),
    entityType: z.enum(['lead', 'contact', 'opportunity']),
    entities: z.array(z.record(z.any())).min(1).max(CRM_CONSTANTS.VALIDATION.MAX_BATCH_SIZE),
  }),
};

/**
 * Validate CRM-specific configuration
 */
export const validateCRMSpecificConfig = (crmType, config) => {
  const validationSchemas = {
    salesforce: z.object({
      instanceUrl: z.string().url(),
      clientId: z.string().min(1),
      clientSecret: z.string().min(1),
      username: z.string().email(),
      password: z.string().min(1),
      securityToken: z.string().min(1),
    }),
    
    hubspot: z.object({
      apiKey: z.string().min(1),
      portalId: z.string().min(1),
    }),
    
    pipedrive: z.object({
      apiToken: z.string().min(1),
      companyDomain: z.string().min(1),
    }),
    
    zoho: z.object({
      clientId: z.string().min(1),
      clientSecret: z.string().min(1),
      refreshToken: z.string().min(1),
      datacenter: z.string().default('com'),
    }),
  };

  const schema = validationSchemas[crmType];
  if (!schema) {
    throw new Error(`Validation schema not found for CRM type: ${crmType}`);
  }

  return schema.parse(config);
};

/**
 * Validate field mapping structure
 */
export const validateFieldMapping = (crmType, entityType, mappings) => {
  if (!mappings || typeof mappings !== 'object') {
    throw new Error('Mappings must be an object');
  }

  // Check required fields based on entity type
  const requiredFields = CRM_CONSTANTS.VALIDATION[`REQUIRED_${entityType.toUpperCase()}_FIELDS`];
  if (requiredFields) {
    const missingFields = requiredFields.filter(field => !mappings[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required field mappings: ${missingFields.join(', ')}`);
    }
  }

  return true;
};