import express from 'express';
import { authenticate, requireOrganization, authorize } from '../../../middlewares/auth.middleware.js';
import validate from '../../../middlewares/validation.middleware.js';
import { RoleRepository } from '../repositories/role.repository.js';
import { RoleService } from '../services/role.service.js';
import { RoleController } from '../controllers/role.controller.js';
import {
  createRoleSchema,
  updateRoleSchema,
  listRoleSchema,
  roleIdSchema,
} from '../validators/role.validation.js';
import { ROLE_PERMISSIONS } from '../permissions/role.permission.js';

const router = express.Router();

const roleRepository = new RoleRepository();
const roleService = new RoleService(roleRepository);
const roleController = new RoleController(roleService);

router.use(authenticate, requireOrganization);

const P = ROLE_PERMISSIONS;

router.get(
  '/statistics',
  authorize(P.READ_ROLES),
  roleController.getStatistics
);

router.get(
  '/',
  authorize(P.READ_ROLES),
  validate(listRoleSchema, 'query'),
  roleController.listRoles
);

router.post(
  '/',
  authorize(P.CREATE_ROLES),
  validate(createRoleSchema, 'body'),
  roleController.createRole
);

router.get(
  '/:id',
  authorize(P.READ_ROLES),
  validate(roleIdSchema, 'params'),
  roleController.getRole
);

router.put(
  '/:id',
  authorize(P.UPDATE_ROLES),
  validate(roleIdSchema, 'params'),
  validate(updateRoleSchema, 'body'),
  roleController.updateRole
);

router.delete(
  '/:id',
  authorize(P.DELETE_ROLES),
  validate(roleIdSchema, 'params'),
  roleController.deleteRole
);

export default router;
export { roleController, roleService, roleRepository };