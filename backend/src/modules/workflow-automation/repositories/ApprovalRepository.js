import prisma from '../../../config/database.js';

/**
 * ApprovalRepository
 * Data access for ApprovalChain and ApprovalRequest records.
 */
export class ApprovalRepository {
  // ── Chains ────────────────────────────────────────────────────

  async createChain(data) {
    const { steps, ...chainData } = data;

    return prisma.approvalChain.create({
      data: {
        ...chainData,
        steps: {
          create: steps,
        },
      },
      include: { steps: true },
    });
  }

  async findChainById(id, organizationId) {
    return prisma.approvalChain.findFirst({
      where: { id, organizationId },
      include: { steps: { orderBy: { stepOrder: 'asc' } } },
    });
  }

  async findActiveChainForEntity(organizationId, entityType) {
    return prisma.approvalChain.findFirst({
      where: { organizationId, entityType, isActive: true },
      include: { steps: { orderBy: { stepOrder: 'asc' } } },
    });
  }

  async listChains(organizationId, { page = 1, limit = 20 } = {}) {
    const where = { organizationId };
    const [data, total] = await Promise.all([
      prisma.approvalChain.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { steps: true, requests: true } } },
      }),
      prisma.approvalChain.count({ where }),
    ]);
    return { data, total, page, limit };
  }

  async updateChain(id, data) {
    return prisma.approvalChain.update({ where: { id }, data });
  }

  // ── Requests ──────────────────────────────────────────────────

  async createRequest(data) {
    return prisma.approvalRequest.create({ data });
  }

  async findRequestById(id, organizationId) {
    return prisma.approvalRequest.findFirst({
      where: { id, organizationId },
      include: {
        chain: { include: { steps: { orderBy: { stepOrder: 'asc' } } } },
        requester: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async findPendingRequest(entityId, chainId) {
    return prisma.approvalRequest.findFirst({
      where: { entityId, chainId, status: 'PENDING' },
    });
  }

  async updateRequest(id, data) {
    return prisma.approvalRequest.update({ where: { id }, data });
  }

  async listRequests(organizationId, { page = 1, limit = 20, status } = {}) {
    const where = { organizationId, ...(status ? { status } : {}) };
    const [data, total] = await Promise.all([
      prisma.approvalRequest.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          chain: { select: { id: true, name: true, entityType: true } },
          requester: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      prisma.approvalRequest.count({ where }),
    ]);
    return { data, total, page, limit };
  }
}
