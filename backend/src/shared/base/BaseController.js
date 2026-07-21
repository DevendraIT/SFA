/**
 * Base Controller - Enterprise Modular Monolith
 * Provides common functionality and patterns for all controllers
 */
import { ApiResponse, AppError } from '../response.js';

export class BaseController {
  constructor(service) {
    this.service = service;
    this.allowedFilters = []; // Override in child classes
    this.allowedSorts = ['createdAt', 'updatedAt']; // Override in child classes
  }

  /**
   * Async error handler wrapper
   * Eliminates need for try-catch in every controller method
   */
  asyncHandler = (fn) => {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };

  /**
   * Standardized success response handler
   */
  handleSuccess(res, data = null, message = 'Operation successful', statusCode = 200, meta = null) {
    console.error("HANDLE SUCCESS DATA:", data ? Object.keys(data) : null);
    return res.status(statusCode).json(ApiResponse.success(message, data, meta));
  }

  /**
   * Standardized error response handler
   */
  handleError(res, error, message = 'Operation failed', statusCode = 500) {
    return res.status(statusCode).json(ApiResponse.error(message, error));
  }

  /**
   * Handle paginated responses
   */
  handlePaginated(res, data, pagination, message = 'Data retrieved successfully') {
    return res.status(200).json(ApiResponse.paginated(message, data, pagination));
  }

  /**
   * Extract user from authenticated request
   */
  extractUser(req) {
    if (!req.user) {
      throw AppError.unauthorized('User not authenticated');
    }
    return req.user;
  }

  /**
   * Extract organization from request
   */
  extractOrganization(req) {
    if (!req.organization) {
      throw AppError.badRequest('Organization context not found');
    }
    return req.organization;
  }

  /**
   * Parse and validate pagination parameters
   */
  extractPagination(req) {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }

  /**
   * Parse and validate filter parameters
   */
  extractFilters(req) {
    const filters = {};
    
    for (const key of this.allowedFilters) {
      if (req.query[key] !== undefined) {
        filters[key] = req.query[key];
      }
    }

    return filters;
  }

  /**
   * Parse and validate sort parameters
   */
  extractSort(req) {
    const sort = req.query.sort || 'createdAt';
    const order = (req.query.order || 'desc').toLowerCase();

    if (!this.allowedSorts.includes(sort)) {
      throw AppError.badRequest(`Invalid sort field: ${sort}`);
    }

    if (!['asc', 'desc'].includes(order)) {
      throw AppError.badRequest(`Invalid sort order: ${order}`);
    }

    return { [sort]: order };
  }

  /**
   * Extract request metadata (IP, User-Agent, etc.)
   */
  extractRequestMeta(req) {
    return {
      ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
      userAgent: req.headers['user-agent'],
      requestId: req.requestId || req.headers['x-request-id'],
    };
  }

  /**
   * Generic CRUD operations
   */

  // Create resource
  create = this.asyncHandler(async (req, res) => {
    const user = this.extractUser(req);
    const data = { ...req.body, createdById: user.id };
    
    const result = await this.service.create(data);
    return this.handleSuccess(res, result, 'Resource created successfully', 201);
  });

  // Get all resources with pagination and filtering
  getAll = this.asyncHandler(async (req, res) => {
    const pagination = this.extractPagination(req);
    const filters = this.extractFilters(req);
    const sort = this.extractSort(req);

    const result = await this.service.getAll({ ...pagination, filters, sort });
    
    return this.handlePaginated(res, result.data, {
      page: pagination.page,
      limit: pagination.limit,
      total: result.total,
      pages: Math.ceil(result.total / pagination.limit),
    });
  });

  // Get single resource by ID
  getById = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await this.service.getById(id);
    
    if (!result) {
      throw AppError.notFound('Resource not found');
    }
    
    return this.handleSuccess(res, result, 'Resource retrieved successfully');
  });

  // Update resource by ID
  update = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = this.extractUser(req);
    const data = { ...req.body, updatedById: user.id };
    
    const result = await this.service.update(id, data);
    return this.handleSuccess(res, result, 'Resource updated successfully');
  });

  // Delete resource by ID (soft delete if supported)
  delete = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = this.extractUser(req);
    
    await this.service.delete(id, user.id);
    return this.handleSuccess(res, null, 'Resource deleted successfully');
  });

  // Restore soft-deleted resource
  restore = this.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = this.extractUser(req);
    
    const result = await this.service.restore(id, user.id);
    return this.handleSuccess(res, result, 'Resource restored successfully');
  });

  // Bulk operations
  bulkCreate = this.asyncHandler(async (req, res) => {
    const user = this.extractUser(req);
    const { items } = req.body;
    
    const data = items.map(item => ({ ...item, createdById: user.id }));
    const results = await this.service.bulkCreate(data);
    
    return this.handleSuccess(res, results, `${results.length} resources created successfully`, 201);
  });

  bulkUpdate = this.asyncHandler(async (req, res) => {
    const user = this.extractUser(req);
    const { items } = req.body;
    
    const data = items.map(item => ({ ...item, updatedById: user.id }));
    const results = await this.service.bulkUpdate(data);
    
    return this.handleSuccess(res, results, `${results.length} resources updated successfully`);
  });

  bulkDelete = this.asyncHandler(async (req, res) => {
    const user = this.extractUser(req);
    const { ids } = req.body;
    
    const count = await this.service.bulkDelete(ids, user.id);
    return this.handleSuccess(res, { count }, `${count} resources deleted successfully`);
  });
}