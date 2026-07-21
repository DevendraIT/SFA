/**
 * Sales Order Module - Permission Slugs
 * Enterprise RBAC permission definitions for sales order operations
 */

import { PERMISSIONS } from '../../auth/auth.permissions.js';

/**
 * Sales Order Permission Slugs
 * Reuses central RBAC permission definitions with extended granular permissions
 */
export const SALES_ORDER_PERMISSIONS = {
  // Basic CRUD permissions
  READ: PERMISSIONS.ORDERS.READ,
  CREATE: PERMISSIONS.ORDERS.CREATE,
  UPDATE: PERMISSIONS.ORDERS.UPDATE,
  DELETE: PERMISSIONS.ORDERS.DELETE,

  // Extended granular permissions
  APPROVE: 'approve:orders',
  REJECT: 'reject:orders',
  CANCEL: 'cancel:orders',
  COMPLETE: 'complete:orders',
  
  // Assignment permissions
  ASSIGN: 'assign:orders',
  REASSIGN: 'reassign:orders',
  
  // Bulk operation permissions
  BULK_UPDATE: 'bulk_update:orders',
  BULK_DELETE: 'bulk_delete:orders',
  
  // Status-specific permissions
  OVERRIDE_STATUS: 'override_status:orders',
  BYPASS_APPROVAL: 'bypass_approval:orders',
  
  // Advanced permissions
  VIEW_ALL_ORDERS: 'view_all:orders', // Cross-territory/branch access
  EXPORT_ORDERS: 'export:orders',
  IMPORT_ORDERS: 'import:orders',
  
  // Audit and reporting
  VIEW_AUDIT_TRAIL: 'view_audit:orders',
  VIEW_ANALYTICS: 'view_analytics:orders',
  
  // Integration permissions
  ERP_SYNC: 'erp_sync:orders',
  EXTERNAL_API: 'external_api:orders',
};

/**
 * Legacy compatibility - matches existing controller usage
 */
export const ORDERS_PERMISSIONS = {
  READ: SALES_ORDER_PERMISSIONS.READ,
  CREATE: SALES_ORDER_PERMISSIONS.CREATE,
  UPDATE: SALES_ORDER_PERMISSIONS.UPDATE,
  DELETE: SALES_ORDER_PERMISSIONS.DELETE,
};

const SALES_REP_PERMISSIONS = [
  SALES_ORDER_PERMISSIONS.READ,
  SALES_ORDER_PERMISSIONS.CREATE,
  SALES_ORDER_PERMISSIONS.UPDATE,
  SALES_ORDER_PERMISSIONS.ASSIGN,
];

const SALES_MANAGER_PERMISSIONS = [
  ...SALES_REP_PERMISSIONS,
  SALES_ORDER_PERMISSIONS.DELETE,
  SALES_ORDER_PERMISSIONS.APPROVE,
  SALES_ORDER_PERMISSIONS.REJECT,
  SALES_ORDER_PERMISSIONS.CANCEL,
  SALES_ORDER_PERMISSIONS.COMPLETE,
  SALES_ORDER_PERMISSIONS.REASSIGN,
  SALES_ORDER_PERMISSIONS.BULK_UPDATE,
  SALES_ORDER_PERMISSIONS.VIEW_ALL_ORDERS,
  SALES_ORDER_PERMISSIONS.VIEW_ANALYTICS,
];
/**
 * Permission Groups for Role-Based Assignment
 */
export const PERMISSION_GROUPS = {
  SALES_REP: SALES_REP_PERMISSIONS,
  SALES_MANAGER: SALES_MANAGER_PERMISSIONS,
  ADMINISTRATOR: [...Object.values(SALES_ORDER_PERMISSIONS)],
};

/**
 * Approval Authority Levels
 * Maps permission levels to approval authority
 */
export const APPROVAL_PERMISSIONS = {
  LEVEL_1: [
    SALES_ORDER_PERMISSIONS.APPROVE,
  ],
  LEVEL_2: [
    SALES_ORDER_PERMISSIONS.APPROVE,
    SALES_ORDER_PERMISSIONS.OVERRIDE_STATUS,
  ],
  LEVEL_3: [
    SALES_ORDER_PERMISSIONS.APPROVE,
    SALES_ORDER_PERMISSIONS.OVERRIDE_STATUS,
    SALES_ORDER_PERMISSIONS.BYPASS_APPROVAL,
  ],
};

/**
 * Status-based Permission Matrix
 * Defines which permissions are needed for specific status transitions
 */
export const STATUS_PERMISSION_MATRIX = {
  'draft->pending': [SALES_ORDER_PERMISSIONS.UPDATE],
  'pending->approved': [SALES_ORDER_PERMISSIONS.APPROVE],
  'pending->rejected': [SALES_ORDER_PERMISSIONS.REJECT],
  'approved->completed': [SALES_ORDER_PERMISSIONS.COMPLETE],
  'approved->cancelled': [SALES_ORDER_PERMISSIONS.CANCEL],
  'any->cancelled': [SALES_ORDER_PERMISSIONS.CANCEL],
};

/**
 * Helper function to check if user has required permission for status change
 */
export const hasStatusChangePermission = (userPermissions, fromStatus, toStatus) => {
  const transitionKey = `${fromStatus}->${toStatus}`;
  const anyTransitionKey = `any->${toStatus}`;
  
  const requiredPermissions = STATUS_PERMISSION_MATRIX[transitionKey] || 
                             STATUS_PERMISSION_MATRIX[anyTransitionKey] || 
                             [SALES_ORDER_PERMISSIONS.UPDATE];
  
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

/**
 * Helper function to get user's approval authority level
 */
export const getUserApprovalLevel = (userPermissions) => {
  if (userPermissions.includes(SALES_ORDER_PERMISSIONS.BYPASS_APPROVAL)) {
    return 3;
  }
  if (userPermissions.includes(SALES_ORDER_PERMISSIONS.OVERRIDE_STATUS)) {
    return 2;
  }
  if (userPermissions.includes(SALES_ORDER_PERMISSIONS.APPROVE)) {
    return 1;
  }
  return 0;
};

/**
 * Helper function to check bulk operation permissions
 */
export const canPerformBulkOperation = (userPermissions, operation) => {
  const bulkPermissionMap = {
    'status_update': SALES_ORDER_PERMISSIONS.BULK_UPDATE,
    'delete': SALES_ORDER_PERMISSIONS.BULK_DELETE,
    'assign': SALES_ORDER_PERMISSIONS.REASSIGN,
    'approve': SALES_ORDER_PERMISSIONS.APPROVE,
    'reject': SALES_ORDER_PERMISSIONS.REJECT,
  };
  
  const requiredPermission = bulkPermissionMap[operation];
  return requiredPermission ? userPermissions.includes(requiredPermission) : false;
};

// Default export for backward compatibility
export default SALES_ORDER_PERMISSIONS;
