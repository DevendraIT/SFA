import express from "express";
import { AuthRepository } from "./auth.repository.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { authenticate } from "./auth.middleware.js";
import {
  validateLogin,
  validateVerifyEmail,
  validateResendOtp,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
} from "./auth.validation.js";

const router = express.Router();

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

// --------------------------------------------------
// Public Endpoints
// --------------------------------------------------

router.post("/login", validateLogin, authController.login);
router.post("/refresh-token", authController.refresh);
router.post("/logout", authController.logout);
router.post("/verify-email", validateVerifyEmail, authController.verifyEmail);
router.post("/resend-verification", validateResendOtp, authController.resendVerificationOtp);
router.post("/forgot-password", validateForgotPassword, authController.forgotPassword);
router.post("/reset-password", validateResetPassword, authController.resetPassword);

// --------------------------------------------------
// Authenticated Endpoints
// --------------------------------------------------

router.post("/change-password", authenticate, validateChangePassword, authController.changePassword);
router.get("/me", authenticate, authController.getMe);

export default router;
export { authController, authService, authRepository };
