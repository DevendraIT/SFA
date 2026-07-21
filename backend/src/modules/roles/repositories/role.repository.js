import { prisma } from '../../../config/database.js';

export class RoleRepository {
  async findAll(organizationId, options = {}) {
    const {
      skip = 0,
      take = 20,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const where = { organizationId };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [roles, total] = await Promise.all([
      prisma.role.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          parentRole: {
            select: {
              id: true,
              name: true,
              level: true,
            },
          },
          childRoles: {
            select: {
              id: true,
              name: true,
              level: true,
            },
          },
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
        parentRole: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
        childRoles: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
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
        parentRole: {
          select: {
            id: true,
            name: true,
            level: true,
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

  async update(id, data) {
    return prisma.role.update({
      where: { id },
      data,
      include: {
        parentRole: {
          select: {
            id: true,
            name: true,
            level: true,
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
    const [
      totalRoles,
      systemRoles,
      customRoles,
      rolesWithUsers,
      totalAssignedUsers,
    ] = await Promise.all([
      prisma.role.count({ 
        where: { organizationId } 
      }),
      prisma.role.count({ 
        where: { 
          organizationId, 
          isSystem: true 
        } 
      }),
      prisma.role.count({ 
        where: { 
          organizationId, 
          isSystem: false 
        } 
      }),
      prisma.role.count({
        where: {
          organizationId,
          users: {
            some: {}
          }
        }
      }),
      prisma.userRole.count({ 
        where: { 
          role: { organizationId }
        } 
      }),
    ]);

    const unassignedRoles = totalRoles - rolesWithUsers;

    return {
      roles: { 
        total: totalRoles,
        system: systemRoles,
        custom: customRoles,
        assigned: rolesWithUsers,
        unassigned: unassignedRoles
      },
      users: {
        assigned: totalAssignedUsers
      }
    };
  }
}