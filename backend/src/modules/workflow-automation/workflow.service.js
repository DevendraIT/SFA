import { AssignmentEngine } from './assignment-engine/assignment.engine.js';
import { eventBus } from '../../utils/index.js';
import { logger, AppError } from '../../shared/index.js';

export class WorkflowService {
  constructor() {
    this.assignmentEngine = new AssignmentEngine();
  }

  /**
   * Evaluates the best employee for a given task and returns their ID.
   */
  async handleAutomaticAssignment(organizationId, taskContext) {
    logger.info(`[WorkflowService] Starting automatic assignment for org ${organizationId}`);
    
    const bestEmployeeId = await this.assignmentEngine.findBestEmployee(organizationId, taskContext);
    
    if (!bestEmployeeId) {
      throw AppError.badRequest('Could not automatically assign task. No eligible employee found.');
    }
    
    logger.info(`[WorkflowService] Automatic assignment completed. Assigned to: ${bestEmployeeId}`);
    return bestEmployeeId;
  }

  /**
   * Orchestrates an end-to-end event driven workflow (e.g., from an event listener)
   */
  async processEventDrivenTask(organizationId, taskData, assignedById) {
    try {
      logger.info(`[WorkflowService] Processing event driven task: ${taskData.title}`);
      
      const bestEmployeeId = await this.handleAutomaticAssignment(organizationId, taskData);

      // We dynamically import to avoid circular dependency
      const { FieldForceService } = await import('../field-force/field-force.service.js');
      const { FieldForceRepository } = await import('../field-force/field-force.repository.js');
      
      const fieldForceRepo = new FieldForceRepository();
      const fieldForceService = new FieldForceService(fieldForceRepo);
      
      // Setup payload for creation
      const taskPayload = {
        ...taskData,
        assignedToId: bestEmployeeId,
      };

      const task = await fieldForceService.createTask(organizationId, assignedById, taskPayload);
      
      logger.info(`[WorkflowService] Workflow Completed. Task created: ${task.id}`);
      return task;
    } catch (error) {
      logger.error(`[WorkflowService] Error processing event driven task: ${error.message}`);
    }
  }
}
