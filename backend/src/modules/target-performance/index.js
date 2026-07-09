import targetPerformanceRoutes from './target-performance.routes.js';
import { registerTargetListeners } from './target-performance.listeners.js';
import logger from '../../utils/logger.js';

let initialized = false;

export function initTargetPerformance() {
  if (initialized) return;
  initialized = true;
  
  registerTargetListeners();
  logger.info('[target-performance] Target & Performance module initialized (Listeners registered).');
}

export default targetPerformanceRoutes;
