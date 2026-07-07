/**
 * CRM Integration Module - Enterprise Modular Monolith
 * External API exports for other modules
 */

// Main service interfaces that other modules can use
export { CRMService } from './services/CRMService.js';
export { CRMAPIClient } from './services/CRMAPIClient.js';

// Repository for direct data access if needed
export { CRMRepository } from './repositories/CRMRepository.js';

// Constants that other modules might need
export { CRM_CONSTANTS } from './constants/crm.constants.js';

// DTOs for data transformation
export { 
  CRMEntityDto,
  CRMConfigurationDto,
  CRMSyncJobDto 
} from './dto/crm.dto.js';

// Helpers for external use
export { CRMHelpers } from './helpers/crm.helpers.js';

// Events for inter-module communication
export { 
  crmEvents, 
  CRM_EVENTS,
  emitCRMEvent,
  emitSyncStarted,
  emitSyncCompleted,
  emitSyncFailed,
  emitWebhookReceived,
  emitConfigurationUpdated
} from './events/crm.events.js';

// Validation functions for external use
export { validateCRMSpecificConfig, validateFieldMapping } from './validators/crm.validation.js';