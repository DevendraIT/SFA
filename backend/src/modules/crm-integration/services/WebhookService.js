/**
 * CRM Webhook Service - Enterprise Modular Monolith
 */

import crypto from 'crypto';
import { AppError } from '../../../shared/response.js';
import { CRM_CONSTANTS } from '../constants/crm.constants.js';

export class WebhookService {
  constructor(crmRepository, crmAPIClient) {
    this.crmRepository = crmRepository;
    this.crmAPIClient = crmAPIClient;
  }

  /**
   * Setup webhooks for CRM integration
   */
  async setupWebhooks(organizationId, crmType) {
    const webhookEvents = this.getWebhookEvents(crmType);
    const webhookUrl = this.generateWebhookUrl(organizationId, crmType);
    
    const webhookConfig = await this.crmRepository.saveWebhookConfig({
      organizationId,
      crmType,
      webhookUrl,
      events: webhookEvents,
      status: CRM_CONSTANTS.STATUS.ACTIVE,
      secretKey: this.generateSecretKey(),
    });

    return webhookConfig;
  }

  /**
   * Verify webhook signature
   */
  async verifyWebhook(crmType, payload, headers) {
    const signature = headers[CRM_CONSTANTS.WEBHOOK_SECURITY.SIGNATURE_HEADER] || headers['x-hub-signature'];
    
    if (!signature) {
      return false;
    }

    // Get webhook secret for verification
    const secret = await this.getWebhookSecret(crmType);
    if (!secret) {
      return false;
    }

    return this.verifySignature(payload, signature, secret, crmType);
  }

  /**
   * Process webhook event
   */
  async processWebhookEvent(crmType, payload) {
    try {
      // Log webhook event
      await this.crmRepository.logWebhookEvent({
        crmType,
        eventType: this.extractEventType(crmType, payload),
        payload: JSON.stringify(payload),
        processed: false,
      });

      // Process based on CRM type and event
      const processedData = await this.processEventData(crmType, payload);
      
      return {
        success: true,
        data: processedData,
      };
    } catch (error) {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }

  /**
   * Get webhook status
   */
  async getWebhookStatus(organizationId) {
    const webhooks = await this.crmRepository.getWebhookConfigs(organizationId);
    return webhooks.map(webhook => ({
      id: webhook.id,
      crmType: webhook.crmType,
      status: webhook.status,
      lastEvent: webhook.lastEventAt,
      eventsCount: webhook.eventsProcessed || 0,
    }));
  }

  // Private methods
  generateWebhookUrl(organizationId, crmType) {
    const baseUrl = process.env.WEBHOOK_BASE_URL || 'https://api.example.com';
    return `${baseUrl}/api/v1/crm/webhook/${crmType}?org=${organizationId}`;
  }

  generateSecretKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  getWebhookEvents(crmType) {
    // Return relevant events based on CRM type
    return Object.values(CRM_CONSTANTS.WEBHOOK_EVENTS);
  }

  async getWebhookSecret(crmType) {
    // Retrieve webhook secret from configuration
    return process.env[`${crmType.toUpperCase()}_WEBHOOK_SECRET`];
  }

  verifySignature(payload, signature, secret, crmType) {
    switch (crmType) {
      case 'hubspot':
        return this.verifyHubSpotSignature(payload, signature, secret);
      case 'salesforce':
        return this.verifySalesforceSignature(payload, signature, secret);
      default:
        return this.verifyGenericSignature(payload, signature, secret);
    }
  }

  verifyHubSpotSignature(payload, signature, secret) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return signature === expectedSignature;
  }

  verifySalesforceSignature(payload, signature, secret) {
    // Salesforce uses different signature method
    const expectedSignature = crypto
      .createHmac('sha1', secret)
      .update(payload)
      .digest('base64');
    
    return signature === expectedSignature;
  }

  verifyGenericSignature(payload, signature, secret) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    return signature === `sha256=${expectedSignature}`;
  }

  extractEventType(crmType, payload) {
    switch (crmType) {
      case 'hubspot':
        return payload.subscriptionType || 'unknown';
      case 'salesforce':
        return payload.sobjectType || 'unknown';
      default:
        return payload.eventType || 'unknown';
    }
  }

  async processEventData(crmType, payload) {
    // Process webhook data based on CRM type and event
    const eventType = this.extractEventType(crmType, payload);
    
    switch (eventType) {
      case 'contact.creation':
      case 'LEAD_CREATED':
        return await this.processLeadCreated(crmType, payload);
      case 'contact.propertyChange':
      case 'LEAD_UPDATED':
        return await this.processLeadUpdated(crmType, payload);
      default:
        console.log(`Unhandled event type: ${eventType}`);
        return { eventType, processed: false };
    }
  }

  async processLeadCreated(crmType, payload) {
    // Transform webhook data to our lead format
    const leadData = this.transformWebhookLead(crmType, payload);
    
    // Here you would typically create or update the lead in your system
    // For now, just return the transformed data
    return {
      action: 'lead_created',
      leadData,
    };
  }

  async processLeadUpdated(crmType, payload) {
    const leadData = this.transformWebhookLead(crmType, payload);
    
    return {
      action: 'lead_updated',
      leadData,
    };
  }

  transformWebhookLead(crmType, payload) {
    switch (crmType) {
      case 'hubspot':
        return {
          crmId: payload.objectId,
          firstName: payload.properties?.firstname,
          lastName: payload.properties?.lastname,
          email: payload.properties?.email,
          company: payload.properties?.company,
        };
      case 'salesforce':
        return {
          crmId: payload.Id,
          firstName: payload.FirstName,
          lastName: payload.LastName,
          email: payload.Email,
          company: payload.Company,
        };
      default:
        return payload;
    }
  }
}