import { AppError } from '../../../shared/response.js';
import { logAudit } from '../../../utils/audit.js';
import { ROLE_TYPES, ROLE_STATUS, DEFAULT_SYSTEM_ROLES, ENTERPRISE_SYSTEM_ROLES } from '../constants/role.constants.js';

/**
 * Role Service
 * Business logic for Role management
 */
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
    const allowedSortFields = ['name', 'createdAt', 'updatedAt', 'status'];
    const resolvedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    return { skip, take: limit, search, sortBy: resolvedSortBy, sortOrder };
  }

  _isSystemRole(role) {
    return role.type === ROLE_TYPES.SYSTEM || Object.values(DEFAULT_SYSTEM_ROLES).includes(role.name);
  }

  _isEnterpriseSystemRole(roleName) {
    return ENTERPRISE_SYSTEM_ROLES.includes(roleName.toLowerCase());
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
    const { roles, total } = await this.repo.findAll(organizationId, {
      ...options,
      status: query.status,
      type: query.type,
    });
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
      type: data.type || ROLE_TYPES.CUSTOM,
      status: data.status || ROLE_STATUS.ACTIVE,
    };

    const role = await this.repo.create(roleData);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'role.create',
      moduleName: 'roles',
      details: { roleId: role.id, name: role.name, type: role.type },
      req,
    });

    return role;
  }

  async updateRole(id, organizationId, data, req) {
    const role = await this.repo.findById(id, organizationId);
    if (!role) throw AppError.notFound('Role not found.');

    if (this._isEnterpriseSystemRole(role.name)) {
      if (data.name && data.name !== role.name) {
        throw AppError.forbidden('Enterprise system roles (Admin, Head of Sales, Sales Manager, Sales Person) cannot be renamed.');
      }
      if (data.status === ROLE_STATUS.INACTIVE) {
        throw AppError.forbidden('Enterprise system roles cannot be deactivated.');
      }
    }

    if (this._isSystemRole(role)) {
      if (data.name && data.name !== role.name) {
        throw AppError.forbidden('System roles cannot be renamed.');
      }
      if (data.status === ROLE_STATUS.INACTIVE) {
        throw AppError.forbidden('System roles cannot be deactivated.');
      }
    }

    if (data.name && data.name !== role.name) {
      if (await this.repo.existsByName(data.name, organizationId, id)) {
        throw AppError.badRequest(`Role name '${data.name}' is already in use within this organization.`);
      }
    }

    if (data.status && !Object.values(ROLE_STATUS).includes(data.status)) {
      throw AppError.badRequest('Invalid role status provided.');
    }

    this._validateUniquePermissions(data.permissions);

    const updated = await this.repo.update(id, data);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'role.update',
      moduleName: 'roles',
      details: { roleId: id, changes: data },
      req,
    });

    return updated;
  }

  async deleteRole(id, organizationId, req) {
    const role = await this.repo.findById(id, organizationId);
    if (!role) throw AppError.notFound('Role not found.');

    if (this._isEnterpriseSystemRole(role.name)) {
      throw AppError.forbidden('Enterprise system roles (Admin, Head of Sales, Sales Manager, Sales Person) cannot be deleted.');
    }

    if (this._isSystemRole(role)) {
      throw AppError.forbidden('System roles cannot be deleted.');
    }

    if (role._count.users > 0) {
      throw AppError.conflict('Cannot delete role while users are assigned to it.');
    }

    const deleted = await this.repo.delete(id);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'role.delete',
      moduleName: 'roles',
      details: { roleId: id, name: role.name },
      req,
    });

    return deleted;
  }

  async activateRole(id, organizationId, req) {
    const role = await this.repo.findById(id, organizationId);
    if (!role) throw AppError.notFound('Role not found.');

    if (role.status === ROLE_STATUS.ACTIVE) {
      throw AppError.badRequest('Role is already active.');
    }

    const updated = await this.repo.update(id, { status: ROLE_STATUS.ACTIVE });

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'role.activate',
      moduleName: 'roles',
      details: { roleId: id, previousStatus: role.status },
      req,
    });

    return updated;
  }

  async deactivateRole(id, organizationId, req) {
    const role = await this.repo.findById(id, organizationId);
    if (!role) throw AppError.notFound('Role not found.');

    if (this._isEnterpriseSystemRole(role.name)) {
      throw AppError.forbidden('Enterprise system roles (Admin, Head of Sales, Sales Manager, Sales Person) cannot be deactivated.');
    }

    if (this._isSystemRole(role)) {
      throw AppError.forbidden('System roles cannot be deactivated.');
    }

    if (role.status === ROLE_STATUS.INACTIVE) {
      throw AppError.badRequest('Role is already inactive.');
    }

    const updated = await this.repo.update(id, { status: ROLE_STATUS.INACTIVE });

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'role.deactivate',
      moduleName: 'roles',
      details: { roleId: id, previousStatus: role.status },
      req,
    });

    return updated;
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