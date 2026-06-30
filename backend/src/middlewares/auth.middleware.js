import { verifyAccessToken } from '../config/jwt.js';
import { AppError } from '../shared/response.js';
import { prisma } from '../config/database.js';

/**
 * Authenticate user via JWT token
 * Extracts token from Authorization header and validates it
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    // Fetch user from database matching multi-role relational schema
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw AppError.unauthorized('User not found or inactive');
    }

    if (user.deletedAt) {
      throw AppError.unauthorized('User account has been deleted');
    }

    // Attach user metadata to request context
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles.map((ur) => ur.role.name),
      permissions: user.roles.flatMap((ur) => ur.role.permissions.map((rp) => rp.permission.slug)),
      organizationId: user.organizationId,
      branchId: user.branchId,
      departmentId: user.departmentId,
      teamId: user.teamId,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Authorize user based on role or permissions
 * @param {string[]|string} requiredPermissions - Permissions required
 */
export const authorize = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw AppError.unauthorized('Authentication required');
      }

      const permissions = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      const hasPermission = permissions.some((permission) =>
        req.user.permissions.includes(permission)
      );

      if (!hasPermission) {
        throw AppError.forbidden('Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check user's organizational access
 * Ensures user can only access their organization's data
 */
export const requireOrganization = (req, res, next) => {
  try {
    if (!req.user?.organizationId) {
      throw AppError.forbidden('Organization access required');
    }

    // Add organization context to request
    req.organizationId = req.user.organizationId;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify user owns resource
 * @param {Object} req - Request context
 * @param {string} resourceOwnerId - ID of the resource owner
 */
export const verifyOwnership = (req, resourceOwnerId) => {
  if (resourceOwnerId !== req.user?.id) {
    throw AppError.forbidden('You do not own this resource');
  }
};

export default authenticate;
