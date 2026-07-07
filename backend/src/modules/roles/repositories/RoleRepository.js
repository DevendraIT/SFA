import prisma from '../../../config/database.js';

/**
 * Role Repository
 * Handles all database operations for Role entity
 */
export class RoleRepository {

  async findAll(organizationId, options = {}) {
    const {
      skip = 0,
      take = 20,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      type
    } = options;

    const where = { organizationId };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    const [roles, total] = await Promise.all([
      prisma.role.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          _count: {
            select: {
              users: true,
              permissions: true,
            },
          },
        },
      }),
      prisma.role.count({ where }),
    ]);

    return { roles, total };
  }

  async findById(id, organizationId) {
    return prisma.role.findFirst({
      where: { 
        id, 
        organizationId 
      },
      include: {
        permissions: {
          select: {
            permission: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            users: true,
            permissions: true,
          },
        },
      },
    });
  }

  async findByName(name, organizationId) {
    return prisma.role.findFirst({
      where: { 
        name: { equals: name, mode: 'insensitive' },
        organizationId 
      },
    });
  }

  async create(data) {
    return prisma.role.create({
      data,
      include: {
        _count: {
          select: {
            users: true,
            permissions: true,
          },
        },
      },
    });
  }

  async update(id, data) {
    return prisma.role.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            users: true,
            permissions: true,
          },
        },
      },
    });
  }

  async delete(id) {
    return prisma.role.delete({
      where: { id },
    });
  }

  async existsByName(name, organizationId, excludeId = null) {
    const where = { 
      name: { equals: name, mode: 'insensitive' },
      organizationId 
    };
    
    if (excludeId) {
      where.NOT = { id: excludeId };
    }

    const count = await prisma.role.count({ where });
    return count > 0;
  }

  async getStatistics(organizationId) {
    return prisma.$transaction(async (tx) => {
      const [
        totalRoles,
        activeRoles,
        inactiveRoles,
        systemRoles,
        customRoles,
        rolesWithUsers,
        totalAssignedUsers,
      ] = await Promise.all([
        tx.role.count({ 
          where: { organizationId } 
        }),
        tx.role.count({ 
          where: { 
            organizationId, 
            status: 'active' 
          } 
        }),
        tx.role.count({ 
          where: { 
            organizationId, 
            status: 'inactive' 
          } 
        }),
        tx.role.count({ 
          where: { 
            organizationId, 
            type: 'system' 
          } 
        }),
        tx.role.count({ 
          where: { 
            organizationId, 
            type: 'custom' 
          } 
        }),
        tx.role.count({
          where: {
            organizationId,
            users: {
              some: {}
            }
          }
        }),
        tx.user.count({ 
          where: { 
            role: { organizationId },
            roleId: { not: null }
          } 
        }),
      ]);

      const unassignedRoles = totalRoles - rolesWithUsers;

      return {
        roles: { 
          total: totalRoles, 
          active: activeRoles, 
          inactive: inactiveRoles,
          system: systemRoles,
          custom: customRoles,
          assigned: rolesWithUsers,
          unassigned: unassignedRoles
        },
        users: {
          assigned: totalAssignedUsers
        }
      };
    });
  }
}