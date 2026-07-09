import fieldForceRoutes from './field-force.routes.js';
import { registerFieldForceListeners } from './field-force.listeners.js';
import logger from '../../utils/logger.js';

export { FieldForceRepository } from "./field-force.repository.js";
export { FieldForceService } from "./field-force.service.js";
export { FieldForceController } from "./field-force.controller.js";

let initialized = false;

export function initFieldForce() {
  if (initialized) return;
  initialized = true;
  
  registerFieldForceListeners();
  logger.info('[field-force] Field Force module initialized (Listeners registered).');
}

export default fieldForceRoutes;
