import { prisma } from '../../config/database.js';

/**
 * SettingsRepository
 *
 * Data access for WorkflowSettings, NotificationPreference, and BusinessRuleConfig.
 * All automation-critical configuration lives here.
 */
export class SettingsRepository {

  // ─── Workflow Settings ────────────────────────────────────────────

  async getWorkflowSettings(organizationId) {
    return prisma.workflowSettings.findFirst({ where: { organizationId } });
  }

  async upsertWorkflowSettings(organizationId, data) {
    const existing = await this.getWorkflowSettings(organizationId);

    if (existing) {
      return prisma.workflowSettings.update({
        where: { id: existing.id },
        data,
      });
    }

    return prisma.workflowSettings.create({
      data: { organizationId, ...data },
    });
  }

  // ─── Notification Preferences ─────────────────────────────────────

  async getNotificationPreference(organizationId, userId) {
    return prisma.notificationPreference.findFirst({
      where: { organizationId, userId },
    });
  }

  async upsertNotificationPreference(organizationId, userId, data) {
    const existing = await this.getNotificationPreference(organizationId, userId);

    if (existing) {
      return prisma.notificationPreference.update({
        where: { id: existing.id },
        data,
      });
    }

    return prisma.notificationPreference.create({
      data: { organizationId, userId, ...data },
    });
  }

  // ─── Business Rules ───────────────────────────────────────────────

  async listBusinessRules(organizationId) {
    return prisma.businessRuleConfig.findMany({ where: { organizationId } });
  }

  async getBusinessRule(organizationId, ruleKey) {
    return prisma.businessRuleConfig.findUnique({
      where: { organizationId_ruleKey: { organizationId, ruleKey } },
    });
  }

  async upsertBusinessRule(organizationId, ruleKey, ruleValue, description) {
    return prisma.businessRuleConfig.upsert({
      where: { organizationId_ruleKey: { organizationId, ruleKey } },
      update: { ruleValue, description },
      create: { organizationId, ruleKey, ruleValue, description },
    });
  }

  async deleteBusinessRule(organizationId, ruleKey) {
    return prisma.businessRuleConfig.delete({
      where: { organizationId_ruleKey: { organizationId, ruleKey } },
    });
  }
}
