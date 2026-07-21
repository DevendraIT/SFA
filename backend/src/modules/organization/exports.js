/**
 * Organization Module Exports
 * Centralized export file for all Organization module components
 */

// Core Components
export { OrganizationController } from './controllers/organization.controller.js';
export { OrganizationService } from './services/organization.service.js';
export { OrganizationRepository } from './repositories/OrganizationRepository.js';

// Validation Schemas
export {
  createOrganizationSchema,
  updateOrganizationSchema,
  createCompanySchema,
  updateCompanySchema,
  createBranchSchema,
  updateBranchSchema,
  createDepartmentSchema,
  updateDepartmentSchema,
  createTerritorySchema,
  updateTerritorySchema,
  listQuerySchema,
  idParamSchema,
} from './validators/organization.validation.js';

// Permissions
export { ORGANIZATION_PERMISSIONS } from './permissions/organization.permission.js';

// Routes (default export from main index.js)
export { default as organizationRouter } from './routes/organization.routes.js';