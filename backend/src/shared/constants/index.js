/**
 * Shared Constants - Enterprise Modular Monolith
 */

// System-wide constants
export const SYSTEM_CONSTANTS = {
  API_VERSION: 'v1',
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_SORT: 'createdAt',
  DEFAULT_ORDER: 'desc',
  
  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: {
    IMAGE: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    DOCUMENT: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'],
    IMPORT: ['csv', 'xlsx', 'xls'],
  },
  
  // Session settings
  MAX_CONCURRENT_SESSIONS: 3,
  SESSION_TIMEOUT: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
  
  // Rate limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  
  // Export settings
  EXPORT_MAX_RECORDS: 50000,
  EXPORT_FILE_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
};

// Status constants
export const STATUS_CONSTANTS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
};

// Priority constants
export const PRIORITY_CONSTANTS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
};