/**
 * Leads Module — Permission Slugs
 */

export const LEADS_PERMISSIONS = {
  READ:              'read:leads',
  CREATE:            'write:leads',
  UPDATE:            'update:leads',
  DELETE:            'delete:leads',
  EXPORT:            'export:leads',
  ASSIGN:            'assign:leads',
  MANAGE_NOTES:      'manage:lead_notes',
  MANAGE_DOCUMENTS:  'manage:lead_documents',
  MANAGE_FOLLOWUPS:  'manage:lead_followups',
  MANAGE_MEETINGS:   'manage:lead_meetings',
  CONVERT:           'convert:leads',
  VIEW_ANALYTICS:    'read:lead_analytics',
};

export default LEADS_PERMISSIONS;
