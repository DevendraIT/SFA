/**
 * CRM Integration Service - Enterprise Modular Monolith
 * Handles all CRM integration business logic
 */

import { AppError } from '../../../shared/response.js';
import { logAudit } from '../../../shared/utils/index.js';
import { CRM_CONSTANTS } from '../constants/crm.constants.js';

export class CRMService {
  constructor(crmRepository, crmAPIClient, webhookService, syncService, mappingService) {
    this.crmRepository = crmRepository;
    this.crmAPIClient = crmAPIClient;
    this.webhookService = webhookService;
    this.syncService = syncService;
    this.mappingService = mappingService;
  }

  /**
   * Configure CRM integration settings
   */
  async configure(configData, user) {
    const { organizationId } = user;
    
    // Validate configuration
    await this.validateConfiguration(configData);
    
    // Test connection with provided credentials
    const connectionTest = await this.crmAPIClient.testConnection(configData);
    if (!connectionTest.success) {
      throw AppError.badRequest('Failed to connect to CRM with provided credentials');
    }

    // Save configuration
    const config = await this.crmRepository.saveConfiguration({
      organizationId,
      ...configData,
      status: CRM_CONSTANTS.STATUS.ACTIVE,
      lastTestedAt: new Date(),
    });

    // Initialize webhooks if enabled
    if (configData.enableWebhooks) {
      await this.webhookService.setupWebhooks(organizationId, configData.crmType);
    }

    // Log audit
    await logAudit({
      organizationId,
      userId: user.id,
      action: CRM_CONSTANTS.AUDIT_ACTIONS.CONFIGURATION_UPDATED,
      moduleName: CRM_CONSTANTS.MODULE_NAME,
      details: { crmType: configData.crmType },
    });

    return config;
  }

  /**
   * Test CRM connection
   */
  async testConnection(organizationId) {
    const config = await this.crmRepository.getConfiguration(organizationId);
    if (!config) {
      throw AppError.notFound('CRM configuration not found');
    }

    const result = await this.crmAPIClient.testConnection(config);
    
    // Update last tested timestamp
    await this.crmRepository.updateConfiguration(organizationId, {
      lastTestedAt: new Date(),
      status: result.success ? CRM_CONSTANTS.STATUS.ACTIVE : CRM_CONSTANTS.STATUS.ERROR,
    });

    return result;
  }

  /**
   * Initiate data synchronization
   */
  async initiateSync(syncType, user) {
    const { organizationId } = user;
    
    const config = await this.crmRepository.getConfiguration(organizationId);
    if (!config || config.status !== CRM_CONSTANTS.STATUS.ACTIVE) {
      throw AppError.badRequest('CRM integration not configured or inactive');
    }

    // Check if sync is already in progress
    const ongoingSync = await this.crmRepository.getOngoingSync(organizationId);
    if (ongoingSync) {
      throw AppError.conflict('Sync already in progress');
    }

    // Create sync job
    const syncJob = await this.crmRepository.createSyncJob({
      organizationId,
      userId: user.id,
      syncType,
      status: CRM_CONSTANTS.SYNC_STATUS.INITIATED,
      startedAt: new Date(),
    });

    // Start sync process asynchronously
    this.syncService.startSync(syncJob.id, config, syncType);

    // Log audit
    await logAudit({
      organizationId,
      userId: user.id,
      action: CRM_CONSTANTS.AUDIT_ACTIONS.SYNC_INITIATED,
      moduleName: CRM_CONSTANTS.MODULE_NAME,
      details: { syncType, syncJobId: syncJob.id },
    });

    return syncJob;
  }

  /**
   * Get synchronization status
   */
  async getSyncStatus(organizationId) {
    const currentSync = await this.crmRepository.getCurrentSync(organizationId);
    const lastSync = await this.crmRepository.getLastCompletedSync(organizationId);
    
    return {
      currentSync,
      lastSync,
      nextScheduledSync: await this.getNextScheduledSync(organizationId),
    };
  }

