import { ApiResponse } from '../../../shared/response.js';

/**
 * Permission Controller
 * Thin HTTP layer — delegates all logic to PermissionService
 */
export class PermissionController {
  constructor(permissionService) {
    this.service = permissionService;
  }

  listPermissions = async (req, res, next) => {
    try {
      const { permissions, meta } = await this.service.listPermissions(req.user.organizationId, req.query);
      res.json(ApiResponse.success('Permissions retrieved successfully.', { permissions }, meta));
    } catch (error) {
      next(error);
    }
  };

  getPermission = async (req, res, next) => {
    try {
      const permission = await this.service.getPermission(req.params.id, req.user.organizationId);
      res.json(ApiResponse.success('Permission retrieved successfully.', permission));
    } catch (error) {
      next(error);
    }
  };

  createPermission = async (req, res, next) => {
    try {
      const permission = await this.service.createPermission(req.user.organizationId, req.body, req);
      res.status(201).json(ApiResponse.success('Permission created successfully.', permission));
    } catch (error) {
      next(error);
    }
  };

  updatePermission = async (req, res, next) => {
    try {
      const updated = await this.service.updatePermission(req.params.id, req.user.organizationId, req.body, req);
      res.json(ApiResponse.success('Permission updated successfully.', updated));
    } catch (error) {
      next(error);
    }
  };

  deletePermission = async (req, res, next) => {
    try {
      await this.service.deletePermission(req.params.id, req.user.organizationId, req);
      res.json(ApiResponse.success('Permission deleted successfully.'));
    } catch (error) {
      next(error);
    }
  };

  getStatistics = async (req, res, next) => {
    try {
      const statistics = await this.service.getStatistics(req.user.organizationId, req);
      res.json(ApiResponse.success('Permission statistics retrieved successfully.', statistics));
    } catch (error) {
      next(error);
    }
  };
}