export class DashboardService {
  constructor(dashboardRepository) {
    this.repo = dashboardRepository;
  }

  async getExecutiveDashboard(organizationId) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [visitMetrics, targetMetrics, attendanceMetrics, orderMetrics, taskMetrics, todayTaskCount] = await Promise.all([
      this.repo.getVisitMetrics(organizationId, null, firstDayOfMonth, now),
      this.repo.getTargetMetrics(organizationId),
      this.repo.getAttendanceMetrics(organizationId, now),
      this.repo.getOrderMetrics(organizationId, null, firstDayOfMonth, now),
      this.repo.getTaskMetrics(organizationId),
      this.repo.getTodayTaskCount(organizationId),
    ]);

    return {
      visitSummary: this._formatGroupBy(visitMetrics, 'status'),
      targets: targetMetrics,
      attendanceToday: this._formatGroupBy(attendanceMetrics, 'status'),
      orders: this._formatOrderGroupBy(orderMetrics, 'status'),
      tasks: this._formatTaskSummary(taskMetrics, todayTaskCount),
    };
  }

  async getTeamDashboard(organizationId, managerId) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [visitMetrics, targetMetrics, orderMetrics, taskMetrics, todayTaskCount] = await Promise.all([
      this.repo.getVisitMetrics(organizationId, null, firstDayOfMonth, now),
      this.repo.getTargetMetrics(organizationId),
      this.repo.getOrderMetrics(organizationId, null, firstDayOfMonth, now),
      this.repo.getTaskMetrics(organizationId, null, managerId),
      this.repo.getTodayTaskCount(organizationId, null, managerId),
    ]);

    return {
      teamVisits: this._formatGroupBy(visitMetrics, 'status'),
      teamTargets: targetMetrics,
      teamOrders: this._formatOrderGroupBy(orderMetrics, 'status'),
      teamTasks: this._formatTaskSummary(taskMetrics, todayTaskCount),
    };
  }

  async getUserDashboard(organizationId, userId) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [visitMetrics, targetMetrics, orderMetrics, taskMetrics, todayTaskCount] = await Promise.all([
      this.repo.getVisitMetrics(organizationId, userId, firstDayOfMonth, now),
      this.repo.getTargetMetrics(organizationId, userId),
      this.repo.getOrderMetrics(organizationId, userId, firstDayOfMonth, now),
      this.repo.getTaskMetrics(organizationId, userId),
      this.repo.getTodayTaskCount(organizationId, userId),
    ]);

    return {
      myVisits: this._formatGroupBy(visitMetrics, 'status'),
      myTargets: targetMetrics,
      myOrders: this._formatOrderGroupBy(orderMetrics, 'status'),
      myTasks: this._formatTaskSummary(taskMetrics, todayTaskCount),
    };
  }

  _formatTaskSummary(data, todayCount) {
    const summary = {
      assigned: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      todaysTasks: todayCount || 0,
      byStatus: {}
    };

    for (const row of data) {
      const status = row.status;
      const count = row._count.id;
      summary.byStatus[status] = count;
      summary.assigned += count;

      if (status === 'PENDING' || status === 'ASSIGNED' || status === 'ACCEPTED') {
        summary.pending += count;
      } else if (status === 'IN_PROGRESS' || status === 'NAVIGATING' || status === 'ARRIVED' || status === 'CHECKED_IN' || status === 'DELIVERY_IN_PROGRESS' || status === 'PAYMENT_COLLECTED' || status === 'PHOTO_UPLOADED' || status === 'VISIT_NOTES_COMPLETED') {
        summary.inProgress += count;
      } else if (status === 'COMPLETED' || status === 'CHECKED_OUT') {
        summary.completed += count;
      }
    }

    return summary;
  }

  _formatGroupBy(data, key) {
    const result = {};
    for (const row of data) {
      result[row[key]] = row._count.id;
    }
    return result;
  }

  _formatOrderGroupBy(data, key) {
    const result = {};
    for (const row of data) {
      result[row[key]] = {
        count: row._count.id,
        revenue: row._sum.totalAmount || 0,
      };
    }
    return result;
  }

  async refreshCache(organizationId, dashboardType) {
    // In a real application, this would invalidate the Redis cache for the given dashboard type
    // and re-aggregate data in the background. For this mock, it simply logs.
    return { success: true, organizationId, dashboardType };
  }
}
