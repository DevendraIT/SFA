/**
 * Operational Error Class
 * Used to throw errors that are predicted/operational (e.g. Validation, Auth, Permissions)
 */
export class AppError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    // Capture stack trace, excluding the constructor call from it
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, errors = null) {
    return new AppError(message, 400, errors);
  }

  static unauthorized(message, errors = null) {
    return new AppError(message, 401, errors);
  }

  static forbidden(message, errors = null) {
    return new AppError(message, 403, errors);
  }

  static notFound(message, errors = null) {
    return new AppError(message, 404, errors);
  }

  static internal(message, errors = null) {
    return new AppError(message, 500, errors);
  }
}

/**
 * Standard API Response Formatter Class
 */
export class ApiResponse {
  constructor(success, message, data = {}, meta = null, errors = []) {
    this.success = success;
    this.message = message;
    if (success) {
      this.data = data || {};
      if (meta !== null) this.meta = meta;
    } else {
      this.errors = errors || [];
    }
  }

  static success(message, data = {}, meta = null) {
    return new ApiResponse(true, message, data, meta);
  }

  static error(message, errors = []) {
    return new ApiResponse(false, message, null, null, errors);
  }
}

