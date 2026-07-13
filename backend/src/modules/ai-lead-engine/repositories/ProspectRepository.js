import { prisma } from '../../../config/database.js';

export class ProspectRepository {
  async create(data) {
    return prisma.prospect.create({ data });
  }

  async createMany(dataArray) {
    return prisma.prospect.createMany({
      data: dataArray,
      skipDuplicates: true,
    });
  }

  async findById(id, organizationId) {
    return prisma.prospect.findFirst({
      where: { id, organizationId },
      include: {
        emailActivities: true,
        aiAnalyses: true,
      }
    });
  }

  async findByEmail(email, organizationId) {
    return prisma.prospect.findFirst({
      where: { email, organizationId }
    });
  }

  async update(id, organizationId, data) {
    return prisma.prospect.update({
      where: { id_organizationId: { id, organizationId } }, // Wait, compound id is not in schema. I should use findFirst / update with just id.
      // Actually, since Prisma update needs a unique identifier, and ID is unique globally:
      where: { id },
      data,
    });
  }

  async updateScore(id, scoreIncrement) {
    return prisma.prospect.update({
      where: { id },
      data: { score: { increment: scoreIncrement } },
    });
  }

  async list(organizationId, filters = {}, pagination = { page: 1, limit: 20 }) {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const where = { organizationId, ...filters };

    const [data, total] = await Promise.all([
      prisma.prospect.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.prospect.count({ where }),
    ]);

    return { data, total, page, limit };
  }
}
