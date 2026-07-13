import { prisma } from '../../../config/database.js';

/**
 * Repository for EmailTemplate model.
 * Organization-isolated — all queries are scoped by organizationId.
 */
export class EmailTemplateRepository {

  async create(data) {
    return prisma.emailTemplate.create({ data });
  }

  async findById(id, organizationId) {
    return prisma.emailTemplate.findFirst({
      where: { id, organizationId }
    });
  }

  async list(organizationId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      prisma.emailTemplate.findMany({
        where: { organizationId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.emailTemplate.count({ where: { organizationId } })
    ]);
    return { data, total, page, limit };
  }

  async update(id, data) {
    return prisma.emailTemplate.update({ where: { id }, data });
  }

  async delete(id, organizationId) {
    return prisma.emailTemplate.deleteMany({ where: { id, organizationId } });
  }
}
