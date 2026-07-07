/**
 * CRM Integration Repository - Enterprise Modular Monolith
 * Handles all CRM integration data access
 */
import prisma from '../../../config/database.js';

export class CRMRepository {
 
  /**
   * Save CRM configuration
   */
  async saveConfiguration(configData) {
    const existingConfig = await this.prisma.cRMConfiguration.findUnique({
      where: { organizationId: configData.organizationId },
    });

    if (existingConfig) {
      return await this.prisma.cRMConfiguration.update({
        where: { organizationId: configData.organizationId },
        data: {
          ...configData,
          updatedAt: new Date(),
        },
      });
    } else {
      return await this.prisma.cRMConfiguration.create({
        data: configData,
      });
    }
  }

  /**
   * Get CRM configuration
   */
  async getConfiguration(organizationId) {
    return await this.prisma.cRMConfiguration.findUnique({
      where: { organizationId },
    });
  }

  /**
   * Update CRM configuration
   */
  async updateConfiguration(organizationId, updateData) {
    return await this.prisma.cRMConfiguration.update({
      where: { organizationId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Delete CRM configuration
   */
  async deleteConfiguration(organizationId) {
    return await this.prisma.cRMConfiguration.delete({
      where: { organizationId },
    });
  }

  /**
   * Create sync job
   */
  async createSyncJob(jobData) {
    return await this.prisma.cRMSyncJob.create({
      data: jobData,
    });
  }

  /**
   * Update sync job
   */
  async updateSyncJob(jobId, updateData) {
    return await this.prisma.cRMSyncJob.update({
      where: { id: jobId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Get ongoing sync job
   */
  async getOngoingSync(organizationId) {
    return await this.prisma.cRMSyncJob.findFirst({
      where: {
        organizationId,
        status: {
          in: ['INITIATED', 'IN_PROGRESS'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get current sync status
   */
  async getCurrentSync(organizationId) {
    return await this.prisma.cRMSyncJob.findFirst({
      where: { organizationId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get last completed sync
   */
  async getLastCompletedSync(organizationId) {
    return await this.prisma.cRMSyncJob.findFirst({
      where: {
        organizationId,
        status: 'COMPLETED',
      },
      orderBy: {
        completedAt: 'desc',
      },
    });
  }

  /**
   * Get recent syncs
   */
  async getRecentSyncs(organizationId, limit = 10) {
    return await this.prisma.cRMSyncJob.findMany({
      where: { organizationId },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Get sync logs with pagination
   */
  async getSyncLogs(options) {
    const { organizationId, page, limit, syncJobId, level } = options;
    const skip = (page - 1) * limit;

    const where = {
      organizationId,
      ...(syncJobId && { syncJobId }),
      ...(level && { level }),
    };

    const [logs, total] = await Promise.all([
      this.prisma.cRMSyncLog.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
        include: {
          syncJob: {
            select: {
              id: true,
              syncType: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.cRMSyncLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create sync log entry
   */
  async createSyncLog(logData) {
    return await this.prisma.cRMSyncLog.create({
      data: logData,
    });
  }

  /**
   * Save field mappings
   */
  async saveMappings(organizationId, mappingsData) {
    const existingMapping = await this.prisma.cRMMapping.findUnique({
      where: { organizationId },
    });

    if (existingMapping) {
      return await this.prisma.cRMMapping.update({
        where: { organizationId },
        data: {
          mappings: mappingsData,
          updatedAt: new Date(),
        },
      });
    } else {
      return await this.prisma.cRMMapping.create({
        data: {
          organizationId,
          mappings: mappingsData,
        },
      });
    }
  }

  /**
   * Get field mappings
   */
  async getMappings(organizationId) {
    const mapping = await this.prisma.cRMMapping.findUnique({
      where: { organizationId },
    });
    
    return mapping?.mappings || {};
  }

  /**
   * Save webhook configuration
   */
  async saveWebhookConfig(webhookData) {
    return await this.prisma.cRMWebhook.create({
      data: webhookData,
    });
  }

  /**
   * Get webhook configurations
   */
  async getWebhookConfigs(organizationId) {
    return await this.prisma.cRMWebhook.findMany({
      where: { organizationId },
    });
  }

  /**
   * Update webhook status
   */
  async updateWebhookStatus(webhookId, status) {
    return await this.prisma.cRMWebhook.update({
      where: { id: webhookId },
      data: {
        status,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Log webhook event
   */
  async logWebhookEvent(eventData) {
    return await this.prisma.cRMWebhookEvent.create({
      data: eventData,
    });
  }

  /**
   * Get webhook events
   */
  async getWebhookEvents(organizationId, options = {}) {
    const { page = 1, limit = 20, eventType } = options;
    const skip = (page - 1) * limit;

    const where = {
      organizationId,
      ...(eventType && { eventType }),
    };

    const [events, total] = await Promise.all([
      this.prisma.cRMWebhookEvent.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.cRMWebhookEvent.count({ where }),
    ]);

    return {
      data: events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Clean up old sync logs (housekeeping)
   */
  async cleanupOldSyncLogs(olderThanDays = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    return await this.prisma.cRMSyncLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });
  }
}
export default CRMRepository;