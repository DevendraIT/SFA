import { AppError } from '../../../shared/response.js';
import { ApprovalEngine } from '../approvals/ApprovalEngine.js';

/**
 * ApprovalService
 *
 * Business logic for managing ApprovalChains and ApprovalRequests.
 */
export class ApprovalService {
  constructor(approvalRepo) {
    this.repo   = approvalRepo;
    this.engine = new ApprovalEngine(approvalRepo);
  }

  // ── Chains ────────────────────────────────────────────────────────

  async createChain(organizationId, data) {
    return this.repo.createChain({ organizationId, ...data });
  }

  async getChains(organizationId, query) {
    return this.repo.listChains(organizationId, query);
  }

  async getChain(id, organizationId) {
    const chain = await this.repo.findChainById(id, organizationId);
    if (!chain) throw AppError.notFound('Approval chain not found.');
    return chain;
  }

  async toggleChain(id, organizationId) {
    const chain = await this.getChain(id, organizationId);
    return this.repo.updateChain(id, { isActive: !chain.isActive });
  }

  // ── Requests ──────────────────────────────────────────────────────

  async initiateApproval(organizationId, data) {
    return this.engine.initiate({ organizationId, ...data });
  }

  async processAction(requestId, organizationId, data) {
    return this.engine.processAction(requestId, organizationId, data);
  }

  async getRequests(organizationId, query) {
    return this.repo.listRequests(organizationId, query);
  }

  async getRequest(id, organizationId) {
    const req = await this.repo.findRequestById(id, organizationId);
    if (!req) throw AppError.notFound('Approval request not found.');
    return req;
  }
}
