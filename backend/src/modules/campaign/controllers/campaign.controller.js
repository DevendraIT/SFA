import { ApiResponse } from '../../../shared/response.js';
import { CampaignDto } from '../dtos/campaign.dto.js';

export class CampaignController {
  constructor(campaignService) {
    this.service = campaignService;
  }

  createCampaign = async (req, res, next) => {
    try {
      const campaign = await this.service.createCampaign(req.user.organizationId, req.user.id, req.body);
      res.status(201).json(ApiResponse.success('Campaign created successfully', CampaignDto.toResponse(campaign)));
    } catch (error) {
      next(error);
    }
  };

  getCampaigns = async (req, res, next) => {
    try {
      const { campaigns, meta } = await this.service.getCampaigns(req.user.organizationId, req.query);
      res.json(ApiResponse.success('Campaigns retrieved successfully', { campaigns: CampaignDto.toListResponse(campaigns) }, meta));
    } catch (error) {
      next(error);
    }
  };

  getCampaign = async (req, res, next) => {
    try {
      const campaign = await this.service.getCampaign(req.params.id, req.user.organizationId);
      res.json(ApiResponse.success('Campaign retrieved successfully', CampaignDto.toResponse(campaign)));
    } catch (error) {
      next(error);
    }
  };

  updateCampaign = async (req, res, next) => {
    try {
      const campaign = await this.service.updateCampaign(req.params.id, req.user.organizationId, req.user.id, req.body);
      res.json(ApiResponse.success('Campaign updated successfully', CampaignDto.toResponse(campaign)));
    } catch (error) {
      next(error);
    }
  };

  deleteCampaign = async (req, res, next) => {
    try {
      await this.service.deleteCampaign(req.params.id, req.user.organizationId);
      res.json(ApiResponse.success('Campaign deleted successfully'));
    } catch (error) {
      next(error);
    }
  };

  startCampaign = async (req, res, next) => {
    try {
      const campaign = await this.service.startCampaign(req.params.id, req.user.organizationId, req.user.id);
      res.json(ApiResponse.success('Campaign started successfully', CampaignDto.toResponse(campaign)));
    } catch (error) {
      next(error);
    }
  };

  pauseCampaign = async (req, res, next) => {
    try {
      const campaign = await this.service.pauseCampaign(req.params.id, req.user.organizationId, req.user.id);
      res.json(ApiResponse.success('Campaign paused successfully', CampaignDto.toResponse(campaign)));
    } catch (error) {
      next(error);
    }
  };

  resumeCampaign = async (req, res, next) => {
    try {
      const campaign = await this.service.resumeCampaign(req.params.id, req.user.organizationId, req.user.id);
      res.json(ApiResponse.success('Campaign resumed successfully', CampaignDto.toResponse(campaign)));
    } catch (error) {
      next(error);
    }
  };

  cancelCampaign = async (req, res, next) => {
    try {
      const campaign = await this.service.cancelCampaign(req.params.id, req.user.organizationId, req.user.id);
      res.json(ApiResponse.success('Campaign cancelled successfully', CampaignDto.toResponse(campaign)));
    } catch (error) {
      next(error);
    }
  };

  getAnalytics = async (req, res, next) => {
    try {
      const analytics = await this.service.getCampaignAnalytics(req.params.id, req.user.organizationId);
      res.json(ApiResponse.success('Campaign analytics retrieved successfully', analytics));
    } catch (error) {
      next(error);
    }
  };

  // Webhooks
  webhookEmailStatus = async (req, res, next) => {
    try {
      await this.service.updateEmailStatus(req.body.campaignId, req.body);
      res.json(ApiResponse.success('Email status updated via webhook'));
    } catch (error) {
      next(error);
    }
  };

  webhookReply = async (req, res, next) => {
    try {
      await this.service.updateReplyStatus(req.body.campaignId, req.body);
      res.json(ApiResponse.success('Reply status updated via webhook'));
    } catch (error) {
      next(error);
    }
  };
}
