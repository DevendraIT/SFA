/**
 * CRM Sync Service - Enterprise Modular Monolith
 */

import { CRM_CONSTANTS } from '../constants/crm.constants.js';
import { logAudit } from '../../../shared/utils/index.js';

export class SyncService {
  constructor(crmRepository, crmAPIClient) {
    this.crmRepository = crmRepository;
    this.crmAPIClient = crmAPIClient;
  }

  /**
   * Start synchronization process
   */
  async startSync(syncJobId, config, syncType) {
    try {
      // Update sync job status
      await this.crmRepository.updateSyncJob(syncJobId, {
        status: CRM_CONSTANTS.SYNC_STATUS.IN_PROGRESS,
        startedAt: new Date(),
      });

      // Log sync start
      await this.logSyncEvent(syncJobId, 'INFO', 'Sync process started', { syncType });

      // Perform sync based on type
      let result;
      switch (syncType) {
        case CRM_CONSTANTS.SYNC_TYPES.FULL:
          result = await this.performFullSync(syncJobId, config);
          break;
        case CRM_CONSTANTS.SYNC_TYPES.INCREMENTAL:
          result = await this.performIncrementalSync(syncJobId, config);
          break;
        case CRM_CONSTANTS.SYNC_TYPES.LEADS_ONLY:
          result = await this.syncLeadsOnly(syncJobId, config);
          break;
        case CRM_CONSTANTS.SYNC_TYPES.CONTACTS_ONLY:
          result = await this.syncContactsOnly(syncJobId, config);
          break;
        default:
          throw new Error(`Unsupported sync type: ${syncType}`);
      }

      // Update sync job as completed
      await this.crmRepository.updateSyncJob(syncJobId, {
        status: CRM_CONSTANTS.SYNC_STATUS.COMPLETED,
        completedAt: new Date(),
        recordsProcessed: result.recordsProcessed,
        recordsSuccess: result.recordsSuccess,
        recordsErrors: result.recordsErrors,
        summary: result.summary,
      });

      await this.logSyncEvent(syncJobId, 'INFO', 'Sync process completed successfully', result.summary);

      return result;
    } catch (error) {
      console.error('Sync process failed:', error);

      // Update sync job as failed
      await this.crmRepository.updateSyncJob(syncJobId, {
        status: CRM_CONSTANTS.SYNC_STATUS.FAILED,
        completedAt: new Date(),
        errorMessage: error.message,
      });

      await this.logSyncEvent(syncJobId, 'ERROR', 'Sync process failed', { error: error.message });

      throw error;
    }
  }

  /**
   * Perform full synchronization
   */
  async performFullSync(syncJobId, config) {
    await this.logSyncEvent(syncJobId, 'INFO', 'Starting full synchronization');

    const results = {
      leads: await this.syncLeads(syncJobId, config, { fullSync: true }),
      contacts: await this.syncContacts(syncJobId, config, { fullSync: true }),
      opportunities: await this.syncOpportunities(syncJobId, config, { fullSync: true }),
    };

    const summary = {
      totalRecordsProcessed: results.leads.processed + results.contacts.processed + results.opportunities.processed,
      totalRecordsSuccess: results.leads.success + results.contacts.success + results.opportunities.success,
      totalRecordsErrors: results.leads.errors + results.contacts.errors + results.opportunities.errors,
      breakdown: results,
    };

    return {
      recordsProcessed: summary.totalRecordsProcessed,
      recordsSuccess: summary.totalRecordsSuccess,
      recordsErrors: summary.totalRecordsErrors,
      summary,
    };
  }

  /**
   * Perform incremental synchronization
   */
  async performIncrementalSync(syncJobId, config) {
    await this.logSyncEvent(syncJobId, 'INFO', 'Starting incremental synchronization');

    // Get last sync timestamp
    const lastSync = await this.crmRepository.getLastCompletedSync(config.organizationId);
    const lastSyncDate = lastSync?.completedAt || new Date(Date.now() - 24 * 60 * 60 * 1000); // Default to 24h ago

    const options = {
      modifiedSince: lastSyncDate,
      incrementalSync: true,
    };

    const results = {
      leads: await this.syncLeads(syncJobId, config, options),
      contacts: await this.syncContacts(syncJobId, config, options),
      opportunities: await this.syncOpportunities(syncJobId, config, options),
    };

    const summary = {
      lastSyncDate,
      totalRecordsProcessed: results.leads.processed + results.contacts.processed + results.opportunities.processed,
      totalRecordsSuccess: results.leads.success + results.contacts.success + results.opportunities.success,
      totalRecordsErrors: results.leads.errors + results.contacts.errors + results.opportunities.errors,
      breakdown: results,
    };

    return {
      recordsProcessed: summary.totalRecordsProcessed,
      recordsSuccess: summary.totalRecordsSuccess,
      recordsErrors: summary.totalRecordsErrors,
      summary,
    };
  }

  /**
   * Sync leads only
   */
  async syncLeadsOnly(syncJobId, config) {
    const result = await this.syncLeads(syncJobId, config);
    
    return {
      recordsProcessed: result.processed,
      recordsSuccess: result.success,
      recordsErrors: result.errors,
      summary: { leads: result },
    };
  }

