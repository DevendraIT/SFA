/**
 * Centralized Response Utilities - Enterprise Modular Monolith
 * Standardized API responses and error handling
 */

/**
 * Custom Application Error Class
 * Extends native Error with HTTP status codes and operational flags
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
    this.errors = errors;
    
    // Maintain proper stack trace
    Error.captureStackTrace(this, AppError);
  }

  // Static factory methods for common errors
  static badRequest(message = 'Bad Request', errors = null) {
    return new AppError(message, 400, true, errors);
  }

  static unauthorized(message = 'Unauthorized', errors = null) {
    return new AppError(message, 401, true, errors);
  }

  static forbidden(message = 'Forbidden', errors = null) {
    return new AppError(message, 403, true, errors);
  }

  static notFound(message = 'Resource not found', errors = null) {
    return new AppError(message, 404, true, errors);
  }

  static conflict(message = 'Resource conflict', errors = null) {
    return new AppError(message, 409, true, errors);
  }

  static unprocessableEntity(message = 'Validation failed', errors = null) {
    return new AppError(message, 422, true, errors);
  }

  static tooManyRequests(message = 'Too many requests', errors = null) {
    return new AppError(message, 429, true, errors);
  }

  static internal(message = 'Internal server error', errors = null) {
    return new AppError(message, 500, false, errors);
  }
}

/**
 * Standardized API Response Formatter
 * Ensures consistent response structure across all endpoints
 */
export class ApiResponse {
  constructor(success, message, data = null, meta = null) {
    this.success = success;
    this.message = message;
    this.timestamp = new Date().toISOString();
    
    if (data !== null) {
      this.data = data;
    }
    
    if (meta !== null) {
      this.meta = meta;
    }
  }

  // Static factory methods for different response types
  static success(message, data = null, meta = null) {
    return new ApiResponse(true, message, data, meta);
  }

  static error(message, data = null, meta = null) {
    return new ApiResponse(false, message, data, meta);
  }

  static created(message, data = null, meta = null) {
    return new ApiResponse(true, message, data, meta);
  }

  static updated(message, data = null, meta = null) {
    return new ApiResponse(true, message, data, meta);
  }

  static deleted(message = 'Resource deleted successfully') {
    return new ApiResponse(true, message);
  }

  static paginated(message, data, pagination) {
    return new ApiResponse(true, message, data, { pagination });
  }
}

/**
 * Helper functions for consistent response handling
 */
export const successResponse = (res, message, data = null, statusCode = 200, meta = null) => {
  return res.status(statusCode).json(ApiResponse.success(message, data, meta));
};

export const errorResponse = (res, message, statusCode = 500, data = null) => {
  return res.status(statusCode).json(ApiResponse.error(message, data));
};

export const createdResponse = (res, message, data = null) => {
  return res.status(201).json(ApiResponse.created(message, data));
};

export const updatedResponse = (res, message, data = null) => {
  return res.status(200).json(ApiResponse.updated(message, data));
};

export const deletedResponse = (res, message = 'Resource deleted successfully') => {
  return res.status(200).json(ApiResponse.deleted(message));
};

export const paginatedResponse = (res, message, data, pagination) => {
  return res.status(200).json(ApiResponse.paginated(message, data, pagination));
};