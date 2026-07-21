import { ApiResponse } from '../../../shared/response.js';

/**
 * Role Controller
 * Thin HTTP layer — delegates all logic to RoleService
 */
export class RoleController {
  constructor(roleService) {
    this.service = roleService;
  }

  listRoles = async (req, res, next) => {
    try {
      const { roles, meta } = await this.service.listRoles(req.user.organizationId, req.query);
      res.json(ApiResponse.success('Roles retrieved successfully.', { roles }, meta));
    } catch (error) {
      next(error);
    }
  };

  getRole = async (req, res, next) => {
    try {
      const role = await this.service.getRole(req.params.id, req.user.organizationId);
      res.json(ApiResponse.success('Role retrieved successfully.', role));
    } catch (error) {
      next(error);
    }
  };

  createRole = async (req, res, next) => {
    try {
      const role = await this.service.createRole(req.user.organizationId, req.body, req);
      res.status(201).json(ApiResponse.success('Role created successfully.', role));
    } catch (error) {
      next(error);
    }
  };

  updateRole = async (req, res, next) => {
    try {
      const updated = await this.service.updateRole(req.params.id, req.user.organizationId, req.body, req);
      res.json(ApiResponse.success('Role updated successfully.', updated));
    } catch (error) {
      next(error);
    }
  };

  deleteRole = async (req, res, next) => {
    try {
      await this.service.deleteRole(req.params.id, req.user.organizationId, req);
      res.json(ApiResponse.success('Role deleted successfully.'));
    } catch (error) {
      next(error);
    }
  };

  getStatistics = async (req, res, next) => {
    try {
      const statistics = await this.service.getStatistics(req.user.organizationId, req);
      res.json(ApiResponse.success('Role statistics retrieved successfully.', statistics));
    } catch (error) {
      next(error);
    }
  };
}