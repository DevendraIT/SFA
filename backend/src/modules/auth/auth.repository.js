import prisma from "../../config/database.js";

/**
 * Authentication Module Database Repository
 */
export class AuthRepository {
  /**
   * Find organization by slug
   * @param {string} slug - unique slug
   */
  async findOrganizationBySlug(slug) {
    return prisma.organization.findUnique({
      where: { slug },
    });
  }

  /**
   * Find user by email and organization ID with full role/permission graph
   * @param {string} organizationId - UUID
   * @param {string} email - lowercased email
   */
  async findUserByEmailAndOrg(organizationId, email) {
    return prisma.user.findFirst({
      where: {
        organizationId,
        email,
        deletedAt: null,
      },
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
  }

  /**
   * Find user by ID with roles and permissions
   * @param {string} userId - UUID
   */
  async findUserById(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
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
  }

  /**
   * Update User attributes
   * @param {string} userId - UUID
   * @param {Object} data - Update payload
   */
  async updateUser(userId, data) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  /**
   * Create Session
   * @param {Object} data - Session model fields
   */
  async createSession(data) {
    return prisma.session.create({
      data,
    });
  }

  /**
   * Find session by token value
   * @param {string} token - unique token hash
   */
  async findSessionByToken(token) {
    return prisma.session.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });
  }

  /**
   * Delete specific session
   * @param {string} sessionId - UUID
   */
  async deleteSession(sessionId) {
    return prisma.session.delete({
      where: { id: sessionId },
    });
  }

  /**
   * Find session details by ID
   * @param {string} id - UUID
   */
  async findSessionById(id) {
    return prisma.session.findUnique({
      where: { id },
    });
  }

  /**
   * Terminate all active sessions for a user
   * @param {string} userId - UUID
   */
  async deleteSessionsByUserId(userId) {
    return prisma.session.deleteMany({
      where: { userId },
    });
  }

  /**
   * Create Refresh Token
   * @param {Object} data - fields
   */
  async createRefreshToken(data) {
    return prisma.refreshToken.create({
      data,
    });
  }

  /**
   * Find Refresh Token with session details
   * @param {string} token - refresh token value
   */
  async findRefreshToken(token) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: {
        user: true,
        session: true,
      },
    });
  }

  /**
   * Update Refresh Token attributes
   * @param {string} id - UUID
   * @param {Object} data - payload
   */
  async updateRefreshToken(id, data) {
    return prisma.refreshToken.update({
      where: { id },
      data,
    });
  }

  /**
   * Revoke all refresh tokens associated with a session
   * @param {string} sessionId - UUID
   */
  async revokeRefreshTokensBySession(sessionId) {
    return prisma.refreshToken.updateMany({
      where: { sessionId },
      data: { isRevoked: true },
    });
  }

  /**
   * Retrieve password history list
   * @param {string} userId - UUID
   * @param {number} limit - max size
   */
  async getPasswordHistory(userId, limit = 5) {
    return prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  /**
   * Add password hash to history
   * @param {string} userId - UUID
   * @param {string} passwordHash - encrypted password
   */
  async createPasswordHistory(userId, passwordHash) {
    return prisma.passwordHistory.create({
      data: {
        userId,
        passwordHash,
      },
    });
  }

  /**
   * Create system audit log
   * @param {Object} data - log values
   */
  async createAuditLog(data) {
    return prisma.auditLog.create({
      data,
    });
  }



  /**
   * Fetch all active sessions for a user
   * @param {string} userId - UUID
   */
  async findActiveSessions(userId) {
    return prisma.session.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Count active sessions for a user
   * @param {string} userId - UUID
   */
  async findActiveSessionsCount(userId) {
    return prisma.session.count({
      where: {
        userId,
        expiresAt: { gt: new Date() },
      },
    });
  }

  /**
   * Delete the oldest active session for a user (limit enforcement)
   * @param {string} userId - UUID
   */
  async deleteOldestSession(userId) {
    const oldestSession = await prisma.session.findFirst({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    if (oldestSession) {
      return prisma.session.delete({
        where: { id: oldestSession.id },
      });
    }
    return null;
  }

  /**
   * Get audit logs for a tenant organization
   * @param {string} organizationId - UUID
   * @param {number} limit - page limit
   * @param {number} offset - page offset
   */
  async getAuditLogs(organizationId, limit = 50, offset = 0) {
    return prisma.auditLog.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}

export default AuthRepository;
