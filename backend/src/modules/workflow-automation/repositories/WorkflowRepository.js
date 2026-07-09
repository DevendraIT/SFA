import prisma from '../../../config/database.js';

/**
 * WorkflowRuleRepository
 * Data access for WorkflowRule records.
 */
export class WorkflowRuleRepository {
  async create(data) {
    return prisma.workflowRule.create({ data });
  }

  async findById(id, organizationId) {
    return prisma.workflowRule.findFirst({ where: { id, organizationId } });
  }

  async update(id, data) {
    return prisma.workflowRule.update({ where: { id }, data });
  }

  async delete(id, organizationId) {
    return prisma.workflowRule.deleteMany({ where: { id, organizationId } });
  }

  async list(organizationId, { page = 1, limit = 20, eventName } = {}) {
    const where = { organizationId, ...(eventName ? { eventName } : {}) };
    const [data, total] = await Promise.all([
      prisma.workflowRule.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.workflowRule.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  /** Find all active rules for a given event. */
  async findActiveByEvent(organizationId, eventName) {
    return prisma.workflowRule.findMany({
      where: { organizationId, eventName, isActive: true },
    });
  }
}

/**
 * WorkflowExecutionRepository
 * Data access for WorkflowExecution and WorkflowLog records.
 */
export class WorkflowExecutionRepository {
  async create(data) {
    return prisma.workflowExecution.create({ data });
  }

  async update(id, data) {
    return prisma.workflowExecution.update({ where: { id }, data });
  }

  async findById(id, organizationId) {
    return prisma.workflowExecution.findFirst({
      where: { id, organizationId },
      include: { logs: { orderBy: { createdAt: 'asc' } }, rule: { select: { id: true, name: true, eventName: true } } },
    });
  }

  async list(organizationId, { page = 1, limit = 20, status, ruleId } = {}) {
    const where = {
      organizationId,
      ...(status ? { status } : {}),
      ...(ruleId ? { ruleId } : {}),
    };
    const [data, total] = await Promise.all([
      prisma.workflowExecution.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startedAt: 'desc' },
        include: { rule: { select: { id: true, name: true, eventName: true } } },
      }),
      prisma.workflowExecution.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async appendLog(executionId, level, message, metadata = null) {
    return prisma.workflowLog.create({ data: { executionId, level, message, metadata } });
  }

  async getLogs(executionId) {
    return prisma.workflowLog.findMany({
      where: { executionId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