  /**
   * Get sync logs with pagination
   */
  async getSyncLogs(filters, user) {
    const options = {
      ...filters,
      organizationId: user.organizationId,
      page: parseInt(filters.page) || 1,
      limit: parseInt(filters.limit) || 20,
    };

    return await this.crmRepository.getSyncLogs(options);
  }

  /**
   * Get CRM field mappings
   */
  async getMappings(organizationId) {
    return await this.mappingService.getMappings(organizationId);
  }

  /**
   * Update CRM field mappings
   */
  async updateMappings(mappingsData, user) {
    const { organizationId } = user;
    
    // Validate mappings
    await this.mappingService.validateMappings(mappingsData);
    
    // Update mappings
    const result = await this.mappingService.updateMappings(organizationId, mappingsData);

    // Log audit
    await logAudit({
      organizationId,
      userId: user.id,
      action: CRM_CONSTANTS.AUDIT_ACTIONS.MAPPINGS_UPDATED,
      moduleName: CRM_CONSTANTS.MODULE_NAME,
      details: { mappingCount: Object.keys(mappingsData).length },
    });

    return result;
  }

  /**
   * Process incoming webhook
   */
  async processWebhook(crmType, payload, headers) {
    // Verify webhook signature
    const isValid = await this.webhookService.verifyWebhook(crmType, payload, headers);
    if (!isValid) {
      throw AppError.unauthorized('Invalid webhook signature');
    }

    // Process webhook event
    const result = await this.webhookService.processWebhookEvent(crmType, payload);
    
    return result;
  }

  /**
   * Get integration status and health
   */
  async getIntegrationStatus(organizationId) {
    const config = await this.crmRepository.getConfiguration(organizationId);
    const recentSyncs = await this.crmRepository.getRecentSyncs(organizationId, 5);
    const webhookStatus = await this.webhookService.getWebhookStatus(organizationId);
    
    return {
      configuration: config,
      recentSyncs,
      webhookStatus,
      healthCheck: await this.performHealthCheck(organizationId),
    };
  }

  /**
   * Toggle integration (pause/resume)
   */
  async toggleIntegration(action, user) {
    const { organizationId } = user;
    
    const newStatus = action === 'pause' 
      ? CRM_CONSTANTS.STATUS.PAUSED 
      : CRM_CONSTANTS.STATUS.ACTIVE;

    const result = await this.crmRepository.updateConfiguration(organizationId, {
      status: newStatus,
      updatedAt: new Date(),
    });

    // Log audit
    await logAudit({
      organizationId,
      userId: user.id,
      action: action === 'pause' 
        ? CRM_CONSTANTS.AUDIT_ACTIONS.INTEGRATION_PAUSED 
        : CRM_CONSTANTS.AUDIT_ACTIONS.INTEGRATION_RESUMED,
      moduleName: CRM_CONSTANTS.MODULE_NAME,
    });

    return result;
  }

  // Private helper methods
  async validateConfiguration(configData) {
    const requiredFields = ['crmType', 'apiUrl', 'apiKey'];
    
    for (const field of requiredFields) {
      if (!configData[field]) {
        throw AppError.badRequest(`Missing required field: ${field}`);
      }
    }

    if (!CRM_CONSTANTS.SUPPORTED_CRMS.includes(configData.crmType)) {
      throw AppError.badRequest('Unsupported CRM type');
    }
  }

  async getNextScheduledSync(organizationId) {
    const config = await this.crmRepository.getConfiguration(organizationId);
    if (!config || !config.syncSchedule) {
      return null;
    }

    // Calculate next sync based on schedule
    // This is a simplified version - actual implementation would use a proper cron parser
    return new Date(Date.now() + 24 * 60 * 60 * 1000); // Next day
  }

  async performHealthCheck(organizationId) {
    const config = await this.crmRepository.getConfiguration(organizationId);
    if (!config) {
      return { status: 'not_configured', message: 'CRM not configured' };
    }

    try {
      const connectionTest = await this.crmAPIClient.testConnection(config);
      return {
        status: connectionTest.success ? 'healthy' : 'unhealthy',
        message: connectionTest.message,
        lastChecked: new Date(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        lastChecked: new Date(),
      };
    }
  }
}