/**
 * AI Lead Engine Campaign Controller - Enterprise Modular Monolith
 */

import { ApiResponse } from '../../../shared/response.js';

export class CampaignController {
  constructor(campaignService) {
    this.campaignService = campaignService;
  }

  // Create Email Campaign
  createEmailCampaign = async (req, res, next) => {
    try {
      const result = await this.campaignService.createEmailCampaign(req.body, req.user);
      res.status(201).json(ApiResponse.success('Email campaign created', result));
    } catch (error) {
      next(error);
    }
  };

  // Create SMS Campaign
  createSMSCampaign = async (req, res, next) => {
    try {
      const result = await this.campaignService.createSMSCampaign(req.body, req.user);
      res.status(201).json(ApiResponse.success('SMS campaign created', result));
    } catch (error) {
      next(error);
    }
  };

  // Create WhatsApp Campaign
  createWhatsAppCampaign = async (req, res, next) => {
    try {
      const result = await this.campaignService.createWhatsAppCampaign(req.body, req.user);
      res.status(201).json(ApiResponse.success('WhatsApp campaign created', result));
    } catch (error) {
      next(error);
    }
  };

  // Get Campaigns
  getCampaigns = async (req, res, next) => {
    try {
      const result = await this.campaignService.getCampaigns(req.query, req.user);
      res.status(200).json(ApiResponse.success('Campaigns retrieved', result.data, result.meta));
    } catch (error) {
      next(error);
    }
  };

  // Get Campaign Analytics
  getCampaignAnalytics = async (req, res, next) => {
    try {
      const { campaignId } = req.params;
      const result = await this.campaignService.getCampaignAnalytics(campaignId, req.user);
      res.status(200).json(ApiResponse.success('Campaign analytics retrieved', result));
    } catch (error) {
      next(error);
    }
  };
}