import { Router } from 'express';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';
import { DashboardRepository } from './dashboard.repository.js';
import { authenticate, requireOrganization, authorize } from '../../middlewares/auth.middleware.js';

const router = Router();

const repo = new DashboardRepository();
const service = new DashboardService(repo);
const controller = new DashboardController(service);

router.use(authenticate, requireOrganization);

router.get('/executive', controller.getExecutiveDashboard); // Could add requireRole('Admin')
router.get('/me', controller.getUserDashboard);

export default router;
