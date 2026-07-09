import EventBus from '../events/EventBus.js';
import { RuleEngine } from '../rules/RuleEngine.js';
import { AssignmentEngine } from '../assignment/AssignmentEngine.js';
import { WorkflowRuleRepository, WorkflowExecutionRepository } from '../repositories/WorkflowRepository.js';
import logger from '../../../utils/logger.js';
import prisma from '../../../config/database.js';

/**
 * WorkflowEngine
 *
 * The central orchestrator. It:
 *  1. Subscribes to ALL business events on the EventBus.
 *  2. Looks up active WorkflowRules for each event.
 *  3. Evaluates conditions via RuleEngine.
 *  4. Dispatches actions and records the execution history.
 *
 * Adding support for a new event requires no code change here —
 * just register a new WorkflowRule via the API.
 */
export class WorkflowEngine {
  constructor() {
    this.ruleRepo      = new WorkflowRuleRepository();
    this.executionRepo = new WorkflowExecutionRepository();
    this.ruleEngine    = new RuleEngine();
    this.assignment    = new AssignmentEngine();

    // Action handlers map — each handler receives (config, payload)
    this.actionHandlers = {
      ASSIGN_USER:        (cfg, payload) => this._handleAssignUser(cfg, payload),
      ASSIGN_ROLE:        (cfg, payload) => this._handleAssignRole(cfg, payload),
      SEND_NOTIFICATION:  (cfg, payload) => this._handleSendNotification(cfg, payload),
      CREATE_TASK:        (cfg, payload) => this._handleCreateTask(cfg, payload),
      UPDATE_FIELD:       (cfg, payload) => this._handleUpdateField(cfg, payload),
      TRIGGER_APPROVAL:   (cfg, payload) => this._handleTriggerApproval(cfg, payload),
      EMIT_EVENT:         (cfg, payload) => this._handleEmitEvent(cfg, payload),
      WEBHOOK:            (cfg, payload) => this._handleWebhook(cfg, payload),
      GENERATE_DAR:       (cfg, payload) => this._handleGenerateDar(cfg, payload),
      UPDATE_DASHBOARD:   (cfg, payload) => this._handleUpdateDashboard(cfg, payload),
      UPDATE_PERFORMANCE: (cfg, payload) => this._handleUpdatePerformance(cfg, payload),
      ESCALATE:           (cfg, payload) => this._handleEscalate(cfg, payload),
    };
  }

  /**
   * Bootstrap: subscribe to every event on the EventBus.
   * All events are processed by the same handler.
   */
  start() {
    // Subscribe to all events generically using wildcard approach
    this._subscribeToAllEvents();

    logger.info('[WorkflowEngine] Started and listening for business events.');
  }

  /**
   * Subscribe the engine to a list of known workflow events.
   * When a new event type is added to WORKFLOW_EVENTS, it auto-registers.
   */
  _subscribeToAllEvents() {
    // We use a single proxy listener on the EventBus
    // by overriding emit to intercept all emitted events.
    const originalEmit = EventBus.emit.bind(EventBus);

    EventBus.emit = (eventName, payload) => {
      // Let the original emit propagate first
      const result = originalEmit(eventName, payload);

      // Then process asynchronously through the workflow engine
      if (eventName !== 'newListener' && eventName !== 'removeListener') {
        setImmediate(() => this._processEvent(eventName, payload));
      }

      return result;
    };
  }

  /** Core event processing: find rules → evaluate → dispatch. */
  async _processEvent(eventName, payload = {}) {
    if (!payload?.organizationId) return;

    try {
      const rules = await this.ruleRepo.findActiveByEvent(payload.organizationId, eventName);
      if (rules.length === 0) return;

      for (const rule of rules) {
        await this._executeRule(rule, eventName, payload);
      }
    } catch (err) {
      logger.error(`[WorkflowEngine] Error processing event "${eventName}": ${err.message}`);
    }
  }

  /** Execute a single rule: evaluate conditions → dispatch actions → record execution. */
  async _executeRule(rule, eventName, payload) {
    const conditionsMet = this.ruleEngine.evaluate(rule.conditions, payload);
    if (!conditionsMet) return;

    // Create execution record
    const execution = await this.executionRepo.create({
      organizationId:   payload.organizationId,
      ruleId:           rule.id,
      triggeredByEvent: eventName,
      payload,
      status:           'RUNNING',
    });

    await this.executionRepo.appendLog(execution.id, 'INFO', `Rule "${rule.name}" triggered by event "${eventName}".`);

    try {
      const actionResults = await this.ruleEngine.dispatchActions(
        rule.actions,
        { ...payload, executionId: execution.id },
        this.actionHandlers
      );

      await this.executionRepo.update(execution.id, {
        status:      'COMPLETED',
        completedAt: new Date(),
      });

      await this.executionRepo.appendLog(execution.id, 'INFO', 'All actions executed.', { actionResults });
    } catch (err) {
      await this.executionRepo.update(execution.id, {
        status:       'FAILED',
        errorMessage: err.message,
        completedAt:  new Date(),
      });

      await this.executionRepo.appendLog(execution.id, 'ERROR', `Rule execution failed: ${err.message}`);
      logger.error(`[WorkflowEngine] Rule "${rule.name}" failed: ${err.message}`);
    }
  }

