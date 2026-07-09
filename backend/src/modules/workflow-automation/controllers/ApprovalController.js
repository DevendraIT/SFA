import {
  successResponse,
  createdResponse,
  paginatedResponse,
} from '../../../shared/response.js';

/**
 * ApprovalController
 *
 * Handles HTTP for ApprovalChains and ApprovalRequests.
 */
export class ApprovalController {
  constructor(approvalService) {
    this.service = approvalService;
  }

  // ── Chains ────────────────────────────────────────────────────────

  createChain = async (req, res, next) => {
    try {
      const chain = await this.service.createChain(req.user.organizationId, req.body);
      return createdResponse(res, 'Approval chain created.', chain);
    } catch (e) { next(e); }
  };

  getChains = async (req, res, next) => {
    try {
      const { data, total, page, limit } = await this.service.getChains(req.user.organizationId, req.query);
      return paginatedResponse(res, 'Approval chains retrieved.', data, { total, page, limit });
    } catch (e) { next(e); }
  };

  getChain = async (req, res, next) => {
    try {
      const chain = await this.service.getChain(req.params.id, req.user.organizationId);
      return successResponse(res, 'Approval chain retrieved.', chain);
    } catch (e) { next(e); }
  };

  toggleChain = async (req, res, next) => {
    try {
      const chain = await this.service.toggleChain(req.params.id, req.user.organizationId);
      return successResponse(res, `Chain ${chain.isActive ? 'activated' : 'deactivated'}.`, chain);
    } catch (e) { next(e); }
  };

  // ── Requests ──────────────────────────────────────────────────────

  initiateApproval = async (req, res, next) => {
    try {
      const result = await this.service.initiateApproval(req.user.organizationId, {
        ...req.body,
        requestedById: req.user.id,
      });
      return createdResponse(res, 'Approval request initiated.', result);
    } catch (e) { next(e); }
  };

  processAction = async (req, res, next) => {
    try {
      const result = await this.service.processAction(req.params.id, req.user.organizationId, req.body);
      return successResponse(res, `Approval ${req.body.action.toLowerCase()}d.`, result);
    } catch (e) { next(e); }
  };

  getRequests = async (req, res, next) => {
    try {
      const { data, total, page, limit } = await this.service.getRequests(req.user.organizationId, req.query);
      return paginatedResponse(res, 'Approval requests retrieved.', data, { total, page, limit });
    } catch (e) { next(e); }
  };

  getRequest = async (req, res, next) => {
    try {
      const request = await this.service.getRequest(req.params.id, req.user.organizationId);
      return successResponse(res, 'Approval request retrieved.', request);
    } catch (e) { next(e); }
  };
}
