import { ApiResponse } from '../../../shared/response.js';

/**
 * Users Controller
 * Thin HTTP layer — delegates all logic to UsersService
 */
export class UserController {
  constructor(usersService) {
    this.service = usersService;
  }

  listUsers = async (req, res, next) => {
    try {
      const { users, meta } = await this.service.listUsers(req.user.organizationId, req.query);
      res.json(ApiResponse.success('Users retrieved successfully.', { users }, meta));
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req, res, next) => {
    try {
      const user = await this.service.getUser(req.params.id, req.user.organizationId);
      res.json(ApiResponse.success('User retrieved successfully.', user));
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req, res, next) => {
    try {
      const user = await this.service.createUser(req.user.organizationId, req.body, req);
      res.status(201).json(ApiResponse.success('User created successfully.', user));
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const user = await this.service.updateUser(req.params.id, req.user.organizationId, req.body, req);
      res.json(ApiResponse.success('User updated successfully.', user));
    } catch (error) {
      next(error);
    }
  };

  updateUserRoles = async (req, res, next) => {
    try {
      const user = await this.service.updateUserRoles(req.params.id, req.user.organizationId, req.body.roleIds, req);
      res.json(ApiResponse.success('User roles updated successfully.', user));
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      await this.service.deleteUser(req.params.id, req.user.organizationId, req);
      res.json(ApiResponse.success('User deactivated and removed successfully.'));
    } catch (error) {
      next(error);
    }
  };

  getSubordinates = async (req, res, next) => {
    try {
      const result = await this.service.getSubordinates(req.params.id, req.user.organizationId);
      res.json(ApiResponse.success('Subordinates retrieved successfully.', result));
    } catch (error) {
      next(error);
    }
  };

  getManagerHierarchy = async (req, res, next) => {
    try {
      const result = await this.service.getManagerHierarchy(req.params.id, req.user.organizationId);
      res.json(ApiResponse.success('Manager hierarchy retrieved successfully.', result));
    } catch (error) {
      next(error);
    }
  };
}
