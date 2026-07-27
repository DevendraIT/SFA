import { prisma } from '../../config/database.js';

export class CustomerRepository {
  async findAll(organizationId, filters = {}) {
    const { skip = 0, take = 50, search } = filters;
    const where = { organizationId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      prisma.customer.count({ where }),
    ]);

    return { customers, total };
  }

  async findById(id, organizationId) {
    return prisma.customer.findFirst({
      where: { id, organizationId },
      include: { orders: { take: 5, orderBy: { createdAt: 'desc' } } },
    });
  }

  async create(data) {
    return prisma.customer.create({ data });
  }

  async update(id, organizationId, data) {
    return prisma.customer.update({
      where: { id, organizationId },
      data,
    });
  }

  async delete(id, organizationId) {
    return prisma.customer.delete({
      where: { id, organizationId },
    });
  }
}

