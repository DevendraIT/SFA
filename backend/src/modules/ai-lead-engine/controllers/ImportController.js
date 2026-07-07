/**
 * AI Lead Engine Import Controller - Enterprise Modular Monolith
 */

import { ApiResponse } from '../../../shared/response.js';

export class ImportController {
  constructor(importService) {
    this.importService = importService;
  }

  // CSV Import
  uploadCSV = async (req, res, next) => {
    try {
      const result = await this.importService.uploadCSV(req.file, req.user);
      res.status(200).json(ApiResponse.success('CSV uploaded successfully', result));
    } catch (error) {
      next(error);
    }
  };

  // Excel Import  
  uploadExcel = async (req, res, next) => {
    try {
      const result = await this.importService.uploadExcel(req.file, req.user);
      res.status(200).json(ApiResponse.success('Excel uploaded successfully', result));
    } catch (error) {
      next(error);
    }
  };

  // API Import
  apiImport = async (req, res, next) => {
    try {
      const result = await this.importService.apiImport(req.body, req.user);
      res.status(200).json(ApiResponse.success('API import initiated', result));
    } catch (error) {
      next(error);
    }
  };

  // Manual Import
  manualImport = async (req, res, next) => {
    try {
      const result = await this.importService.manualImport(req.body, req.user);
      res.status(200).json(ApiResponse.success('Manual import completed', result));
    } catch (error) {
      next(error);
    }
  };

  // Get Import History
  getImportHistory = async (req, res, next) => {
    try {
      const result = await this.importService.getImportHistory(req.query, req.user);
      res.status(200).json(ApiResponse.success('Import history retrieved', result.data, result.meta));
    } catch (error) {
      next(error);
    }
  };
}