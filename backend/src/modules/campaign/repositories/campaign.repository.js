import prisma from '../../../config/database.js';

export class CampaignRepository {
  /**
   * Campaigns
   */
  async createCampaign(data) {
    return prisma.campaign.create({ data });
  }

  async getCampaignById(id, organizationId) {
    return prisma.campaign.findFirst({
      where: { id, organizationId },
      include: {
        _count: {
          select: { campaignLeads: true }
        }
      }
    });
  }

  async getCampaigns(organizationId, filters = {}, pagination = {}) {
    const { skip = 0, take = 10 } = pagination;
    
    const where = { organizationId, ...filters };
    
    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { campaignLeads: true }
          }
        }
      }),
      prisma.campaign.count({ where })
    ]);
    
    return { campaigns, total };
  }

  async updateCampaign(id, organizationId, data) {
    return prisma.campaign.updateMany({
      where: { id, organizationId },
      data
    });
  }

  async deleteCampaign(id, organizationId) {
    return prisma.campaign.deleteMany({
      where: { id, organizationId }
    });
  }

  /**
   * Campaign Leads
   */
  async createCampaignLeads(campaignLeads) {
    return prisma.campaignLead.createMany({
      data: campaignLeads,
      skipDuplicates: true
    });
  }

  async updateCampaignLead(campaignId, leadId, data) {
    return prisma.campaignLead.updateMany({
      where: { campaignId, leadId },
      data
    });
  }

  async getCampaignLeadsByCampaign(campaignId) {
    return prisma.campaignLead.findMany({
      where: { campaignId },
      include: {
        lead: true
      }
    });
  }

  /**
   * Campaign Logs
   */
  async createLog(data) {
    return prisma.campaignLog.create({ data });
  }

  async getLogsByCampaign(campaignId, pagination = {}) {
    const { skip = 0, take = 50 } = pagination;
    return prisma.campaignLog.findMany({
      where: { campaignId },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Analytics
   */
  async getCampaignAnalytics(campaignId, organizationId) {
    // First ensure campaign belongs to org
    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, organizationId }
    });
    if (!campaign) return null;

    const stats = await prisma.campaignLead.groupBy({
      by: ['status'],
      where: { campaignId },
      _count: true
    });

    const replyStats = await prisma.campaignLead.groupBy({
      by: ['replyType'],
      where: { campaignId, status: 'Replied' },
      _count: true
    });

    return {
      campaign,
      statusStats: stats,
      replyStats: replyStats
    };
  }
}
