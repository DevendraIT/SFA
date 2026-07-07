import prisma from '../../../config/database.js';

/**
 * Company Repository
 * Handles all database operations for Company entity
 */
export class CompanyRepository {

  // Standard includes for company queries
  #companyIncludes = {
    branches: {
      include: {
        _count: { 
          select: { 
            departments: true, 
            users: true 
          } 
        },
      },
      orderBy: { name: 'asc' },
    },
    territories: { 
      orderBy: { name: 'asc' } 
    },
    _count: { 
      select: { 
        branches: true, 
        territories: true 
      } 
    },
  };

  // Build where clause for company queries
  #buildWhereClause(organizationId, { search } = {}) {
    const where = { organizationId };
    
    if (search) {
      where.name = { 
        contains: search, 
        mode: 'insensitive' 
      };
    }
    
    return where;
  }

  async findAll(organizationId, options = {}) {
    const {
      skip = 0,
      take = 20,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = options;

    const where = this.#buildWhereClause(organizationId, { search });

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: { 
            select: { 
              branches: true, 
              territories: true 
            } 
          },
        },
      }),
      prisma.company.count({ where }),
    ]);

    return { companies, total };
  }

  async findById(id, organizationId) {
    return prisma.company.findFirst({
      where: { 
        id, 
        organizationId 
      },
      include: this.#companyIncludes,
    });
  }

  async findByCode(organizationId, code) {
    return prisma.company.findUnique({
      where: { 
        organizationId_code: { 
          organizationId, 
          code 
        } 
      },
    });
  }

  async create(data) {
    return prisma.company.create({ 
      data,
      include: {
        _count: { 
          select: { 
            branches: true, 
            territories: true 
          } 
        },
      },
    });
  }

  async update(id, data) {
    return prisma.company.update({
      where: { id },
      data,
      include: {
        _count: { 
          select: { 
            branches: true, 
            territories: true 
          } 
        },
      },
    });
  }

  async delete(id) {
    return prisma.company.delete({
      where: { id },
    });
  }

  async existsByCode(organizationId, code, excludeId = null) {
    const where = { 
      organizationId, 
      code 
    };
    
    if (excludeId) {
      where.NOT = { id: excludeId };
    }

    const count = await prisma.company.count({ where });
    return count > 0;
  }

  async belongsToOrganization(companyId, organizationId) {
    const company = await prisma.company.findFirst({
      where: { 
        id: companyId, 
        organizationId 
      },
      select: { id: true },
    });
    
    return !!company;
  }
}