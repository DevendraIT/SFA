/**
 * Auth Module Constants - Enterprise Modular Monolith
 * Consolidated authentication constants and configuration
 */

export const AUTH_CONSTANTS = {
  // JWT Token settings
  JWT: {
    ACCESS_TOKEN_EXPIRY: '480m',
    REFRESH_TOKEN_EXPIRY: '7d',
    REMEMBER_ME_EXPIRY: '30d',
  },

  // Account lockout settings (using more restrictive settings)
  LOCKOUT: {
    MAX_FAILED_ATTEMPTS: 5,
    DURATION_MS: 15 * 60 * 1000, // 15 minutes
  },

  // Session settings
  SESSION: {
    MAX_CONCURRENT: 3,
    CLEANUP_INTERVAL_MS: 60 * 60 * 1000, // 1 hour
  },

  // Password Policy rules (comprehensive from auth.constants.js)
  PASSWORD_POLICY: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
    HISTORY_LIMIT: 5, // Compare against last 5 passwords
    EXPIRY_DAYS: 90,
    REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },

  // Legacy PASSWORD settings for backward compatibility
  PASSWORD: {
    MIN_LENGTH: 8,
    HISTORY_COUNT: 5,
    EXPIRY_DAYS: 90,
    REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  },

  // One-Time Password (OTP) Configuration (merged from both)
  OTP: {
    LENGTH: 6,
    ALPHANUMERIC: false, // Digits only by default
    EXPIRY_MINUTES: 10,
    MAX_ATTEMPTS: 3,
    EXPIRY: {
      EMAIL_VERIFICATION_MS: 24 * 60 * 60 * 1000, // 24 hours
      PASSWORD_RESET_MS: 15 * 60 * 1000, // 15 minutes
    },
  },

  // Cookie settings (merged from both files)
  COOKIE: {
    REFRESH_TOKEN_NAME: "sfa_rt",
    MAX_AGE_MS: 7 * 24 * 60 * 60 * 1000, // 7 days (matches JWT refresh token expiration)
  },

  COOKIES: {
    REFRESH_TOKEN: 'refreshToken',
    SESSION_ID: 'sessionId',
    OPTIONS: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },

  // Audit Log Action Slugs (merged from both files)
  AUDIT: {
    MODULE: 'AUTH',
    ACTIONS: {
      // New format (dotted notation)
      LOGIN_SUCCESS: "auth.login.success",
      LOGIN_FAILED: "auth.login.failed", 
      LOGOUT: "auth.logout",
      REFRESH_TOKEN: "auth.token.refresh",
      REFRESH_TOKEN_REUSE: "auth.token.reuse_detected",
      PASSWORD_CHANGE: "auth.password.change",
      PASSWORD_RESET_REQUEST: "auth.password.reset_request",
      PASSWORD_RESET_SUCCESS: "auth.password.reset_success",
      EMAIL_VERIFICATION_REQUEST: "auth.email_verify.request",
      EMAIL_VERIFICATION_SUCCESS: "auth.email_verify.success",
      ACCOUNT_LOCKED: "auth.account.locked",
      ACCOUNT_UNLOCKED: "auth.account.unlocked",
      
      // Legacy format (for backward compatibility)
      TOKEN_REFRESHED: 'TOKEN_REFRESHED',
      PASSWORD_CHANGED: 'PASSWORD_CHANGED',
      PASSWORD_RESET_REQUESTED: 'PASSWORD_RESET_REQUESTED',
      PASSWORD_RESET_COMPLETED: 'PASSWORD_RESET_COMPLETED',
      EMAIL_VERIFIED: 'EMAIL_VERIFIED',
      SESSION_TERMINATED: 'SESSION_TERMINATED',
      REFRESH_TOKEN_REVOKED: 'REFRESH_TOKEN_REVOKED',
    },
  },

  // Response messages
  MESSAGES: {
    LOGIN_SUCCESS: 'Login successful',
    LOGIN_FAILED: 'Invalid credentials',
    LOGOUT_SUCCESS: 'Logout successful',
    TOKEN_REFRESHED: 'Token refreshed successfully',
    PASSWORD_CHANGED: 'Password changed successfully',
    PASSWORD_RESET_SENT: 'Password reset instructions sent to your email',
    PASSWORD_RESET_SUCCESS: 'Password reset successful',
    ACCOUNT_LOCKED: 'Account temporarily locked due to multiple failed login attempts',
    EMAIL_VERIFICATION_SENT: 'Verification email sent',
    EMAIL_VERIFIED: 'Email verified successfully',
    INVALID_TOKEN: 'Invalid or expired token',
    SESSION_EXPIRED: 'Session has expired',
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Insufficient permissions',
  },
};

export default AUTH_CONSTANTS;