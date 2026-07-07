import prisma from '../../../config/database.js';

/**
 * Organization Repository
 * Handles all database operations for Organization entity
 */
export class OrganizationRepository {

  async findAll(options = {}) {
    return prisma.organization.findMany();
  }

  async findById(id) {
    return prisma.organization.findUnique({
      where: { id }
    });
  }

  async create(data) {
    return prisma.organization.create({
      data
    });
  }

  async update(id, data) {
    return prisma.organization.update({
      where: { id },
      data
    });
  }

  async delete(id) {
    return prisma.organization.delete({
      where: { id }
    });
  }
}