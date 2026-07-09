/**
 * Workflow Automation Permissions
 */

const WORKFLOW_PERMISSIONS = {
  // Rules
  MANAGE_RULES:    'workflow:rules:manage',
  VIEW_RULES:      'workflow:rules:view',

  // Executions / History
  VIEW_EXECUTIONS: 'workflow:executions:view',
  RETRY_EXECUTION: 'workflow:executions:retry',

  // Approvals
  MANAGE_APPROVALS: 'workflow:approvals:manage',
  APPROVE_REQUEST:  'workflow:approvals:approve',

  // Manual Trigger
  TRIGGER_MANUAL:  'workflow:trigger:manual',

  // Logs
  VIEW_LOGS:       'workflow:logs:view',
};

export default WORKFLOW_PERMISSIONS;
