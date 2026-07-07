/**
 * CRM Integration DTOs - Enterprise Modular Monolith
 */

export class CRMConfigurationDto {
  static toResponse(config) {
    return {
      id: config.id,
      organizationId: config.organizationId,
      crmType: config.crmType,
      apiUrl: config.apiUrl,
      // Don't expose sensitive data like API keys
      status: config.status,
      enableWebhooks: config.enableWebhooks,
      syncEnabled: config.syncEnabled,
      syncSchedule: config.syncSchedule,
      lastTestedAt: config.lastTestedAt,
      lastSyncAt: config.lastSyncAt,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    };
  }

  static toSummary(config) {
    return {
      crmType: config.crmType,
      status: config.status,
      lastSyncAt: config.lastSyncAt,
      syncEnabled: config.syncEnabled,
    };
  }
}

export class CRMSyncJobDto {
  static toResponse(syncJob) {
    return {
      id: syncJob.id,
      organizationId: syncJob.organizationId,
      syncType: syncJob.syncType,
      status: syncJob.status,
      recordsProcessed: syncJob.recordsProcessed || 0,
      recordsSuccess: syncJob.recordsSuccess || 0,
      recordsErrors: syncJob.recordsErrors || 0,
      startedAt: syncJob.startedAt,
      completedAt: syncJob.completedAt,
      duration: syncJob.completedAt && syncJob.startedAt 
        ? Math.round((new Date(syncJob.completedAt) - new Date(syncJob.startedAt)) / 1000)
        : null,
      errorMessage: syncJob.errorMessage,
      summary: syncJob.summary ? JSON.parse(syncJob.summary) : null,
      createdAt: syncJob.createdAt,
    };
  }

  static toSummary(syncJob) {
    return {
      id: syncJob.id,
      syncType: syncJob.syncType,
      status: syncJob.status,
      recordsProcessed: syncJob.recordsProcessed || 0,
      startedAt: syncJob.startedAt,
      completedAt: syncJob.completedAt,
    };
  }
}

export class CRMSyncLogDto {
  static toResponse(log) {
    return {
      id: log.id,
      syncJobId: log.syncJobId,
      level: log.level,
      message: log.message,
      details: log.details ? JSON.parse(log.details) : null,
      createdAt: log.createdAt,
      syncJob: log.syncJob ? {
        syncType: log.syncJob.syncType,
        status: log.syncJob.status,
      } : null,
    };
  }
}

export class CRMWebhookDto {
  static toResponse(webhook) {
    return {
      id: webhook.id,
      organizationId: webhook.organizationId,
      crmType: webhook.crmType,
      webhookUrl: webhook.webhookUrl,
      events: webhook.events,
      status: webhook.status,
      lastEventAt: webhook.lastEventAt,
      eventsProcessed: webhook.eventsProcessed || 0,
      createdAt: webhook.createdAt,
      updatedAt: webhook.updatedAt,
    };
  }
}

export class CRMWebhookEventDto {
  static toResponse(event) {
    return {
      id: event.id,
      organizationId: event.organizationId,
      crmType: event.crmType,
      eventType: event.eventType,
      processed: event.processed,
      processedAt: event.processedAt,
      errorMessage: event.errorMessage,
      createdAt: event.createdAt,
    };
  }
}

export class CRMMappingDto {
  static toResponse(mappings) {
    return {
      leadMappings: mappings.leadMappings || {},
      contactMappings: mappings.contactMappings || {},
      opportunityMappings: mappings.opportunityMappings || {},
      customMappings: mappings.customMappings || {},
    };
  }
}

export class CRMEntityDto {
  static leadToSFA(crmLead, mappings) {
    const sfaLead = {};
    
    if (mappings && mappings.leadMappings) {
      for (const [sfaField, crmField] of Object.entries(mappings.leadMappings)) {
        if (crmLead[crmField] !== undefined) {
          sfaLead[sfaField] = crmLead[crmField];
        }
      }
    }

    // Add metadata
    sfaLead.crmId = crmLead.id;
    sfaLead.crmType = crmLead.crmType;
    sfaLead.crmCreatedAt = crmLead.createdDate || crmLead.created_at;
    sfaLead.crmUpdatedAt = crmLead.modifiedDate || crmLead.updated_at;

    return sfaLead;
  }

