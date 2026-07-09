import { successResponse } from '../../shared/response.js';

export class FieldForceController {
  constructor(fieldForceService) {
    this.service = fieldForceService;
  }

  checkIn = async (req, res, next) => {
    try {
      const result = await this.service.checkIn(req.user.organizationId, req.user.id, req.body);
      return successResponse(res, result, 'Checked in successfully.');
    } catch (err) {
      next(err);
    }
  };

  checkOut = async (req, res, next) => {
    try {
      const result = await this.service.checkOut(req.user.organizationId, req.user.id, req.body);
      return successResponse(res, result, 'Checked out successfully.');
    } catch (err) {
      next(err);
    }
  };

  planVisit = async (req, res, next) => {
    try {
      const result = await this.service.planVisit(req.user.organizationId, req.user.id, req.body);
      return successResponse(res, result, 'Visit planned successfully.', 201);
    } catch (err) {
      next(err);
    }
  };

  startVisit = async (req, res, next) => {
    try {
      const result = await this.service.startVisit(req.params.id, req.user.organizationId, req.user.id);
      return successResponse(res, result, 'Visit started.');
    } catch (err) {
      next(err);
    }
  };

  completeVisit = async (req, res, next) => {
    try {
      const result = await this.service.completeVisit(req.params.id, req.user.organizationId, req.user.id, req.body);
      return successResponse(res, result, 'Visit completed.');
    } catch (err) {
      next(err);
    }
  };

  logExpense = async (req, res, next) => {
    try {
      const result = await this.service.logExpense(req.user.organizationId, req.user.id, req.body);
      return successResponse(res, result, 'Expense logged successfully.', 201);
    } catch (err) {
      next(err);
    }
  };

  addVisitNotes = async (req, res, next) => {
    try {
      const result = await this.service.addVisitNotes(req.params.id, req.user.organizationId, req.body.notes);
      return successResponse(res, result, 'Visit notes added.');
    } catch (err) {
      next(err);
    }
  };

  uploadVisitPhoto = async (req, res, next) => {
    try {
      const result = await this.service.uploadVisitPhoto(req.params.id, req.user.organizationId, req.body.photoUrl);
      return successResponse(res, result, 'Visit photo uploaded.');
    } catch (err) {
      next(err);
    }
  };

  optimizeRoute = async (req, res, next) => {
    try {
      const result = await this.service.optimizeRoute(req.user.organizationId, req.user.id, req.body.visitIds);
      return successResponse(res, result, 'Route optimized.');
    } catch (err) {
      next(err);
    }
  };

  createTask = async (req, res, next) => {
    try {
      const result = await this.service.createTask(req.user.organizationId, req.user.id, req.body);
      return successResponse(res, result, 'Task created successfully.', 201);
    } catch (err) {
      next(err);
    }
  };

  createBeatPlan = async (req, res, next) => {
    try {
      const result = await this.service.createBeatPlan(req.user.organizationId, req.user.id, req.body);
      return successResponse(res, result, 'Beat plan created successfully.', 201);
    } catch (err) {
      next(err);
    }
  };

  approveBeatPlan = async (req, res, next) => {
    try {
      const result = await this.service.approveBeatPlan(req.params.id, req.user.organizationId, req.user.id);
      return successResponse(res, result, 'Beat plan approved.');
    } catch (err) {
      next(err);
    }
  };

  createCalendarEvent = async (req, res, next) => {
    try {
      const result = await this.service.createCalendarEvent(req.user.organizationId, req.user.id, req.body);
      return successResponse(res, result, 'Calendar event created successfully.', 201);
    } catch (err) {
      next(err);
    }
  };
}
