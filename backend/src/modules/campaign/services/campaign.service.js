import { AppError } from '../../../shared/response.js';
import { CAMPAIGN_EVENTS } from '../events/campaign.events.js';
import logger from '../../../utils/logger.js';

export class CampaignService {
  constructor(campaignRepository, leadsRepository, n8nClient, eventBus) {
    this.campaignRepo = campaignRepository;
    this.leadsRepo = leadsRepository;
    this.n8nClient = n8nClient;
    this.eventBus = eventBus;
  }

  async createCampaign(organizationId, userId, data) {
    const payload = {
      ...data,
      organizationId,
      createdById: userId,
      updatedById: userId,
      status: 'Draft'
    };

    const campaign = await this.campaignRepo.createCampaign(payload);
    
    if (this.eventBus) {
      this.eventBus.emit(CAMPAIGN_EVENTS.CREATED, { campaignId: campaign.id, organizationId });
    }

    return campaign;
  }

  async getCampaign(campaignId, organizationId) {
    const campaign = await this.campaignRepo.getCampaignById(campaignId, organizationId);
    if (!campaign) {
      throw AppError.notFound('Campaign not found');
    }
    return campaign;
  }

  async getCampaigns(organizationId, query) {
    const { page = 1, limit = 10, ...filters } = query;
    const skip = (page - 1) * limit;
    
    const { campaigns, total } = await this.campaignRepo.getCampaigns(organizationId, filters, { skip, take: parseInt(limit) });
    
    return {
      campaigns,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async updateCampaign(campaignId, organizationId, userId, data) {
    const campaign = await this.getCampaign(campaignId, organizationId);
    
    if (campaign.status === 'Completed' || campaign.status === 'Cancelled') {
      throw AppError.badRequest(`Cannot edit a ${campaign.status} campaign`);
    }

    await this.campaignRepo.updateCampaign(campaignId, organizationId, {
      ...data,
      updatedById: userId
    });

    return this.getCampaign(campaignId, organizationId);
  }

  async deleteCampaign(campaignId, organizationId) {
    const campaign = await this.getCampaign(campaignId, organizationId);
    
    if (campaign.status === 'Running') {
      throw AppError.badRequest('Cannot delete a running campaign');
    }

    await this.campaignRepo.deleteCampaign(campaignId, organizationId);
    return true;
  }

  async startCampaign(campaignId, organizationId, userId) {
    const campaign = await this.getCampaign(campaignId, organizationId);
    
    if (campaign.status !== 'Draft' && campaign.status !== 'Paused') {
      throw AppError.badRequest(`Campaign is in ${campaign.status} state. Only Draft or Paused campaigns can be started.`);
    }

    // Fetch leads based on campaign filters
    // In a real scenario, campaign would store filters in a JSON column.
    // For this implementation, we'll fetch all leads for the org that match category/serviceType if present
    const leadFilters = {
      hasEmail: true,
      includeDeleted: false
    };
    if (campaign.category) leadFilters.category = campaign.category;
    if (campaign.serviceType) leadFilters.serviceType = campaign.serviceType;
    
    // Fetch active leads with email from LeadRepository
    const leads = await this.leadsRepo.findByFilter(organizationId, leadFilters);

    if (!leads || leads.length === 0) {
      throw AppError.badRequest('Cannot start campaign without leads');
    }

    // Prepare campaign leads
    const campaignLeads = leads.map(lead => ({
      campaignId,
      leadId: lead.id,
      email: lead.email,
      contactName: lead.firstName + (lead.lastName ? ' ' + lead.lastName : ''),
      company: lead.company,
      status: 'Pending'
    }));

    await this.campaignRepo.createCampaignLeads(campaignLeads);

    // Update status to Running
    await this.campaignRepo.updateCampaign(campaignId, organizationId, {
      status: 'Running',
      startedAt: new Date(),
      updatedById: userId
    });

    // Send to n8n webhook
    const payload = {
      campaignId: campaign.id,
      campaignName: campaign.name,
      category: campaign.category,
      serviceType: campaign.serviceType,
      stats: {
        totalLeads: leads.length
      }
    };

    // Background trigger to avoid blocking API response
    this.n8nClient.triggerCampaign(payload).catch(err => {
      logger.error(`Failed to trigger n8n for campaign ${campaignId}`, err);
      // We could log this to CampaignLog
      this.campaignRepo.createLog({
        campaignId,
        event: 'N8N_TRIGGER_FAILED',
        status: 'Error',
        message: err.message
      });
    });

    if (this.eventBus) {
      this.eventBus.emit(CAMPAIGN_EVENTS.STARTED, { campaignId, organizationId });
    }

    this.campaignRepo.createLog({
      campaignId,
      event: 'CAMPAIGN_STARTED',
      status: 'Success',
      message: `Campaign started with ${leads.length} leads`
    });

    return this.getCampaign(campaignId, organizationId);
  }

  async pauseCampaign(campaignId, organizationId, userId) {
    const campaign = await this.getCampaign(campaignId, organizationId);
    
    if (campaign.status !== 'Running') {
      throw AppError.badRequest('Only Running campaigns can be paused');
    }

    await this.campaignRepo.updateCampaign(campaignId, organizationId, {
      status: 'Paused',
      updatedById: userId
    });

    if (this.eventBus) {
      this.eventBus.emit(CAMPAIGN_EVENTS.PAUSED, { campaignId, organizationId });
    }

    this.campaignRepo.createLog({
      campaignId,
      event: 'CAMPAIGN_PAUSED',
      status: 'Success',
      message: 'Campaign paused'
    });

    return this.getCampaign(campaignId, organizationId);
  }

  async resumeCampaign(campaignId, organizationId, userId) {
    // This is essentially starting it again if it was paused
    return this.startCampaign(campaignId, organizationId, userId);
  }

  async cancelCampaign(campaignId, organizationId, userId) {
    const campaign = await this.getCampaign(campaignId, organizationId);
    
    if (campaign.status === 'Completed' || campaign.status === 'Cancelled') {
      throw AppError.badRequest(`Campaign is already ${campaign.status}`);
    }

    await this.campaignRepo.updateCampaign(campaignId, organizationId, {
      status: 'Cancelled',
      updatedById: userId
    });

    if (this.eventBus) {
      this.eventBus.emit(CAMPAIGN_EVENTS.CANCELLED, { campaignId, organizationId });
    }

    this.campaignRepo.createLog({
      campaignId,
      event: 'CAMPAIGN_CANCELLED',
      status: 'Success',
      message: 'Campaign cancelled'
    });

    return this.getCampaign(campaignId, organizationId);
  }

  async updateEmailStatus(campaignId, payload) {
    const { leadId, status, errorMessage } = payload;
    
    const updateData = { status };
    if (errorMessage) updateData.errorMessage = errorMessage;

    const now = new Date();
    if (status === 'Sent') updateData.sentAt = now;
    if (status === 'Opened') updateData.openedAt = now;
    if (status === 'Clicked') updateData.clickedAt = now;

    await this.campaignRepo.updateCampaignLead(campaignId, leadId, updateData);
    
    await this.campaignRepo.createLog({
      campaignId,
      leadId,
      event: `EMAIL_${status.toUpperCase()}`,
      status: 'Success',
      message: errorMessage || `Email status updated to ${status}`
    });

    return true;
  }

  async updateReplyStatus(campaignId, payload) {
    let { leadId, replyType } = payload;
    
    if (replyType === 'Demo Requested') replyType = 'Demo';
    if (replyType === 'Not Interested') replyType = 'NotInterested';

    await this.campaignRepo.updateCampaignLead(campaignId, leadId, {
      status: 'Replied',
      replyType,
      repliedAt: new Date()
    });

    await this.campaignRepo.createLog({
      campaignId,
      leadId,
      event: 'EMAIL_REPLIED',
      status: 'Success',
      message: `Lead replied with intent: ${replyType}`
    });

    if (this.eventBus) {
      this.eventBus.emit(CAMPAIGN_EVENTS.LEAD_REPLIED, { campaignId, leadId, replyType });
    }

    return true;
  }

  async getCampaignAnalytics(campaignId, organizationId) {
    const data = await this.campaignRepo.getCampaignAnalytics(campaignId, organizationId);
    if (!data) throw AppError.notFound('Campaign not found');

    const totalLeads = data.statusStats.reduce((sum, s) => sum + s._count, 0);
    const sent = data.statusStats.find(s => s.status === 'Sent')?._count || 0;
    const delivered = data.statusStats.find(s => s.status === 'Delivered')?._count || 0;
    const opened = data.statusStats.find(s => s.status === 'Opened')?._count || 0;
    const clicked = data.statusStats.find(s => s.status === 'Clicked')?._count || 0;
    const replies = data.statusStats.find(s => s.status === 'Replied')?._count || 0;
    const failed = data.statusStats.find(s => s.status === 'Failed')?._count || 0;

    return {
      totalLeads,
      metrics: {
        sent,
        delivered,
        opened,
        clicked,
        replies,
        failed,
      },
      replyBreakdown: data.replyStats,
      conversionRate: sent > 0 ? ((replies / sent) * 100).toFixed(2) : 0
    };
  }
}
