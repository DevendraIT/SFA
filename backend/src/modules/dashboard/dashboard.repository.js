import { prisma } from '../../config/database.js';

export class DashboardRepository {
  async getLeadMetrics(organizationId, userId = null, territoryId = null) {
    const where = { organizationId };
    if (userId) where.assignedToId = userId;
    if (territoryId) where.territoryId = territoryId;

    return prisma.lead.groupBy({
      by: ['status'],
      where,
      _count: { id: true },
    });
  }

  async getVisitMetrics(organizationId, userId = null, startDate, endDate) {
    const where = { organizationId };
    if (userId) where.userId = userId;
    if (startDate && endDate) {
      where.scheduledAt = { gte: startDate, lte: endDate };
    }

    return prisma.visit.groupBy({
      by: ['status'],
      where,
      _count: { id: true },
    });
  }

  async getTargetMetrics(organizationId, userId = null) {
    const where = { organizationId, status: 'ACTIVE' };
    if (userId) where.userId = userId;

    return prisma.target.findMany({
      where,
      select: {
        metric: true,
        targetValue: true,
        achievedValue: true,
      },
    });
  }

  async getAttendanceMetrics(organizationId, date) {
    return prisma.attendance.groupBy({
      by: ['status'],
      where: {
        organizationId,
        date: { gte: new Date(date.setHours(0,0,0,0)), lte: new Date(date.setHours(23,59,59,999)) },
      },
      _count: { id: true },
    });
  }
}
