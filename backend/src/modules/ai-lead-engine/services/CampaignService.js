import { AppError } from '../../../shared/response.js';
import { ENGINE_CONSTANTS } from '../constants/engine.constants.js';

/**
 * CampaignService
 *
 * Extended service handling:
 * - Email Template CRUD
 * - Campaign CRUD with status state machine
 * - Campaign Scheduling (set scheduledAt + transition to SCHEDULED)
 * - Campaign History & Statistics
 * - Test Email (via EmailDispatchService)
 * - Bulk Recipient Generation with filtering
 *
 * All email sends go through EmailDispatchService — never from controllers.
 */
export class CampaignService {
  constructor(campaignRepo, templateRepo, emailDispatchService, trackingRepo) {
    this.campaignRepo        = campaignRepo;
    this.templateRepo        = templateRepo;
    this.emailDispatch       = emailDispatchService;
    this.trackingRepo        = trackingRepo;
  }

  // ─────────────────────────────────────────────
  // Email Templates
  // ─────────────────────────────────────────────

  async createTemplate(organizationId, userId, data) {
    return this.templateRepo.create({ organizationId, createdById: userId, ...data });
  }

  async getTemplate(id, organizationId) {
    const template = await this.templateRepo.findById(id, organizationId);
    if (!template) throw AppError.notFound('Email template not found');
    return template;
  }

  async listTemplates(organizationId, page, limit) {
    return this.templateRepo.list(organizationId, page, limit);
  }

  async updateTemplate(id, organizationId, data) {
    await this.getTemplate(id, organizationId); // ensure exists and belongs to org
    return this.templateRepo.update(id, data);
  }

  async deleteTemplate(id, organizationId) {
    await this.getTemplate(id, organizationId);
    return this.templateRepo.delete(id, organizationId);
  }

  // ─────────────────────────────────────────────
  // Campaigns
  // ─────────────────────────────────────────────

  async createCampaign(organizationId, userId, data) {
    // If a templateId is provided, copy subject + body from template (can still override)
    let campaignData = { organizationId, createdById: userId, ...data, status: 'DRAFT' };

    if (data.templateId) {
      const template = await this.getTemplate(data.templateId, organizationId);
      campaignData.subject      = data.subject      || template.subject;
      campaignData.templateBody = data.templateBody || template.body;
    }

    return this.campaignRepo.create(campaignData);
  }

  async getCampaign(id, organizationId) {
    const campaign = await this.campaignRepo.findById(id, organizationId);
    if (!campaign) throw AppError.notFound('Campaign not found');
    return campaign;
  }

  async listCampaigns(organizationId, filters, page, limit) {
    const repoFilters = {};
    if (filters.status) repoFilters.status = filters.status;
    return this.campaignRepo.list(organizationId, repoFilters, page, limit);
  }

  async updateCampaign(id, organizationId, data) {
    const campaign = await this.getCampaign(id, organizationId);

    if (data.status && !this.isValidStatusTransition(campaign.status, data.status)) {
      throw AppError.badRequest(`Cannot transition from ${campaign.status} → ${data.status}`);
    }

    return this.campaignRepo.update(id, data);
  }

  async deleteCampaign(id, organizationId) {
    const campaign = await this.getCampaign(id, organizationId);
    if (campaign.status !== 'DRAFT') {
      throw AppError.badRequest('Only DRAFT campaigns can be deleted');
    }
    return this.campaignRepo.delete(id, organizationId);
  }

  // ─────────────────────────────────────────────
  // Scheduling
  // ─────────────────────────────────────────────

  async scheduleCampaign(id, organizationId, scheduledAt) {
    const campaign = await this.getCampaign(id, organizationId);

    if (!this.isValidStatusTransition(campaign.status, 'SCHEDULED')) {
      throw AppError.badRequest(`Cannot schedule a campaign in ${campaign.status} status`);
    }

    const scheduleDate = new Date(scheduledAt);
    if (scheduleDate <= new Date()) {
      throw AppError.badRequest('Scheduled time must be in the future');
    }

    return this.campaignRepo.update(id, { status: 'SCHEDULED', scheduledAt: scheduleDate });
  }

  // ─────────────────────────────────────────────
  // Recipient Management
  // ─────────────────────────────────────────────

  async addProspects(id, organizationId, prospectIds) {
    const campaign = await this.getCampaign(id, organizationId);
    if (campaign.status !== 'DRAFT') {
      throw AppError.badRequest('Can only add prospects to DRAFT campaigns');
    }
    await this.campaignRepo.addProspects(id, prospectIds);
    return { success: true, added: prospectIds.length };
  }

  /**
   * Bulk recipient generation by filtering prospects from the organization.
   * Filters: qualificationStatus[], country, company, jobTitle, importJobId
   */
  async generateRecipientsFromFilter(id, organizationId, filters) {
    const campaign = await this.getCampaign(id, organizationId);
    if (campaign.status !== 'DRAFT') {
      throw AppError.badRequest('Can only generate recipients for DRAFT campaigns');
    }

    const prospects = await this.campaignRepo.getFilteredProspects(organizationId, filters);
    if (prospects.length === 0) {
      return { success: true, added: 0, message: 'No prospects matched the filters' };
    }

    const prospectIds = prospects.map(p => p.id);
    await this.campaignRepo.addProspects(id, prospectIds);

    return { success: true, added: prospects.length, filters };
  }

  // ─────────────────────────────────────────────
  // Statistics & History
  // ─────────────────────────────────────────────

  async getCampaignStatistics(id, organizationId) {
    const stats = await this.campaignRepo.getStatistics(id, organizationId);
    if (!stats) throw AppError.notFound('Campaign not found');
    return stats;
  }

  // ─────────────────────────────────────────────
  // Test Email
  // ─────────────────────────────────────────────

  async sendTestEmail(id, organizationId, recipientEmail) {
    const campaign = await this.getCampaign(id, organizationId);

    const renderedBody = this.emailDispatch.renderTemplate(campaign.templateBody, {
      firstName: 'Test User',
      lastName: 'Preview',
      company: 'Test Company',
      jobTitle: 'Test Title',
    });

    await this.emailDispatch.sendTestEmail(recipientEmail, `[TEST] ${campaign.subject}`, renderedBody);

    return { success: true, sentTo: recipientEmail };
  }

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────

  isValidStatusTransition(current, next) {
    const validNexts = ENGINE_CONSTANTS.CAMPAIGN_STATUS_TRANSITIONS[current] || [];
    return validNexts.includes(next);
  }
}
