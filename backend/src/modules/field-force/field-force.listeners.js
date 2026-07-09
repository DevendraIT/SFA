import EventBus from '../workflow-automation/events/EventBus.js';
import { WORKFLOW_EVENTS } from '../workflow-automation/constants/workflow.events.js';
import { FieldForceRepository } from './field-force.repository.js';
import { FieldForceService } from './field-force.service.js';
import  logger from '../../utils/logger.js';

const repo = new FieldForceRepository();
const service = new FieldForceService(repo);

export function registerFieldForceListeners() {
  EventBus.on('WORKFLOW_CREATE_TASK', async (payload) => {
    try {
      const { organizationId, assignedToId, title, dueInDays, entityType, entityId } = payload;
      if (!assignedToId) return;

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + (dueInDays || 1));

      await service.createTask(organizationId, assignedToId, {
        title,
        description: `Auto-generated task for ${entityType}`,
        dueDate: dueDate.toISOString(),
        referenceType: entityType,
        referenceId: entityId,
      });

      logger.info(`[field-force] Auto-created task for user ${assignedToId}`);
    } catch (err) {
      logger.error(`[field-force] Error auto-creating task: ${err.message}`);
    }
  });

  EventBus.on(WORKFLOW_EVENTS.LEAD_ASSIGNED, async (payload) => {
    try {
      const { organizationId, assignedToId, leadId } = payload;
      if (!assignedToId) return;

      // Automatically create a follow-up Visit when a lead is assigned
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      await service.planVisit(organizationId, assignedToId, {
        leadId,
        title: 'Initial Follow-up Visit',
        type: 'FOLLOW_UP',
        scheduledAt: tomorrow.toISOString(),
      });

      logger.info(`[field-force] Auto-created initial visit for lead ${leadId}`);
    } catch (err) {
      logger.error(`[field-force] Error auto-creating visit: ${err.message}`);
    }
  });
}
