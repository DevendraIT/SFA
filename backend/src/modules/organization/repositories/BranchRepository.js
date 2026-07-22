import { prisma } from '../../../config/database.js';

/**
 * Branch Repository
 * Handles all database operations for Branch entity
 */
export class BranchRepository {

  // Standard includes for branch queries
  // #branchIncludes = {
  //   company: { 
  //     select: { 
  //       id: true, 
  //       name: true 
  //     } 
  //   },
  //   departments: { 
  //     orderBy: { name: 'asc' } 
  //   },
  //   teams: { 
  //     orderBy: { name: 'asc' } 
  //   },
  //   _count: { 
  //     select: { 
  //       departments: true, 
  //       users: true, 
  //       teams: true 
  //     } 
  //   },
  // };

  #branchIncludes = {
  company: {
    select: {
      id: true,
      name: true,
    },
  },

  departments: {
    where: {
      isDeleted: false,
    },
    orderBy: {
      name: 'asc',
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
      departments: true,
      users: true,
      teams: true,
    },
  },
};

  // Build where clause for branch queries
  #buildWhereClause(organizationId, { search, companyId } = {}) {
    // const where = {
    //   company: { organizationId }
    // };
    
    const where = {
  isDeleted: false,
  company: {
    organizationId,
    isDeleted: false,
  },
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

  // async findById(id, organizationId) {
  //   return prisma.branch.findFirst({
  //     where: { 
  //       id, 
  //       company: { organizationId } 
  //     },
  //     include: this.#branchIncludes,
  //   });
  // }

  async findById(id, organizationId) {
  return prisma.branch.findFirst({
    where: {
      id,
      isDeleted: false,
      company: {
        organizationId,
        isDeleted: false,
      },
    },
    include: this.#branchIncludes,
  });
}

  // async findByCode(companyId, code) {
  //   return prisma.branch.findUnique({
  //     where: { 
  //       companyId_code: { 
  //         companyId, 
  //         code 
  //       } 
  //     },
  //   });
  // }

  async findByCode(companyId, code) {
  return prisma.branch.findFirst({
    where: {
      companyId,
      code,
      isDeleted: false,
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

  // async delete(id) {
  //   return prisma.branch.delete({
  //     where: { id },
  //   });
  // }

  // async softDelete(id) {
  //   return prisma.branch.update({
  //     where: { id },
  //     data: { deletedAt: new Date() },
  //   });
  // }
  async softDelete(id, deletedBy) {
  return prisma.branch.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy,
    },
  });
}

  // async restore(id) {
  //   return prisma.branch.update({
  //     where: { id },
  //     data: { deletedAt: null },
  //   });
  // }

  async restore(id) {
  return prisma.branch.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
      deletedBy: null,
    },
  });
}

  async bulkCreate(data) {
    return prisma.branch.createMany({ data, skipDuplicates: true });
  }

  async bulkUpdate(updates) {
    return Promise.all(
      updates.map(({ id, ...data }) => this.update(id, data))
    );
  }

  // async existsByCode(companyId, code, excludeId = null) {
  //   const where = { 
  //     companyId, 
  //     code 
  //   };
    
  //   if (excludeId) {
  //     where.NOT = { id: excludeId };
  //   }

  //   const count = await prisma.branch.count({ where });
  //   return count > 0;
  // }

  async existsByCode(companyId, code, excludeId = null) {
  const where = {
    companyId,
    code,
    isDeleted: false,
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
  isDeleted: false,
  company: {
    organizationId,
    isDeleted: false,
  },

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