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

//   testTomTom = async (req, res, next) => {
//   try {
//     const result = await this.service.testTomTom();

//     return successResponse(res, result, "TomTom API Working");
//   } catch (err) {
//     next(err);
//   }
// };

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

  assignBeatPlan = async (req, res, next) => {
    try {
      const result = await this.service.assignBeatPlan(req.user.organizationId, req.user.id, req.body);
      return successResponse(res, result, 'Beat plan assigned to subordinate successfully.', 201);
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

  // ===== GET/LIST CONTROLLER METHODS =====

  getAttendance = async (req, res, next) => {
    try {
      const result = await this.service.getAttendance(req.user.organizationId, req.user.id, req.query.date);
      return successResponse(res, result, 'Attendance record retrieved.');
    } catch (err) {
      next(err);
    }
  };

  listAttendance = async (req, res, next) => {
    try {
      const result = await this.service.listAttendance(req.user.organizationId, {
        userId: req.query.userId,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        skip: parseInt(req.query.skip) || 0,
        take: parseInt(req.query.take) || 20,
      });
      return successResponse(res, result, 'Attendance records retrieved.');
    } catch (err) {
      next(err);
    }
  };

  getVisitDetail = async (req, res, next) => {
    try {
      const result = await this.service.getVisit(req.params.id, req.user.organizationId);
      return successResponse(res, result, 'Visit retrieved.');
    } catch (err) {
      next(err);
    }
  };

  listVisitsData = async (req, res, next) => {
    try {
      const result = await this.service.listVisits(req.user.organizationId, {
        userId: req.query.userId,
        status: req.query.status,
        customerId: req.query.customerId,
        skip: parseInt(req.query.skip) || 0,
        take: parseInt(req.query.take) || 20,
      });
      return successResponse(res, result, 'Visits retrieved.');
    } catch (err) {
      next(err);
    }
  };

  getExpenseDetail = async (req, res, next) => {
    try {
      const result = await this.service.getExpense(req.params.id, req.user.organizationId);
      return successResponse(res, result, 'Expense retrieved.');
    } catch (err) {
      next(err);
    }
  };

  listExpensesData = async (req, res, next) => {
    try {
      const result = await this.service.listExpenses(req.user.organizationId, {
        userId: req.query.userId,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        skip: parseInt(req.query.skip) || 0,
        take: parseInt(req.query.take) || 20,
      });
      return successResponse(res, result, 'Expenses retrieved.');
    } catch (err) {
      next(err);
    }
  };

  approveExpenseDetail = async (req, res, next) => {
    try {
      const result = await this.service.approveExpense(req.params.id, req.user.organizationId, req.user.id);
      return successResponse(res, result, 'Expense approved.');
    } catch (err) {
      next(err);
    }
  };

  rejectExpenseDetail = async (req, res, next) => {
    try {
      const result = await this.service.rejectExpense(req.params.id, req.user.organizationId);
      return successResponse(res, result, 'Expense rejected.');
    } catch (err) {
      next(err);
    }
  };

  getDailyActivityReportDetail = async (req, res, next) => {
    try {
      const result = await this.service.getDailyActivityReport(req.params.id, req.user.organizationId);
      return successResponse(res, result, 'Daily Activity Report retrieved.');
    } catch (err) {
      next(err);
    }
  };

  listDailyActivityReportsData = async (req, res, next) => {
    try {
      const result = await this.service.listDailyActivityReports(req.user.organizationId, {
        userId: req.query.userId,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        skip: parseInt(req.query.skip) || 0,
        take: parseInt(req.query.take) || 20,
      });
      return successResponse(res, result, 'Daily Activity Reports retrieved.');
    } catch (err) {
      next(err);
    }
  };

  submitDailyActivityReport = async (req, res, next) => {
    try {
      const result = await this.service.submitDailyActivityReport(req.params.id, req.user.organizationId);
      return successResponse(res, result, 'Daily Activity Report submitted.');
    } catch (err) {
      next(err);
    }
  };

  approveDailyActivityReport = async (req, res, next) => {
    try {
      const result = await this.service.approveDailyActivityReport(req.params.id, req.user.organizationId);
      return successResponse(res, result, 'Daily Activity Report approved.');
    } catch (err) {
      next(err);
    }
  };

  getTaskDetail = async (req, res, next) => {
    try {
      const result = await this.service.getTask(req.params.id, req.user.organizationId);
      return successResponse(res, result, 'Task retrieved.');
    } catch (err) {
      next(err);
    }
  };

  listTasksData = async (req, res, next) => {
    try {
      const result = await this.service.listTasks(req.user.organizationId, {
        userId: req.query.userId,
        status: req.query.status,
        skip: parseInt(req.query.skip) || 0,
        take: parseInt(req.query.take) || 20,
      });
      return successResponse(res, result, 'Tasks retrieved.');
    } catch (err) {
      next(err);
    }
  };

  completeTaskDetail = async (req, res, next) => {
    try {
      const result = await this.service.completeTask(req.params.id, req.user.organizationId);
      return successResponse(res, result, 'Task completed.');
    } catch (err) {
      next(err);
    }
  };

  getBeatPlanDetail = async (req, res, next) => {
    try {
      const result = await this.service.getBeatPlan(req.params.id, req.user.organizationId);
      return successResponse(res, result, 'Beat Plan retrieved.');
    } catch (err) {
      next(err);
    }
  };

  listBeatPlansData = async (req, res, next) => {
    try {
      const result = await this.service.listBeatPlans(req.user.organizationId, {
        userId: req.query.userId,
        status: req.query.status,
        skip: parseInt(req.query.skip) || 0,
        take: parseInt(req.query.take) || 20,
      });
      return successResponse(res, result, 'Beat Plans retrieved.');
    } catch (err) {
      next(err);
    }
  };

  getCalendarEventDetail = async (req, res, next) => {
    try {
      const result = await this.service.getCalendarEvent(req.params.id, req.user.organizationId);
      return successResponse(res, result, 'Calendar Event retrieved.');
    } catch (err) {
      next(err);
    }
  };

  listCalendarEventsData = async (req, res, next) => {
    try {
      const result = await this.service.listCalendarEvents(req.user.organizationId, {
        userId: req.query.userId,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        skip: parseInt(req.query.skip) || 0,
        take: parseInt(req.query.take) || 20,
      });
      return successResponse(res, result, 'Calendar Events retrieved.');
    } catch (err) {
      next(err);
    }
  };

  getAttendanceSummary = async (req, res, next) => {
    try {
      const result = await this.service.getAttendanceSummary(
        req.user.organizationId,
        req.user.id,
        req.query.startDate,
        req.query.endDate
      );
      return successResponse(res, result, 'Attendance summary retrieved.');
    } catch (err) {
      next(err);
    }
  };

  getVisitsSummary = async (req, res, next) => {
    try {
      const result = await this.service.getVisitsSummary(
        req.user.organizationId,
        req.user.id,
        req.query.startDate,
        req.query.endDate
      );
      return successResponse(res, result, 'Visits summary retrieved.');
    } catch (err) {
      next(err);
    }
  };

  getExpenseSummary = async (req, res, next) => {
    try {
      const result = await this.service.getExpenseSummary(
        req.user.organizationId,
        req.user.id,
        req.query.startDate,
        req.query.endDate
      );
      return successResponse(res, result, 'Expenses summary retrieved.');
    } catch (err) {
      next(err);
    }
  };

  generateDar = async (req, res, next) => {
    try {
      const result = await this.service.generateDar(req.user.organizationId, req.user.id, req.body);
      return successResponse(res, result, 'Daily Activity Report generated successfully.', 201);
    } catch (err) {
      next(err);
    }
  };
}
