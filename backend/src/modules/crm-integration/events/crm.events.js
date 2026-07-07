/**
 * CRM Integration Events - Enterprise Modular Monolith
 */

import { EventEmitter } from 'events';
import { logAudit } from '../../../shared/utils/index.js';
import { CRM_CONSTANTS } from '../constants/crm.constants.js';

class CRMEventEmitter extends EventEmitter {}
export const crmEvents = new CRMEventEmitter();

// Event types
export const CRM_EVENTS = {
  // Configuration events
  CONFIGURATION_UPDATED: 'configuration.updated',
  CONFIGURATION_DELETED: 'configuration.deleted',
  CONNECTION_TESTED: 'connection.tested',

  // Sync events
  SYNC_STARTED: 'sync.started',
  SYNC_PROGRESS: 'sync.progress',
  SYNC_COMPLETED: 'sync.completed',
  SYNC_FAILED: 'sync.failed',
  SYNC_CANCELLED: 'sync.cancelled',

  // Webhook events
  WEBHOOK_RECEIVED: 'webhook.received',
  WEBHOOK_PROCESSED: 'webhook.processed',
  WEBHOOK_FAILED: 'webhook.failed',

  // Data events
  LEAD_SYNCED: 'lead.synced',
  CONTACT_SYNCED: 'contact.synced',
  OPPORTUNITY_SYNCED: 'opportunity.synced',
  
  // Error events
  API_ERROR: 'api.error',
  RATE_LIMIT_EXCEEDED: 'rate_limit.exceeded',
  AUTHENTICATION_FAILED: 'authentication.failed',

  // Integration events
  INTEGRATION_PAUSED: 'integration.paused',
  INTEGRATION_RESUMED: 'integration.resumed',
  MAPPING_UPDATED: 'mapping.updated',
};

/**
 * CRM Event Handler Class
 */
export class CRMEventHandler {
  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Configuration events
    crmEvents.on(CRM_EVENTS.CONFIGURATION_UPDATED, this.onConfigurationUpdated.bind(this));
    crmEvents.on(CRM_EVENTS.CONNECTION_TESTED, this.onConnectionTested.bind(this));

    // Sync events
    crmEvents.on(CRM_EVENTS.SYNC_STARTED, this.onSyncStarted.bind(this));
    crmEvents.on(CRM_EVENTS.SYNC_PROGRESS, this.onSyncProgress.bind(this));
    crmEvents.on(CRM_EVENTS.SYNC_COMPLETED, this.onSyncCompleted.bind(this));
    crmEvents.on(CRM_EVENTS.SYNC_FAILED, this.onSyncFailed.bind(this));

    // Webhook events
    crmEvents.on(CRM_EVENTS.WEBHOOK_RECEIVED, this.onWebhookReceived.bind(this));
    crmEvents.on(CRM_EVENTS.WEBHOOK_PROCESSED, this.onWebhookProcessed.bind(this));

    // Error events
    crmEvents.on(CRM_EVENTS.API_ERROR, this.onApiError.bind(this));
    crmEvents.on(CRM_EVENTS.RATE_LIMIT_EXCEEDED, this.onRateLimitExceeded.bind(this));
    crmEvents.on(CRM_EVENTS.AUTHENTICATION_FAILED, this.onAuthenticationFailed.bind(this));

