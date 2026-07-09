import prisma from '../../config/database.js';

/**
 * Team Repository
 * All Prisma queries for Team model
 */
export class TeamRepository {

  async findTeams(organizationId, { skip, take, search, sortBy, sortOrder, branchId, departmentId, territoryId }) {
    const where = {
      organizationId,
      ...(branchId && { branchId }),
      ...(departmentId && { departmentId }),
      ...(territoryId && { territoryId }),
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    };

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        include: {
          branch: {
            select: {
              id: true,
              name: true,
              company: { select: { id: true, name: true } },
            },
          },
          department: { select: { id: true, name: true } },
          territory: { select: { id: true, name: true } },
          _count: { select: { users: true } },
        },
      }),
      prisma.team.count({ where }),
    ]);

    return { teams, total };
  }

  async findTeamById(id, organizationId) {
    return prisma.team.findFirst({
      where: { id, organizationId },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            company: { select: { id: true, name: true } },
          },
        },
        department: { select: { id: true, name: true } },
        territory: { select: { id: true, name: true } },
        users: {
          where: { deletedAt: null, isActive: true },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
          orderBy: { firstName: 'asc' },
        },
        _count: { select: { users: true } },
      },
    });
  }

  async createTeam(data) {
    return prisma.team.create({ data });
  }

  async updateTeam(id, data) {
    return prisma.team.update({ where: { id }, data });
  }

  // Existence checks
  async branchBelongsToOrg(branchId, organizationId) {
    const branch = await prisma.branch.findFirst({
      where: { id: branchId, company: { organizationId } },
      select: { id: true },
    });
    return !!branch;
  }

  async departmentBelongsToOrg(departmentId, organizationId) {
    const department = await prisma.department.findFirst({
      where: { id: departmentId, branch: { company: { organizationId } } },
      select: { id: true },
    });
    return !!department;
  }

  async territoryBelongsToOrg(territoryId, organizationId) {
    const territory = await prisma.territory.findFirst({
      where: { id: territoryId, organizationId },
      select: { id: true },
    });
    return !!territory;
  }

  // --- Assignment / Hierarchy queries ---

  async findFirstUserByRole(organizationId, roleId) {
    const userRole = await prisma.userRole.findFirst({
      where: { roleId, user: { organizationId, isActive: true } },
      include: { user: { select: { id: true } } },
    });
    return userRole?.user?.id || null;
  }

  async findUsersByRole(organizationId, roleId) {
    return prisma.userRole.findMany({
      where: { roleId, user: { organizationId, isActive: true } },
      include: { user: { select: { id: true } } },
    });
  }

  async findFirstUserByTerritory(organizationId, territoryId) {
    const user = await prisma.user.findFirst({
      where: { organizationId, territoryId, isActive: true },
      select: { id: true },
    });
    return user?.id || null;
  }

  async findManagerByUserId(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { managerId: true },
    });
    return user?.managerId || null;
  }

  async findUserCountsForWorkload(organizationId, userIds) {
    const counts = await prisma.lead.groupBy({
      by: ['assignedToId'],
      where: {
        organizationId,
        assignedToId: { in: userIds },
        status: { notIn: ['CLOSED_WON', 'CLOSED_LOST', 'WON', 'LOST'] },
      },
      _count: { assignedToId: true },
    });
    return counts;
  }
}
