/**
 * CRM Integration Helpers - Enterprise Modular Monolith
 */

import { CRM_CONSTANTS } from '../constants/crm.constants.js';

export class CRMHelpers {
  /**
   * Generate webhook URL for organization and CRM type
   */
  static generateWebhookUrl(organizationId, crmType) {
    const baseUrl = process.env.WEBHOOK_BASE_URL || process.env.API_BASE_URL || 'https://api.example.com';
    return `${baseUrl}/api/v1/crm/webhook/${crmType}?org=${organizationId}`;
  }

  /**
   * Validate CRM type
   */
  static validateCRMType(crmType) {
    return CRM_CONSTANTS.SUPPORTED_CRMS.includes(crmType.toLowerCase());
  }

  /**
   * Get CRM display name
   */
  static getCRMDisplayName(crmType) {
    const displayNames = {
      salesforce: 'Salesforce',
      hubspot: 'HubSpot',
      pipedrive: 'Pipedrive',
      zoho: 'Zoho CRM',
      dynamics365: 'Microsoft Dynamics 365',
      freshworks: 'Freshworks CRM',
    };
    
    return displayNames[crmType.toLowerCase()] || crmType;
  }

  /**
   * Get CRM authentication type
   */
  static getCRMAuthType(crmType) {
    const authTypes = {
      salesforce: 'oauth2',
      hubspot: 'api_key',
      pipedrive: 'api_key',
      zoho: 'oauth2',
      dynamics365: 'oauth2',
      freshworks: 'api_key',
    };
    
    return authTypes[crmType.toLowerCase()] || 'api_key';
  }

  /**
   * Get required configuration fields for CRM type
   */
  static getRequiredConfigFields(crmType) {
    const requiredFields = {
      salesforce: ['instanceUrl', 'clientId', 'clientSecret', 'username', 'password', 'securityToken'],
      hubspot: ['apiKey', 'portalId'],
      pipedrive: ['apiToken', 'companyDomain'],
      zoho: ['clientId', 'clientSecret', 'refreshToken', 'datacenter'],
      dynamics365: ['tenantId', 'clientId', 'clientSecret', 'resource'],
      freshworks: ['domain', 'apiKey'],
    };
    
    return requiredFields[crmType.toLowerCase()] || ['apiKey'];
  }

  /**
   * Get CRM API base URL
   */
  static getCRMApiBaseUrl(crmType, config) {
    switch (crmType.toLowerCase()) {
      case 'salesforce':
        return config.instanceUrl || 'https://na1.salesforce.com';
      case 'hubspot':
        return 'https://api.hubapi.com';
      case 'pipedrive':
        return `https://${config.companyDomain}.pipedrive.com/api`;
      case 'zoho':
        return `https://www.zohoapis.${config.datacenter || 'com'}`;
      case 'dynamics365':
        return `https://${config.resource}.api.crm.dynamics.com/api/data/v9.0`;
      case 'freshworks':
        return `https://${config.domain}.freshworks.com/crm/sales/api`;
      default:
        return config.apiUrl;
    }
  }

  /**
   * Format sync duration for display
   */
  static formatSyncDuration(startTime, endTime) {
    if (!startTime || !endTime) return null;
    
    const duration = Math.round((new Date(endTime) - new Date(startTime)) / 1000);
    
    if (duration < 60) {
      return `${duration}s`;
    } else if (duration < 3600) {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}m ${seconds}s`;
    } else {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  }

  /**
   * Calculate sync success rate
   */
  static calculateSuccessRate(processed, success) {
    if (!processed || processed === 0) return 0;
    return Math.round((success / processed) * 100);
  }

  /**
   * Get next sync time based on schedule
   */
  static getNextSyncTime(schedule, lastSync) {
    if (!schedule) return null;
    
    // Simple implementation - in production you'd use a proper cron parser
    try {
      // For demo purposes, assume schedule is in hours
      const intervalHours = parseInt(schedule) || 6;
      const lastSyncTime = lastSync ? new Date(lastSync) : new Date();
      return new Date(lastSyncTime.getTime() + (intervalHours * 60 * 60 * 1000));
    } catch (error) {
      console.error('Error parsing sync schedule:', error);
      return null;
    }
  }

  /**
   * Sanitize sensitive configuration data for logging
   */
  static sanitizeConfig(config) {
    const sensitiveFields = ['apiKey', 'apiSecret', 'accessToken', 'refreshToken', 'password', 'securityToken', 'clientSecret'];
    const sanitized = { ...config };
    
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    }
    
    return sanitized;
  }

  /**
   * Generate unique sync job identifier
   */
  static generateSyncJobId(organizationId, syncType) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${organizationId}-${syncType}-${timestamp}-${random}`;
  }

