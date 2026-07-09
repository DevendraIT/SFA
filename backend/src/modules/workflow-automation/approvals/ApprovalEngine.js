import { AppError } from '../../../shared/response.js';
import { ApprovalRepository } from '../repositories/ApprovalRepository.js';
import EventBus from '../events/EventBus.js';

/**
 * ApprovalEngine
 *
 * Handles multi-step approval chains for any entity type.
 * Business logic of the entity (Sales Order, Quotation etc.)
 * stays in its own module — this engine only manages the
 * approval lifecycle and notifies via EventBus.
 */
export class ApprovalEngine {
  constructor(approvalRepo) {
    this.repo = approvalRepo || new ApprovalRepository();
  }

  /**
   * Initiate an approval request for an entity.
   * Finds the active chain for the given entityType.
   */
  async initiate({ organizationId, entityType, entityId, requestedById }) {
    const chain = await this.repo.findActiveChainForEntity(organizationId, entityType);

    if (!chain) {
      throw AppError.badRequest(`No active approval chain found for entity type: ${entityType}`);
    }

    // Prevent duplicate pending requests
    const existing = await this.repo.findPendingRequest(entityId, chain.id);
    if (existing) return existing;

    const request = await this.repo.createRequest({
      organizationId,
      chainId: chain.id,
      entityId,
      requestedById,
      status: 'PENDING',
      currentStep: 1,
    });

    // Notify the approver of step 1
    this._notifyCurrentApprover(request, chain);

    return request;
  }

  /**
   * Process an approve or reject action from an approver.
   */
  async processAction(requestId, organizationId, { action, comment }) {
    const request = await this.repo.findRequestById(requestId, organizationId);

    if (!request) throw AppError.notFound('Approval request not found.');
    if (request.status !== 'PENDING') {
      throw AppError.badRequest(`Request is already ${request.status}.`);
    }

    if (action === 'REJECT') {
      await this.repo.updateRequest(requestId, { status: 'REJECTED' });
      EventBus.emit('APPROVAL_REJECTED', { requestId, entityId: request.entityId, comment });
      return { status: 'REJECTED', requestId };
    }

    // APPROVE: check if there are more steps
    const totalSteps = request.chain.steps.length;
    const nextStep   = request.currentStep + 1;

    if (nextStep > totalSteps) {
      // All steps complete — fully approved
      await this.repo.updateRequest(requestId, { status: 'APPROVED' });
      EventBus.emit('APPROVAL_COMPLETED', { requestId, entityId: request.entityId, entityType: request.chain.entityType });
      return { status: 'APPROVED', requestId };
    }

    // Advance to the next step
    await this.repo.updateRequest(requestId, { currentStep: nextStep });
    this._notifyCurrentApprover({ ...request, currentStep: nextStep }, request.chain);

    return { status: 'PENDING', requestId, currentStep: nextStep };
  }

  /** Emit an event so the notification service can pick it up. */
  _notifyCurrentApprover(request, chain) {
    const step = chain.steps.find(s => s.stepOrder === request.currentStep);
    if (!step) return;

    EventBus.emit('APPROVAL_STEP_PENDING', {
      requestId:   request.id,
      entityId:    request.entityId,
      entityType:  chain.entityType,
      currentStep: request.currentStep,
      totalSteps:  chain.steps.length,
      approverRoleId: step.roleId,
      approverUserId: step.userId,
      requiresManager: step.isManager,
      organizationId: request.organizationId,
    });
  }
}
