import { Router } from 'express';
import { NotificationsController } from './notifications.controller.js';
import { NotificationsService } from './notifications.service.js';
import { NotificationsRepository } from './notifications.repository.js';
import { authenticate, requireOrganization } from '../../middlewares/auth.middleware.js';

const router = Router();
const repo = new NotificationsRepository();
export const notificationsService = new NotificationsService(repo);
const controller = new NotificationsController(notificationsService);

router.use(authenticate, requireOrganization);

router.get('/me', controller.getMyNotifications);
router.patch('/:id/read', controller.markAsRead);
router.post('/test', controller.createTestNotification);

export default router;
