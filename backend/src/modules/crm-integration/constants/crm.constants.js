/**
 * CRM Integration Constants - Enterprise Modular Monolith
 */

export const CRM_CONSTANTS = {
  // Module name for audit logs
  MODULE_NAME: 'CRM_INTEGRATION',

  // Supported CRM systems
  SUPPORTED_CRMS: [
    'salesforce',
    'hubspot',
    'pipedrive',
    'zoho',
    'dynamics365',
    'freshworks',
  ],

  // Integration status
  STATUS: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    PAUSED: 'PAUSED',
    ERROR: 'ERROR',
    CONFIGURING: 'CONFIGURING',
  },

  // Sync status
  SYNC_STATUS: {
    INITIATED: 'INITIATED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED',
  },

  // Sync types
  SYNC_TYPES: {
    FULL: 'FULL',
    INCREMENTAL: 'INCREMENTAL',
    LEADS_ONLY: 'LEADS_ONLY',
    CONTACTS_ONLY: 'CONTACTS_ONLY',
    OPPORTUNITIES_ONLY: 'OPPORTUNITIES_ONLY',
  },

  // Webhook event types
  WEBHOOK_EVENTS: {
    LEAD_CREATED: 'LEAD_CREATED',
    LEAD_UPDATED: 'LEAD_UPDATED',
    LEAD_DELETED: 'LEAD_DELETED',
    CONTACT_CREATED: 'CONTACT_CREATED',
    CONTACT_UPDATED: 'CONTACT_UPDATED',
    CONTACT_DELETED: 'CONTACT_DELETED',
    OPPORTUNITY_CREATED: 'OPPORTUNITY_CREATED',
    OPPORTUNITY_UPDATED: 'OPPORTUNITY_UPDATED',
    OPPORTUNITY_DELETED: 'OPPORTUNITY_DELETED',
  },

  // Log levels
  LOG_LEVELS: {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
  },

  // API settings
  API_TIMEOUT: 30000, // 30 seconds
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second

  // Pagination defaults
  DEFAULT_PAGE_SIZE: 100,
  MAX_PAGE_SIZE: 1000,

  // Rate limiting
  RATE_LIMIT: {
    REQUESTS_PER_MINUTE: 60,
    BURST_LIMIT: 10,
  },

  // Data validation
  VALIDATION: {
    MAX_BATCH_SIZE: 500,
    REQUIRED_LEAD_FIELDS: ['email', 'firstName', 'lastName'],
    REQUIRED_CONTACT_FIELDS: ['email', 'firstName', 'lastName'],
  },

  // Audit actions
  AUDIT_ACTIONS: {
    CONFIGURATION_UPDATED: 'CONFIGURATION_UPDATED',
    CONFIGURATION_DELETED: 'CONFIGURATION_DELETED',
    SYNC_INITIATED: 'SYNC_INITIATED',
    SYNC_COMPLETED: 'SYNC_COMPLETED',
    SYNC_FAILED: 'SYNC_FAILED',
    MAPPINGS_UPDATED: 'MAPPINGS_UPDATED',
    WEBHOOK_CONFIGURED: 'WEBHOOK_CONFIGURED',
    INTEGRATION_PAUSED: 'INTEGRATION_PAUSED',
    INTEGRATION_RESUMED: 'INTEGRATION_RESUMED',
    DATA_EXPORTED: 'DATA_EXPORTED',
    DATA_IMPORTED: 'DATA_IMPORTED',
  },

  // Error codes
  ERROR_CODES: {
    CONFIGURATION_NOT_FOUND: 'CRM_CONFIG_NOT_FOUND',
    INVALID_CREDENTIALS: 'CRM_INVALID_CREDENTIALS',
    API_LIMIT_EXCEEDED: 'CRM_API_LIMIT_EXCEEDED',
    SYNC_IN_PROGRESS: 'CRM_SYNC_IN_PROGRESS',
    WEBHOOK_VERIFICATION_FAILED: 'CRM_WEBHOOK_VERIFICATION_FAILED',
    MAPPING_VALIDATION_FAILED: 'CRM_MAPPING_VALIDATION_FAILED',
    UNSUPPORTED_CRM: 'CRM_UNSUPPORTED_CRM',
  },

  // Success messages
  MESSAGES: {
    CONFIGURATION_SAVED: 'CRM configuration saved successfully',
    SYNC_INITIATED: 'Data synchronization initiated successfully',
    SYNC_COMPLETED: 'Data synchronization completed successfully',
    MAPPINGS_UPDATED: 'Field mappings updated successfully',
    INTEGRATION_PAUSED: 'CRM integration paused successfully',
    INTEGRATION_RESUMED: 'CRM integration resumed successfully',
    WEBHOOK_PROCESSED: 'Webhook processed successfully',
    CONNECTION_SUCCESSFUL: 'CRM connection test successful',
  },

  // Default field mappings for different CRMs
  DEFAULT_MAPPINGS: {
    salesforce: {
      lead: {
        firstName: 'FirstName',
        lastName: 'LastName',
        email: 'Email',
        company: 'Company',
        phone: 'Phone',
        status: 'Status',
      },
      contact: {
        firstName: 'FirstName',
        lastName: 'LastName',
        email: 'Email',
        phone: 'Phone',
        accountId: 'AccountId',
      },
    },
    hubspot: {
      lead: {
        firstName: 'firstname',
        lastName: 'lastname',
        email: 'email',
        company: 'company',
        phone: 'phone',
        status: 'hs_lead_status',
      },
      contact: {
        firstName: 'firstname',
        lastName: 'lastname',
        email: 'email',
        phone: 'phone',
        company: 'company',
      },
    },
  },

  // Webhook security
  WEBHOOK_SECURITY: {
    SIGNATURE_HEADER: 'X-Hub-Signature-256',
    TIMESTAMP_TOLERANCE: 300, // 5 minutes
  },

  // Sync scheduling
  SYNC_SCHEDULE: {
    DEFAULT_INTERVAL: '0 */6 * * *', // Every 6 hours
    MIN_INTERVAL: 3600, // 1 hour minimum
    MAX_PARALLEL_JOBS: 3,
  },
};