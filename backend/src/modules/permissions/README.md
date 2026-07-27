# Permissions Module

Enterprise-grade permissions management system for SFA backend.

## Overview

The Permissions module provides comprehensive permission management capabilities including:
- CRUD operations for permissions
- Organization-scoped permissions
- System vs custom permissions
- Hierarchical permission structure
- Permission categories and types
- Statistics and reporting

## Architecture

```
src/modules/permissions/
├── controllers/
│   └── permission.controller.js    # HTTP layer
├── services/
│   └── permission.service.js       # Business logic
├── repositories/
│   └── PermissionRepository.js     # Data access
├── routes/
│   └── permission.routes.js        # API routes
├── validators/
│   └── permission.validation.js    # Input validation
├── constants/
│   └── permission.constants.js     # Permission definitions
├── index.js                        # Module exports
└── export.js                       # Export utilities
```

## API Endpoints

- `GET /permissions` - List permissions with filtering/pagination
- `GET /permissions/:id` - Get permission by ID
- `POST /permissions` - Create new permission
- `PUT /permissions/:id` - Update permission
- `DELETE /permissions/:id` - Delete permission
- `GET /permissions/statistics` - Get permission statistics

## Permission Categories

- **SYSTEM** - Core system operations
- **ORGANIZATION** - Organization management
- **USER_MANAGEMENT** - User operations
- **ROLE_MANAGEMENT** - Role operations
- **PERMISSION_MANAGEMENT** - Permission operations
- **LEAD_MANAGEMENT** - Lead operations
- **SALES_ORDER** - Sales order operations
- **REPORTING** - Reporting operations

## Permission Types

- **CRUD** - Standard create, read, update, delete
- **ACTION** - Specific actions like approve, publish
- **ACCESS** - Access controls like view_sensitive

## Security Features

- Organization-scoped permissions
- System permission protection
- Reserved slug validation
- Hierarchical permission support
- Proper authentication/authorization

## Statistics

The module provides comprehensive statistics:
- Total permissions count
- System vs custom breakdown
- Active vs inactive counts
- Category-wise distribution

## Usage

```javascript
import { PermissionService } from './modules/permissions/export.js';

// Create permission
const permission = await permissionService.createPermission(orgId, {
  name: 'View Reports',
  slug: 'reporting:view',
  category: 'REPORTING'
});
```

## Dependencies

- Express.js for routing
- Zod for validation
- Prisma for database operations
- Organization module for context