/**
 * Shared Utilities - Enterprise Modular Monolith
 */

// Re-export from existing utils if they exist, otherwise provide fallbacks
export { logAudit } from '../../utils/audit.js';
export { default as logger } from '../../utils/logger.js';