import express from 'express';
import { authenticate, requireOrganization, authorize } from '../../../middlewares/auth.middleware.js';
import validate from '../../../middlewares/validation.middleware.js';
import { PermissionRepository } from '../repositories/PermissionRepository.js';
import { PermissionService } from '../services/permission.service.js';
import { PermissionController } from '../controllers/permission.controller.js';
import {
  createPermissionSchema,
  updatePermissionSchema,
  listPermissionSchema,
  permissionIdSchema,
} from '../validators/permission.validation.js';
import { SYSTEM_PERMISSIONS } from '../constants/permission.constants.js';

const router = express.Router();

const permissionRepository = new PermissionRepository();
const permissionService = new PermissionService(permissionRepository);
const permissionController = new PermissionController(permissionService);

router.use(authenticate, requireOrganization);

const P = SYSTEM_PERMISSIONS;

router.get(
  '/statistics',
  authorize(P.READ_PERMISSION),
  permissionController.getStatistics
);

router.get(
  '/',
  authorize(P.READ_PERMISSION),
  validate(listPermissionSchema, 'query'),
  permissionController.listPermissions
);

router.post(
  '/',
  authorize(P.CREATE_PERMISSION),
  validate(createPermissionSchema, 'body'),
  permissionController.createPermission
);

router.get(
  '/:id',
  authorize(P.READ_PERMISSION),
  validate(permissionIdSchema, 'params'),
  permissionController.getPermission
);

router.put(
  '/:id',
  authorize(P.UPDATE_PERMISSION),
  validate(permissionIdSchema, 'params'),
  validate(updatePermissionSchema, 'body'),
  permissionController.updatePermission
);

router.delete(
  '/:id',
  authorize(P.DELETE_PERMISSION),
  validate(permissionIdSchema, 'params'),
  permissionController.deletePermission
);

export default router;
export { permissionController, permissionService, permissionRepository };