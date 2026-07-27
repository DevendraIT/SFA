import express from 'express';
import { SettingsRepository } from './settings.repository.js';
import { SettingsService } from './settings.service.js';
import { SettingsController } from './settings.controller.js';
import { authenticate, requireOrganization } from '../../middlewares/auth.middleware.js';

const router = express.Router();

const settingsRepository = new SettingsRepository();
const settingsService    = new SettingsService(settingsRepository);
const settingsController = new SettingsController(settingsService);

router.use(authenticate, requireOrganization);

// Workflow Settings
router.get('/workflow', settingsController.getWorkflowSettings);
router.put('/workflow', settingsController.updateWorkflowSettings);

// Notification Preferences (per logged-in user)
router.get('/notifications/preferences', settingsController.getNotificationPreference);
router.put('/notifications/preferences', settingsController.updateNotificationPreference);

// Business Rules
router.get('/business-rules', settingsController.listBusinessRules);
router.put('/business-rules', settingsController.setBusinessRule);
router.delete('/business-rules/:ruleKey', settingsController.deleteBusinessRule);

export default router;
export { settingsController, settingsService, settingsRepository };

