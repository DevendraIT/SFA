import prisma from '../../../config/database.js';

/**
 * Branch Repository
 * Handles all database operations for Branch entity
 */
export class BranchRepository {

  // Standard includes for branch queries
  #branchIncludes = {
    company: { 
      select: { 
        id: true, 
        name: true 
      } 
    },
    departments: { 
      orderBy: { name: 'asc' } 
    },
    teams: { 
      orderBy: { name: 'asc' } 
    },
    _count: { 
      select: { 
        departments: true, 
        users: true, 
        teams: true 
      } 
    },
  };

  // Build where clause for branch queries
  #buildWhereClause(organizationId, { search, companyId } = {}) {
    const where = {
      company: { organizationId }
    };
    
    if (companyId) {
      where.companyId = companyId;
    }
    
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
      sortOrder = 'desc',
      companyId
    } = options;

    const where = this.#buildWhereClause(organizationId, { search, companyId });

    const [branches, total] = await Promise.all([
      prisma.branch.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          company: { 
            select: { 
              id: true, 
              name: true 
            } 
          },
          _count: { 
            select: { 
              departments: true, 
              users: true, 
              teams: true 
            } 
          },
        },
      }),
      prisma.branch.count({ where }),
    ]);

    return { branches, total };
  }

  async findById(id, organizationId) {
    return prisma.branch.findFirst({
      where: { 
        id, 
        company: { organizationId } 
      },
      include: this.#branchIncludes,
    });
  }

  async findByCode(companyId, code) {
    return prisma.branch.findUnique({
      where: { 
        companyId_code: { 
          companyId, 
          code 
        } 
      },
    });
  }

  async create(data) {
    return prisma.branch.create({ 
      data,
      include: {
        company: { 
          select: { 
            id: true, 
            name: true 
          } 
        },
        _count: { 
          select: { 
            departments: true, 
            users: true, 
            teams: true 
          } 
        },
      },
    });
  }

  async update(id, data) {
    return prisma.branch.update({
      where: { id },
      data,
      include: {
        company: { 
          select: { 
            id: true, 
            name: true 
          } 
        },
        _count: { 
          select: { 
            departments: true, 
            users: true, 
            teams: true 
          } 
        },
      },
    });
  }

  async delete(id) {
    return prisma.branch.delete({
      where: { id },
    });
  }

  async existsByCode(companyId, code, excludeId = null) {
    const where = { 
      companyId, 
      code 
    };
    
    if (excludeId) {
      where.NOT = { id: excludeId };
    }

    const count = await prisma.branch.count({ where });
    return count > 0;
  }

  async belongsToOrganization(branchId, organizationId) {
    const branch = await prisma.branch.findFirst({
      where: { 
        id: branchId, 
        company: { organizationId } 
      },
      select: { id: true },
    });
    
    return !!branch;
  }

  async countActiveUsers(branchId) {
    return prisma.user.count({
      where: {
        branchId,
        isActive: true,
        deletedAt: null,
      },
    });
  }
}