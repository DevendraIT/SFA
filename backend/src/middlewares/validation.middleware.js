import { z } from 'zod';
import { AppError } from '../shared/response.js';

/**
 * Validation Middleware Factory
 * Creates middleware to validate request body, params, or query
 * @param {z.Schema} schema - Zod schema for validation
 * @param {'body'|'params'|'query'} source - Source to validate
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    let data;
    try {
      data = source === 'body' ? req.body : source === 'params' ? req.params : req.query;

      const validated = schema.parse(data);

      if (source === 'body') {
        req.body = validated;
      } else if (source === 'params') {
        req.params = validated;
      } else if (source === 'query') {
        req.query = validated;
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          received: err.received
        }));
        
        // Log detailed validation error for debugging
        console.error('❌ Validation Error Details:', {
          source,
          errors,
          originalData: data
        });
        
        return next(AppError.badRequest('Validation failed', errors));
      }
      next(error);
    }
  };
};

export default validate;
