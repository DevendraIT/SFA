import notificationsRoutes from './notifications.routes.js';
import { registerNotificationListeners } from './notifications.listeners.js';
import logger from '../../utils/logger.js';

let initialized = false;

export function initNotifications() {
  if (initialized) return;
  initialized = true;
  
  registerNotificationListeners();
  logger.info('[notifications] Notifications module initialized (Listeners registered).');
}

export default notificationsRoutes;
