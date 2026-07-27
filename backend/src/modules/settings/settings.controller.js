import { successResponse } from '../../shared/response.js';

/**
 * SettingsController
 *
 * HTTP endpoints for automation configuration:
 *   - Workflow Settings
 *   - Notification Preferences
 *   - Business Rules
 */
export class SettingsController {
  constructor(settingsService) {
    this.service = settingsService;
  }

  // ─── Workflow Settings ────────────────────────────────────────────

  getWorkflowSettings = async (req, res, next) => {
    try {
      const result = await this.service.getWorkflowSettings(req.user.organizationId);
      return successResponse(res, result, 'Workflow settings retrieved.');
    } catch (err) {
      next(err);
    }
  };

  updateWorkflowSettings = async (req, res, next) => {
    try {
      const result = await this.service.updateWorkflowSettings(req.user.organizationId, req.body);
      return successResponse(res, result, 'Workflow settings updated.');
    } catch (err) {
      next(err);
    }
  };

  // ─── Notification Preferences ─────────────────────────────────────

  getNotificationPreference = async (req, res, next) => {
    try {
      const result = await this.service.getNotificationPreference(req.user.organizationId, req.user.id);
      return successResponse(res, result, 'Notification preferences retrieved.');
    } catch (err) {
      next(err);
    }
  };

  updateNotificationPreference = async (req, res, next) => {
    try {
      const result = await this.service.updateNotificationPreference(req.user.organizationId, req.user.id, req.body);
      return successResponse(res, result, 'Notification preferences updated.');
    } catch (err) {
      next(err);
    }
  };

  // ─── Business Rules ───────────────────────────────────────────────

  listBusinessRules = async (req, res, next) => {
    try {
      const result = await this.service.listBusinessRules(req.user.organizationId);
      return successResponse(res, result, 'Business rules retrieved.');
    } catch (err) {
      next(err);
    }
  };

  setBusinessRule = async (req, res, next) => {
    try {
      const { ruleKey, ruleValue, description } = req.body;
      const result = await this.service.setBusinessRule(req.user.organizationId, ruleKey, ruleValue, description);
      return successResponse(res, result, 'Business rule saved.');
    } catch (err) {
      next(err);
    }
  };

  deleteBusinessRule = async (req, res, next) => {
    try {
      await this.service.deleteBusinessRule(req.user.organizationId, req.params.ruleKey);
      return successResponse(res, null, 'Business rule deleted.');
    } catch (err) {
      next(err);
    }
  };
}