  static contactToSFA(crmContact, mappings) {
    const sfaContact = {};
    
    if (mappings && mappings.contactMappings) {
      for (const [sfaField, crmField] of Object.entries(mappings.contactMappings)) {
        if (crmContact[crmField] !== undefined) {
          sfaContact[sfaField] = crmContact[crmField];
        }
      }
    }

    // Add metadata
    sfaContact.crmId = crmContact.id;
    sfaContact.crmType = crmContact.crmType;
    sfaContact.crmCreatedAt = crmContact.createdDate || crmContact.created_at;
    sfaContact.crmUpdatedAt = crmContact.modifiedDate || crmContact.updated_at;

    return sfaContact;
  }

  static opportunityToSFA(crmOpportunity, mappings) {
    const sfaOpportunity = {};
    
    if (mappings && mappings.opportunityMappings) {
      for (const [sfaField, crmField] of Object.entries(mappings.opportunityMappings)) {
        if (crmOpportunity[crmField] !== undefined) {
          sfaOpportunity[sfaField] = crmOpportunity[crmField];
        }
      }
    }

    // Add metadata
    sfaOpportunity.crmId = crmOpportunity.id;
    sfaOpportunity.crmType = crmOpportunity.crmType;
    sfaOpportunity.crmCreatedAt = crmOpportunity.createdDate || crmOpportunity.created_at;
    sfaOpportunity.crmUpdatedAt = crmOpportunity.modifiedDate || crmOpportunity.updated_at;

    return sfaOpportunity;
  }

  static sfaLeadToCRM(sfaLead, mappings, crmType) {
    const crmLead = {};
    
    if (mappings && mappings.leadMappings) {
      for (const [sfaField, crmField] of Object.entries(mappings.leadMappings)) {
        if (sfaLead[sfaField] !== undefined) {
          crmLead[crmField] = sfaLead[sfaField];
        }
      }
    }

    // Add CRM-specific formatting
    return this.formatForCRM(crmLead, crmType);
  }

  static formatForCRM(data, crmType) {
    switch (crmType) {
      case 'salesforce':
        // Salesforce-specific formatting
        return data;
      case 'hubspot':
        // HubSpot uses properties wrapper
        return {
          properties: data,
        };
      case 'pipedrive':
        // Pipedrive-specific formatting
        return data;
      default:
        return data;
    }
  }
}

export class CRMHealthCheckDto {
  static toResponse(healthCheck) {
    return {
      status: healthCheck.status,
      message: healthCheck.message,
      lastChecked: healthCheck.lastChecked,
      responseTime: healthCheck.responseTime,
      details: healthCheck.details || {},
    };
  }
}

export class CRMIntegrationStatusDto {
  static toResponse(status) {
    return {
      configuration: status.configuration ? CRMConfigurationDto.toResponse(status.configuration) : null,
      recentSyncs: status.recentSyncs?.map(sync => CRMSyncJobDto.toSummary(sync)) || [],
      webhookStatus: status.webhookStatus?.map(webhook => CRMWebhookDto.toResponse(webhook)) || [],
      healthCheck: status.healthCheck ? CRMHealthCheckDto.toResponse(status.healthCheck) : null,
      lastActivity: this.getLastActivity(status),
      statistics: this.getStatistics(status),
    };
  }

  static getLastActivity(status) {
    const activities = [];

    if (status.configuration?.lastSyncAt) {
      activities.push({
        type: 'sync',
        timestamp: status.configuration.lastSyncAt,
      });
    }

    if (status.webhookStatus?.length > 0) {
      const latestWebhook = status.webhookStatus.reduce((latest, webhook) => 
        (!latest.lastEventAt || (webhook.lastEventAt && webhook.lastEventAt > latest.lastEventAt)) ? webhook : latest
      );
      
      if (latestWebhook.lastEventAt) {
        activities.push({
          type: 'webhook',
          timestamp: latestWebhook.lastEventAt,
        });
      }
    }

    return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] || null;
  }

  static getStatistics(status) {
    const stats = {
      totalSyncs: status.recentSyncs?.length || 0,
      successfulSyncs: status.recentSyncs?.filter(sync => sync.status === 'COMPLETED').length || 0,
      failedSyncs: status.recentSyncs?.filter(sync => sync.status === 'FAILED').length || 0,
      totalWebhookEvents: 0,
      activeWebhooks: status.webhookStatus?.filter(webhook => webhook.status === 'ACTIVE').length || 0,
    };

    if (status.webhookStatus) {
      stats.totalWebhookEvents = status.webhookStatus.reduce((total, webhook) => 
        total + (webhook.eventsProcessed || 0), 0
      );
    }

    return stats;
  }
}