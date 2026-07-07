export const ROLE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

export const DEFAULT_SYSTEM_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  HEAD_OF_SALES: 'head_of_sales',
  SALES_MANAGER: 'sales_manager',
  SALES_PERSON: 'sales_person',
  MANAGER: 'manager',
  SALES_REP: 'sales_rep',
  VIEWER: 'viewer'
};

export const ENTERPRISE_SYSTEM_ROLES = [
  'admin',
  'head_of_sales',
  'sales_manager',
  'sales_person'
];

export const RESERVED_ROLE_NAMES = [
  'super_admin',
  'system_admin',
  'root',
  'administrator',
  'admin',
  'head_of_sales',
  'sales_manager',
  'sales_person',
  'guest',
  'anonymous',
  'public'
];

export const ROLE_VALIDATION = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 255,
  PERMISSIONS_MAX_COUNT: 100
};

export const ROLE_TYPES = {
  SYSTEM: 'system',
  CUSTOM: 'custom',
  ORGANIZATIONAL: 'organizational'
};

export const DEFAULT_ROLE_STATUS = ROLE_STATUS.ACTIVE;