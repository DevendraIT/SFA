import dashboardRoutes from './dashboard.routes.js';
import { registerDashboardListeners } from './dashboard.listeners.js';
import logger from '../../utils/logger.js';

registerDashboardListeners();
logger.info('[dashboard] Dashboard module initialized (Listeners registered).');

export default dashboardRoutes;
