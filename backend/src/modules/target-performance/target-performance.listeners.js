import EventBus from '../workflow-automation/events/EventBus.js';
import { WORKFLOW_EVENTS } from '../workflow-automation/constants/workflow.events.js';
import { targetPerformanceService } from './target-performance.routes.js';
import logger from '../../utils/logger.js';

export function registerTargetListeners() {
  EventBus.on(WORKFLOW_EVENTS.VISIT_COMPLETED, async (payload) => {
    try {
      const { organizationId, userId } = payload;
      await targetPerformanceService.recordAchievement(organizationId, userId, 'VISITS', 1);
      logger.info(`[target-performance] Incremented VISITS target for user ${userId}`);
    } catch (err) {
      logger.error(`[target-performance] Failed to increment VISITS target: ${err.message}`);
    }
  });

  EventBus.on(WORKFLOW_EVENTS.LEAD_CREATED, async (payload) => {
    try {
      const { organizationId, userId } = payload;
      await targetPerformanceService.recordAchievement(organizationId, userId, 'NEW_LEADS', 1);
      logger.info(`[target-performance] Incremented NEW_LEADS target for user ${userId}`);
    } catch (err) {
      logger.error(`[target-performance] Failed to increment NEW_LEADS target: ${err.message}`);
    }
  });

  EventBus.on(WORKFLOW_EVENTS.SALES_ORDER_APPROVED, async (payload) => {
    try {
      const { organizationId, userId, amount } = payload;
      if (amount) {
        await targetPerformanceService.recordAchievement(organizationId, userId, 'REVENUE', amount);
        logger.info(`[target-performance] Incremented REVENUE target for user ${userId} by ${amount}`);
      }
    } catch (err) {
      logger.error(`[target-performance] Failed to increment REVENUE target: ${err.message}`);
    }
  });

  EventBus.on(WORKFLOW_EVENTS.ATTENDANCE_CHECKED_IN, async (payload) => {
    try {
      const { organizationId, userId } = payload;
      await targetPerformanceService.recordAchievement(organizationId, userId, 'ATTENDANCE', 1);
      logger.info(`[target-performance] Incremented ATTENDANCE target for user ${userId}`);
    } catch (err) {
      logger.error(`[target-performance] Failed to increment ATTENDANCE target: ${err.message}`);
    }
  });

  // Since we haven't strictly defined DAR_GENERATED yet, let's assume it or we can hook to ATTENDANCE_CHECKED_OUT which generates the DAR
  EventBus.on(WORKFLOW_EVENTS.ATTENDANCE_CHECKED_OUT, async (payload) => {
    try {
      const { organizationId, userId } = payload;
      await targetPerformanceService.recordAchievement(organizationId, userId, 'DAR', 1);
      logger.info(`[target-performance] Incremented DAR target for user ${userId}`);
    } catch (err) {
      logger.error(`[target-performance] Failed to increment DAR target: ${err.message}`);
    }
  });

  EventBus.on(WORKFLOW_EVENTS.TASK_COMPLETED, async (payload) => {
    try {
      const { organizationId, userId } = payload;
      await targetPerformanceService.recordAchievement(organizationId, userId, 'ACTIVITIES', 1);
      logger.info(`[target-performance] Incremented ACTIVITIES target for user ${userId}`);
    } catch (err) {
      logger.error(`[target-performance] Failed to increment ACTIVITIES target: ${err.message}`);
    }
  });
}
