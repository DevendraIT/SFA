/**
 * CRM Integration Routes - Enterprise Modular Monolith
 */

import { Router } from 'express';
import { authenticate, requireOrganization } from '../../../middlewares/auth.middleware.js';
import { validate } from '../../../middlewares/validation.middleware.js';
import { CRMController } from '../controllers/CRMController.js';
import { CRMService } from '../services/CRMService.js';
import { CRMRepository } from '../repositories/CRMRepository.js';
import { CRMAPIClient } from '../services/CRMAPIClient.js';
import { WebhookService } from '../services/WebhookService.js';
import { SyncService } from '../services/SyncService.js';
import { MappingService } from '../services/MappingService.js';
import { crmValidation } from '../validators/crm.validation.js';
import { 
  requireCRMConfiguration,
  checkSyncNotInProgress,
  validateCRMType,
  validateWebhookSignature,
  parseWebhookOrganization
} from '../middleware/crm.middleware.js';

const router = Router();

// Initialize dependencies
const crmRepository = new CRMRepository();
const crmAPIClient = new CRMAPIClient();
const webhookService = new WebhookService(crmRepository, crmAPIClient);
const syncService = new SyncService(crmRepository, crmAPIClient);
const mappingService = new MappingService(crmRepository);

const crmService = new CRMService(
  crmRepository,
  crmAPIClient,
  webhookService,
  syncService,
  mappingService
);

const crmController = new CRMController(crmService);

// Apply authentication middleware to most routes
router.use(authenticate);
router.use(requireOrganization);

// Configuration routes
router.post('/configure', 
  validate(crmValidation.configureSchema),
  crmController.configureCRM
);

router.post('/test-connection', crmController.testConnection);

// Sync routes
router.post('/sync', 
  requireCRMConfiguration,
  checkSyncNotInProgress,
  validate(crmValidation.syncSchema),
  crmController.syncData
);

router.get('/sync/status', 
  requireCRMConfiguration,
  crmController.getSyncStatus
);

router.get('/sync/logs', 
  requireCRMConfiguration,
  crmController.getSyncLogs
);

// Mapping routes
router.get('/mappings', 
  requireCRMConfiguration,
  crmController.getMappings
);

router.put('/mappings', 
  requireCRMConfiguration,
  validate(crmValidation.mappingsSchema),
  crmController.updateMappings
);

// Webhook route (no auth required for incoming webhooks)
router.post('/webhook/:crmType', 
  validateCRMType,
  parseWebhookOrganization,
  validateWebhookSignature,
  crmController.handleWebhook
);

// Status and control routes
router.get('/status', crmController.getIntegrationStatus);

router.post('/toggle', 
  requireCRMConfiguration,
  validate(crmValidation.toggleSchema),
  crmController.toggleIntegration
);

export default router;