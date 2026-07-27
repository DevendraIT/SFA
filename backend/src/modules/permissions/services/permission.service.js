import { AppError } from '../../../shared/response.js';
import { logAudit } from '../../../utils/audit.js';
import { 
  PERMISSION_CATEGORIES,
  PERMISSION_STATUS, 
  SYSTEM_PERMISSIONS,
  RESERVED_PERMISSION_SLUGS 
} from '../constants/permission.constants.js';

/**
 * Permission Service
 * Business logic for Permission management
 */
export class PermissionService {
  constructor(permissionRepository) {
    this.repo = permissionRepository;
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
    const allowedSortFields = ['name', 'slug', 'createdAt', 'updatedAt', 'category', 'type'];
    const resolvedSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    return { skip, take: limit, search, sortBy: resolvedSortBy, sortOrder };
  }

  _isSystemPermission(permission) {
    return permission.isSystem || Object.values(SYSTEM_PERMISSIONS).includes(permission.slug);
  }

  _isReservedSlug(slug) {
    return RESERVED_PERMISSION_SLUGS.includes(slug);
  }

  _validateCategory(category) {
    if (!Object.values(PERMISSION_CATEGORIES).includes(category)) {
      throw AppError.badRequest(`Invalid permission category: ${category}`);
    }
  }

  _validateSlugFormat(slug) {
    const slugPattern = /^[a-z0-9]+:[a-z0-9_-]+$/;
    if (!slugPattern.test(slug)) {
      throw AppError.badRequest('Permission slug must follow format: module:action (e.g., users:create, orders:read)');
    }
  }

  async listPermissions(organizationId, query) {
    const options = this._buildListOptions(query);
    const { permissions, total } = await this.repo.findAll(organizationId, {
      ...options,
      category: query.category,
      type: query.type,
      scope: query.scope,
      status: query.status,
    });
    return {
      permissions,
      meta: this._buildPaginationMeta(total, query.page, query.limit)
    };
  }

  async getPermission(id, organizationId) {
    const permission = await this.repo.findById(id, organizationId);
    if (!permission) throw AppError.notFound('Permission not found.');
    return permission;
  }

