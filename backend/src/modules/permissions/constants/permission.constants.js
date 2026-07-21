export const PERMISSION_CATEGORIES = {
  SYSTEM: 'system',
  ORGANIZATION: 'organization',
  USER_MANAGEMENT: 'user_management',
  ROLE_MANAGEMENT: 'role_management',
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
  MANAGE_SYSTEM: 'system:manage',
  VIEW_SYSTEM_LOGS: 'system:logs:read',
  MANAGE_SYSTEM_CONFIG: 'system:config:manage',
  MANAGE_SUBSCRIPTION: 'subscription:manage',
  VIEW_AUDIT_LOGS: 'audit:read',
  CREATE_ORGANIZATION: 'organization:create',
  READ_ORGANIZATION: 'organization:read',
  UPDATE_ORGANIZATION: 'organization:update',
  DELETE_ORGANIZATION: 'organization:delete',
  MANAGE_COMPANY: 'company:manage',
  MANAGE_BRANCH: 'branch:manage',
  MANAGE_DEPARTMENT: 'dept:manage',
  MANAGE_TERRITORY: 'territory:manage',
  PLAN_TERRITORY: 'territory:plan',
  MANAGE_TEAM: 'team:manage',
  CREATE_USER: 'users:create',
  READ_USER: 'users:read',
  UPDATE_USER: 'users:update',
  DELETE_USER: 'users:delete',
  MANAGE_USER_ROLES: 'users:roles:manage',
  CREATE_ROLE: 'roles:create',
  READ_ROLE: 'roles:read',
  UPDATE_ROLE: 'roles:update',
  DELETE_ROLE: 'roles:delete',
  ASSIGN_PERMISSIONS: 'roles:permissions:assign',
  CREATE_PERMISSION: 'permissions:create',
  READ_PERMISSION: 'permissions:read',
  UPDATE_PERMISSION: 'permissions:update',
  DELETE_PERMISSION: 'permissions:delete',
  MANAGE_WORKFLOW: 'workflow:manage',
  MANAGE_INTEGRATION: 'integration:manage',
  VIEW_ORG_DASHBOARD: 'dashboard:org',
  VIEW_SALES_DASHBOARD: 'dashboard:sales',
  VIEW_TEAM_ANALYTICS: 'analytics:team',
  VIEW_FORECAST: 'forecast:read',
  MANAGE_TARGETS: 'target:manage',
  MANAGE_REVIEWS: 'reviews:manage',
  MONITOR_USERS: 'users:monitor',
  MANAGE_CAMPAIGNS: 'campaigns:manage',
  RUN_CAMPAIGNS: 'campaigns:run',
  MONITOR_CAMPAIGNS: 'campaigns:monitor',
  SEND_EMAILS: 'emails:send',

  CREATE_ORDER: 'orders:create',
  READ_ORDER: 'orders:read',
  UPDATE_ORDER: 'orders:update',
  DELETE_ORDER: 'orders:delete',
  APPROVE_ORDER: 'orders:approve',
  CANCEL_ORDER: 'orders:cancel',
  GENERATE_QUOTATION: 'quotations:generate',
  APPROVE_QUOTATION: 'quotations:approve',
  VIEW_REPORTS: 'reports:read',
  CREATE_REPORTS: 'reports:create',
  EXPORT_REPORTS: 'reports:export',
  VIEW_PERFORMANCE_REPORTS: 'reports:performance',
  SUBMIT_DAILY_REPORTS: 'reports:daily',
  MANAGE_VISITS: 'visits:manage',
  MANAGE_SETTINGS: 'settings:manage',
  VIEW_SETTINGS: 'settings:read'
};

