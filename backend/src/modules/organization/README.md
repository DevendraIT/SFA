# Organization Module

Enterprise-grade Organization module managing organizational hierarchy and structure.

## Architecture

This module follows the **Enterprise Modular Monolith** architecture pattern:

```
organization/
├── controllers/           # HTTP request handlers
│   └── organization.controller.js
├── services/              # Business logic layer
│   └── organization.service.js  
├── repositories/          # Data access layer
│   └── organization.repository.js
├── routes/                # Route definitions
│   └── organization.routes.js
├── validators/            # Request validation schemas
│   └── organization.validation.js
├── permissions/           # RBAC permission constants
│   └── organization.permission.js
├── constants/             # Module constants (empty)
├── dto/                   # Data Transfer Objects (empty)
├── mappers/               # Entity mappers (empty)
├── helpers/               # Utility functions (empty)
├── index.js               # Main module export
├── exports.js             # Centralized exports
└── README.md              # This file
```

## Features

- **Multi-tenant Organization Management**
- **Company Hierarchy Management**
- **Branch Management**
- **Department Management**  
- **Territory Management**
- **Enterprise-grade RBAC**
- **Comprehensive Audit Logging**

## API Endpoints

### Organization
- `GET /api/v1/organization` - Get current organization
- `PUT /api/v1/organization` - Update organization

### Companies
- `GET /api/v1/organization/companies` - List companies
- `POST /api/v1/organization/companies` - Create company
- `GET /api/v1/organization/companies/:id` - Get company
- `PUT /api/v1/organization/companies/:id` - Update company
- `DELETE /api/v1/organization/companies/:id` - Delete company
- `PATCH /api/v1/organization/companies/:id/restore` - Restore company

### Branches
- `GET /api/v1/organization/branches` - List branches
- `POST /api/v1/organization/branches` - Create branch
- `GET /api/v1/organization/branches/:id` - Get branch
- `PUT /api/v1/organization/branches/:id` - Update branch
- `DELETE /api/v1/organization/branches/:id` - Delete branch
- `PATCH /api/v1/organization/branches/:id/restore` - Restore branch

### Departments
- `GET /api/v1/organization/departments` - List departments
- `POST /api/v1/organization/departments` - Create department
- `GET /api/v1/organization/departments/:id` - Get department
- `PUT /api/v1/organization/departments/:id` - Update department
- `DELETE /api/v1/organization/departments/:id` - Delete department
- `PATCH /api/v1/organization/departments/:id/restore` - Restore department

### Territories
- `GET /api/v1/organization/territories` - List territories
- `POST /api/v1/organization/territories` - Create territory
- `GET /api/v1/organization/territories/:id` - Get territory
- `PUT /api/v1/organization/territories/:id` - Update territory
- `DELETE /api/v1/organization/territories/:id` - Delete territory
- `PATCH /api/v1/organization/territories/:id/restore` - Restore territory
