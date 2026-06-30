/**
 * Authentication Module Constants
 */
export const AUTH_CONSTANTS = {
  // Account Security
  LOCKOUT: {
    MAX_FAILED_ATTEMPTS: 5,
    DURATION_MS: 15 * 60 * 1000, // 15 minutes
  },
  
  // Password Policy rules
  PASSWORD_POLICY: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
    HISTORY_LIMIT: 5, // Compare against last 5 passwords
  },
  
  // One-Time Password (OTP) Configuration
  OTP: {
    LENGTH: 6,
    ALPHANUMERIC: false, // Digits only by default
    EXPIRY: {
      EMAIL_VERIFICATION_MS: 24 * 60 * 60 * 1000, // 24 hours
      PASSWORD_RESET_MS: 15 * 60 * 1000, // 15 minutes
    },
  },
  
  // Cookie settings (for httpOnly JWT Refresh token storage)
  COOKIE: {
    REFRESH_TOKEN_NAME: "sfa_rt",
    MAX_AGE_MS: 7 * 24 * 60 * 60 * 1000, // 7 days (matches JWT refresh token expiration)
  },

  // Audit Log Action Slugs
  AUDIT: {
    ACTIONS: {
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
    },
    MODULE: "auth",
  },
};

export default AUTH_CONSTANTS;
