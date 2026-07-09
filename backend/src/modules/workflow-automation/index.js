/**
 * workflow-automation/index.js
 *
 * Module entry point.
 * 1. Starts the WorkflowEngine (registers EventBus intercept).
 * 2. Exports the HTTP router.
 *
 * Import this file once from routes/index.js.
 */

import { WorkflowEngine } from './engine/WorkflowEngine.js';
import workflowRouter     from './routes/workflow.routes.js';
import logger             from '../../utils/logger.js';

// ── Bootstrap WorkflowEngine once ────────────────────────────────────────

let engineStarted = false;

export function startWorkflowEngine() {
  if (engineStarted) return;
  engineStarted = true;

  const engine = new WorkflowEngine();
  engine.start();

  logger.info('[workflow-automation] WorkflowEngine initialized.');
}

export default workflowRouter;
