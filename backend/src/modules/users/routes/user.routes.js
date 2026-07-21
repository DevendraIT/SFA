import express from 'express';
import { authenticate, requireOrganization, authorize } from '../../../middlewares/auth.middleware.js';
import validate from '../../../middlewares/validation.middleware.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { UserService } from '../services/user.service.js';
import { UserController } from '../controllers/user.controller.js';
import {
  listQuerySchema,
  createUserSchema,
  updateUserSchema,
  updateUserRolesSchema,
  idParamSchema,
} from '../validators/user.validation.js';
import { USER_PERMISSIONS } from '../permissions/user.permission.js';

const router = express.Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.use(authenticate, requireOrganization);

const P = USER_PERMISSIONS;

// List & Create
router.get('/', authorize(P.READ_USER), validate(listQuerySchema, 'query'), userController.listUsers);
router.post('/', authorize(P.CREATE_USER), validate(createUserSchema, 'body'), userController.createUser);

// Single User CRUD
router.get('/:id', authorize(P.READ_USER), validate(idParamSchema, 'params'), userController.getUser);
router.put('/:id', authorize(P.UPDATE_USER), validate(idParamSchema, 'params'), validate(updateUserSchema, 'body'), userController.updateUser);
router.delete('/:id', authorize(P.DELETE_USER), validate(idParamSchema, 'params'), userController.deleteUser);

// Role Management
router.put('/:id/roles', authorize(P.UPDATE_USER), validate(idParamSchema, 'params'), validate(updateUserRolesSchema, 'body'), userController.updateUserRoles);

// User Status Management
router.patch('/:id/activate', authorize(P.UPDATE_USER), validate(idParamSchema, 'params'), userController.activateUser);
router.patch('/:id/deactivate', authorize(P.UPDATE_USER), validate(idParamSchema, 'params'), userController.deactivateUser);

// Bulk Operations
router.post('/bulk/update', authorize(P.UPDATE_USER), userController.bulkUpdateUsers);

// Reporting Hierarchy
router.get('/:id/subordinates', authorize(P.READ_USER), validate(idParamSchema, 'params'), userController.getSubordinates);
router.get('/:id/hierarchy', authorize(P.READ_USER), validate(idParamSchema, 'params'), userController.getManagerHierarchy);

export default router;
export { userController, userService, userRepository };
