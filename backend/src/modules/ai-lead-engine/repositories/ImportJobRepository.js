import { prisma } from '../../../config/database.js';

export class ImportJobRepository {
  async create(data) {
    return prisma.importJob.create({ data });
  }

  async findById(id, organizationId) {
    return prisma.importJob.findFirst({
      where: { id, organizationId }
    });
  }

  async update(id, data) {
    return prisma.importJob.update({
      where: { id },
      data
    });
  }

  async incrementProcessed(id, count = 1) {
    return prisma.importJob.update({
      where: { id },
      data: { processedRecords: { increment: count } }
    });
  }

  async incrementFailed(id, count = 1) {
    return prisma.importJob.update({
      where: { id },
      data: { failedRecords: { increment: count } }
    });
  }

  async listJobs(organizationId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      prisma.importJob.findMany({
        where: { organizationId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.importJob.count({ where: { organizationId } })
    ]);
    
    return { data, total, page, limit };
  }
}
