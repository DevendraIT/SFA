import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import AUTH_CONSTANTS from "./auth.constants.js";
import config from "../../config/env.js";
import { logger } from "../../utils/index.js";

// ==================================================
// 1. PASSWORD UTILITIES
// ==================================================

/**
 * Hash a plain text password using bcrypt
 * @param {string} password - Raw password string
 * @returns {Promise<string>} Encrypted hash
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hash
 * @param {string} password - Raw password string
 * @param {string} hash - Saved bcrypt hash
 * @returns {Promise<boolean>} Match comparison result
 */
export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Verify a password complies with password policy rules
 * @param {string} password - Raw password
 * @returns {{isValid: boolean, error: string|null}} Check results
 */
export const checkPasswordPolicy = (password) => {
  const policy = AUTH_CONSTANTS.PASSWORD_POLICY;
  
  if (password.length < policy.MIN_LENGTH || password.length > policy.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Password must be between ${policy.MIN_LENGTH} and ${policy.MAX_LENGTH} characters.`,
    };
  }
  
  if (policy.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one uppercase letter." };
  }
  
  if (policy.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one lowercase letter." };
  }
  
  if (policy.REQUIRE_NUMBER && !/[0-9]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one numeric digit." };
  }
  
  if (policy.REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, error: "Password must contain at least one special character." };
  }
  
  return { isValid: true, error: null };
};

// ==================================================
// 2. OTP UTILITIES
// ==================================================

/**
 * Generate a cryptographically secure random numeric OTP
 * @returns {string} OTP code digits
 */
export const generateNumericOtp = () => {
  const length = AUTH_CONSTANTS.OTP.LENGTH;
  let otp = "";
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += Math.floor((bytes[i] / 256) * 10).toString();
  }
  return otp;
};

// ==================================================
// 3. COOKIE UTILITIES
// ==================================================

/**
 * Get secure cookie options based on active environment (production vs development)
 * @param {string} envName - NODE_ENV value
 * @returns {Object} Cookie options
 */
export const getCookieOptions = (envName) => {
  const isProd = envName === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    maxAge: AUTH_CONSTANTS.COOKIE.MAX_AGE_MS,
    path: "/",
  };
};

/**
 * Attach secure session token cookie to HTTP response
 * @param {Object} res - Express response
 * @param {string} token - refresh token value
 */
export const setSessionCookie = (res, token) => {
  const options = getCookieOptions(config.NODE_ENV);
  res.cookie(AUTH_CONSTANTS.COOKIE.REFRESH_TOKEN_NAME, token, options);
};

/**
 * Clear session cookie from HTTP response
 * @param {Object} res - Express response
 */
export const clearSessionCookie = (res) => {
  res.clearCookie(AUTH_CONSTANTS.COOKIE.REFRESH_TOKEN_NAME, {
    path: "/",
    httpOnly: true,
  });
};

// ==================================================
// 4. JWT & TOKEN UTILITIES
// ==================================================

/**
 * Generate JWT access token
 * @param {Object} payload - Token payload properties
 */
export const signAccessToken = (payload) => {
  return jwt.sign(payload, config.JWT.secret, {
    expiresIn: config.JWT.expiresIn,
  });
};

/**
 * Generate JWT refresh token
 * @param {Object} payload - Token payload properties
 */
export const signRefreshToken = (payload) => {
  return jwt.sign(payload, config.JWT.refreshSecret, {
    expiresIn: config.JWT.refreshExpiresIn,
  });
};

// ==================================================
// 5. EMAIL UTILITIES (ABSTRACTIONS)
// ==================================================

/**
 * Abstracted email sender interface (logs to emulator stdout)
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject line
 * @param {string} html - HTML email body content
 */
export const sendEmail = async (to, subject, html) => {
  // In production, integrate NodeMailer, SendGrid, or AWS SES here
  logger.info(`📬 [EMAIL EMULATOR] Sending Email:
    To: ${to}
    Subject: ${subject}
    Body (Truncated): ${html.substring(0, 150)}...
  `);
  return true;
};

/**
 * Send email verification code
 * @param {string} to - Recipient email
 * @param {string} otp - verification OTP code
 */
export const sendVerificationEmail = async (to, otp) => {
  const subject = "Verify Your Account - SFA Platform";
  const html = `
    <h1>Welcome to Sales Force Automation (SFA)</h1>
    <p>Please verify your email address by entering this verification code:</p>
    <h2 style="color:#0066cc; font-size:32px; letter-spacing:2px;">${otp}</h2>
    <p>This code will expire in 24 hours.</p>
  `;
  return sendEmail(to, subject, html);
};

/**
 * Send password reset code
 * @param {string} to - Recipient email
 * @param {string} otp - reset OTP code
 */
export const sendPasswordResetEmail = async (to, otp) => {
  const subject = "Reset Your Password - SFA Platform";
  const html = `
    <h1>Password Reset Request</h1>
    <p>You requested a password reset. Use this code to change your password:</p>
    <h2 style="color:#cc0000; font-size:32px; letter-spacing:2px;">${otp}</h2>
    <p>This code will expire in 15 minutes. If you did not request this, please secure your account.</p>
  `;
  return sendEmail(to, subject, html);
};

// ==================================================
// 6. DEVICE UTILITIES
// ==================================================

/**
 * Simple parser to extract OS/Browser name from User-Agent header
 * @param {string} userAgent - Raw user agent string
 * @returns {{browser: string, os: string}} parsed values
 */
export const parseUserAgent = (userAgent) => {
  if (!userAgent) return { browser: "Unknown Browser", os: "Unknown OS" };

  let os = "Unknown OS";
  let browser = "Unknown Browser";

  if (/windows/i.test(userAgent)) os = "Windows";
  else if (/macintosh|mac os x/i.test(userAgent)) os = "macOS";
  else if (/iphone|ipad/i.test(userAgent)) os = "iOS";
  else if (/android/i.test(userAgent)) os = "Android";
  else if (/linux/i.test(userAgent)) os = "Linux";

  if (/chrome|crios/i.test(userAgent) && !/edge/i.test(userAgent) && !/opr/i.test(userAgent)) browser = "Google Chrome";
  else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = "Apple Safari";
  else if (/firefox|fxios/i.test(userAgent)) browser = "Mozilla Firefox";
  else if (/edge|edg/i.test(userAgent)) browser = "Microsoft Edge";
  else if (/opr|opera/i.test(userAgent)) browser = "Opera";

  return { browser, os };
};
