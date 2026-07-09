import { 
  createImportSchema, 
  prospectQuerySchema, 
  createCampaignSchema, 
  updateCampaignSchema, 
  addProspectsToCampaignSchema, 
  emailWebhookSchema 
} from '../validators/engine.validation.js';

export class EngineController {
  constructor(leadEngineService, campaignService, trackingService, prospectRepo) {
    this.leadEngineService = leadEngineService;
    this.campaignService = campaignService;
    this.trackingService = trackingService;
    this.prospectRepo = prospectRepo;
  }

  // --- Imports ---
  importProspects = async (req, res, next) => {
    try {
      if (!req.file) {
        throw AppError.badRequest('File is required. Send a CSV or Excel file as multipart/form-data with key "file".');
      }

      // When using CloudinaryStorage, req.file.path is the remote Cloudinary HTTPS URL
      const cloudinaryUrl = req.file.path;
      const originalName = req.file.originalname;
      const { organizationId, id: userId } = req.user;

      // Kick off processing — service internally creates the ImportJob
      const result = await this.leadEngineService.processImport(organizationId, userId, cloudinaryUrl, originalName);

      res.status(202).json({
        success: true,
        message: 'File upload to Cloudinary successful. Processing started.',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  importApiProspects = async (req, res, next) => {
    try {
      const { organizationId, id: userId } = req.user;
      const { prospects } = req.body;

      // Run synchronously for API arrays or push to background based on scale
      // Here we await it directly as it's an API array (limited to 500 max by Zod)
      const result = await this.leadEngineService.processApiImport(organizationId, userId, prospects);

      res.status(200).json({
        success: true,
        message: 'API import completed',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  importManualProspect = async (req, res, next) => {
    try {
      const { organizationId, id: userId } = req.user;
      const prospectData = req.body;

      // Re-use API import logic for a single item
      const result = await this.leadEngineService.processApiImport(organizationId, userId, [prospectData]);

      res.status(200).json({
        success: true,
        message: 'Manual import completed',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  // --- Import Jobs ---
  listImportJobs = async (req, res, next) => {
    try {
      const { organizationId } = req.user;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;

      const result = await this.leadEngineService.importJobRepo.listJobs(organizationId, page, limit);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getImportJob = async (req, res, next) => {
    try {
      const { organizationId } = req.user;
      const { id } = req.params;

      const job = await this.leadEngineService.importJobRepo.findById(id, organizationId);
      if (!job) {
        throw AppError.notFound('Import Job not found');
      }

      res.json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  };

  // --- Prospects ---
  listProspects = async (req, res, next) => {
    try {
      const { organizationId } = req.user;
      const filters = { ...req.query };
      delete filters.page;
      delete filters.limit;

      const pagination = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
      };

      const result = await this.prospectRepo.list(organizationId, filters, pagination);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  // --- Campaigns ---
  createCampaign = async (req, res, next) => {
    try {
      const { organizationId, id: userId } = req.user;
      const data = req.body; // validated by middleware

      const campaign = await this.campaignService.createCampaign(organizationId, userId, data);
      res.status(201).json({ success: true, data: campaign });
    } catch (error) {
      next(error);
    }
  };

  updateCampaign = async (req, res, next) => {
    try {
      const { organizationId } = req.user;
      const { id } = req.params;
      const data = req.body;

      const campaign = await this.campaignService.updateCampaign(id, organizationId, data);
      res.json({ success: true, data: campaign });
    } catch (error) {
      next(error);
    }
  };

  addProspectsToCampaign = async (req, res, next) => {
    try {
      const { organizationId } = req.user;
      const { id } = req.params;
      const { prospectIds } = req.body;

      const result = await this.campaignService.addProspects(id, organizationId, prospectIds);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  listCampaigns = async (req, res, next) => {
    try {
      const { organizationId } = req.user;
      const { status, page = 1, limit = 20 } = req.query;

      const result = await this.campaignService.listCampaigns(
        organizationId,
        { status },
        parseInt(page),
        parseInt(limit)
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getCampaign = async (req, res, next) => {
    try {
      const { organizationId } = req.user;
      const campaign = await this.campaignService.getCampaign(req.params.id, organizationId);
      res.json({ success: true, data: campaign });
    } catch (error) {
      next(error);
    }
  };

  deleteCampaign = async (req, res, next) => {
    try {
      const { organizationId } = req.user;
      await this.campaignService.deleteCampaign(req.params.id, organizationId);
      res.json({ success: true, message: 'Campaign deleted' });
    } catch (error) {
      next(error);
    }
  };

  scheduleCampaign = async (req, res, next) => {
    try {
      const { organizationId } = req.user;
      const { scheduledAt } = req.body;
      const campaign = await this.campaignService.scheduleCampaign(req.params.id, organizationId, scheduledAt);
      res.json({ success: true, data: campaign });
    } catch (error) {
      next(error);
    }
  };

  getCampaignStatistics = async (req, res, next) => {
    try {
      const { organizationId } = req.user;
      const stats = await this.campaignService.getCampaignStatistics(req.params.id, organizationId);
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  };

  sendTestEmail = async (req, res, next) => {
    try {
      const { organizationId } = req.user;
      const { email } = req.body;
      const result = await this.campaignService.sendTestEmail(req.params.id, organizationId, email);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  generateRecipients = async (req, res, next) => {
    try {
      const { organizationId } = req.user;
      const result = await this.campaignService.generateRecipientsFromFilter(
        req.params.id, organizationId, req.body
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  // ─── Email Templates ───────────────────────────

  createTemplate = async (req, res, next) => {
    try {
      const { organizationId, id: userId } = req.user;
      const template = await this.campaignService.createTemplate(organizationId, userId, req.body);
      res.status(201).json({ success: true, data: template });
    } catch (error) {
      next(error);
    }
  };

  listTemplates = async (req, res, next) => {
    try {
      const { organizationId } = req.user;
      const { page = 1, limit = 20 } = req.query;
      const result = await this.campaignService.listTemplates(organizationId, parseInt(page), parseInt(limit));
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getTemplate = async (req, res, next) => {
    try {
      const { organizationId } = req.user;
      const template = await this.campaignService.getTemplate(req.params.id, organizationId);
      res.json({ success: true, data: template });
    } catch (error) {
      next(error);
    }
  };

  updateTemplate = async (req, res, next) => {
    try {
      const { organizationId } = req.user;
      const template = await this.campaignService.updateTemplate(req.params.id, organizationId, req.body);
      res.json({ success: true, data: template });
    } catch (error) {
      next(error);
    }
  };

  deleteTemplate = async (req, res, next) => {
    try {
      const { organizationId } = req.user;
      await this.campaignService.deleteTemplate(req.params.id, organizationId);
      res.json({ success: true, message: 'Template deleted' });
    } catch (error) {
      next(error);
    }
  };

  // --- Tracking (Webhooks) ---
  handleWebhook = async (req, res, next) => {
    try {
      // payload structure depends on provider
      const events = req.body.events || [];
      
      // Async process
      this.trackingService.handleWebhook(events).catch(console.error);

      // Acknowledge receipt to provider immediately
      res.status(200).send('OK');
    } catch (error) {
      next(error);
    }
  };
}
