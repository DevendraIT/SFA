import { AppError } from '../../shared/response.js';
import { logAudit } from '../../utils/audit.js';

/**
 * Team Service
 * Business rules for Team management
 */
export class TeamService {
  constructor(teamRepository) {
    this.repo = teamRepository;
  }

  _buildPaginationMeta(total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  }

  _buildListOptions({ page, limit, search, sortBy, sortOrder }) {
    const skip = (page - 1) * limit;
    const allowedSortFields = ['name', 'createdAt', 'updatedAt'];
    const resolvedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    return { skip, take: limit, search, sortBy: resolvedSortBy, sortOrder };
  }

  async listTeams(organizationId, query) {
    const options = this._buildListOptions(query);
    const { teams, total } = await this.repo.findTeams(organizationId, {
      ...options,
      branchId: query.branchId,
      departmentId: query.departmentId,
      territoryId: query.territoryId,
    });
    return { teams, meta: this._buildPaginationMeta(total, query.page, query.limit) };
  }

  async getTeam(id, organizationId) {
    const team = await this.repo.findTeamById(id, organizationId);
    if (!team) throw AppError.notFound('Team not found.');
    return team;
  }

  async createTeam(organizationId, data, req) {
    const branchExists = await this.repo.branchBelongsToOrg(data.branchId, organizationId);
    if (!branchExists) throw AppError.badRequest('Branch not found within your organization.');

    if (data.departmentId) {
      const departmentExists = await this.repo.departmentBelongsToOrg(data.departmentId, organizationId);
      if (!departmentExists) throw AppError.badRequest('Department not found within your organization.');
    }

    if (data.territoryId) {
      const territoryExists = await this.repo.territoryBelongsToOrg(data.territoryId, organizationId);
      if (!territoryExists) throw AppError.badRequest('Territory not found within your organization.');
    }

    const team = await this.repo.createTeam({ ...data, organizationId });

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'team.create',
      moduleName: 'team',
      details: { teamId: team.id, name: team.name },
      req,
    });

    return team;
  }

  async updateTeam(id, organizationId, data, req) {
    const team = await this.repo.findTeamById(id, organizationId);
    if (!team) throw AppError.notFound('Team not found.');

    if (data.branchId) {
      const branchExists = await this.repo.branchBelongsToOrg(data.branchId, organizationId);
      if (!branchExists) throw AppError.badRequest('Branch not found within your organization.');
    }

    if (data.departmentId) {
      const departmentExists = await this.repo.departmentBelongsToOrg(data.departmentId, organizationId);
      if (!departmentExists) throw AppError.badRequest('Department not found within your organization.');
    }

    if (data.territoryId) {
      const territoryExists = await this.repo.territoryBelongsToOrg(data.territoryId, organizationId);
      if (!territoryExists) throw AppError.badRequest('Territory not found within your organization.');
    }

    const updated = await this.repo.updateTeam(id, data);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'team.update',
      moduleName: 'team',
      details: { teamId: id, changes: data },
      req,
    });

    return updated;
  }

  async deleteTeam(id, organizationId, req) {
    const team = await this.repo.findTeamById(id, organizationId);
    if (!team) throw AppError.notFound('Team not found.');

    if (team._count.users > 0) {
      throw AppError.conflict('Cannot delete team while users are assigned.');
    }

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'team.delete.rejected',
      moduleName: 'team',
      details: { teamId: id, reason: 'Soft delete fields unavailable in Prisma schema.' },
      req,
    });

    throw AppError.conflict('Team cannot be deleted because the current Prisma schema does not provide soft-delete fields for this resource.');
  }

  async restoreTeam(id, organizationId, req) {
    const team = await this.repo.findTeamById(id, organizationId);
    if (!team) throw AppError.notFound('Team not found.');

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'team.restore.rejected',
      moduleName: 'team',
      details: { teamId: id, reason: 'Soft delete fields unavailable in Prisma schema.' },
      req,
    });

    throw AppError.conflict('Team restore is unavailable because the current Prisma schema does not provide soft-delete fields.');
  }
}
