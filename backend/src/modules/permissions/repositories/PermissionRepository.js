import prisma from '../../../config/database.js';

/**
 * Permission Repository
 * Handles all database operations for Permission entity
 */
export class PermissionRepository {

  async findAll(organizationId, options = {}) {
    const {
      skip = 0,
      take = 20,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      category,
      type,
      scope,
      status
    } = options;

    const where = { organizationId };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category) {
      where.category = category;
    }

    if (type) {
      where.type = type;
    }

    if (scope) {
      where.scope = scope;
    }

    if (status) {
      where.status = status;
    }

    const [permissions, total] = await Promise.all([
      prisma.permission.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          parent: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          children: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              rolePermissions: true,
              children: true,
            },
          },
        },
      }),
      prisma.permission.count({ where }),
    ]);

    return { permissions, total };
  }

  async findById(id, organizationId) {
    return prisma.permission.findFirst({
      where: { 
        id, 
        organizationId 
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        rolePermissions: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            rolePermissions: true,
            children: true,
          },
        },
      },
    });
  }

  async findBySlug(slug, organizationId) {
    return prisma.permission.findFirst({
      where: { 
        slug,
        organizationId 
      },
      include: {
        _count: {
          select: {
            rolePermissions: true,
          },
        },
      },
    });
  }

  async create(data) {
    return prisma.permission.create({
      data,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            rolePermissions: true,
            children: true,
          },
        },
      },
    });
  }

  async update(id, data) {
    return prisma.permission.update({
      where: { id },
      data,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            rolePermissions: true,
            children: true,
          },
        },
      },
    });
  }

  async delete(id) {
    return prisma.permission.delete({
      where: { id },
    });
  }

  async existsBySlug(slug, organizationId, excludeId = null) {
    const where = { 
      slug,
      organizationId 
    };
    
    if (excludeId) {
      where.NOT = { id: excludeId };
    }

    const count = await prisma.permission.count({ where });
    return count > 0;
  }

  async getStatistics(organizationId) {
    return prisma.$transaction(async (tx) => {
      const [
        totalPermissions,
        activePermissions,
        inactivePermissions,
        systemPermissions,
        customPermissions,
        assignedPermissions,
        totalRoleAssignments,
        permissionsByCategory,
        permissionsByType,
        permissionsByScope,
      ] = await Promise.all([
        tx.permission.count({ 
          where: { organizationId } 
        }),
        tx.permission.count({ 
          where: { 
            organizationId, 
            status: 'active' 
          } 
        }),
        tx.permission.count({ 
          where: { 
            organizationId, 
            status: 'inactive' 
          } 
        }),
        tx.permission.count({ 
          where: { 
            organizationId, 
            isSystem: true 
          } 
        }),
        tx.permission.count({ 
          where: { 
            organizationId, 
            isSystem: false 
          } 
        }),
        tx.permission.count({
          where: {
            organizationId,
            rolePermissions: {
              some: {}
            }
          }
        }),
        tx.rolePermission.count({ 
          where: { 
            permission: { organizationId }
          } 
        }),
        tx.permission.groupBy({
          by: ['category'],
          where: { organizationId },
          _count: { id: true },
        }),
        tx.permission.groupBy({
          by: ['type'],
          where: { organizationId },
          _count: { id: true },
        }),
        tx.permission.groupBy({
          by: ['scope'],
          where: { organizationId },
          _count: { id: true },
        }),
      ]);

      const unassignedPermissions = totalPermissions - assignedPermissions;

      return {
        permissions: { 
          total: totalPermissions, 
          active: activePermissions, 
          inactive: inactivePermissions,
          system: systemPermissions,
          custom: customPermissions,
          assigned: assignedPermissions,
          unassigned: unassignedPermissions
        },
        assignments: {
          total: totalRoleAssignments
        },
        breakdown: {
          byCategory: permissionsByCategory.reduce((acc, item) => {
            acc[item.category] = item._count.id;
            return acc;
          }, {}),
          byType: permissionsByType.reduce((acc, item) => {
            acc[item.type] = item._count.id;
            return acc;
          }, {}),
          byScope: permissionsByScope.reduce((acc, item) => {
            acc[item.scope] = item._count.id;
            return acc;
          }, {}),
        }
      };
    });
  }
}