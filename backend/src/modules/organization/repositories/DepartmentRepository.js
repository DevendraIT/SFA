import prisma from '../../../config/database.js';

/**
 * Department Repository
 * Handles all database operations for Department entity
 */
export class DepartmentRepository {

  // Standard includes for department queries
  #departmentIncludes = {
    branch: {
      select: {
        id: true,
        name: true,
        company: { 
          select: { 
            id: true, 
            name: true 
          } 
        },
      },
    },
    teams: { 
      orderBy: { name: 'asc' } 
    },
    _count: { 
      select: { 
        users: true, 
        teams: true 
      } 
    },
  };

  // Build where clause for department queries
  #buildWhereClause(organizationId, { search, branchId } = {}) {
    const where = {
      branch: { 
        company: { organizationId } 
      }
    };
    
    if (branchId) {
      where.branchId = branchId;
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
      branchId
    } = options;

    const where = this.#buildWhereClause(organizationId, { search, branchId });

    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          branch: {
            select: {
              id: true,
              name: true,
              company: { 
                select: { 
                  id: true, 
                  name: true 
                } 
              },
            },
          },
          _count: { 
            select: { 
              users: true, 
              teams: true 
            } 
          },
        },
      }),
      prisma.department.count({ where }),
    ]);

    return { departments, total };
  }

  async findById(id, organizationId) {
    return prisma.department.findFirst({
      where: { 
        id, 
        branch: { 
          company: { organizationId } 
        } 
      },
      include: this.#departmentIncludes,
    });
  }

  async findByCode(branchId, code) {
    return prisma.department.findUnique({
      where: { 
        branchId_code: { 
          branchId, 
          code 
        } 
      },
    });
  }

  async create(data) {
    return prisma.department.create({ 
      data,
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            company: { 
              select: { 
                id: true, 
                name: true 
              } 
            },
          },
        },
        _count: { 
          select: { 
            users: true, 
            teams: true 
          } 
        },
      },
    });
  }

  async update(id, data) {
    return prisma.department.update({
      where: { id },
      data,
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            company: { 
              select: { 
                id: true, 
                name: true 
              } 
            },
          },
        },
        _count: { 
          select: { 
            users: true, 
            teams: true 
          } 
        },
      },
    });
  }

  async delete(id) {
    return prisma.department.delete({
      where: { id },
    });
  }

  async existsByCode(branchId, code, excludeId = null) {
    const where = { 
      branchId, 
      code 
    };
    
    if (excludeId) {
      where.NOT = { id: excludeId };
    }

    const count = await prisma.department.count({ where });
    return count > 0;
  }
}