import { verifyAccessToken } from "../../config/jwt.js";
import { AppError } from "../../shared/response.js";
import prisma from "../../config/database.js";

/**
 * Authentication Middleware
 * Validates JWT access tokens in the Authorization header
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw AppError.unauthorized("Missing or invalid authorization header");
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

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
      throw AppError.unauthorized("User account is inactive or not found.");
    }

    if (user.deletedAt) {
      throw AppError.unauthorized("User account has been deleted.");
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organizationId: user.organizationId,
      branchId: user.branchId,
      departmentId: user.departmentId,
      teamId: user.teamId,
      roles: user.roles.map((ur) => ur.role.name),
      permissions: user.roles.flatMap((ur) => ur.role.permissions.map((rp) => rp.permission.slug)),
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-Based Access Control (RBAC) Authorization Middleware
 * @param {string|string[]} requiredPermissions - Slug(s) required to pass
 */
export const authorize = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw AppError.unauthorized("Authentication required.");
      }

      const permissions = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

      const hasPermission = permissions.some((perm) =>
        req.user.permissions.includes(perm)
      );

      if (!hasPermission) {
        throw AppError.forbidden("Access denied: Insufficient permissions.");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Require active tenant organization context
 */
export const requireOrganization = (req, res, next) => {
  try {
    if (!req.user?.organizationId) {
      throw AppError.forbidden("Tenant organization context required.");
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default {
  authenticate,
  authorize,
  requireOrganization,
};
