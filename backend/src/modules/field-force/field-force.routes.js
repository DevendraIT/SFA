import { Router } from 'express';
import { FieldForceController } from './field-force.controller.js';
import { FieldForceService } from './field-force.service.js';
import { FieldForceRepository } from './field-force.repository.js';
import { authenticate, requireOrganization } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validation.middleware.js';
import {
  checkInSchema,
  planVisitSchema,
  completeVisitSchema,
  logExpenseSchema,
} from './field-force.validation.js';

const router = Router();

const repo = new FieldForceRepository();
const service = new FieldForceService(repo);
const controller = new FieldForceController(service);

router.use(authenticate, requireOrganization);

router.post('/attendance/check-in', validate(checkInSchema), controller.checkIn);
router.post('/attendance/check-out', validate(checkInSchema), controller.checkOut);

router.post('/visits', validate(planVisitSchema), controller.planVisit);
router.post('/visits/:id/start', controller.startVisit);
router.post('/visits/:id/complete', validate(completeVisitSchema), controller.completeVisit);
router.post('/visits/:id/notes', controller.addVisitNotes);
router.post('/visits/:id/photo', controller.uploadVisitPhoto);

router.post('/route/optimize', controller.optimizeRoute);

router.post('/expenses', validate(logExpenseSchema), controller.logExpense);

router.post('/tasks', controller.createTask);

router.post('/beat-plans', controller.createBeatPlan);
router.post('/beat-plans/:id/approve', controller.approveBeatPlan);

router.post('/calendar', controller.createCalendarEvent);

export default router;