  /**
   * Parse CRM error response
   */
  static parseCRMError(error, crmType) {
    if (!error.response) {
      return {
        code: 'NETWORK_ERROR',
        message: error.message || 'Network error occurred',
        retryable: true,
      };
    }

    const { status, data } = error.response;

    switch (crmType.toLowerCase()) {
      case 'salesforce':
        return this.parseSalesforceError(status, data);
      case 'hubspot':
        return this.parseHubSpotError(status, data);
      case 'pipedrive':
        return this.parsePipedriveError(status, data);
      default:
        return this.parseGenericError(status, data);
    }
  }

  static parseSalesforceError(status, data) {
    if (status === 401) {
      return {
        code: 'AUTHENTICATION_FAILED',
        message: 'Salesforce authentication failed. Please check your credentials.',
        retryable: false,
      };
    }

    if (data && data[0] && data[0].errorCode) {
      return {
        code: data[0].errorCode,
        message: data[0].message,
        retryable: status >= 500,
      };
    }

    return this.parseGenericError(status, data);
  }

  static parseHubSpotError(status, data) {
    if (status === 401) {
      return {
        code: 'AUTHENTICATION_FAILED',
        message: 'HubSpot API key is invalid or expired.',
        retryable: false,
      };
    }

    if (data && data.message) {
      return {
        code: data.category || 'HUBSPOT_ERROR',
        message: data.message,
        retryable: status >= 500,
      };
    }

    return this.parseGenericError(status, data);
  }

  static parsePipedriveError(status, data) {
    if (status === 401) {
      return {
        code: 'AUTHENTICATION_FAILED',
        message: 'Pipedrive API token is invalid.',
        retryable: false,
      };
    }

    if (data && data.error) {
      return {
        code: 'PIPEDRIVE_ERROR',
        message: data.error,
        retryable: status >= 500,
      };
    }

    return this.parseGenericError(status, data);
  }

  static parseGenericError(status, data) {
    return {
      code: `HTTP_${status}`,
      message: data?.message || data?.error || `HTTP ${status} error`,
      retryable: status >= 500,
    };
  }

  /**
   * Check if error is retryable
   */
  static isRetryableError(error) {
    const nonRetryableStatuses = [400, 401, 403, 404, 422];
    
    if (error.response) {
      return !nonRetryableStatuses.includes(error.response.status);
    }

    // Network errors are typically retryable
    return true;
  }

  /**
   * Get retry delay based on attempt number (exponential backoff)
   */
  static getRetryDelay(attemptNumber, baseDelay = 1000) {
    return Math.min(baseDelay * Math.pow(2, attemptNumber), 30000); // Max 30 seconds
  }

  /**
   * Validate webhook signature format
   */
  static validateWebhookSignature(signature, crmType) {
    const signatureFormats = {
      salesforce: /^[a-zA-Z0-9+/]+=*$/,  // Base64
      hubspot: /^[a-fA-F0-9]{64}$/,      // SHA256 hex
      pipedrive: /^[a-fA-F0-9]+$/,       // Hex
      zoho: /^[a-fA-F0-9]+$/,            // Hex
    };

    const format = signatureFormats[crmType.toLowerCase()];
    return format ? format.test(signature) : true;
  }

  /**
   * Get CRM-specific rate limits
   */
  static getRateLimits(crmType) {
    const rateLimits = {
      salesforce: { requestsPerMinute: 100, dailyLimit: 15000 },
      hubspot: { requestsPerMinute: 100, dailyLimit: 40000 },
      pipedrive: { requestsPerMinute: 60, dailyLimit: 10000 },
      zoho: { requestsPerMinute: 60, dailyLimit: 10000 },
    };

    return rateLimits[crmType.toLowerCase()] || { requestsPerMinute: 60, dailyLimit: 10000 };
  }

  /**
   * Format record count for display
   */
  static formatRecordCount(count) {
    if (count < 1000) return count.toString();
    if (count < 1000000) return (count / 1000).toFixed(1) + 'K';
    return (count / 1000000).toFixed(1) + 'M';
  }
}