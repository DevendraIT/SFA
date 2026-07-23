import { prisma } from '../../config/database.js';

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
        title: data.title,
        type: data.type,
        scheduledAt: new Date(data.scheduledAt),
        location: data.location,
        notes: data.notes,
        customerId: data.customerId,
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

  // ===== GET/LIST METHODS (CRITICAL) =====

  async getAttendance(organizationId, userId, date) {
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    return prisma.attendance.findFirst({
      where: {
        organizationId,
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async listAttendance(organizationId, filters = {}) {
    const { userId, startDate, endDate, skip = 0, take = 20 } = filters;

    const where = { organizationId };
    if (userId) where.userId = userId;
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [attendance, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip,
        take,
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        orderBy: { date: 'desc' },
      }),
      prisma.attendance.count({ where }),
    ]);

    return { attendance, total };
  }

  async getVisit(visitId, organizationId) {
    return prisma.visit.findFirst({
      where: { id: visitId, organizationId },
      include: { user: true },
    });
  }

  async listVisits(organizationId, filters = {}) {
    const { userId, status, customerId, skip = 0, take = 20 } = filters;

    const where = { organizationId };
    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (customerId) where.customerId = customerId;

    const [visits, total] = await Promise.all([
      prisma.visit.findMany({
        where,
        skip,
        take,
        include: { user: true },
        orderBy: { scheduledAt: 'desc' },
      }),
      prisma.visit.count({ where }),
    ]);

    return { visits, total };
  }

  async getExpense(expenseId, organizationId) {
    return prisma.expense.findFirst({
      where: { id: expenseId, organizationId },
      include: { user: true, approvedBy: true },
    });
  }

  async listExpenses(organizationId, filters = {}) {
    const { userId, status, startDate, endDate, skip = 0, take = 20 } = filters;

    const where = { organizationId };
    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        skip,
        take,
        include: { user: true, approvedBy: true },
        orderBy: { date: 'desc' },
      }),
      prisma.expense.count({ where }),
    ]);

    return { expenses, total };
  }

  async updateExpenseStatus(expenseId, organizationId, status, approvedById = null) {
    const updateData = { status };
    if (approvedById) updateData.approvedById = approvedById;
    if (status === 'APPROVED') updateData.approvedAt = new Date();

    return prisma.expense.update({
      where: { id: expenseId, organizationId },
      data: updateData,
      include: { user: true, approvedBy: true },
    });
  }

  async getDailyActivityReport(darId, organizationId) {
    return prisma.dailyActivityReport.findFirst({
      where: { id: darId, organizationId },
      include: { user: true },
    });
  }

  async listDailyActivityReports(organizationId, filters = {}) {
    const { userId, status, startDate, endDate, skip = 0, take = 20 } = filters;

    const where = { organizationId };
    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [dars, total] = await Promise.all([
      prisma.dailyActivityReport.findMany({
        where,
        skip,
        take,
        include: { user: true },
        orderBy: { date: 'desc' },
      }),
      prisma.dailyActivityReport.count({ where }),
    ]);

    return { dars, total };
  }

  async updateDarStatus(darId, organizationId, status) {
    return prisma.dailyActivityReport.update({
      where: { id: darId, organizationId },
      data: { status },
      include: { user: true },
    });
  }

  async getTask(taskId, organizationId) {
    return prisma.task.findFirst({
      where: { id: taskId, organizationId },
      include: { user: true },
    });
  }

  async listTasks(organizationId, filters = {}) {
    const { userId, status, skip = 0, take = 20 } = filters;

    const where = { organizationId };
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take,
        include: { user: true },
        orderBy: { dueDate: 'asc' },
      }),
      prisma.task.count({ where }),
    ]);

    return { tasks, total };
  }

  async updateTaskStatus(taskId, organizationId, status) {
    const updateData = { status };
    if (status === 'COMPLETED') updateData.completedAt = new Date();

    return prisma.task.update({
      where: { id: taskId, organizationId },
      data: updateData,
      include: { user: true },
    });
  }

  async getBeatPlan(beatPlanId, organizationId) {
    return prisma.beatPlan.findFirst({
      where: { id: beatPlanId, organizationId },
      include: { user: true },
    });
  }

  async listBeatPlans(organizationId, filters = {}) {
    const { userId, status, skip = 0, take = 20 } = filters;

    const where = { organizationId };
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [plans, total] = await Promise.all([
      prisma.beatPlan.findMany({
        where,
        skip,
        take,
        include: { user: true },
        orderBy: { startDate: 'desc' },
      }),
      prisma.beatPlan.count({ where }),
    ]);

    return { plans, total };
  }

  async getCalendarEvent(eventId, organizationId) {
    return prisma.calendarEvent.findFirst({
      where: { id: eventId, organizationId },
      include: { user: true },
    });
  }

  async listCalendarEvents(organizationId, filters = {}) {
    const { userId, startDate, endDate, skip = 0, take = 20 } = filters;

    const where = { organizationId };
    if (userId) where.userId = userId;
    if (startDate && endDate) {
      where.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const [events, total] = await Promise.all([
      prisma.calendarEvent.findMany({
        where,
        skip,
        take,
        include: { user: true },
        orderBy: { startTime: 'asc' },
      }),
      prisma.calendarEvent.count({ where }),
    ]);

    return { events, total };
  }

  // Analytics & Aggregations
  async getAttendanceSummary(organizationId, userId, startDate, endDate) {
    return prisma.attendance.aggregate({
      where: {
        organizationId,
        userId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      _count: true,
      _avg: { durationMins: true },
    });
  }

  async getVisitsSummary(organizationId, userId, startDate, endDate) {
    const visits = await prisma.visit.findMany({
      where: {
        organizationId,
        userId,
        scheduledAt: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      select: { status: true },
    });

    const summary = {
      total: visits.length,
      planned: visits.filter(v => v.status === 'PLANNED').length,
      inProgress: visits.filter(v => v.status === 'IN_PROGRESS').length,
      completed: visits.filter(v => v.status === 'COMPLETED').length,
      cancelled: visits.filter(v => v.status === 'CANCELLED').length,
    };

    return summary;
  }

  async getExpenseSummary(organizationId, userId, startDate, endDate) {
    const expenses = await prisma.expense.aggregate({
      where: {
        organizationId,
        userId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      _sum: { amount: true },
      _count: true,
    });

    return expenses;
  }
}
