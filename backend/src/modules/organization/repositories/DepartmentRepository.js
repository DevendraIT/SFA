import { prisma } from '../../../config/database.js';

/**
 * Department Repository
 * Handles all database operations for Department entity
 */
export class DepartmentRepository {

  // Standard includes for department queries
  // #departmentIncludes = {
  //   branch: {
  //     select: {
  //       id: true,
  //       name: true,
  //       company: { 
  //         select: { 
  //           id: true, 
  //           name: true 
  //         } 
  //       },
  //     },
  //   },
  //   teams: { 
  //     orderBy: { name: 'asc' } 
  //   },
  //   _count: { 
  //     select: { 
  //       users: true, 
  //       teams: true 
  //     } 
  //   },
  // };

  #departmentIncludes = {
  branch: {
    select: {
      id: true,
      name: true,
      company: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },

  teams: {
    where: {
      isDeleted: false,
    },
    orderBy: {
      name: 'asc',
    },
  },

  _count: {
    select: {
      users: true,
      teams: true,
    },
  },
};

  // Build where clause for department queries
  #buildWhereClause(organizationId, { search, branchId } = {}) {
    // const where = {
    //   branch: { 
    //     company: { organizationId } 
    //   }
    // };

    const where = {
  isDeleted: false,
  branch: {
    isDeleted: false,
    company: {
      organizationId,
      isDeleted: false,
    },
  },
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

  // async findById(id, organizationId) {
  //   return prisma.department.findFirst({
  //     where: { 
  //       id, 
  //       branch: { 
  //         company: { organizationId } 
  //       } 
  //     },
  //     include: this.#departmentIncludes,
  //   });
  // }

  async findById(id, organizationId) {
  return prisma.department.findFirst({
    where: {
      id,
      isDeleted: false,
      branch: {
        isDeleted: false,
        company: {
          organizationId,
          isDeleted: false,
        },
      },
    },
    include: this.#departmentIncludes,
  });
}

  // async findByCode(branchId, code) {
  //   return prisma.department.findUnique({
  //     where: { 
  //       branchId_code: { 
  //         branchId, 
  //         code 
  //       } 
  //     },
  //   });
  // }

  async findByCode(branchId, code) {
  return prisma.department.findFirst({
    where: {
      branchId,
      code,
      isDeleted: false,
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

  // async delete(id) {
  //   return prisma.department.delete({
  //     where: { id },
  //   });
  // }

  // async softDelete(id) {
  //   return prisma.department.update({
  //     where: { id },
  //     data: { deletedAt: new Date() },
  //   });
  // }

  async softDelete(id, deletedBy) {
  return prisma.department.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy,
    },
  });
}

  // async restore(id) {
  //   return prisma.department.update({
  //     where: { id },
  //     data: { deletedAt: null },
  //   });
  // }

  async restore(id) {
  return prisma.department.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
    },
  });
}
  async bulkCreate(data) {
    return prisma.department.createMany({ data, skipDuplicates: true });
  }

  async bulkUpdate(updates) {
    return Promise.all(
      updates.map(({ id, ...data }) => this.update(id, data))
    );
  }

  // async existsByCode(branchId, code, excludeId = null) {
  //   const where = { 
  //     branchId, 
  //     code 
  //   };
    
  //   if (excludeId) {
  //     where.NOT = { id: excludeId };
  //   }

  //   const count = await prisma.department.count({ where });
  //   return count > 0;
  // }
  async existsByCode(branchId, code, excludeId = null) {
  const where = {
    branchId,
    code,
    isDeleted: false,
  };

  if (excludeId) {
    where.NOT = { id: excludeId };
  }

  const count = await prisma.department.count({ where });
  return count > 0;
}
async belongsToOrganization(departmentId, organizationId) {
  const department = await prisma.department.findFirst({
    where: {
      id: departmentId,
      isDeleted: false,
      branch: {
        isDeleted: false,
        company: {
          organizationId,
          isDeleted: false,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return !!department;
}
}