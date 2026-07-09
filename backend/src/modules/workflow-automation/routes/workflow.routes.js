import express from 'express';
import { authenticate, requireOrganization, authorize } from '../../../middlewares/auth.middleware.js';
import validate from '../../../middlewares/validation.middleware.js';

import {
  createRuleSchema,
  updateRuleSchema,
  idParamSchema,
  paginationSchema,
  manualTriggerSchema,
  createApprovalChainSchema,
  approvalActionSchema,
} from '../validators/workflow.validation.js';

import { WorkflowRuleRepository, WorkflowExecutionRepository } from '../repositories/WorkflowRepository.js';
import { ApprovalRepository }  from '../repositories/ApprovalRepository.js';
import { WorkflowService }     from '../services/WorkflowService.js';
import { ApprovalService }     from '../services/ApprovalService.js';
import { WorkflowController }  from '../controllers/WorkflowController.js';
import { ApprovalController }  from '../controllers/ApprovalController.js';
import WORKFLOW_PERMISSIONS    from '../permissions/workflow.permissions.js';

const router = express.Router();
const P = WORKFLOW_PERMISSIONS;

// ── Dependency Injection ──────────────────────────────────────────────────

const ruleRepo      = new WorkflowRuleRepository();
const executionRepo = new WorkflowExecutionRepository();
const approvalRepo  = new ApprovalRepository();

const workflowService = new WorkflowService(ruleRepo, executionRepo);
const approvalService = new ApprovalService(approvalRepo);

const wCtrl = new WorkflowController(workflowService);
const aCtrl = new ApprovalController(approvalService);

// ── Auth Guard ────────────────────────────────────────────────────────────

router.use(authenticate, requireOrganization);

// ── Workflow Rules ────────────────────────────────────────────────────────
// POST   /workflows/rules             - Create rule
// GET    /workflows/rules             - List rules
// GET    /workflows/rules/:id         - Get rule
// PUT    /workflows/rules/:id         - Update rule
// DELETE /workflows/rules/:id         - Delete rule
// PATCH  /workflows/rules/:id/toggle  - Toggle active/inactive

router.post('/rules',               authorize(P.MANAGE_RULES), validate(createRuleSchema),          wCtrl.createRule);
router.get('/rules',                authorize(P.VIEW_RULES),   validate(paginationSchema, 'query'),  wCtrl.getRules);
router.get('/rules/:id',            authorize(P.VIEW_RULES),   validate(idParamSchema, 'params'),    wCtrl.getRule);
router.put('/rules/:id',            authorize(P.MANAGE_RULES), validate(idParamSchema, 'params'), validate(updateRuleSchema), wCtrl.updateRule);
router.delete('/rules/:id',         authorize(P.MANAGE_RULES), validate(idParamSchema, 'params'),    wCtrl.deleteRule);
router.patch('/rules/:id/toggle',   authorize(P.MANAGE_RULES), validate(idParamSchema, 'params'),    wCtrl.toggleRule);

// ── Executions / History ──────────────────────────────────────────────────
// GET   /workflows/executions         - List execution history
// GET   /workflows/executions/:id     - Get single execution
// GET   /workflows/executions/:id/logs - Get execution logs
// POST  /workflows/executions/:id/retry - Retry failed execution

router.get('/executions',                  authorize(P.VIEW_EXECUTIONS), validate(paginationSchema, 'query'), wCtrl.getExecutions);
router.get('/executions/:id',              authorize(P.VIEW_EXECUTIONS), validate(idParamSchema, 'params'),   wCtrl.getExecution);
router.get('/executions/:id/logs',         authorize(P.VIEW_LOGS),       validate(idParamSchema, 'params'),   wCtrl.getLogs);
router.post('/executions/:id/retry',       authorize(P.RETRY_EXECUTION), validate(idParamSchema, 'params'),   wCtrl.retryExecution);

// ── Manual Trigger ────────────────────────────────────────────────────────
// POST  /workflows/trigger            - Manually fire a workflow event

router.post('/trigger', authorize(P.TRIGGER_MANUAL), validate(manualTriggerSchema), wCtrl.manualTrigger);

// ── Approval Chains ───────────────────────────────────────────────────────
// POST   /workflows/approvals/chains         - Create chain
// GET    /workflows/approvals/chains         - List chains
// GET    /workflows/approvals/chains/:id     - Get chain
// PATCH  /workflows/approvals/chains/:id/toggle - Toggle active

router.post('/approvals/chains',               authorize(P.MANAGE_APPROVALS), validate(createApprovalChainSchema), aCtrl.createChain);
router.get('/approvals/chains',                authorize(P.MANAGE_APPROVALS), validate(paginationSchema, 'query'),  aCtrl.getChains);
router.get('/approvals/chains/:id',            authorize(P.MANAGE_APPROVALS), validate(idParamSchema, 'params'),    aCtrl.getChain);
router.patch('/approvals/chains/:id/toggle',   authorize(P.MANAGE_APPROVALS), validate(idParamSchema, 'params'),    aCtrl.toggleChain);

// ── Approval Requests ─────────────────────────────────────────────────────
// POST  /workflows/approvals/requests          - Initiate approval
// GET   /workflows/approvals/requests          - List requests
// GET   /workflows/approvals/requests/:id      - Get request
// POST  /workflows/approvals/requests/:id/action - Approve or Reject

router.post('/approvals/requests',               authorize(P.MANAGE_APPROVALS), aCtrl.initiateApproval);
router.get('/approvals/requests',                authorize(P.MANAGE_APPROVALS), validate(paginationSchema, 'query'), aCtrl.getRequests);
router.get('/approvals/requests/:id',            authorize(P.APPROVE_REQUEST),  validate(idParamSchema, 'params'),   aCtrl.getRequest);
router.post('/approvals/requests/:id/action',    authorize(P.APPROVE_REQUEST),  validate(idParamSchema, 'params'), validate(approvalActionSchema), aCtrl.processAction);

export default router;
