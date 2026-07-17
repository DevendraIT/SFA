import axios from 'axios';
import config from '../../../config/env.js';
import logger from '../../../utils/logger.js';
import { AppError } from '../../../shared/response.js';

/**
 * n8n Client to trigger webhooks
 */
export class N8nClient {
  constructor() {
    this.webhookUrl = config.N8N_WEBHOOK_URL;
    this.client = axios.create({
      timeout: 10000, // 10 seconds timeout
    });
  }

  async triggerCampaign(payload) {
    if (!this.webhookUrl) {
      logger.error('N8N_WEBHOOK_URL is not defined in environment variables');
      throw AppError.internal('N8N integration is not configured');
    }

    try {
      logger.info(`Triggering n8n webhook for campaign: ${payload.campaignId}`);
      
      const response = await this.client.post(this.webhookUrl, payload);
      
      logger.info(`n8n webhook triggered successfully for campaign: ${payload.campaignId}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to trigger n8n webhook', {
        error: error.message,
        campaignId: payload.campaignId,
      });
      
      // We don't want to throw an error if the webhook fails to respond immediately, 
      // but we should log it. The campaign status might need to be retried by a background job later.
      // Depending on requirements, we can throw here. Let's throw for now so the service knows it failed.
      throw AppError.internal('Failed to trigger campaign execution via n8n');
    }
  }
}
