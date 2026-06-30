import { z } from "zod";
import AUTH_CONSTANTS from "./auth.constants.js";

const passwordPolicy = AUTH_CONSTANTS.PASSWORD_POLICY;

// Reusable text sanitization helper (removes HTML tags and strips spacing)
const sanitizeText = (val) => {
  if (typeof val !== "string") return val;
  return val.replace(/<[^>]*>/g, "").trim();
};

// Reusable strong password validation schema
export const strongPasswordSchema = z
  .string()
  .min(passwordPolicy.MIN_LENGTH, { message: `Password must be at least ${passwordPolicy.MIN_LENGTH} characters long.` })
  .max(passwordPolicy.MAX_LENGTH, { message: `Password cannot exceed ${passwordPolicy.MAX_LENGTH} characters.` })
  .refine((val) => !passwordPolicy.REQUIRE_UPPERCASE || /[A-Z]/.test(val), {
    message: "Password must contain at least one uppercase letter.",
  })
  .refine((val) => !passwordPolicy.REQUIRE_LOWERCASE || /[a-z]/.test(val), {
    message: "Password must contain at least one lowercase letter.",
  })
  .refine((val) => !passwordPolicy.REQUIRE_NUMBER || /[0-9]/.test(val), {
    message: "Password must contain at least one numeric digit.",
  })
  .refine((val) => !passwordPolicy.REQUIRE_SPECIAL || /[!@#$%^&*(),.?":{}|<>]/.test(val), {
    message: "Password must contain at least one special character.",
  });

// Standard tenant identifier
export const tenantIdentifierSchema = z.string().uuid({ message: "Invalid Organization ID." });


// 2. Login Schema
export const loginSchema = z.object({
  organizationSlug: z.string().trim().toLowerCase().min(2, { message: "Organization slug is required." }),
  email: z.string().trim().toLowerCase().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  rememberMe: z.boolean().optional().default(false),
});

// 3. Email Verification Schema
export const verifyEmailSchema = z.object({
  organizationSlug: z.string().trim().toLowerCase().min(2),
  email: z.string().trim().toLowerCase().email({ message: "Invalid email address." }),
  otp: z.string().trim().length(AUTH_CONSTANTS.OTP.LENGTH, { message: `OTP must be exactly ${AUTH_CONSTANTS.OTP.LENGTH} digits.` }),
});

// 4. Resend OTP Schema
export const resendOtpSchema = z.object({
  organizationSlug: z.string().trim().toLowerCase().min(2),
  email: z.string().trim().toLowerCase().email({ message: "Invalid email address." }),
});

// 5. Change Password
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: strongPasswordSchema,
}).refine((data) => data.oldPassword !== data.newPassword, {
  message: "New password must be different from your old password.",
  path: ["newPassword"],
});

// 6. Forgot Password
export const forgotPasswordSchema = z.object({
  organizationSlug: z.string().trim().toLowerCase().min(2),
  email: z.string().trim().toLowerCase().email({ message: "Invalid email address." }),
});

// 7. Reset Password
export const resetPasswordSchema = z.object({
  organizationSlug: z.string().trim().toLowerCase().min(2),
  email: z.string().trim().toLowerCase().email({ message: "Invalid email address." }),
  otp: z.string().trim().length(AUTH_CONSTANTS.OTP.LENGTH, { message: `OTP must be exactly ${AUTH_CONSTANTS.OTP.LENGTH} digits.` }),
  newPassword: strongPasswordSchema,
});
