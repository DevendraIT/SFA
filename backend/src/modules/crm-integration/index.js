/**
 * CRM Integration Module - Enterprise Modular Monolith
 * Main module exports
 */

import crmRouter from './routes/crm.routes.js';

// Controllers
export { CRMController } from './controllers/CRMController.js';

// Services
export { CRMService } from './services/CRMService.js';
export { CRMAPIClient } from './services/CRMAPIClient.js';
export { WebhookService } from './services/WebhookService.js';
export { SyncService } from './services/SyncService.js';
export { MappingService } from './services/MappingService.js';

// Repository
export { CRMRepository } from './repositories/CRMRepository.js';

// Constants
export { CRM_CONSTANTS } from './constants/crm.constants.js';

// Validators
export { crmValidation } from './validators/crm.validation.js';

// DTOs
export * from './dto/crm.dto.js';

// Helpers
export { CRMHelpers } from './helpers/crm.helpers.js';

// Events
export { crmEvents, CRM_EVENTS, emitCRMEvent, crmEventHandler } from './events/crm.events.js';

// Default export (routes)
export default crmRouter;