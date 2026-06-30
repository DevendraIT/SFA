/**
 * Enterprise Role-Based Access Control (RBAC) Permissions Configuration
 */

// --------------------------------------------------
// 1. MODULE PERMISSION CONSTANTS
// --------------------------------------------------
export const PERMISSIONS = {
  // User Management
  USERS: {
    READ: "read:users",
    CREATE: "write:users",
    UPDATE: "update:users",
    DELETE: "delete:users",
  },
  
  // Organization Structure Settings
  ORGANIZATION: {
    READ: "read:organization",
    UPDATE: "update:organization",
  },

  // Security & Sessions Control
  SECURITY: {
    MANAGE_SESSIONS: "manage:sessions",
    VIEW_AUDIT_LOGS: "read:audit_logs",
  },

  // Sales CRM Core entities
  LEADS: {
    READ: "read:leads",
    CREATE: "write:leads",
    UPDATE: "update:leads",
    DELETE: "delete:leads",
  },
  
  CUSTOMERS: {
    READ: "read:customers",
    CREATE: "write:customers",
    UPDATE: "update:customers",
    DELETE: "delete:customers",
  },
  
  OPPORTUNITIES: {
    READ: "read:opportunities",
    CREATE: "write:opportunities",
    UPDATE: "update:opportunities",
    DELETE: "delete:opportunities",
  },
  
  ORDERS: {
    READ: "read:orders",
    CREATE: "write:orders",
    UPDATE: "update:orders",
    DELETE: "delete:orders",
  },
};

// --------------------------------------------------
// 2. STANDARD ENTERPRISE ROLES & MAPS
// --------------------------------------------------
export const ROLES = {
  ADMINISTRATOR: "Administrator",
  SALES_MANAGER: "Sales Manager",
  SALES_REPRESENTATIVE: "Sales Representative",
};

/**
 * Standard Default Permission Sets mapped per Role
 */
export const ROLE_PERMISSION_MAPPING = {
  [ROLES.ADMINISTRATOR]: [
    ...Object.values(PERMISSIONS.USERS),
    ...Object.values(PERMISSIONS.ORGANIZATION),
    ...Object.values(PERMISSIONS.SECURITY),
    ...Object.values(PERMISSIONS.LEADS),
    ...Object.values(PERMISSIONS.CUSTOMERS),
    ...Object.values(PERMISSIONS.OPPORTUNITIES),
    ...Object.values(PERMISSIONS.ORDERS),
  ],
  [ROLES.SALES_MANAGER]: [
    PERMISSIONS.USERS.READ,
    PERMISSIONS.ORGANIZATION.READ,
    PERMISSIONS.LEADS.READ,
    PERMISSIONS.LEADS.CREATE,
    PERMISSIONS.LEADS.UPDATE,
    PERMISSIONS.CUSTOMERS.READ,
    PERMISSIONS.CUSTOMERS.CREATE,
    PERMISSIONS.CUSTOMERS.UPDATE,
    PERMISSIONS.OPPORTUNITIES.READ,
    PERMISSIONS.OPPORTUNITIES.CREATE,
    PERMISSIONS.OPPORTUNITIES.UPDATE,
    PERMISSIONS.ORDERS.READ,
    PERMISSIONS.ORDERS.CREATE,
    PERMISSIONS.ORDERS.UPDATE,
  ],
  [ROLES.SALES_REPRESENTATIVE]: [
    PERMISSIONS.ORGANIZATION.READ,
    PERMISSIONS.LEADS.READ,
    PERMISSIONS.LEADS.CREATE,
    PERMISSIONS.LEADS.UPDATE,
    PERMISSIONS.CUSTOMERS.READ,
    PERMISSIONS.CUSTOMERS.CREATE,
    PERMISSIONS.CUSTOMERS.UPDATE,
    PERMISSIONS.OPPORTUNITIES.READ,
    PERMISSIONS.OPPORTUNITIES.CREATE,
    PERMISSIONS.OPPORTUNITIES.UPDATE,
  ],
};

// --------------------------------------------------
// 3. AUTHORIZATION UTILITY HELPERS
// --------------------------------------------------

/**
 * Check if a user context possesses a specific permission slug
 * @param {Object} user - Sanitized request user object
 * @param {string} permission - Permission slug
 * @returns {boolean} Access outcome
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) return false;
  
  // Administrator always bypassed
  if (user.roles?.includes(ROLES.ADMINISTRATOR)) return true;
  
  return user.permissions.includes(permission);
};

/**
 * Check if user possesses ANY of the listed permissions
 * @param {Object} user - Sanitized request user object
 * @param {string[]} permissions - Permissions list
 * @returns {boolean} Access outcome
 */
export const hasAnyPermission = (user, permissions = []) => {
  if (!user || !user.permissions) return false;
  if (user.roles?.includes(ROLES.ADMINISTRATOR)) return true;
  return permissions.some((permission) => user.permissions.includes(permission));
};

/**
 * Check if user possesses ALL of the listed permissions
 * @param {Object} user - Sanitized request user object
 * @param {string[]} permissions - Permissions list
 * @returns {boolean} Access outcome
 */
export const hasAllPermissions = (user, permissions = []) => {
  if (!user || !user.permissions) return false;
  if (user.roles?.includes(ROLES.ADMINISTRATOR)) return true;
  return permissions.every((permission) => user.permissions.includes(permission));
};

/**
 * Helper checking if user belongs to specific role
 * @param {Object} user - User request profile
 * @param {string} roleName - Target role name
 * @returns {boolean} check result
 */
export const isRole = (user, roleName) => {
  if (!user || !user.roles) return false;
  return user.roles.includes(roleName);
};

/**
 * Easy helper checking if user has owner/admin status
 * @param {Object} user - User request profile
 */
export const isAdmin = (user) => {
  return isRole(user, ROLES.ADMINISTRATOR);
};

export default {
  PERMISSIONS,
  ROLES,
  ROLE_PERMISSION_MAPPING,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isRole,
  isAdmin,
};
