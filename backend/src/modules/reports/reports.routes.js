import { Router } from 'express';
import { ReportsController } from './reports.controller.js';
import { ReportsService } from './reports.service.js';
import { ReportsRepository } from './reports.repository.js';
import { authenticate, requireOrganization } from '../../middlewares/auth.middleware.js';

const router = Router();

const repo = new ReportsRepository();
const service = new ReportsService(repo);
const controller = new ReportsController(service);

router.use(authenticate, requireOrganization);

router.get('/export', controller.downloadReport);

export default router;
