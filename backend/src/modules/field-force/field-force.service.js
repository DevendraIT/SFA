import { AppError } from '../../shared/response.js';
import EventBus from '../workflow-automation/events/EventBus.js';
import { WORKFLOW_EVENTS } from '../workflow-automation/constants/workflow.events.js';

export class FieldForceService {
  constructor(fieldForceRepository) {
    this.repo = fieldForceRepository;
  }

  async checkIn(organizationId, userId, data) {
    if (!data.location || !data.location.lat || !data.location.lng) {
      throw AppError.badRequest('GPS Verification Failed: Location coordinates are required to check in.');
    }
    
    const attendance = await this.repo.checkIn(organizationId, userId, data);

    EventBus.emit(WORKFLOW_EVENTS.ATTENDANCE_CHECKED_IN, {
      organizationId,
      userId,
      attendanceId: attendance.id,
      timestamp: attendance.checkInAt,
    });

    return attendance;
  }

  async checkOut(organizationId, userId, data) {
    const attendance = await this.repo.checkOut(organizationId, userId, data);

    EventBus.emit(WORKFLOW_EVENTS.ATTENDANCE_CHECKED_OUT, {
      organizationId,
      userId,
      attendanceId: attendance.id,
      timestamp: attendance.checkOutAt,
    });

    return attendance;
  }

  async planVisit(organizationId, userId, data) {
    return this.repo.createVisit(organizationId, userId, data);
  }

  async startVisit(visitId, organizationId, userId) {
    const visit = await this.repo.updateVisitStatus(visitId, organizationId, 'IN_PROGRESS');

    EventBus.emit(WORKFLOW_EVENTS.VISIT_STARTED, {
      organizationId,
      userId,
      visitId,
    });

    return visit;
  }

  async completeVisit(visitId, organizationId, userId, data) {
    const visit = await this.repo.updateVisitStatus(visitId, organizationId, 'COMPLETED', data);

    EventBus.emit(WORKFLOW_EVENTS.VISIT_COMPLETED, {
      organizationId,
      userId,
      visitId,
      leadId: visit.leadId,
    });

    return visit;
  }

  async addVisitNotes(visitId, organizationId, notes) {
    return this.repo.updateVisitStatus(visitId, organizationId, undefined, { notes });
  }

  async uploadVisitPhoto(visitId, organizationId, photoUrl) {
    return this.repo.updateVisitStatus(visitId, organizationId, undefined, { photoUrl });
  }

  async logExpense(organizationId, userId, data) {
    return this.repo.createExpense(organizationId, userId, data);
  }

  async createTask(organizationId, userId, data) {
    const task = await this.repo.createTask(organizationId, userId, data);
    EventBus.emit(WORKFLOW_EVENTS.TASK_CREATED, { organizationId, userId, taskId: task.id });
    return task;
  }

  async generateDar(organizationId, userId, data) {
    return this.repo.createDar(organizationId, userId, data);
  }

  async createBeatPlan(organizationId, userId, data) {
    return this.repo.createBeatPlan(organizationId, userId, data);
  }

  async approveBeatPlan(planId, organizationId, userId) {
    const plan = await this.repo.updateBeatPlanStatus(planId, organizationId, 'APPROVED');

    EventBus.emit(WORKFLOW_EVENTS.BEAT_PLAN_APPROVED, {
      organizationId,
      userId: plan.userId,
      approvedById: userId,
      beatPlanId: plan.id,
      startDate: plan.startDate,
      endDate: plan.endDate,
      title: plan.title
    });

    return plan;
  }

  async createCalendarEvent(organizationId, userId, data) {
    return this.repo.createCalendarEvent(organizationId, userId, data);
  }

  async optimizeRoute(organizationId, userId, visitIds) {
    // Mock Route Optimization logic for API testing
    // In production, this would call Google Maps Route Optimization API
    return {
      optimizedOrder: visitIds.reverse(),
      estimatedDistance: '15.5 km',
      estimatedDuration: '45 mins'
    };
  }
}
