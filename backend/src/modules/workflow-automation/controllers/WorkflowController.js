import {
  successResponse,
  createdResponse,
  deletedResponse,
  paginatedResponse,
} from '../../../shared/response.js';

/**
 * WorkflowController
 *
 * Handles HTTP for WorkflowRules, Executions, Logs, and Manual Triggers.
 * No business logic here — delegates entirely to WorkflowService.
 */
export class WorkflowController {
  constructor(workflowService) {
    this.service = workflowService;
  }

  // ── Rules ─────────────────────────────────────────────────────────

  createRule = async (req, res, next) => {
    try {
      const rule = await this.service.createRule(req.user.organizationId, req.body);
      return createdResponse(res, 'Workflow rule created.', rule);
    } catch (e) { next(e); }
  };

  getRules = async (req, res, next) => {
    try {
      const { data, total, page, limit } = await this.service.getRules(req.user.organizationId, req.query);
      return paginatedResponse(res, 'Workflow rules retrieved.', data, { total, page, limit });
    } catch (e) { next(e); }
  };

  getRule = async (req, res, next) => {
    try {
      const rule = await this.service.getRule(req.params.id, req.user.organizationId);
      return successResponse(res, 'Workflow rule retrieved.', rule);
    } catch (e) { next(e); }
  };

  updateRule = async (req, res, next) => {
    try {
      const rule = await this.service.updateRule(req.params.id, req.user.organizationId, req.body);
      return successResponse(res, 'Workflow rule updated.', rule);
    } catch (e) { next(e); }
  };

  deleteRule = async (req, res, next) => {
    try {
      await this.service.deleteRule(req.params.id, req.user.organizationId);
      return deletedResponse(res, 'Workflow rule deleted.');
    } catch (e) { next(e); }
  };

  toggleRule = async (req, res, next) => {
    try {
      const rule = await this.service.toggleRule(req.params.id, req.user.organizationId);
      return successResponse(res, `Rule ${rule.isActive ? 'activated' : 'deactivated'}.`, rule);
    } catch (e) { next(e); }
  };

  // ── Executions ────────────────────────────────────────────────────

  getExecutions = async (req, res, next) => {
    try {
      const { data, total, page, limit } = await this.service.getExecutions(req.user.organizationId, req.query);
      return paginatedResponse(res, 'Executions retrieved.', data, { total, page, limit });
    } catch (e) { next(e); }
  };

  getExecution = async (req, res, next) => {
    try {
      const exec = await this.service.getExecution(req.params.id, req.user.organizationId);
      return successResponse(res, 'Execution retrieved.', exec);
    } catch (e) { next(e); }
  };

  getLogs = async (req, res, next) => {
    try {
      const logs = await this.service.getLogs(req.params.id, req.user.organizationId);
      return successResponse(res, 'Execution logs retrieved.', logs);
    } catch (e) { next(e); }
  };

  retryExecution = async (req, res, next) => {
    try {
      const result = await this.service.retryExecution(req.params.id, req.user.organizationId);
      return successResponse(res, 'Execution retry initiated.', result);
    } catch (e) { next(e); }
  };

  // ── Manual Trigger ────────────────────────────────────────────────

  manualTrigger = async (req, res, next) => {
    try {
      const result = await this.service.manualTrigger(req.user.organizationId, req.body);
      return successResponse(res, 'Workflow event triggered.', result);
    } catch (e) { next(e); }
  };
}
