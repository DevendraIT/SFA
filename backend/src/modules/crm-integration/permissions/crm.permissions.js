/**
 * CRM Integration Permissions - Enterprise Modular Monolith
 */

export const CRM_PERMISSIONS = {
  // Configuration permissions
  READ_CONFIGURATION: 'crm:read_configuration',
  WRITE_CONFIGURATION: 'crm:write_configuration',
  DELETE_CONFIGURATION: 'crm:delete_configuration',
  TEST_CONNECTION: 'crm:test_connection',

  // Sync permissions
  INITIATE_SYNC: 'crm:initiate_sync',
  VIEW_SYNC_STATUS: 'crm:view_sync_status',
  VIEW_SYNC_LOGS: 'crm:view_sync_logs',
  CANCEL_SYNC: 'crm:cancel_sync',

  // Mapping permissions
  VIEW_MAPPINGS: 'crm:view_mappings',
  UPDATE_MAPPINGS: 'crm:update_mappings',

  // Webhook permissions
  CONFIGURE_WEBHOOKS: 'crm:configure_webhooks',
  VIEW_WEBHOOK_EVENTS: 'crm:view_webhook_events',

  // Integration management
  PAUSE_INTEGRATION: 'crm:pause_integration',
  RESUME_INTEGRATION: 'crm:resume_integration',
  VIEW_INTEGRATION_STATUS: 'crm:view_integration_status',

  // Administrative permissions
  MANAGE_CRM_SETTINGS: 'crm:manage_settings',
  VIEW_CRM_ANALYTICS: 'crm:view_analytics',
  EXPORT_CRM_DATA: 'crm:export_data',
};

export const CRM_PERMISSION_GROUPS = {
  // Basic user permissions
  BASIC_USER: [
    CRM_PERMISSIONS.VIEW_SYNC_STATUS,
    CRM_PERMISSIONS.VIEW_INTEGRATION_STATUS,
  ],

  // CRM Manager permissions
  CRM_MANAGER: [
    CRM_PERMISSIONS.READ_CONFIGURATION,
    CRM_PERMISSIONS.VIEW_SYNC_STATUS,
    CRM_PERMISSIONS.VIEW_SYNC_LOGS,
    CRM_PERMISSIONS.VIEW_MAPPINGS,
    CRM_PERMISSIONS.VIEW_WEBHOOK_EVENTS,
    CRM_PERMISSIONS.VIEW_INTEGRATION_STATUS,
    CRM_PERMISSIONS.INITIATE_SYNC,
  ],

  // CRM Administrator permissions
  CRM_ADMIN: [
    CRM_PERMISSIONS.READ_CONFIGURATION,
    CRM_PERMISSIONS.WRITE_CONFIGURATION,
    CRM_PERMISSIONS.TEST_CONNECTION,
    CRM_PERMISSIONS.INITIATE_SYNC,
    CRM_PERMISSIONS.VIEW_SYNC_STATUS,
    CRM_PERMISSIONS.VIEW_SYNC_LOGS,
    CRM_PERMISSIONS.CANCEL_SYNC,
    CRM_PERMISSIONS.VIEW_MAPPINGS,
    CRM_PERMISSIONS.UPDATE_MAPPINGS,
    CRM_PERMISSIONS.CONFIGURE_WEBHOOKS,
    CRM_PERMISSIONS.VIEW_WEBHOOK_EVENTS,
    CRM_PERMISSIONS.PAUSE_INTEGRATION,
    CRM_PERMISSIONS.RESUME_INTEGRATION,
    CRM_PERMISSIONS.VIEW_INTEGRATION_STATUS,
    CRM_PERMISSIONS.VIEW_CRM_ANALYTICS,
    CRM_PERMISSIONS.EXPORT_CRM_DATA,
  ],

  // Super Administrator permissions
  SUPER_ADMIN: [
    ...Object.values(CRM_PERMISSIONS),
    CRM_PERMISSIONS.DELETE_CONFIGURATION,
    CRM_PERMISSIONS.MANAGE_CRM_SETTINGS,
  ],
};

export default CRM_PERMISSIONS;