export const PERMISSION_GROUPS = {
  ORGANIZATION_SUPER_ADMIN: {
    name: 'Organization Super Admin',
    description: 'Full system access and global configuration',
    permissions: Object.values(SYSTEM_PERMISSIONS)
  },
  COMPANY_ADMIN: {
    name: 'Company Admin',
    description: 'Company-level administration',
    permissions: [
      SYSTEM_PERMISSIONS.MANAGE_COMPANY,
      SYSTEM_PERMISSIONS.MANAGE_BRANCH,
      SYSTEM_PERMISSIONS.MANAGE_DEPARTMENT,
      SYSTEM_PERMISSIONS.MANAGE_TERRITORY,
      SYSTEM_PERMISSIONS.MANAGE_TEAM,
      SYSTEM_PERMISSIONS.CREATE_USER,
      SYSTEM_PERMISSIONS.READ_USER,
      SYSTEM_PERMISSIONS.UPDATE_USER,
      SYSTEM_PERMISSIONS.DELETE_USER,
      SYSTEM_PERMISSIONS.MANAGE_USER_ROLES,
      SYSTEM_PERMISSIONS.CREATE_ROLE,
      SYSTEM_PERMISSIONS.READ_ROLE,
      SYSTEM_PERMISSIONS.UPDATE_ROLE,
      SYSTEM_PERMISSIONS.DELETE_ROLE,
      SYSTEM_PERMISSIONS.ASSIGN_PERMISSIONS,
      SYSTEM_PERMISSIONS.CREATE_PERMISSION,
      SYSTEM_PERMISSIONS.READ_PERMISSION,
      SYSTEM_PERMISSIONS.UPDATE_PERMISSION,
      SYSTEM_PERMISSIONS.DELETE_PERMISSION,
      SYSTEM_PERMISSIONS.MANAGE_WORKFLOW,
      SYSTEM_PERMISSIONS.MANAGE_INTEGRATION
    ]
  },
  HEAD_OF_SALES: {
    name: 'Head of Sales',
    description: 'Sales strategy and campaign oversight',
    permissions: [
      SYSTEM_PERMISSIONS.MANAGE_TARGETS,
      SYSTEM_PERMISSIONS.VIEW_SALES_DASHBOARD,
      SYSTEM_PERMISSIONS.MONITOR_CAMPAIGNS,
      SYSTEM_PERMISSIONS.MANAGE_CAMPAIGNS,
      SYSTEM_PERMISSIONS.READ_PIPELINE,
      SYSTEM_PERMISSIONS.VIEW_TEAM_ANALYTICS,
      SYSTEM_PERMISSIONS.PLAN_TERRITORY,
      SYSTEM_PERMISSIONS.VIEW_PERFORMANCE_REPORTS,
      SYSTEM_PERMISSIONS.VIEW_FORECAST,
      SYSTEM_PERMISSIONS.VIEW_REPORTS,
      SYSTEM_PERMISSIONS.EXPORT_REPORTS
    ]
  },
  SALES_MANAGER: {
    name: 'Sales Manager',
    description: 'Sales team management and campaign execution',
    permissions: [
      SYSTEM_PERMISSIONS.RUN_CAMPAIGNS,
      SYSTEM_PERMISSIONS.MONITOR_USERS,
      SYSTEM_PERMISSIONS.MANAGE_REVIEWS,
      SYSTEM_PERMISSIONS.VIEW_REPORTS,
      SYSTEM_PERMISSIONS.APPROVE_QUOTATION,
      SYSTEM_PERMISSIONS.APPROVE_ORDER
    ]
  },
  SALES_EXECUTIVE: {
    name: 'Sales Executive',
    description: 'Individual sales activities',
    permissions: [
      SYSTEM_PERMISSIONS.SEND_EMAILS,
      SYSTEM_PERMISSIONS.GENERATE_QUOTATION,
      SYSTEM_PERMISSIONS.CREATE_ORDER,
      SYSTEM_PERMISSIONS.READ_ORDER,
      SYSTEM_PERMISSIONS.SUBMIT_DAILY_REPORTS,
      SYSTEM_PERMISSIONS.MANAGE_VISITS
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
