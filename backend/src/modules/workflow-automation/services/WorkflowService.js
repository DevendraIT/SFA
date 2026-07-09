import { AppError } from '../../../shared/response.js';
import EventBus from '../events/EventBus.js';

/**
 * WorkflowService
 *
 * Business logic for managing WorkflowRules and Executions.
 * Controllers talk to this; this talks to repositories.
 */
export class WorkflowService {
  constructor(ruleRepo, executionRepo) {
    this.ruleRepo      = ruleRepo;
    this.executionRepo = executionRepo;
  }

  // ── Rules ─────────────────────────────────────────────────────────

  async createRule(organizationId, data) {
    return this.ruleRepo.create({ organizationId, ...data });
  }

  async getRules(organizationId, query) {
    return this.ruleRepo.list(organizationId, query);
  }

  async getRule(id, organizationId) {
    const rule = await this.ruleRepo.findById(id, organizationId);
    if (!rule) throw AppError.notFound('Workflow rule not found.');
    return rule;
  }

  async updateRule(id, organizationId, data) {
    await this.getRule(id, organizationId); // ensure exists
    return this.ruleRepo.update(id, data);
  }

  async deleteRule(id, organizationId) {
    await this.getRule(id, organizationId); // ensure exists
    await this.ruleRepo.delete(id, organizationId);
  }

  async toggleRule(id, organizationId) {
    const rule = await this.getRule(id, organizationId);
    return this.ruleRepo.update(id, { isActive: !rule.isActive });
  }

  // ── Executions ────────────────────────────────────────────────────

  async getExecutions(organizationId, query) {
    return this.executionRepo.list(organizationId, query);
  }

  async getExecution(id, organizationId) {
    const exec = await this.executionRepo.findById(id, organizationId);
    if (!exec) throw AppError.notFound('Workflow execution not found.');
    return exec;
  }

  async getLogs(executionId, organizationId) {
    await this.getExecution(executionId, organizationId); // ownership check
    return this.executionRepo.getLogs(executionId);
  }

  /**
   * Retry a failed execution by re-emitting the original event.
   * The WorkflowEngine will re-pick-up the rule and re-run it.
   */
  async retryExecution(id, organizationId) {
    const exec = await this.getExecution(id, organizationId);

    if (exec.status !== 'FAILED') {
      throw AppError.badRequest('Only FAILED executions can be retried.');
    }

    // Increment retry counter
    await this.executionRepo.update(id, { retryCount: exec.retryCount + 1 });

    // Re-emit the original event so WorkflowEngine reprocesses it
    EventBus.emit(exec.triggeredByEvent, exec.payload);

    return { retrying: true, eventName: exec.triggeredByEvent };
  }

  // ── Manual Trigger ────────────────────────────────────────────────

  async manualTrigger(organizationId, { eventName, payload }) {
    EventBus.emit(eventName, { organizationId, ...payload });
    return { triggered: true, eventName };
  }
}
