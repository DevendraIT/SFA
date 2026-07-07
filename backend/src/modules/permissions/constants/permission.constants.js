export const PERMISSION_CATEGORIES = {
  SYSTEM: 'system',
  ORGANIZATION: 'organization',
  USER_MANAGEMENT: 'user_management',
  ROLE_MANAGEMENT: 'role_management',
  LEAD_MANAGEMENT: 'lead_management',
  SALES_ORDER: 'sales_order',
  REPORTING: 'reporting',
  SETTINGS: 'settings',
  INTEGRATION: 'integration',
  CUSTOM: 'custom'
};

export const PERMISSION_TYPES = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  EXECUTE: 'execute',
  APPROVE: 'approve',
  EXPORT: 'export',
  IMPORT: 'import'
};

export const PERMISSION_SCOPES = {
  GLOBAL: 'global',
  ORGANIZATION: 'organization',
  DEPARTMENT: 'department',
  TEAM: 'team',
  SELF: 'self'
};

export const PERMISSION_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DEPRECATED: 'deprecated'
};

export const SYSTEM_PERMISSIONS = {
  // System Administration
  MANAGE_SYSTEM: 'system:manage',
  VIEW_SYSTEM_LOGS: 'system:logs:read',
  MANAGE_SYSTEM_CONFIG: 'system:config:manage',
  
  // Organization Management
  CREATE_ORGANIZATION: 'organization:create',
  READ_ORGANIZATION: 'organization:read',
  UPDATE_ORGANIZATION: 'organization:update',
  DELETE_ORGANIZATION: 'organization:delete',
  
  // User Management
  CREATE_USER: 'users:create',
  READ_USER: 'users:read',
  UPDATE_USER: 'users:update',
  DELETE_USER: 'users:delete',
  MANAGE_USER_ROLES: 'users:roles:manage',
  
  // Role Management
  CREATE_ROLE: 'roles:create',
  READ_ROLE: 'roles:read',
  UPDATE_ROLE: 'roles:update',
  DELETE_ROLE: 'roles:delete',
  ASSIGN_PERMISSIONS: 'roles:permissions:assign',
  
  // Permission Management
  CREATE_PERMISSION: 'permissions:create',
  READ_PERMISSION: 'permissions:read',
  UPDATE_PERMISSION: 'permissions:update',
  DELETE_PERMISSION: 'permissions:delete',
  
  // Lead Management
  CREATE_LEAD: 'leads:create',
  READ_LEAD: 'leads:read',
  UPDATE_LEAD: 'leads:update',
  DELETE_LEAD: 'leads:delete',
  CONVERT_LEAD: 'leads:convert',
  ASSIGN_LEAD: 'leads:assign',
  EXPORT_LEADS: 'leads:export',
  
  // Sales Order Management
  CREATE_ORDER: 'orders:create',
  READ_ORDER: 'orders:read',
  UPDATE_ORDER: 'orders:update',
  DELETE_ORDER: 'orders:delete',
  APPROVE_ORDER: 'orders:approve',
  CANCEL_ORDER: 'orders:cancel',
  
  // Reporting
  VIEW_REPORTS: 'reports:read',
  CREATE_REPORTS: 'reports:create',
  EXPORT_REPORTS: 'reports:export',
  
  // Settings
  MANAGE_SETTINGS: 'settings:manage',
  VIEW_SETTINGS: 'settings:read'
};

