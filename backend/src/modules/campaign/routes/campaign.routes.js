import express from 'express';
import { authenticate, requireOrganization, authorize } from '../../../middlewares/auth.middleware.js';
import validate from '../../../middlewares/validation.middleware.js';
import { CampaignRepository } from '../repositories/campaign.repository.js';
import { LeadsRepository } from '../../lead-management/repositories/LeadRepository.js';
import { CampaignService } from '../services/campaign.service.js';
import { CampaignController } from '../controllers/campaign.controller.js';
import { N8nClient } from '../utils/n8n.client.js';
import CAMPAIGN_PERMISSIONS from '../permissions/campaign.permissions.js';
import EventBus from '../../workflow-automation/events/EventBus.js';
import {
  createCampaignSchema,
  updateCampaignSchema,
  idParamSchema,
  listQuerySchema,
  webhookEmailStatusSchema,
  webhookReplySchema
} from '../validators/campaign.validator.js';

const router = express.Router();

// Dependency Injection
const campaignRepo = new CampaignRepository();
const leadsRepo = new LeadsRepository();
const n8nClient = new N8nClient();
const campaignService = new CampaignService(campaignRepo, leadsRepo, n8nClient, EventBus);
const campaignController = new CampaignController(campaignService);

const P = CAMPAIGN_PERMISSIONS;

// Webhook endpoints (these must be public or authenticated via api key. For now, public, but you might want to secure them)
router.patch('/email-status', validate(webhookEmailStatusSchema, 'body'), campaignController.webhookEmailStatus);
router.patch('/reply', validate(webhookReplySchema, 'body'), campaignController.webhookReply);

// Standard API routes requiring auth
router.use(authenticate, requireOrganization);

router.post('/', authorize(P.CREATE), validate(createCampaignSchema, 'body'), campaignController.createCampaign);
router.get('/', authorize(P.READ), validate(listQuerySchema, 'query'), campaignController.getCampaigns);
router.get('/:id', authorize(P.READ), validate(idParamSchema, 'params'), campaignController.getCampaign);
router.put('/:id', authorize(P.UPDATE), validate(idParamSchema, 'params'), validate(updateCampaignSchema, 'body'), campaignController.updateCampaign);
router.delete('/:id', authorize(P.DELETE), validate(idParamSchema, 'params'), campaignController.deleteCampaign);

router.post('/:id/start', authorize(P.START), validate(idParamSchema, 'params'), campaignController.startCampaign);
router.post('/:id/pause', authorize(P.PAUSE), validate(idParamSchema, 'params'), campaignController.pauseCampaign);
router.post('/:id/resume', authorize(P.RESUME), validate(idParamSchema, 'params'), campaignController.resumeCampaign);
router.post('/:id/cancel', authorize(P.CANCEL), validate(idParamSchema, 'params'), campaignController.cancelCampaign);

router.get('/:id/analytics', authorize(P.READ), validate(idParamSchema, 'params'), campaignController.getAnalytics);

export default router;
export { campaignController, campaignService, campaignRepo };
