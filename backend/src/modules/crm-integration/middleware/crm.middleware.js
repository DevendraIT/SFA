/**
 * CRM Integration Middleware - Enterprise Modular Monolith
 */

import { AppError } from '../../../shared/response.js';
import { CRM_CONSTANTS } from '../constants/crm.constants.js';
import { CRMRepository } from '../repositories/CRMRepository.js';

const crmRepository = new CRMRepository();

/**
 * Middleware to check if CRM integration is configured
 */
export const requireCRMConfiguration = async (req, res, next) => {
  try {
    const { organizationId } = req.user;

    const config = await crmRepository.getConfiguration(organizationId);
    if (!config) {
      return next(AppError.badRequest('CRM integration is not configured'));
    }

    if (config.status !== CRM_CONSTANTS.STATUS.ACTIVE) {
      return next(AppError.badRequest('CRM integration is not active'));
    }

    // Attach config to request for downstream use
    req.crmConfig = config;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if sync is not already in progress
 */
export const checkSyncNotInProgress = async (req, res, next) => {
  try {
    const { organizationId } = req.user;

    const ongoingSync = await crmRepository.getOngoingSync(organizationId);
    if (ongoingSync) {
      return next(AppError.conflict('Sync operation already in progress'));
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to validate CRM type
 */
export const validateCRMType = (req, res, next) => {
  const { crmType } = req.params;

  if (!CRM_CONSTANTS.SUPPORTED_CRMS.includes(crmType)) {
    return next(AppError.badRequest(`Unsupported CRM type: ${crmType}`));
  }

  req.crmType = crmType;
  next();
};

/**
 * Middleware to rate limit CRM API calls
 */
export const crmRateLimit = (req, res, next) => {
  // Implementation would depend on your rate limiting strategy
  // For now, just pass through
  // In production, you might use redis-based rate limiting
  
  const rateLimitKey = `crm_api:${req.user.organizationId}`;
  // Check rate limit from cache/redis
  // If limit exceeded, return 429
  
  next();
};

/**
 * Middleware to log CRM API requests
 */
export const logCRMRequest = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration,
      organizationId: req.user?.organizationId,
      crmType: req.crmType || 'unknown',
    };

    console.log('CRM API Request:', logData);
  });

  next();
};

/**
 * Middleware to validate webhook signature
 */
export const validateWebhookSignature = async (req, res, next) => {
  try {
    const { crmType } = req.params;
    const signature = req.headers['x-hub-signature-256'] || req.headers['x-hub-signature'];
    
    if (!signature) {
      return next(AppError.unauthorized('Missing webhook signature'));
    }

    // Get webhook secret from configuration
    const webhookSecret = await getWebhookSecret(crmType);
    if (!webhookSecret) {
      return next(AppError.unauthorized('Webhook secret not configured'));
    }

    // Verify signature
    const isValid = verifyWebhookSignature(req.rawBody || req.body, signature, webhookSecret, crmType);
    if (!isValid) {
      return next(AppError.unauthorized('Invalid webhook signature'));
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to parse organization from webhook query
 */
export const parseWebhookOrganization = async (req, res, next) => {
  try {
    const { org } = req.query;
    
    if (!org) {
      return next(AppError.badRequest('Organization ID is required'));
    }

    // You might want to validate the organization exists
    req.organizationId = org;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to ensure CRM permissions
 */
export const requireCRMPermission = (permission) => {
  return (req, res, next) => {
    const userPermissions = req.user?.permissions || [];
    
    if (!userPermissions.includes(permission)) {
      return next(AppError.forbidden(`Missing required permission: ${permission}`));
    }

    next();
  };
};

/**
 * Middleware to validate sync type
 */
export const validateSyncType = (req, res, next) => {
  const { syncType } = req.body;

  if (!syncType) {
    return next(AppError.badRequest('Sync type is required'));
  }

  if (!Object.values(CRM_CONSTANTS.SYNC_TYPES).includes(syncType)) {
    return next(AppError.badRequest(`Invalid sync type: ${syncType}`));
  }

  next();
};

/**
 * Middleware to add request timeout for long-running operations
 */
export const setCRMTimeout = (timeoutMs = 30000) => {
  return (req, res, next) => {
    req.setTimeout(timeoutMs, () => {
      res.status(408).json({
        success: false,
        message: 'Request timeout',
        error: 'CRM operation took too long to complete',
      });
    });

    next();
  };
};

// Helper functions
async function getWebhookSecret(crmType) {
  // In production, this would fetch from secure configuration
  return process.env[`${crmType.toUpperCase()}_WEBHOOK_SECRET`];
}

function verifyWebhookSignature(payload, signature, secret, crmType) {
  // Implementation would vary by CRM type
  // This is a simplified version
  const crypto = require('crypto');
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}