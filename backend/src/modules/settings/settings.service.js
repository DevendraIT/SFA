import { AppError } from '../../shared/response.js';

/**
 * SettingsService
 *
 * Business logic for managing automation-critical settings:
 *   - Workflow configuration (auto-assign, require approval, approval hierarchy)
 *   - Per-user notification preferences (email, SMS, in-app)
 *   - Organisation-level business rule key/value pairs
 */
export class SettingsService {
  constructor(settingsRepository) {
    this.repo = settingsRepository;
  }

  // ─── Workflow Settings ────────────────────────────────────────────

  async getWorkflowSettings(organizationId) {
    const settings = await this.repo.getWorkflowSettings(organizationId);
    // Return safe defaults if not yet configured
    return settings ?? {
      autoAssign: true,
      requireApproval: true,
      approvalHierarchy: null,
    };
  }

  async updateWorkflowSettings(organizationId, data) {
    return this.repo.upsertWorkflowSettings(organizationId, data);
  }

  // ─── Notification Preferences ─────────────────────────────────────

  async getNotificationPreference(organizationId, userId) {
    const prefs = await this.repo.getNotificationPreference(organizationId, userId);
    return prefs ?? { emailEnabled: true, smsEnabled: false, inAppEnabled: true };
  }

  async updateNotificationPreference(organizationId, userId, data) {
    return this.repo.upsertNotificationPreference(organizationId, userId, data);
  }

  // ─── Business Rules ───────────────────────────────────────────────

  async listBusinessRules(organizationId) {
    return this.repo.listBusinessRules(organizationId);
  }

  async setBusinessRule(organizationId, ruleKey, ruleValue, description) {
    if (!ruleKey || ruleValue === undefined) {
      throw AppError.badRequest('ruleKey and ruleValue are required.');
    }
    return this.repo.upsertBusinessRule(organizationId, ruleKey, String(ruleValue), description);
  }

  async deleteBusinessRule(organizationId, ruleKey) {
    const existing = await this.repo.getBusinessRule(organizationId, ruleKey);
    if (!existing) throw AppError.notFound(`Business rule "${ruleKey}" not found.`);
    return this.repo.deleteBusinessRule(organizationId, ruleKey);
  }
}
