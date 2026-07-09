import prisma from '../../../config/database.js';

export class CampaignRepository {
  async create(data) {
    return prisma.emailCampaign.create({ data });
  }

  async findById(id, organizationId) {
    return prisma.emailCampaign.findFirst({
      where: { id, organizationId },
      include: {
        _count: {
          select: { campaignProspects: true, emailActivities: true }
        }
      }
    });
  }

  async update(id, data) {
    return prisma.emailCampaign.update({
      where: { id },
      data,
    });
  }

  async addProspects(campaignId, prospectIds) {
    const data = prospectIds.map(prospectId => ({
      campaignId,
      prospectId,
    }));

    return prisma.campaignProspect.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async getProspectsForCampaign(campaignId, limit = 100, offset = 0) {
    return prisma.campaignProspect.findMany({
      where: { campaignId },
      skip: offset,
      take: limit,
      include: {
        prospect: true,
      }
    });
  }

  async getPendingCampaigns() {
    return prisma.emailCampaign.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: { lte: new Date() }
      },
      include: { createdBy: { select: { id: true, email: true, firstName: true } } }
    });
  }

  async list(organizationId, filters = {}, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { organizationId, ...filters };
    const [data, total] = await Promise.all([
      prisma.emailCampaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { campaignProspects: true, emailActivities: true } },
          template: { select: { id: true, name: true } }
        }
      }),
      prisma.emailCampaign.count({ where })
    ]);
    return { data, total, page, limit };
  }

  async delete(id, organizationId) {
    return prisma.emailCampaign.deleteMany({ where: { id, organizationId, status: 'DRAFT' } });
  }

  /**
   * Aggregate statistics per campaign.
   */
  async getStatistics(campaignId, organizationId) {
    const campaign = await prisma.emailCampaign.findFirst({
      where: { id: campaignId, organizationId },
      include: { _count: { select: { campaignProspects: true } } }
    });
    if (!campaign) return null;

    const activityCounts = await prisma.emailActivity.groupBy({
      by: ['type'],
      where: { campaignId },
      _count: { type: true }
    });

    const stats = activityCounts.reduce((acc, row) => {
      acc[row.type.toLowerCase()] = row._count.type;
      return acc;
    }, {});

    return {
      campaignId,
      name: campaign.name,
      status: campaign.status,
      totalRecipients: campaign._count.campaignProspects,
      sent: stats.sent || 0,
      delivered: stats.delivered || 0,
      opened: stats.opened || 0,
      clicked: stats.clicked || 0,
      replied: stats.replied || 0,
      bounced: stats.bounced || 0,
      unsubscribed: stats.unsubscribed || 0,
      openRate: campaign._count.campaignProspects > 0
        ? `${(((stats.opened || 0) / campaign._count.campaignProspects) * 100).toFixed(1)}%`
        : '0%',
      clickRate: campaign._count.campaignProspects > 0
        ? `${(((stats.clicked || 0) / campaign._count.campaignProspects) * 100).toFixed(1)}%`
        : '0%',
    };
  }

  /**
   * Get prospects filtered by qualification status for bulk recipient generation.
   */
  async getFilteredProspects(organizationId, filters = {}) {
    const where = { organizationId };
    if (filters.qualificationStatus) where.qualificationStatus = { in: filters.qualificationStatus };
    if (filters.country)            where.country = filters.country;
    if (filters.company)            where.company = { contains: filters.company, mode: 'insensitive' };
    if (filters.jobTitle)           where.jobTitle = { contains: filters.jobTitle, mode: 'insensitive' };
    if (filters.importJobId)        where.importJobId = filters.importJobId;
    // Never target converted leads again
    where.isConvertedToLead = false;

    return prisma.prospect.findMany({
      where,
      select: { id: true, email: true, firstName: true, lastName: true, company: true, qualificationStatus: true }
    });
  }
}
