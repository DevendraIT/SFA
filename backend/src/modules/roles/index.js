import roleRouter from './routes/role.routes.js';

export default roleRouter;

export { RoleRepository } from './repositories/role.repository.js';
export { RoleService } from './services/role.service.js';
export { RoleController } from './controllers/role.controller.js';

export {
  ENTERPRISE_ROLES,
  ENTERPRISE_ROLE_LEVELS,
  ENTERPRISE_ROLE_HIERARCHY,
  RESERVED_ROLE_NAMES,
  ROLE_VALIDATION,
} from './constants/role.constants.js';