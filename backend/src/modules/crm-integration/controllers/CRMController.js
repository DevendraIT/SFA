/**
 * CRM Integration Controller - Enterprise Modular Monolith
 * Handles all CRM integration endpoints
 */

import { ApiResponse } from '../../../shared/response.js';

export class CRMController {
  constructor(crmService) {
    this.crmService = crmService;
  }

  /**
   * Configure CRM integration
   */
  configureCRM = async (req, res, next) => {
    try {
      const result = await this.crmService.configure(req.body, req.user);
      res.status(200).json(ApiResponse.success('CRM configuration updated successfully', result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Test CRM connection
   */
  testConnection = async (req, res, next) => {
    try {
      const result = await this.crmService.testConnection(req.user.organizationId);
      res.status(200).json(ApiResponse.success('CRM connection test completed', result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Sync data with CRM
   */
  syncData = async (req, res, next) => {
    try {
      const { syncType } = req.body;
      const result = await this.crmService.initiateSync(syncType, req.user);
      res.status(200).json(ApiResponse.success('CRM sync initiated', result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get sync status
   */
  getSyncStatus = async (req, res, next) => {
    try {
      const result = await this.crmService.getSyncStatus(req.user.organizationId);
      res.status(200).json(ApiResponse.success('Sync status retrieved', result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get sync logs
   */
  getSyncLogs = async (req, res, next) => {
    try {
      const result = await this.crmService.getSyncLogs(req.query, req.user);
      res.status(200).json(ApiResponse.success('Sync logs retrieved', result.data, result.meta));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get CRM mappings
   */
  getMappings = async (req, res, next) => {
    try {
      const result = await this.crmService.getMappings(req.user.organizationId);
      res.status(200).json(ApiResponse.success('CRM mappings retrieved', result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update CRM mappings
   */
  updateMappings = async (req, res, next) => {
    try {
      const result = await this.crmService.updateMappings(req.body, req.user);
      res.status(200).json(ApiResponse.success('CRM mappings updated successfully', result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handle CRM webhook
   */
  handleWebhook = async (req, res, next) => {
    try {
      const { crmType } = req.params;
      const result = await this.crmService.processWebhook(crmType, req.body, req.headers);
      res.status(200).json(ApiResponse.success('Webhook processed successfully', result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get integration status
   */
  getIntegrationStatus = async (req, res, next) => {
    try {
      const result = await this.crmService.getIntegrationStatus(req.user.organizationId);
      res.status(200).json(ApiResponse.success('Integration status retrieved', result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Pause/Resume integration
   */
  toggleIntegration = async (req, res, next) => {
    try {
      const { action } = req.body; // 'pause' or 'resume'
      const result = await this.crmService.toggleIntegration(action, req.user);
      res.status(200).json(ApiResponse.success(`Integration ${action}d successfully`, result));
    } catch (error) {
      next(error);
    }
  };
}