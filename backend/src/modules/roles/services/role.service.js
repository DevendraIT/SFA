import { AppError } from '../../../shared/response.js';
import { logAudit } from '../../../utils/audit.js';
import {
  ENTERPRISE_ROLES,
  ENTERPRISE_ROLE_HIERARCHY,
} from '../constants/role.constants.js';

export class RoleService {
  constructor(roleRepository) {
    this.repo = roleRepository;
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
    const allowedSortFields = ['name', 'createdAt', 'updatedAt', 'level'];
    const resolvedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    return { skip, take: limit, search, sortBy: resolvedSortBy, sortOrder };
  }

 _isEnterpriseSystemRole(roleName) {
  return Object.values(ENTERPRISE_ROLES).includes(roleName);
}

  _validateUniquePermissions(permissions) {
    if (!permissions || !Array.isArray(permissions)) return;
    
    const uniquePermissions = [...new Set(permissions)];
    if (uniquePermissions.length !== permissions.length) {
      throw AppError.badRequest('Duplicate permissions are not allowed.');
    }
  }

  async listRoles(organizationId, query) {
    const options = this._buildListOptions(query);
    const { roles, total } = await this.repo.findAll(organizationId, options);
    return {
      roles,
      meta: this._buildPaginationMeta(total, query.page, query.limit)
    };
  }

  async getRole(id, organizationId) {
    const role = await this.repo.findById(id, organizationId);
    if (!role) throw AppError.notFound('Role not found.');
    return role;
  }

  async createRole(organizationId, data, req) {
    if (await this.repo.existsByName(data.name, organizationId)) {
      throw AppError.badRequest(`Role name '${data.name}' is already in use within this organization.`);
    }

    this._validateUniquePermissions(data.permissions);

    const roleData = {
      ...data,
      organizationId,
      isSystem: false,
    };

    const role = await this.repo.create(roleData);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'role.create',
      moduleName: 'roles',
      details: { roleId: role.id, name: role.name },
      req,
    });

    return role;
  }

  async updateRole(id, organizationId, data, req) {
    const role = await this.repo.findById(id, organizationId);
    if (!role) throw AppError.notFound('Role not found.');

    if (this._isEnterpriseRole(role.name)) {
      if (data.name && data.name !== role.name) {
        throw AppError.forbidden('Enterprise system roles cannot be renamed.');
      }
    }

    if (data.name && data.name !== role.name) {
      if (await this.repo.existsByName(data.name, organizationId, id)) {
        throw AppError.badRequest(`Role name '${data.name}' is already in use within this organization.`);
      }
    }

    this._validateUniquePermissions(data.permissions);

    const updated = await this.repo.update(id, data);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'role.update',
      moduleName: 'roles',
      details: { roleId: updated.id, name: updated.name },
      req,
    });

    return updated;
  }

  async deleteRole(id, organizationId, req) {
    const role = await this.repo.findById(id, organizationId);
    if (!role) throw AppError.notFound('Role not found.');

    if (role.isSystem || this._isEnterpriseRole(role.name)) {
      throw AppError.forbidden('System roles and enterprise roles cannot be deleted.');
    }

    if (role._count.users > 0) {
      throw AppError.conflict('Cannot delete role with assigned users.');
    }

    await this.repo.delete(id);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'role.delete',
      moduleName: 'roles',
      details: { roleId: id, name: role.name },
      req,
    });
  }

  async getStatistics(organizationId, req) {
    const statistics = await this.repo.getStatistics(organizationId);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'role.statistics.view',
      moduleName: 'roles',
      details: { organizationId },
      req,
    });

    return statistics;
  }
}