  async createPermission(organizationId, data, req) {
    this._validateCategory(data.category);
    this._validateSlugFormat(data.slug);

    if (this._isReservedSlug(data.slug)) {
      throw AppError.badRequest(`Permission slug '${data.slug}' is reserved and cannot be used.`);
    }

    if (await this.repo.existsBySlug(data.slug, organizationId)) {
      throw AppError.badRequest(`Permission slug '${data.slug}' is already in use within this organization.`);
    }

    const permissionData = {
      ...data,
      organizationId,
      status: data.status || PERMISSION_STATUS.ACTIVE,
      isSystem: false,
    };

    const permission = await this.repo.create(permissionData);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'permission.create',
      moduleName: 'permissions',
      details: { permissionId: permission.id, slug: permission.slug, category: permission.category },
      req,
    });

    return permission;
  }

  async updatePermission(id, organizationId, data, req) {
    const permission = await this.repo.findById(id, organizationId);
    if (!permission) throw AppError.notFound('Permission not found.');

    if (this._isSystemPermission(permission)) {
      throw AppError.forbidden('System permissions cannot be modified.');
    }

    if (data.category) {
      this._validateCategory(data.category);
    }

    if (data.slug && data.slug !== permission.slug) {
      this._validateSlugFormat(data.slug);
      
      if (this._isReservedSlug(data.slug)) {
        throw AppError.badRequest(`Permission slug '${data.slug}' is reserved and cannot be used.`);
      }

      if (await this.repo.existsBySlug(data.slug, organizationId, id)) {
        throw AppError.badRequest(`Permission slug '${data.slug}' is already in use within this organization.`);
      }
    }

    if (data.status && !Object.values(PERMISSION_STATUS).includes(data.status)) {
      throw AppError.badRequest('Invalid permission status provided.');
    }

    const updated = await this.repo.update(id, data);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'permission.update',
      moduleName: 'permissions',
      details: { permissionId: id, changes: data },
      req,
    });

    return updated;
  }

  async deletePermission(id, organizationId, req) {
    const permission = await this.repo.findById(id, organizationId);
    if (!permission) throw AppError.notFound('Permission not found.');

    if (this._isSystemPermission(permission)) {
      throw AppError.forbidden('System permissions cannot be deleted.');
    }

    if (permission._count.rolePermissions > 0) {
      throw AppError.conflict('Cannot delete permission while it is assigned to roles.');
    }

    if (permission._count.children > 0) {
      throw AppError.conflict('Cannot delete permission while it has child permissions.');
    }

    const deleted = await this.repo.delete(id);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'permission.delete',
      moduleName: 'permissions',
      details: { permissionId: id, slug: permission.slug },
      req,
    });

    return deleted;
  }

  async activatePermission(id, organizationId, req) {
    const permission = await this.repo.findById(id, organizationId);
    if (!permission) throw AppError.notFound('Permission not found.');

    if (permission.status === PERMISSION_STATUS.ACTIVE) {
      throw AppError.badRequest('Permission is already active.');
    }

    const updated = await this.repo.update(id, { status: PERMISSION_STATUS.ACTIVE });

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'permission.activate',
      moduleName: 'permissions',
      details: { permissionId: id, previousStatus: permission.status },
      req,
    });

    return updated;
  }

  async deactivatePermission(id, organizationId, req) {
    const permission = await this.repo.findById(id, organizationId);
    if (!permission) throw AppError.notFound('Permission not found.');

    if (this._isSystemPermission(permission)) {
      throw AppError.forbidden('System permissions cannot be deactivated.');
    }

    if (permission.status === PERMISSION_STATUS.INACTIVE) {
      throw AppError.badRequest('Permission is already inactive.');
    }

    const updated = await this.repo.update(id, { status: PERMISSION_STATUS.INACTIVE });

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'permission.deactivate',
      moduleName: 'permissions',
      details: { permissionId: id, previousStatus: permission.status },
      req,
    });

    return updated;
  }

  async getStatistics(organizationId, req) {
    const statistics = await this.repo.getStatistics(organizationId);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'permission.statistics.view',
      moduleName: 'permissions',
      details: { organizationId },
      req,
    });

    return statistics;
  }

  async bulkUpdatePermissions(organizationId, permissionIds, action, req) {
    const permissions = await Promise.all(
      permissionIds.map(id => this.repo.findById(id, organizationId))
    );

    const notFound = permissions.filter(p => !p);
    if (notFound.length > 0) {
      throw AppError.notFound('One or more permissions not found.');
    }

    const systemPermissions = permissions.filter(p => this._isSystemPermission(p));
    if (systemPermissions.length > 0 && ['delete', 'deactivate'].includes(action)) {
      throw AppError.forbidden('System permissions cannot be deleted or deactivated.');
    }

    const results = [];
    for (const permission of permissions) {
      try {
        let result;
        switch (action) {
          case 'activate':
            result = await this.repo.update(permission.id, { status: PERMISSION_STATUS.ACTIVE });
            break;
          case 'deactivate':
            if (!this._isSystemPermission(permission)) {
              result = await this.repo.update(permission.id, { status: PERMISSION_STATUS.INACTIVE });
            }
            break;
          case 'delete':
            if (!this._isSystemPermission(permission) && permission._count.rolePermissions === 0) {
              result = await this.repo.delete(permission.id);
            }
            break;
        }
        if (result) results.push(result);
      } catch (error) {
        // Continue with other permissions if one fails
      }
    }

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: `permission.bulk.${action}`,
      moduleName: 'permissions',
      details: { permissionIds, processedCount: results.length },
      req,
    });

    return { processed: results.length, total: permissionIds.length };
  }
}