/**
 * Data Transfer Objects for Campaign Module
 * Used to format data for responses
 */

export class CampaignDto {
  static toResponse(campaign) {
    if (!campaign) return null;
    
    return {
      id: campaign.id,
      name: campaign.name,
      description: campaign.description,
      status: campaign.status,
      campaignChannel: campaign.campaignChannel,
      category: campaign.category,
      serviceType: campaign.serviceType,
      templateId: campaign.templateId,
      emailProvider: campaign.emailProvider,
      scheduledAt: campaign.scheduledAt,
      startedAt: campaign.startedAt,
      completedAt: campaign.completedAt,
      leadsCount: campaign._count?.campaignLeads || 0,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt
    };
  }

  static toListResponse(campaigns) {
    return campaigns.map(c => this.toResponse(c));
  }
}
