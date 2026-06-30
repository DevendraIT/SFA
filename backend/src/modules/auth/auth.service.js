import { AppError } from "../../shared/response.js";
import { generateAccessToken, generateRefreshToken } from "../../config/jwt.js";
import {
  hashPassword,
  comparePassword,
  checkPasswordPolicy,
  generateNumericOtp,
  parseUserAgent,
} from "./auth.utils.js";
import AUTH_CONSTANTS from "./auth.constants.js";
import { logger } from "../../utils/index.js";
import crypto from "crypto";

/**
 * Enterprise Authentication Business Logic Service Layer
 */
export class AuthService {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }


  /**
   * Authenticate user credentials, enforce concurrent session limits, and track devices
   * @param {string} organizationSlug - tenant slug
   * @param {string} email - user email
   * @param {string} password - user raw password
   * @param {boolean} rememberMe - remember me flag (extends token expiry)
   * @param {Object} requestMeta - metadata containing IP and User-Agent
   */
  async login(organizationSlug, email, password, rememberMe = false, requestMeta = {}) {
    const org = await this.authRepository.findOrganizationBySlug(organizationSlug);
    if (!org || !org.isActive) {
      throw AppError.unauthorized("Invalid organization slug or inactive tenant.");
    }

    const user = await this.authRepository.findUserByEmailAndOrg(org.id, email);
    if (!user) {
      throw AppError.unauthorized("Invalid email or password.");
    }

    // 1. Lockout Check
    if (user.lockoutExpiresAt && user.lockoutExpiresAt > new Date()) {
      const remainingTime = Math.ceil((user.lockoutExpiresAt - new Date()) / 60000);
      throw AppError.forbidden(`Account is temporarily locked. Try again in ${remainingTime} minutes.`);
    }

    // 2. Password Check & Increment Lockout counter on failure
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      const failedAttempts = user.failedLoginAttempts + 1;
      const updateData = { failedLoginAttempts: failedAttempts };

      if (failedAttempts >= AUTH_CONSTANTS.LOCKOUT.MAX_FAILED_ATTEMPTS) {
        updateData.lockoutExpiresAt = new Date(Date.now() + AUTH_CONSTANTS.LOCKOUT.DURATION_MS);
        updateData.failedLoginAttempts = 0; // reset for next lockout cycle

        // Log Account lockout event
        await this.authRepository.createAuditLog({
          organizationId: org.id,
          userId: user.id,
          action: AUTH_CONSTANTS.AUDIT.ACTIONS.ACCOUNT_LOCKED,
          moduleName: AUTH_CONSTANTS.AUDIT.MODULE,
          ipAddress: requestMeta.ipAddress,
          userAgent: requestMeta.userAgent,
          details: { reason: "Maximum failed login attempts reached" },
        });

        // Revoke active sessions immediately on lockout for security containment
        await this.authRepository.deleteSessionsByUserId(user.id);

        logger.warn(`🔒 Account locked out: User ID ${user.id} at Tenant ID ${org.id}`);
      }

      await this.authRepository.updateUser(user.id, updateData);

      await this.authRepository.createAuditLog({
        organizationId: org.id,
        userId: user.id,
        action: AUTH_CONSTANTS.AUDIT.ACTIONS.LOGIN_FAILED,
        moduleName: AUTH_CONSTANTS.AUDIT.MODULE,
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      });

      throw AppError.unauthorized("Invalid email or password.");
    }

    // 3. Reset lockout counters on successful match
    if (user.failedLoginAttempts > 0 || user.lockoutExpiresAt) {
      await this.authRepository.updateUser(user.id, {
        failedLoginAttempts: 0,
        lockoutExpiresAt: null,
      });
    }

    // 4. Force Email Verification check
    if (!user.emailVerifiedAt) {
      let otp = user.emailVerificationOtp;
      if (!user.emailVerificationExpiresAt || user.emailVerificationExpiresAt < new Date()) {
        otp = generateNumericOtp();
        const expiry = new Date(Date.now() + AUTH_CONSTANTS.OTP.EXPIRY.EMAIL_VERIFICATION_MS);
        await this.authRepository.updateUser(user.id, {
          emailVerificationOtp: otp,
          emailVerificationExpiresAt: expiry,
        });
        logger.info(`📧 [EMAIL EMULATOR] Verification OTP for ${user.email} (Re-generated): ${otp}`);
      }

      return {
        emailVerified: false,
        email: user.email,
        message: "Email verification required before accessing the application.",
      };
    }

    // 4.5. Password Expiration check (Enterprise policy: 90 days expiration)
    const PASSWORD_EXPIRY_DAYS = 90;
    const historyList = await this.authRepository.getPasswordHistory(user.id, 1);
    const lastChanged = historyList[0]?.createdAt || user.createdAt;
    const daysSinceChange = (Date.now() - lastChanged.getTime()) / (24 * 60 * 60 * 1000);
    if (daysSinceChange > PASSWORD_EXPIRY_DAYS) {
      return {
        emailVerified: true,
        passwordExpired: true,
        email: user.email,
        message: "Your password has expired. You must change your password before proceeding.",
      };
    }

    // 5. Seat Sharing Check: Enforce concurrent active session limit (Enterprise CRM compliance)
    const activeSessionsCount = await this.authRepository.findActiveSessionsCount(user.id);
    const MAX_CONCURRENT_SESSIONS = 3; // Standard seat license limit
    if (activeSessionsCount >= MAX_CONCURRENT_SESSIONS) {
      logger.info(`⚠️ Evicting oldest active session for user ${user.id} to enforce concurrent limit.`);
      await this.authRepository.deleteOldestSession(user.id);
    }

    // 6. Device Tracking: Parse OS & Browser info
    const parsedAgent = parseUserAgent(requestMeta.userAgent);
    const deviceString = `${parsedAgent.browser} on ${parsedAgent.os}`;

    // 7. Calculate Expiry based on Remember Me
    const sessionMaxAge = rememberMe 
      ? 30 * 24 * 60 * 60 * 1000 // Remember Me: 30 days
      : 24 * 60 * 60 * 1000;     // Standard: 24 hours
    const sessionExpiry = new Date(Date.now() + sessionMaxAge);

    // 8. Session & Token Creation
    const sessionToken = crypto.randomUUID();
    const session = await this.authRepository.createSession({
      organizationId: org.id,
      userId: user.id,
      token: sessionToken,
      userAgent: deviceString,
      ipAddress: requestMeta.ipAddress || "Unknown IP",
      expiresAt: sessionExpiry,
    });

    const accessPayload = {
      userId: user.id,
      organizationId: org.id,
      roleId: user.roles[0]?.roleId || null,
      roleName: user.roles[0]?.role.name || null,
      permissions: user.roles.flatMap((ur) => ur.role.permissions.map((rp) => rp.permission.slug)),
    };

    const accessToken = generateAccessToken(accessPayload);
    const refreshTokenValue = generateRefreshToken({ userId: user.id });

    // Store refresh token mapped to active session
    await this.authRepository.createRefreshToken({
      userId: user.id,
      sessionId: session.id,
      token: refreshTokenValue,
      expiresAt: sessionExpiry,
    });

    await this.authRepository.createAuditLog({
      organizationId: org.id,
      userId: user.id,
      action: AUTH_CONSTANTS.AUDIT.ACTIONS.LOGIN_SUCCESS,
      moduleName: AUTH_CONSTANTS.AUDIT.MODULE,
      ipAddress: requestMeta.ipAddress,
      userAgent: deviceString,
      details: { rememberMe },
    });

    return {
      emailVerified: true,
      user,
      accessToken,
      refreshToken: refreshTokenValue,
    };
  }

  /**
   * Refresh Token Rotation (RTR) logic with reuse checking
   */
  async refresh(tokenValue, requestMeta = {}) {
    const tokenRecord = await this.authRepository.findRefreshToken(tokenValue);

    if (!tokenRecord) {
      throw AppError.unauthorized("Invalid session token.");
    }

    const { session, user } = tokenRecord;

    // RTR breach containment: Token Reuse detection
    if (tokenRecord.isRevoked) {
      await this.authRepository.revokeRefreshTokensBySession(session.id);
      await this.authRepository.deleteSession(session.id);

      await this.authRepository.createAuditLog({
        organizationId: session.organizationId,
        userId: tokenRecord.userId,
        action: AUTH_CONSTANTS.AUDIT.ACTIONS.REFRESH_TOKEN_REUSE,
        moduleName: AUTH_CONSTANTS.AUDIT.MODULE,
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
        details: { revokedTokenId: tokenRecord.id },
      });

      logger.warn(`⚠️ Token Reuse Detected! Terminating session ${session.id} for user ${tokenRecord.userId}`);
      throw AppError.unauthorized("Session hijacked. Re-authentication required.");
    }

    if (tokenRecord.expiresAt < new Date()) {
      await this.authRepository.deleteSession(session.id);
      throw AppError.unauthorized("Refresh token expired.");
    }

    // Revoke current token
    await this.authRepository.updateRefreshToken(tokenRecord.id, { isRevoked: true });

    // Create rotated token pair
    const fullUser = await this.authRepository.findUserById(user.id);
    const accessPayload = {
      userId: user.id,
      organizationId: session.organizationId,
      roleId: fullUser.roles[0]?.roleId || null,
      roleName: fullUser.roles[0]?.role.name || null,
      permissions: fullUser.roles.flatMap((ur) => ur.role.permissions.map((rp) => rp.permission.slug)),
    };

    const newAccessToken = generateAccessToken(accessPayload);
    const newRefreshTokenValue = generateRefreshToken({ userId: user.id });

    // Maintain same expiration window as initial session creation
    await this.authRepository.createRefreshToken({
      userId: user.id,
      sessionId: session.id,
      token: newRefreshTokenValue,
      expiresAt: tokenRecord.expiresAt,
    });

    return {
      user: fullUser,
      accessToken: newAccessToken,
      refreshToken: newRefreshTokenValue,
    };
  }

  /**
   * Terminate active user login session (Session Destroy)
   */
  async logout(tokenValue, requestMeta = {}) {
    const tokenRecord = await this.authRepository.findRefreshToken(tokenValue);
    if (tokenRecord) {
      await this.authRepository.revokeRefreshTokensBySession(tokenRecord.sessionId);
      await this.authRepository.deleteSession(tokenRecord.sessionId);

      await this.authRepository.createAuditLog({
        organizationId: tokenRecord.session.organizationId,
        userId: tokenRecord.userId,
        action: AUTH_CONSTANTS.AUDIT.ACTIONS.LOGOUT,
        moduleName: AUTH_CONSTANTS.AUDIT.MODULE,
        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      });
    }
    return true;
  }

  /**
   * Verify User Email Address using OTP
   */
  async verifyEmail(organizationSlug, email, otp) {
    const org = await this.authRepository.findOrganizationBySlug(organizationSlug);
    if (!org) throw AppError.badRequest("Invalid organization slug.");

    const user = await this.authRepository.findUserByEmailAndOrg(org.id, email);
    if (!user) throw AppError.badRequest("Invalid request.");

    if (user.emailVerifiedAt) return true;

    if (user.emailVerificationOtp !== otp) {
      throw AppError.badRequest("Invalid verification code.");
    }

    if (user.emailVerificationExpiresAt < new Date()) {
      throw AppError.badRequest("Verification code expired. Please request a new one.");
    }

    await this.authRepository.updateUser(user.id, {
      emailVerifiedAt: new Date(),
      emailVerificationOtp: null,
      emailVerificationExpiresAt: null,
    });

    await this.authRepository.createAuditLog({
      organizationId: org.id,
      userId: user.id,
      action: AUTH_CONSTANTS.AUDIT.ACTIONS.EMAIL_VERIFICATION_SUCCESS,
      moduleName: AUTH_CONSTANTS.AUDIT.MODULE,
    });

    return true;
  }

  /**
   * Resend verification OTP
   */
  async resendVerificationOtp(organizationSlug, email) {
    const org = await this.authRepository.findOrganizationBySlug(organizationSlug);
    if (!org) throw AppError.badRequest("Invalid organization slug.");

    const user = await this.authRepository.findUserByEmailAndOrg(org.id, email);
    if (!user) throw AppError.badRequest("Invalid request.");

    if (user.emailVerifiedAt) {
      throw AppError.badRequest("Email is already verified.");
    }

    const otp = generateNumericOtp();
    const expiry = new Date(Date.now() + AUTH_CONSTANTS.OTP.EXPIRY.EMAIL_VERIFICATION_MS);

    await this.authRepository.updateUser(user.id, {
      emailVerificationOtp: otp,
      emailVerificationExpiresAt: expiry,
    });

    logger.info(`📧 [EMAIL EMULATOR] Resent verification OTP to ${user.email}: ${otp}`);

    await this.authRepository.createAuditLog({
      organizationId: org.id,
      userId: user.id,
      action: AUTH_CONSTANTS.AUDIT.ACTIONS.EMAIL_VERIFICATION_REQUEST,
      moduleName: AUTH_CONSTANTS.AUDIT.MODULE,
    });

    return true;
  }

  /**
   * Request forgot password OTP
   */
  async forgotPassword(organizationSlug, email) {
    const org = await this.authRepository.findOrganizationBySlug(organizationSlug);
    if (!org) return true;

    const user = await this.authRepository.findUserByEmailAndOrg(org.id, email);
    if (!user) return true;

    const otp = generateNumericOtp();
    const expiry = new Date(Date.now() + AUTH_CONSTANTS.OTP.EXPIRY.PASSWORD_RESET_MS);

    await this.authRepository.updateUser(user.id, {
      passwordResetOtp: otp,
      passwordResetExpiresAt: expiry,
    });

    logger.info(`📧 [EMAIL EMULATOR] Password reset OTP for ${user.email}: ${otp}`);

    await this.authRepository.createAuditLog({
      organizationId: org.id,
      userId: user.id,
      action: AUTH_CONSTANTS.AUDIT.ACTIONS.PASSWORD_RESET_REQUEST,
      moduleName: AUTH_CONSTANTS.AUDIT.MODULE,
    });

    return true;
  }

  /**
   * Reset user password using OTP (Enforces history policies)
   */
  async resetPassword(organizationSlug, email, otp, newPassword) {
    const org = await this.authRepository.findOrganizationBySlug(organizationSlug);
    if (!org) throw AppError.badRequest("Invalid verification details.");

    const user = await this.authRepository.findUserByEmailAndOrg(org.id, email);
    if (!user || user.passwordResetOtp !== otp) {
      throw AppError.badRequest("Invalid verification details.");
    }

    if (user.passwordResetExpiresAt < new Date()) {
      throw AppError.badRequest("Password reset code has expired.");
    }

    // 1. Password Policy verification
    const policyCheck = checkPasswordPolicy(newPassword);
    if (!policyCheck.isValid) {
      throw AppError.badRequest(policyCheck.error);
    }

    // 2. Password History verification
    const history = await this.authRepository.getPasswordHistory(user.id);
    for (const record of history) {
      const match = await comparePassword(newPassword, record.passwordHash);
      if (match) {
        throw AppError.badRequest("New password cannot be one of your last 5 passwords.");
      }
    }

    const passwordHash = await hashPassword(newPassword);

    await this.authRepository.createPasswordHistory(user.id, passwordHash);
    await this.authRepository.updateUser(user.id, {
      passwordHash,
      passwordResetOtp: null,
      passwordResetExpiresAt: null,
      failedLoginAttempts: 0,
      lockoutExpiresAt: null,
    });

    // Force log out everywhere on password reset (destroy old sessions)
    await this.authRepository.deleteSessionsByUserId(user.id);

    await this.authRepository.createAuditLog({
      organizationId: org.id,
      userId: user.id,
      action: AUTH_CONSTANTS.AUDIT.ACTIONS.PASSWORD_RESET_SUCCESS,
      moduleName: AUTH_CONSTANTS.AUDIT.MODULE,
    });

    return true;
  }

  /**
   * Change password (Enforces history policies)
   */
  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.authRepository.findUserById(userId);
    if (!user) throw AppError.unauthorized("Authentication required.");

    const matchOld = await comparePassword(oldPassword, user.passwordHash);
    if (!matchOld) {
      throw AppError.badRequest("Current password incorrect.");
    }

    // 1. Password Policy verification
    const policyCheck = checkPasswordPolicy(newPassword);
    if (!policyCheck.isValid) {
      throw AppError.badRequest(policyCheck.error);
    }

    // 2. Password History verification
    const history = await this.authRepository.getPasswordHistory(userId);
    for (const record of history) {
      const match = await comparePassword(newPassword, record.passwordHash);
      if (match) {
        throw AppError.badRequest("New password cannot be one of your last 5 passwords.");
      }
    }

    const passwordHash = await hashPassword(newPassword);

    await this.authRepository.createPasswordHistory(userId, passwordHash);
    await this.authRepository.updateUser(userId, { passwordHash });

    await this.authRepository.createAuditLog({
      organizationId: user.organizationId,
      userId: user.id,
      action: AUTH_CONSTANTS.AUDIT.ACTIONS.PASSWORD_CHANGE,
      moduleName: AUTH_CONSTANTS.AUDIT.MODULE,
    });

    return true;
  }

  /**
   * Get all active sessions for a user (Login History)
   * @param {string} userId - UUID
   */
  async getActiveSessions(userId) {
    const sessions = await this.authRepository.findActiveSessions(userId);
    return sessions.map((session) => ({
      id: session.id,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
    }));
  }

  /**
   * Terminate/Revoke a specific active session (Session Revocation)
   * @param {string} userId - UUID of session owner
   * @param {string} sessionId - UUID of session to terminate
   */
  async revokeSession(userId, sessionId) {
    const session = await this.authRepository.findSessionById(sessionId);

    if (!session || session.userId !== userId) {
      throw AppError.forbidden("You do not have permission to terminate this session.");
    }

    await this.authRepository.revokeRefreshTokensBySession(sessionId);
    await this.authRepository.deleteSession(sessionId);

    await this.authRepository.createAuditLog({
      organizationId: session.organizationId,
      userId,
      action: AUTH_CONSTANTS.AUDIT.ACTIONS.LOGOUT,
      moduleName: AUTH_CONSTANTS.AUDIT.MODULE,
      details: { revokedSessionId: sessionId, method: "user_revocation" },
    });

    return true;
  }
}

export default AuthService;
