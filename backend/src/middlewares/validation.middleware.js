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
    try {
      // Support object format like validate({ body: schema1, params: schema2 })
      if (schema && typeof schema.parse !== 'function') {
        if (schema.body) req.body = schema.body.parse(req.body);
        if (schema.params) req.params = schema.params.parse(req.params);
        if (schema.query) {
          Object.defineProperty(req, 'query', {
            value: schema.query.parse(req.query),
            writable: true, enumerable: true, configurable: true
          });
        }
        return next();
      }

      // Single schema support (original logic)
      const data = source === 'body' ? req.body : source === 'params' ? req.params : req.query;
      const validated = schema.parse(data);

      if (source === 'body') {
        req.body = validated;
      } else if (source === 'params') {
        req.params = validated;
      } else if (source === 'query') {
        Object.defineProperty(req, 'query', {
          value: validated,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          received: err.received
        }));

        console.error('❌ Validation Error Details:', {
          source: (schema && typeof schema.parse !== 'function') ? 'multiple' : source,
          errors,
        });

        return next(AppError.badRequest('Validation failed', errors));
      }
      next(error);
    }
  };
};

export default validate;