import { z } from 'zod';
import { AppError } from '../shared/response.js';

/**
 * Validation Middleware Factory
 * Supports:
 *   validate(schema)
 *   validate(schema, 'params')
 *   validate(schema, 'query')
 *   validate({
 *     body: bodySchema,
 *     params: paramsSchema,
 *     query: querySchema
 *   })
 *
 * @param {z.Schema | { body?: z.Schema, params?: z.Schema, query?: z.Schema }} schema
 * @param {'body'|'params'|'query'} source
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      // Multiple schema support
      if (schema && typeof schema.parse !== 'function') {
        const originalData = {
          body: req.body,
          params: req.params,
          query: req.query,
        };

        if (schema.body) {
          req.body = schema.body.parse(req.body);
        }

        if (schema.params) {
          req.params = schema.params.parse(req.params);
        }

        if (schema.query) {
          const validatedQuery = schema.query.parse(req.query);

          Object.defineProperty(req, 'query', {
            value: validatedQuery,
            writable: true,
            enumerable: true,
            configurable: true,
          });
        }

        return next();
      }

      // Single schema support
      const data =
        source === 'body'
          ? req.body
          : source === 'params'
          ? req.params
          : req.query;

      const validated = schema.parse(data);

      if (source === 'body') {
        req.body = validated;
      } else if (source === 'params') {
        req.params = validated;
      } else {
        Object.defineProperty(req, 'query', {
          value: validated,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          received: err.received,
        }));

        console.error('❌ Validation Error Details:', {
          source:
            schema && typeof schema.parse !== 'function'
              ? 'multiple'
              : source,
          errors,
          originalData: {
            body: req.body,
            params: req.params,
            query: req.query,
          },
        });

        return next(AppError.badRequest('Validation failed', errors));
      }

      next(error);
    }
  };
};

export default validate;