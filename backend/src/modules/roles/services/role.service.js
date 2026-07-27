import { AppError } from '../../../shared/response.js';
import { logAudit } from '../../../utils/audit.js';

/** Business rules for tenant roles. */
export class RoleService {
  constructor(roleRepository) { this.repo = roleRepository; }

  _options({ page, limit, search, sortBy, sortOrder }) {
    const allowed = ['name', 'createdAt', 'updatedAt', 'level'];
    return { skip: (page - 1) * limit, take: limit, search, sortBy: allowed.includes(sortBy) ? sortBy : 'createdAt', sortOrder };
  }

  _meta(total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return { total, page, limit, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 };
  }

  async listRoles(organizationId, query) {
    const { roles, total } = await this.repo.findAll(organizationId, this._options(query));
    return { roles, meta: this._meta(total, query.page, query.limit) };
  }

  async getRole(id, organizationId) {
    const role = await this.repo.findById(id, organizationId);
    if (!role) throw AppError.notFound('Role not found.');
    return role;
  }

  async createRole(organizationId, data, req) {
    if (await this.repo.existsByName(data.name, organizationId)) throw AppError.badRequest(`Role '${data.name}' already exists.`);
    const role = await this.repo.create({ organizationId, name: data.name, description: data.description, isSystem: false });
    await logAudit({ organizationId, userId: req.user.id, action: 'role.create', moduleName: 'roles', details: { roleId: role.id, name: role.name }, req });
    return role;
  }

  async updateRole(id, organizationId, data, req) {
    const role = await this.getRole(id, organizationId);
    if (role.isSystem) throw AppError.forbidden('System roles cannot be modified.');
    if (data.name && data.name !== role.name && await this.repo.existsByName(data.name, organizationId, id)) throw AppError.badRequest(`Role '${data.name}' already exists.`);
    const updated = await this.repo.update(id, { ...(data.name !== undefined && { name: data.name }), ...(data.description !== undefined && { description: data.description }) });
    await logAudit({ organizationId, userId: req.user.id, action: 'role.update', moduleName: 'roles', details: { roleId: id, changes: data }, req });
    return updated;
  }

  async deleteRole(id, organizationId, req) {
    const role = await this.getRole(id, organizationId);
    if (role.isSystem) throw AppError.forbidden('System roles cannot be deleted.');
    if (role._count.users > 0) throw AppError.conflict('Cannot delete a role assigned to users.');
    await this.repo.delete(id);
    await logAudit({ organizationId, userId: req.user.id, action: 'role.delete', moduleName: 'roles', details: { roleId: id, name: role.name }, req });
  }

  async getStatistics(organizationId) { return this.repo.getStatistics(organizationId); }
}
