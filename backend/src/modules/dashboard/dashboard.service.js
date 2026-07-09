export class DashboardService {
  constructor(dashboardRepository) {
    this.repo = dashboardRepository;
  }

  async getExecutiveDashboard(organizationId) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [leadMetrics, visitMetrics, targetMetrics, attendanceMetrics] = await Promise.all([
      this.repo.getLeadMetrics(organizationId),
      this.repo.getVisitMetrics(organizationId, null, firstDayOfMonth, now),
      this.repo.getTargetMetrics(organizationId),
      this.repo.getAttendanceMetrics(organizationId, now),
    ]);

    return {
      leadPipeline: this._formatGroupBy(leadMetrics, 'status'),
      visitSummary: this._formatGroupBy(visitMetrics, 'status'),
      targets: targetMetrics,
      attendanceToday: this._formatGroupBy(attendanceMetrics, 'status'),
    };
  }

  async getUserDashboard(organizationId, userId) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [leadMetrics, visitMetrics, targetMetrics] = await Promise.all([
      this.repo.getLeadMetrics(organizationId, userId),
      this.repo.getVisitMetrics(organizationId, userId, firstDayOfMonth, now),
      this.repo.getTargetMetrics(organizationId, userId),
    ]);

    return {
      myLeads: this._formatGroupBy(leadMetrics, 'status'),
      myVisits: this._formatGroupBy(visitMetrics, 'status'),
      myTargets: targetMetrics,
    };
  }

  _formatGroupBy(data, key) {
    const result = {};
    for (const row of data) {
      result[row[key]] = row._count.id;
    }
    return result;
  }

  async refreshCache(organizationId, dashboardType) {
    // In a real application, this would invalidate the Redis cache for the given dashboard type
    // and re-aggregate data in the background. For this mock, it simply logs.
    return { success: true, organizationId, dashboardType };
  }
}