  /**
   * Sync contacts only
   */
  async syncContactsOnly(syncJobId, config) {
    const result = await this.syncContacts(syncJobId, config);
    
    return {
      recordsProcessed: result.processed,
      recordsSuccess: result.success,
      recordsErrors: result.errors,
      summary: { contacts: result },
    };
  }

  /**
   * Sync leads from CRM
   */
  async syncLeads(syncJobId, config, options = {}) {
    let processed = 0;
    let success = 0;
    let errors = 0;
    let offset = 0;
    const batchSize = config.settings?.batchSize || CRM_CONSTANTS.DEFAULT_PAGE_SIZE;

    try {
      while (true) {
        const fetchOptions = {
          limit: batchSize,
          offset,
          ...options,
        };

        const leadsData = await this.crmAPIClient.fetchLeads(config, fetchOptions);
        
        if (!leadsData || leadsData.length === 0) {
          break; // No more data
        }

        processed += leadsData.length;
        
        // Process each lead
        for (const leadData of leadsData) {
          try {
            await this.processLeadData(leadData, config.organizationId);
            success++;
          } catch (error) {
            errors++;
            await this.logSyncEvent(syncJobId, 'ERROR', `Failed to process lead: ${leadData.id}`, { error: error.message });
          }
        }

        offset += batchSize;

        // Log progress
        await this.logSyncEvent(syncJobId, 'INFO', `Processed ${processed} leads`, { success, errors });

        // Break if less than batch size returned (end of data)
        if (leadsData.length < batchSize) {
          break;
        }
      }
    } catch (error) {
      await this.logSyncEvent(syncJobId, 'ERROR', 'Lead sync failed', { error: error.message });
      throw error;
    }

    return { processed, success, errors };
  }

  /**
   * Sync contacts from CRM
   */
  async syncContacts(syncJobId, config, options = {}) {
    let processed = 0;
    let success = 0;
    let errors = 0;
    let offset = 0;
    const batchSize = config.settings?.batchSize || CRM_CONSTANTS.DEFAULT_PAGE_SIZE;

    try {
      while (true) {
        const fetchOptions = {
          limit: batchSize,
          offset,
          ...options,
        };

        const contactsData = await this.crmAPIClient.fetchContacts(config, fetchOptions);
        
        if (!contactsData || contactsData.length === 0) {
          break;
        }

        processed += contactsData.length;
        
        for (const contactData of contactsData) {
          try {
            await this.processContactData(contactData, config.organizationId);
            success++;
          } catch (error) {
            errors++;
            await this.logSyncEvent(syncJobId, 'ERROR', `Failed to process contact: ${contactData.id}`, { error: error.message });
          }
        }

        offset += batchSize;
        await this.logSyncEvent(syncJobId, 'INFO', `Processed ${processed} contacts`, { success, errors });

        if (contactsData.length < batchSize) {
          break;
        }
      }
    } catch (error) {
      await this.logSyncEvent(syncJobId, 'ERROR', 'Contact sync failed', { error: error.message });
      throw error;
    }

    return { processed, success, errors };
  }

  /**
   * Sync opportunities from CRM
   */
  async syncOpportunities(syncJobId, config, options = {}) {
    let processed = 0;
    let success = 0;
    let errors = 0;
    let offset = 0;
    const batchSize = config.settings?.batchSize || CRM_CONSTANTS.DEFAULT_PAGE_SIZE;

    try {
      while (true) {
        const fetchOptions = {
          limit: batchSize,
          offset,
          ...options,
        };

        const opportunitiesData = await this.crmAPIClient.fetchOpportunities(config, fetchOptions);
        
        if (!opportunitiesData || opportunitiesData.length === 0) {
          break;
        }

        processed += opportunitiesData.length;
        
        for (const opportunityData of opportunitiesData) {
          try {
            await this.processOpportunityData(opportunityData, config.organizationId);
            success++;
          } catch (error) {
            errors++;
            await this.logSyncEvent(syncJobId, 'ERROR', `Failed to process opportunity: ${opportunityData.id}`, { error: error.message });
          }
        }

        offset += batchSize;
        await this.logSyncEvent(syncJobId, 'INFO', `Processed ${processed} opportunities`, { success, errors });

        if (opportunitiesData.length < batchSize) {
          break;
        }
      }
    } catch (error) {
      await this.logSyncEvent(syncJobId, 'ERROR', 'Opportunity sync failed', { error: error.message });
      throw error;
    }

    return { processed, success, errors };
  }

  // Private helper methods
  async processLeadData(leadData, organizationId) {
    // Here you would typically save or update the lead in your system
    // This is a placeholder implementation
    console.log(`Processing lead: ${leadData.id} for org: ${organizationId}`);
  }

  async processContactData(contactData, organizationId) {
    // Here you would typically save or update the contact in your system
    console.log(`Processing contact: ${contactData.id} for org: ${organizationId}`);
  }

  async processOpportunityData(opportunityData, organizationId) {
    // Here you would typically save or update the opportunity in your system
    console.log(`Processing opportunity: ${opportunityData.id} for org: ${organizationId}`);
  }

  async logSyncEvent(syncJobId, level, message, details = {}) {
    await this.crmRepository.createSyncLog({
      syncJobId,
      level,
      message,
      details: JSON.stringify(details),
      createdAt: new Date(),
    });
  }
}