export const PERMISSION_GROUPS = {
  SUPER_ADMIN: {
    name: 'Super Administrator',
    description: 'Full system access',
    permissions: [
      SYSTEM_PERMISSIONS.MANAGE_SYSTEM,
      SYSTEM_PERMISSIONS.VIEW_SYSTEM_LOGS,
      SYSTEM_PERMISSIONS.MANAGE_SYSTEM_CONFIG,
      SYSTEM_PERMISSIONS.CREATE_ORGANIZATION,
      SYSTEM_PERMISSIONS.READ_ORGANIZATION,
      SYSTEM_PERMISSIONS.UPDATE_ORGANIZATION,
      SYSTEM_PERMISSIONS.DELETE_ORGANIZATION
    ]
  },
  
  ADMIN: {
    name: 'Administrator',
    description: 'Organization administration',
    permissions: [
      SYSTEM_PERMISSIONS.READ_ORGANIZATION,
      SYSTEM_PERMISSIONS.UPDATE_ORGANIZATION,
      SYSTEM_PERMISSIONS.CREATE_USER,
      SYSTEM_PERMISSIONS.READ_USER,
      SYSTEM_PERMISSIONS.UPDATE_USER,
      SYSTEM_PERMISSIONS.DELETE_USER,
      SYSTEM_PERMISSIONS.MANAGE_USER_ROLES,
      SYSTEM_PERMISSIONS.CREATE_ROLE,
      SYSTEM_PERMISSIONS.READ_ROLE,
      SYSTEM_PERMISSIONS.UPDATE_ROLE,
      SYSTEM_PERMISSIONS.DELETE_ROLE,
      SYSTEM_PERMISSIONS.ASSIGN_PERMISSIONS
    ]
  },
  
  SALES_MANAGER: {
    name: 'Sales Manager',
    description: 'Sales team management and oversight',
    permissions: [
      SYSTEM_PERMISSIONS.READ_USER,
      SYSTEM_PERMISSIONS.CREATE_LEAD,
      SYSTEM_PERMISSIONS.READ_LEAD,
      SYSTEM_PERMISSIONS.UPDATE_LEAD,
      SYSTEM_PERMISSIONS.CONVERT_LEAD,
      SYSTEM_PERMISSIONS.ASSIGN_LEAD,
      SYSTEM_PERMISSIONS.EXPORT_LEADS,
      SYSTEM_PERMISSIONS.CREATE_ORDER,
      SYSTEM_PERMISSIONS.READ_ORDER,
      SYSTEM_PERMISSIONS.UPDATE_ORDER,
      SYSTEM_PERMISSIONS.APPROVE_ORDER,
      SYSTEM_PERMISSIONS.VIEW_REPORTS,
      SYSTEM_PERMISSIONS.EXPORT_REPORTS
    ]
  },
  
  SALES_PERSON: {
    name: 'Sales Person',
    description: 'Individual sales activities',
    permissions: [
      SYSTEM_PERMISSIONS.CREATE_LEAD,
      SYSTEM_PERMISSIONS.READ_LEAD,
      SYSTEM_PERMISSIONS.UPDATE_LEAD,
      SYSTEM_PERMISSIONS.CREATE_ORDER,
      SYSTEM_PERMISSIONS.READ_ORDER,
      SYSTEM_PERMISSIONS.UPDATE_ORDER,
      SYSTEM_PERMISSIONS.VIEW_REPORTS
    ]
  },
  
  VIEWER: {
    name: 'Viewer',
    description: 'Read-only access',
    permissions: [
      SYSTEM_PERMISSIONS.READ_ORGANIZATION,
      SYSTEM_PERMISSIONS.READ_USER,
      SYSTEM_PERMISSIONS.READ_LEAD,
      SYSTEM_PERMISSIONS.READ_ORDER,
      SYSTEM_PERMISSIONS.VIEW_REPORTS
    ]
  }
};

export const PERMISSION_VALIDATION = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 255,
  SLUG_MIN_LENGTH: 3,
  SLUG_MAX_LENGTH: 100,
  CATEGORY_MAX_LENGTH: 50,
  SCOPE_MAX_LENGTH: 50
};

export const RESERVED_PERMISSION_SLUGS = [
  'system:manage',
  'system:config:manage',
  'organization:delete',
  'users:delete',
  'roles:delete',
  'permissions:delete'
];

export const DEFAULT_PERMISSION_STATUS = PERMISSION_STATUS.ACTIVE;