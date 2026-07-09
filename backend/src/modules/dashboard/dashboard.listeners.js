import EventBus from '../workflow-automation/events/EventBus.js';
import logger from '../../utils/logger.js';
import { DashboardService } from './dashboard.service.js';
import { DashboardRepository } from './dashboard.repository.js';

export const dashboardService = new DashboardService(new DashboardRepository());

export function registerDashboardListeners() {
  EventBus.on('WORKFLOW_UPDATE_DASHBOARD', async (payload) => {
    try {
      const { organizationId, dashboardType } = payload;
      
      // In a real application, this might invalidate a Redis cache key
      // or trigger an async re-aggregation task.
      logger.info(`[dashboard] Refreshing dashboard cache for org ${organizationId}, type ${dashboardType}`);
      
      // Warmup cache / re-aggregate
      if (dashboardService.refreshCache) {
        await dashboardService.refreshCache(organizationId, dashboardType);
      }
      
    } catch (err) {
      logger.error(`[dashboard] Failed to refresh dashboard: ${err.message}`);
    }
  });
}
