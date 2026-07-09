import { Router } from 'express';
import { TargetPerformanceController } from './target-performance.controller.js';
import { TargetPerformanceService } from './target-performance.service.js';
import { TargetPerformanceRepository } from './target-performance.repository.js';
import { authenticate, requireOrganization } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validation.middleware.js';
import { createTargetSchema } from './target-performance.validation.js';

const router = Router();
const repo = new TargetPerformanceRepository();
export const targetPerformanceService = new TargetPerformanceService(repo);
const controller = new TargetPerformanceController(targetPerformanceService);

router.use(authenticate, requireOrganization);

router.get('/targets', controller.getTargets);
router.post('/targets', validate(createTargetSchema), controller.createTarget);
router.get('/leaderboard', controller.getLeaderboard);

export default router;