    // Data events
    crmEvents.on(CRM_EVENTS.LEAD_SYNCED, this.onLeadSynced.bind(this));
    crmEvents.on(CRM_EVENTS.CONTACT_SYNCED, this.onContactSynced.bind(this));
    crmEvents.on(CRM_EVENTS.OPPORTUNITY_SYNCED, this.onOpportunitySynced.bind(this));
  }

  async onConfigurationUpdated(data) {
    const { organizationId, userId, crmType, config } = data;

    try {
      await logAudit({
        organizationId,
        userId,
        action: CRM_CONSTANTS.AUDIT_ACTIONS.CONFIGURATION_UPDATED,
        moduleName: CRM_CONSTANTS.MODULE_NAME,
        details: { crmType, configurationId: config.id },
      });

      console.log(`CRM configuration updated for org ${organizationId}: ${crmType}`);
    } catch (error) {
      console.error('Failed to handle configuration updated event:', error);
    }
  }

  async onConnectionTested(data) {
    const { organizationId, crmType, success, responseTime } = data;

    try {
      console.log(`CRM connection test for ${crmType}: ${success ? 'SUCCESS' : 'FAILED'} (${responseTime}ms)`);
      
      // You could emit notifications, update health metrics, etc.
    } catch (error) {
      console.error('Failed to handle connection tested event:', error);
    }
  }

  async onSyncStarted(data) {
    const { organizationId, userId, syncJobId, syncType } = data;

    try {
      await logAudit({
        organizationId,
        userId,
        action: CRM_CONSTANTS.AUDIT_ACTIONS.SYNC_INITIATED,
        moduleName: CRM_CONSTANTS.MODULE_NAME,
        details: { syncJobId, syncType },
      });

      console.log(`CRM sync started for org ${organizationId}: ${syncType} (Job: ${syncJobId})`);
      
      // You could send notifications, update UI, etc.
    } catch (error) {
      console.error('Failed to handle sync started event:', error);
    }
  }

  async onSyncProgress(data) {
    const { organizationId, syncJobId, progress } = data;
    
    try {
      console.log(`CRM sync progress for job ${syncJobId}: ${progress.processed}/${progress.total} records`);
      
      // You could update real-time progress indicators
    } catch (error) {
      console.error('Failed to handle sync progress event:', error);
    }
  }

  async onSyncCompleted(data) {
    const { organizationId, userId, syncJobId, summary } = data;

    try {
      await logAudit({
        organizationId,
        userId,
        action: CRM_CONSTANTS.AUDIT_ACTIONS.SYNC_COMPLETED,
        moduleName: CRM_CONSTANTS.MODULE_NAME,
        details: { syncJobId, summary },
      });

      console.log(`CRM sync completed for job ${syncJobId}:`, summary);
      
      // You could send completion notifications, update dashboards, etc.
    } catch (error) {
      console.error('Failed to handle sync completed event:', error);
    }
  }

  async onSyncFailed(data) {
    const { organizationId, userId, syncJobId, error, partialResults } = data;

    try {
      await logAudit({
        organizationId,
        userId,
        action: CRM_CONSTANTS.AUDIT_ACTIONS.SYNC_FAILED,
        moduleName: CRM_CONSTANTS.MODULE_NAME,
        details: { syncJobId, error: error.message, partialResults },
      });

      console.error(`CRM sync failed for job ${syncJobId}:`, error.message);
      
      // You could send error notifications, alert administrators, etc.
    } catch (auditError) {
      console.error('Failed to handle sync failed event:', auditError);
    }
  }

  async onWebhookReceived(data) {
    const { organizationId, crmType, eventType, webhookId } = data;

    try {
      console.log(`CRM webhook received from ${crmType}: ${eventType} (ID: ${webhookId})`);
      
      // You could update real-time data, trigger notifications, etc.
    } catch (error) {
      console.error('Failed to handle webhook received event:', error);
    }
  }

  async onWebhookProcessed(data) {
    const { organizationId, crmType, eventType, webhookId, processingTime, success } = data;

    try {
      console.log(`CRM webhook processed from ${crmType}: ${eventType} - ${success ? 'SUCCESS' : 'FAILED'} (${processingTime}ms)`);
    } catch (error) {
      console.error('Failed to handle webhook processed event:', error);
    }
  }

  async onApiError(data) {
    const { organizationId, crmType, error, endpoint, retryable } = data;

    try {
      console.error(`CRM API error for ${crmType} (${endpoint}):`, error.message);
      
      if (!retryable) {
        // You could disable integration temporarily, send alerts, etc.
        console.warn(`Non-retryable error detected for ${crmType} integration`);
      }
    } catch (handleError) {
      console.error('Failed to handle API error event:', handleError);
    }
  }

  async onRateLimitExceeded(data) {
    const { organizationId, crmType, resetTime } = data;

    try {
      console.warn(`Rate limit exceeded for ${crmType}. Reset at: ${resetTime}`);
      
      // You could pause sync operations, send notifications, etc.
    } catch (error) {
      console.error('Failed to handle rate limit exceeded event:', error);
    }
  }

  async onAuthenticationFailed(data) {
    const { organizationId, crmType, error } = data;

    try {
      console.error(`Authentication failed for ${crmType}:`, error.message);
      
      // You could disable integration, send admin alerts, etc.
    } catch (handleError) {
      console.error('Failed to handle authentication failed event:', handleError);
    }
  }

  async onLeadSynced(data) {
    const { organizationId, leadId, crmId, crmType, action } = data;

    try {
      console.log(`Lead ${action} via CRM sync: ${leadId} (CRM: ${crmId})`);
      
      // You could trigger lead scoring, notifications, etc.
    } catch (error) {
      console.error('Failed to handle lead synced event:', error);
    }
  }

  async onContactSynced(data) {
    const { organizationId, contactId, crmId, crmType, action } = data;

    try {
      console.log(`Contact ${action} via CRM sync: ${contactId} (CRM: ${crmId})`);
    } catch (error) {
      console.error('Failed to handle contact synced event:', error);
    }
  }

  async onOpportunitySynced(data) {
    const { organizationId, opportunityId, crmId, crmType, action } = data;

    try {
      console.log(`Opportunity ${action} via CRM sync: ${opportunityId} (CRM: ${crmId})`);
    } catch (error) {
      console.error('Failed to handle opportunity synced event:', error);
    }
  }
}

// Helper functions to emit events
export const emitCRMEvent = (eventName, data) => {
  try {
    crmEvents.emit(eventName, data);
  } catch (error) {
    console.error(`Failed to emit CRM event ${eventName}:`, error);
  }
};

// Convenience functions for common events
export const emitSyncStarted = (organizationId, userId, syncJobId, syncType) => {
  emitCRMEvent(CRM_EVENTS.SYNC_STARTED, { organizationId, userId, syncJobId, syncType });
};

export const emitSyncCompleted = (organizationId, userId, syncJobId, summary) => {
  emitCRMEvent(CRM_EVENTS.SYNC_COMPLETED, { organizationId, userId, syncJobId, summary });
};

export const emitSyncFailed = (organizationId, userId, syncJobId, error, partialResults = null) => {
  emitCRMEvent(CRM_EVENTS.SYNC_FAILED, { organizationId, userId, syncJobId, error, partialResults });
};

export const emitWebhookReceived = (organizationId, crmType, eventType, webhookId) => {
  emitCRMEvent(CRM_EVENTS.WEBHOOK_RECEIVED, { organizationId, crmType, eventType, webhookId });
};

export const emitConfigurationUpdated = (organizationId, userId, crmType, config) => {
  emitCRMEvent(CRM_EVENTS.CONFIGURATION_UPDATED, { organizationId, userId, crmType, config });
};

// Initialize event handler
export const crmEventHandler = new CRMEventHandler();