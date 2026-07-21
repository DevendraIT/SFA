# User Module

Enterprise-grade user management system with hierarchical reporting for SFA backend.

## Overview

The User module provides comprehensive user management capabilities including:
- Complete CRUD operations for users
- Role-based access control integration
- Hierarchical reporting structure (manager/subordinate relationships)
- Organization-scoped user management
- Advanced validation and security features
- Audit logging for all operations

## Architecture

```
src/modules/users/
├── controllers/
│   └── user.controller.js          # HTTP layer
├── services/
│   └── user.service.js             # Business logic
├── repositories/
│   └── UserRepository.js           # Data access with hierarchy
├── routes/
│   └── user.routes.js              # API routes
├── validators/
│   └── user.validation.js          # Input validation
├── permissions/
│   └── user.permission.js          # Permission definitions
├── constants/
│   └── user.constants.js           # User constants
├── dto/                            # Data transfer objects
├── helpers/                        # Utility functions
├── middleware/                     # Custom middleware
├── tests/                          # Test files
├── index.js                        # Module exports
├── export.js                       # Export utilities
└── README.md
```

## API Endpoints

### Core Operations
- `GET /users` - List users with filtering/pagination
- `GET /users/:id` - Get user details
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Soft delete user

### Role Management
- `PUT /users/:id/roles` - Update user roles

### Reporting Hierarchy
- `GET /users/:id/subordinates` - Get all subordinates (recursive)
- `GET /users/:id/hierarchy` - Get manager chain (upward)

## Features

### Security & Validation
- Strong password requirements (8+ chars, mixed case, numbers, symbols)
- Email uniqueness within organization
- Organization-scoped operations
- Permission-based access control
- Audit logging for all operations

### Reporting Hierarchy
- Recursive SQL CTEs for efficient hierarchy queries
- Manager/subordinate relationships
- Circular reference prevention
- Depth-based subordinate listing
- Complete manager chain retrieval

### Business Rules
- Self-deletion prevention
- Email verification for admin-created users
- Role validation within organization
- Structural assignment validation (branch/dept/team/territory)
- Manager assignment validation

### Data Integrity
- Soft delete (preserves references)
- Transaction-based operations
- Foreign key validation
- Secure password hashing

## Usage Examples

```javascript
import { UserService } from './modules/users/export.js';

// Create user
const user = await userService.createUser(orgId, {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  roleIds: ['role-uuid']
});

// Get reporting hierarchy
const subordinates = await userService.getSubordinates(userId, orgId);
const managers = await userService.getManagerHierarchy(userId, orgId);
```

## Constants

- **USER_STATUS** - Active, Inactive, Pending, Suspended
- **USER_VALIDATION** - Length limits for fields
- **USER_ROLES** - Default system roles
- **REPORTING_HIERARCHY** - Hierarchy configuration
- **DEFAULT_USER_SETTINGS** - Default user settings

## Dependencies

- Express.js for routing
- Zod for validation  
- Prisma for database operations with raw SQL CTEs
- Bcrypt for password hashing
- Organization/Role modules for relationships

## Security Notes

- Passwords are hashed using bcrypt
- All operations are organization-scoped
- Sensitive fields excluded from API responses
- Audit trail for compliance
