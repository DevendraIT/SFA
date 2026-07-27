import { eventBus } from '../../utils/index.js';
import { logger } from '../../shared/index.js';
import { WorkflowService } from './workflow.service.js';
import { WORKFLOW_EVENTS } from '../../shared/constants/index.js';

const workflowService = new WorkflowService();

export function registerWorkflowListeners() {
  // Listen for generic SALES_ORDER_APPROVED event
  // Assume WORKFLOW_EVENTS.SALES_ORDER_APPROVED exists, if not we fall back to literal string
  const eventName = WORKFLOW_EVENTS?.SALES_ORDER_APPROVED || 'SALES_ORDER_APPROVED';

  eventBus.on(eventName, async (payload) => {
    try {
      logger.info(`[WorkflowListener] Received event: ${eventName}`);
      const { organizationId, orderId, approvedById } = payload;
      
      const taskData = {
        title: `Follow up on Order ${orderId}`,
        description: 'Automatically generated follow-up task for recently approved sales order.',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Due in 24 hours
        referenceType: 'Order',
        referenceId: orderId,
      };

      await workflowService.processEventDrivenTask(organizationId, taskData, approvedById);

    } catch (error) {
      logger.error(`[WorkflowListener] Error handling event ${eventName}: ${error.message}`);
    }
  });
}
