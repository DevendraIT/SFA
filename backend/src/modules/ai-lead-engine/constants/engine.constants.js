/**
 * AI Lead Engine Module — Constants
 */

export const ENGINE_CONSTANTS = {
  MODULE: 'ai-lead-engine',

  // Valid status transitions
  CAMPAIGN_STATUS_TRANSITIONS: {
    DRAFT: ['SCHEDULED', 'RUNNING', 'CANCELLED'],
    SCHEDULED: ['RUNNING', 'DRAFT', 'CANCELLED'],
    RUNNING: ['COMPLETED', 'FAILED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
    FAILED: [],
  },

  IMPORT_STATUS_TRANSITIONS: {
    PENDING: ['PROCESSING', 'FAILED', 'CANCELLED'],
    PROCESSING: ['COMPLETED', 'FAILED'],
    COMPLETED: [],
    FAILED: [],
  },

  // Scoring weights config
  SCORING_WEIGHTS: {
    EMAIL_DELIVERED: 1,
    EMAIL_OPENED: 5,
    EMAIL_CLICKED: 15,
    POSITIVE_REPLY: 40,
    NEGATIVE_REPLY: -50,
    MEETING_INTENT: 50,
    DEMO_INTENT: 50,
    PRICING_INTENT: 40,
    
    // Demographic / Firmographic Weights
    COMPANY_SIZE_LARGE: 20, // > 1000
    COMPANY_SIZE_MED: 10, // 50-1000
    INDUSTRY_TARGET: 15,
    JOB_TITLE_C_LEVEL: 25,
    JOB_TITLE_VP: 20,
    JOB_TITLE_DIRECTOR: 15,
    JOB_TITLE_MANAGER: 10,
  },

  // Qualification thresholds
  QUALIFICATION_THRESHOLDS: {
    HOT: 80,
    WARM: 50,
    COLD: 20, // below 20 is typically UNQUALIFIED
  },
};

export default ENGINE_CONSTANTS;
