import swaggerJsdoc from 'swagger-jsdoc';
import config from './env.js';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sales Force Automation (SFA) API',
      version: config.API_VERSION,
      description: 'Enterprise-grade SFA Backend API - Production Ready',
      contact: {
        name: 'Backend Team',
        email: 'backend@sfa.local',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/api/${config.API_VERSION}`,
        description: 'Development Server',
      },
      {
        url: `https://api.sfa.local/api/${config.API_VERSION}`,
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization token',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Request success status',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            data: {
              type: 'object',
              nullable: true,
              description: 'Response data',
            },
            meta: {
              type: 'object',
              nullable: true,
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' },
              },
            },
            errors: {
              type: 'array',
              nullable: true,
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
          required: ['success', 'message'],
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            errors: { type: 'array' },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.js', './src/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
