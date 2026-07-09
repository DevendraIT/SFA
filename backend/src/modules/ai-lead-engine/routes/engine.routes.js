import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../../config/cloudinary.js';

import validate from '../../../middlewares/validation.middleware.js';
import { authenticate, requireOrganization, authorize } from '../../../middlewares/auth.middleware.js';
import { ENGINE_PERMISSIONS } from '../permissions/engine.permissions.js';

import {
  createCampaignSchema,
  updateCampaignSchema,
  addProspectsToCampaignSchema,
  prospectQuerySchema,
  apiImportSchema,
  manualProspectSchema,
  createTemplateSchema,
  updateTemplateSchema,
  scheduleCampaignSchema,
  testEmailSchema,
  recipientFilterSchema,
  campaignQuerySchema,
} from '../validators/engine.validation.js';

// --- Services & Repos ---
import { EngineController }       from '../controllers/EngineController.js';
import { LeadEngineService }       from '../services/LeadEngineService.js';
import { CampaignService }         from '../services/CampaignService.js';
import { TrackingService }         from '../services/TrackingService.js';
import { EmailDispatchService }    from '../services/EmailDispatchService.js';

import { ProspectRepository }      from '../repositories/ProspectRepository.js';
import { ImportJobRepository }     from '../repositories/ImportJobRepository.js';
import { CampaignRepository }      from '../repositories/CampaignRepository.js';
import { EmailTemplateRepository } from '../repositories/EmailTemplateRepository.js';
import { TrackingRepository, AiAnalysisRepository } from '../repositories/TrackingRepository.js';

import { ImportDomainService }      from '../imports/ImportDomainService.js';
import { CleaningDomainService }    from '../cleaning/CleaningDomainService.js';
import { AiProviderFactory }        from '../ai/AiProvider.js';
import { ScoringDomainService }     from '../scoring/ScoringDomainService.js';
import { QualificationDomainService } from '../qualification/QualificationDomainService.js';

import { QueueManager }             from '../queues/QueueManager.js';
import { EmailWorker }              from '../queues/workers/EmailWorker.js';
import { CampaignWorker }           from '../queues/workers/CampaignWorker.js';

// ─── Multer (Cloudinary) ────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'sfa_imports',
    resource_type: 'raw',
    public_id: (req, file) => `import_${Date.now()}_${file.originalname}`,
  },
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// ─── DI ─────────────────────────────────────────────────
const prospectRepo     = new ProspectRepository();
const importJobRepo    = new ImportJobRepository();
const campaignRepo     = new CampaignRepository();
const templateRepo     = new EmailTemplateRepository();
const trackingRepo     = new TrackingRepository();
const aiAnalysisRepo   = new AiAnalysisRepository();

const importDomain       = new ImportDomainService();
const cleaningDomain     = new CleaningDomainService();
const aiProvider         = await AiProviderFactory.createProvider();
const scoringDomain      = new ScoringDomainService();
const qualificationDomain = new QualificationDomainService();
const emailDispatch      = new EmailDispatchService();

const leadEngineService = new LeadEngineService(prospectRepo, importJobRepo, importDomain, cleaningDomain);

const campaignService = new CampaignService(campaignRepo, templateRepo, emailDispatch, trackingRepo);

const trackingService = new TrackingService(
  trackingRepo, aiAnalysisRepo, prospectRepo, aiProvider, scoringDomain, qualificationDomain, leadEngineService
);

const controller = new EngineController(leadEngineService, campaignService, trackingService, prospectRepo);

// ─── Queues & Workers ───────────────────────────────────
const queueManager = new QueueManager();
const emailWorker = new EmailWorker(emailDispatch);
const campaignWorker = new CampaignWorker(campaignService, emailDispatch);

// Graceful shutdown for workers
process.on('SIGTERM', async () => {
  console.log('Shutting down AI Lead Engine workers...');
  await emailWorker.close();
  await campaignWorker.close();
  await queueManager.closeAll();
});

// ─── Router ─────────────────────────────────────────────
const router = express.Router();
const P = ENGINE_PERMISSIONS;

// Webhook — public (validate via provider signature in production)
router.post('/webhooks/email', controller.handleWebhook);

// All routes below require auth
router.use(authenticate, requireOrganization);

// ── Imports ──────────────────────────────────────────────
router.post('/imports',           authorize(P.MANAGE_IMPORTS), upload.single('file'), controller.importProspects);
router.post('/imports/api',       authorize(P.MANAGE_IMPORTS), validate(apiImportSchema, 'body'), controller.importApiProspects);
router.post('/imports/manual',    authorize(P.MANAGE_IMPORTS), validate(manualProspectSchema, 'body'), controller.importManualProspect);
router.get('/imports/jobs',       authorize(P.MANAGE_IMPORTS), controller.listImportJobs);
router.get('/imports/jobs/:id',   authorize(P.MANAGE_IMPORTS), controller.getImportJob);

// ── Prospects ─────────────────────────────────────────────
router.get('/prospects', authorize(P.VIEW_PROSPECTS), validate(prospectQuerySchema, 'query'), controller.listProspects);

// ── Email Templates ───────────────────────────────────────
router.post('/templates',       authorize(P.MANAGE_CAMPAIGNS), validate(createTemplateSchema, 'body'), controller.createTemplate);
router.get('/templates',        authorize(P.MANAGE_CAMPAIGNS), controller.listTemplates);
router.get('/templates/:id',    authorize(P.MANAGE_CAMPAIGNS), controller.getTemplate);
router.put('/templates/:id',    authorize(P.MANAGE_CAMPAIGNS), validate(updateTemplateSchema, 'body'), controller.updateTemplate);
router.delete('/templates/:id', authorize(P.MANAGE_CAMPAIGNS), controller.deleteTemplate);

// ── Campaigns ─────────────────────────────────────────────
router.post('/campaigns',                          authorize(P.MANAGE_CAMPAIGNS), validate(createCampaignSchema, 'body'), controller.createCampaign);
router.get('/campaigns',                           authorize(P.MANAGE_CAMPAIGNS), validate(campaignQuerySchema, 'query'), controller.listCampaigns);
router.get('/campaigns/:id',                       authorize(P.MANAGE_CAMPAIGNS), controller.getCampaign);
router.put('/campaigns/:id',                       authorize(P.MANAGE_CAMPAIGNS), validate(updateCampaignSchema, 'body'), controller.updateCampaign);
router.delete('/campaigns/:id',                    authorize(P.MANAGE_CAMPAIGNS), controller.deleteCampaign);
router.post('/campaigns/:id/schedule',             authorize(P.MANAGE_CAMPAIGNS), validate(scheduleCampaignSchema, 'body'), controller.scheduleCampaign);
router.get('/campaigns/:id/statistics',            authorize(P.MANAGE_CAMPAIGNS), controller.getCampaignStatistics);
router.post('/campaigns/:id/test-email',           authorize(P.MANAGE_CAMPAIGNS), validate(testEmailSchema, 'body'), controller.sendTestEmail);
router.post('/campaigns/:id/prospects',            authorize(P.MANAGE_CAMPAIGNS), validate(addProspectsToCampaignSchema, 'body'), controller.addProspectsToCampaign);
router.post('/campaigns/:id/recipients/generate',  authorize(P.MANAGE_CAMPAIGNS), validate(recipientFilterSchema, 'body'), controller.generateRecipients);

export default router;