  // ─── Action Handlers ─────────────────────────────────────────────

  async _handleAssignUser(config, payload) {
    const userId = await this.assignment.resolve(config, payload);
    if (!userId) return { skipped: true, reason: 'No user resolved' };

    // Emit an assignment event so existing modules handle their own update
    EventBus.emit('WORKFLOW_ASSIGN_USER', {
      organizationId: payload.organizationId,
      entityType:     config.entityType,
      entityId:       payload.entityId || payload.leadId || payload.orderId,
      assignedToId:   userId,
    });

    return { assignedToId: userId };
  }

  async _handleAssignRole(config, payload) {
    // Resolve by role then delegate to ASSIGN_USER logic
    return this._handleAssignUser({ ...config, strategy: 'DIRECT_ROLE' }, payload);
  }

  async _handleSendNotification(config, payload) {
    // Delegate to notification module via EventBus — no duplication
    EventBus.emit('WORKFLOW_SEND_NOTIFICATION', {
      organizationId: payload.organizationId,
      recipientId:    config.userId,
      recipientRole:  config.roleId,
      channel:        config.channel || 'IN_APP',
      title:          config.title   || 'Workflow Notification',
      message:        this._interpolate(config.message || '', payload),
      metadata:       payload,
    });

    return { notificationQueued: true };
  }

  async _handleCreateTask(config, payload) {
    // Create a generic task record — modules listening can persist this
    EventBus.emit('WORKFLOW_CREATE_TASK', {
      organizationId: payload.organizationId,
      entityType:     config.entityType,
      entityId:       payload.entityId || payload.leadId || payload.orderId,
      title:          this._interpolate(config.title || 'Follow-up Task', payload),
      dueInDays:      config.dueInDays || 1,
      assignedToId:   config.userId,
    });

    return { taskCreated: true };
  }

  async _handleUpdateField(config, payload) {
    // Instruct the owning module to update a field via EventBus
    EventBus.emit('WORKFLOW_UPDATE_FIELD', {
      organizationId: payload.organizationId,
      entityType:     config.entityType,
      entityId:       payload.entityId || payload.leadId || payload.orderId,
      field:          config.field,
      value:          config.value,
    });

    return { fieldUpdated: true };
  }

  async _handleTriggerApproval(config, payload) {
    EventBus.emit('WORKFLOW_TRIGGER_APPROVAL', {
      organizationId: payload.organizationId,
      entityType:     config.entityType,
      entityId:       payload.entityId || payload.orderId,
      requestedById:  payload.userId,
    });

    return { approvalTriggered: true };
  }

  async _handleEmitEvent(config, payload) {
    if (!config.eventName) return { skipped: true };

    EventBus.emit(config.eventName, {
      ...payload,
      ...(config.payload || {}),
    });

    return { emitted: config.eventName };
  }

  async _handleWebhook(config, payload) {
    if (!config.url) return { skipped: true, reason: 'No URL configured' };

    try {
      const { default: axios } = await import('axios');
      await axios.post(config.url, payload, {
        headers: { 'Content-Type': 'application/json', ...(config.headers || {}) },
        timeout: 5000,
      });
      return { webhookCalled: true };
    } catch (err) {
      throw new Error(`Webhook to ${config.url} failed: ${err.message}`);
    }
  }

  // ─── Template Interpolation ───────────────────────────────────────

  /** Replace {{field}} placeholders in a string with payload values. */
  _interpolate(template, payload) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => payload[key] ?? `{{${key}}}`);
  }

  // ─── Phase 2 Action Handlers ───────────────────────────────────────

  async _handleGenerateDar(config, payload) {
    // We emit an event, or call the FieldForceService directly if injected.
    // Sticking to EDA as requested by the prompt (Workflow engine coordinates via events)
    EventBus.emit('WORKFLOW_GENERATE_DAR', {
      organizationId: payload.organizationId,
      userId: payload.userId,
      summary: config.summary || 'Auto-generated Daily Activity Report'
    });
    return { darGenerated: true };
  }

  async _handleUpdateDashboard(config, payload) {
    // Notify dashboard service to invalidate or re-aggregate caches
    EventBus.emit('WORKFLOW_UPDATE_DASHBOARD', {
      organizationId: payload.organizationId,
      dashboardType: config.dashboardType || 'ALL'
    });
    return { dashboardUpdated: true };
  }

  async _handleUpdatePerformance(config, payload) {
    // Trigger Target & Performance check
    EventBus.emit('WORKFLOW_UPDATE_PERFORMANCE', {
      organizationId: payload.organizationId,
      userId: payload.userId,
      metric: config.metric,
      value: config.value || 1
    });
    return { performanceUpdated: true };
  }

  async _handleEscalate(config, payload) {
    // Use the team service to find manager and notify
    const managerId = await this.assignment.teamService.resolveManager(payload.userId);
    if (!managerId) return { skipped: true, reason: 'No manager found for escalation' };

    return this._handleSendNotification({
      userId: managerId,
      title: config.title || 'Escalation Alert',
      message: this._interpolate(config.message || 'Escalation required for {{entityId}}', payload),
      channel: config.channel || 'EMAIL'
    }, payload);
  }
}
