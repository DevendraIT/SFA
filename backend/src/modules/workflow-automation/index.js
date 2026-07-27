import { WorkflowService } from './workflow.service.js';
import { registerWorkflowListeners } from './workflow.listeners.js';

const workflowService = new WorkflowService();

export {
  workflowService,
  registerWorkflowListeners
};
