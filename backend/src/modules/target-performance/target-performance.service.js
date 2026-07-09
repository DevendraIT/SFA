import EventBus from '../workflow-automation/events/EventBus.js';
import { WORKFLOW_EVENTS } from '../workflow-automation/constants/workflow.events.js';

export class TargetPerformanceService {
  constructor(targetPerformanceRepository) {
    this.repo = targetPerformanceRepository;
  }

  async getTargets(organizationId, query) {
    return this.repo.getTargets(organizationId, query);
  }

  async createTarget(organizationId, data) {
    return this.repo.createTarget(organizationId, data);
  }

  async getLeaderboard(organizationId, metric) {
    return this.repo.getLeaderboard(organizationId, metric);
  }

  /**
   * Called by Event listeners to auto-increment KPIs.
   */
  async recordAchievement(organizationId, userId, metric, value = 1) {
    const updatedTargets = await this.repo.incrementTargetAchievement(organizationId, userId, metric, value);
    
    // Optionally check if target is met to trigger TARGET_ACHIEVED event
    if (updatedTargets && updatedTargets.length > 0) {
      for (const t of updatedTargets) {
        if (t.achievedValue >= t.targetValue && (t.achievedValue - value) < t.targetValue) {
          EventBus.emit(WORKFLOW_EVENTS.TARGET_ACHIEVED, {
            organizationId,
            userId,
            targetId: t.id,
            metric: t.metric,
          });
        }
      }
    }
  }
}
