import prisma from '../../config/database.js';

export class FieldForceRepository {
  async checkIn(organizationId, userId, data) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return prisma.attendance.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        checkInAt: new Date(),
        checkInLoc: data.location,
        status: 'PRESENT',
      },
      create: {
        organizationId,
        userId,
        date: today,
        checkInAt: new Date(),
        checkInLoc: data.location,
        status: 'PRESENT',
      },
    });
  }

  async checkOut(organizationId, userId, data) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return prisma.attendance.update({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      data: {
        checkOutAt: new Date(),
        checkOutLoc: data.location,
      },
    });
  }

  async createVisit(organizationId, userId, data) {
    return prisma.visit.create({
      data: {
        organizationId,
        userId,
        leadId: data.leadId,
        title: data.title,
        type: data.type,
        scheduledAt: new Date(data.scheduledAt),
        location: data.location,
        notes: data.notes,
      },
    });
  }

  async updateVisitStatus(visitId, organizationId, status, data = {}) {
    const updateData = { status };
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }
    if (data.notes) updateData.notes = data.notes;
    if (data.photoUrl) updateData.photoUrl = data.photoUrl;

    return prisma.visit.update({
      where: { id: visitId, organizationId },
      data: updateData,
    });
  }

  async createExpense(organizationId, userId, data) {
    return prisma.expense.create({
      data: {
        organizationId,
        userId,
        amount: data.amount,
        category: data.category,
        date: new Date(data.date),
        notes: data.notes,
        receiptUrl: data.receiptUrl,
      },
    });
  }

  async createDar(organizationId, userId, data) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return prisma.dailyActivityReport.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        totalVisits: data.totalVisits,
        totalOrders: data.totalOrders,
        summary: data.summary,
        status: data.status || 'DRAFT',
      },
      create: {
        organizationId,
        userId,
        date: today,
        totalVisits: data.totalVisits || 0,
        totalOrders: data.totalOrders || 0,
        summary: data.summary,
        status: data.status || 'DRAFT',
      },
    });
  }

  async createTask(organizationId, userId, data) {
    return prisma.task.create({
      data: {
        organizationId,
        userId,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        referenceType: data.referenceType,
        referenceId: data.referenceId,
      },
    });
  }

  async createBeatPlan(organizationId, userId, data) {
    return prisma.beatPlan.create({
      data: {
        organizationId,
        userId,
        title: data.title,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: 'DRAFT',
      },
    });
  }

  async updateBeatPlanStatus(beatPlanId, organizationId, status) {
    return prisma.beatPlan.update({
      where: { id: beatPlanId, organizationId },
      data: { status },
    });
  }

  async createCalendarEvent(organizationId, userId, data) {
    return prisma.calendarEvent.create({
      data: {
        organizationId,
        userId,
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        type: data.type,
      },
    });
  }
}
