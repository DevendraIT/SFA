export class TargetPerformanceService {
  constructor(targetPerformanceRepository) {
    this.repo = targetPerformanceRepository;
  }

  async getTargets(organizationId, query) {
    const targets = await this.repo.getTargets(organizationId, query);
    // Dynamically calculate achievement %
    return targets.map(t => {
      const achievementPercent = t.targetValue > 0 ? (t.achievedValue / t.targetValue) * 100 : 0;
      return {
        ...t,
        achievementPercent: Math.min(100, Math.round(achievementPercent * 100) / 100),
        performanceScore: this.calculatePerformanceScore(t)
      };
    });
  }

  async createTarget(organizationId, data) {
    return this.repo.createTarget(organizationId, data);
  }

  async planTargets(organizationId, data) {
    if (Array.isArray(data.targets)) {
      return Promise.all(data.targets.map(t => this.repo.createTarget(organizationId, t)));
    }
    return this.repo.createTarget(organizationId, data);
  }

  async getLeaderboard(organizationId, metric) {
    const leaders = await this.repo.getLeaderboard(organizationId, metric);
    return leaders.map(l => ({
      ...l,
      achievementPercent: l.targetValue > 0 ? Math.min(100, Math.round((l.achievedValue / l.targetValue) * 10000) / 100) : 0
    }));
  }

  async recordAchievement(organizationId, userId, metric, value = 1) {
    await this.repo.incrementTargetAchievement(organizationId, userId, metric, value);
  }

  calculatePerformanceScore(target) {
    // Basic performance score based on how close to target deadline vs achievement
    if (!target.startDate || !target.endDate) return 0;
    const now = new Date();
    const totalDuration = new Date(target.endDate) - new Date(target.startDate);
    const elapsed = now - new Date(target.startDate);
    const timeRatio = elapsed / totalDuration;
    const achievementRatio = target.targetValue > 0 ? (target.achievedValue / target.targetValue) : 0;
    
    // If they achieved 50% in 10% of the time, they are performing well.
    if (timeRatio <= 0) return 100; // Just started
    const score = (achievementRatio / timeRatio) * 100;
    return Math.min(100, Math.round(score * 100) / 100);
  }
}
