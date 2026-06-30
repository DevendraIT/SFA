import validate from "../../middlewares/validation.middleware.js";
import {
  loginSchema,
  verifyEmailSchema,
  resendOtpSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schema.js";

/**
 * Pre-wrapped Auth Validation Middlewares
 */
export const validateLogin = validate(loginSchema, "body");
export const validateVerifyEmail = validate(verifyEmailSchema, "body");
export const validateResendOtp = validate(resendOtpSchema, "body");
export const validateChangePassword = validate(changePasswordSchema, "body");
export const validateForgotPassword = validate(forgotPasswordSchema, "body");
export const validateResetPassword = validate(resetPasswordSchema, "body");
