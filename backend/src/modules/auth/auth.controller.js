import { ApiResponse } from "../../shared/response.js";
import { AuthUserDto, AuthTokensDto } from "./auth.dto.js";
import AUTH_CONSTANTS from "./auth.constants.js";
import { getCookieOptions } from "./auth.utils.js";
import config from "../../config/env.js";

/**
 * Controller class coordinating Auth HTTP endpoints
 * Follows enterprise standards: no business logic, coordinates responses and validation hooks.
 */
export class AuthController {
  constructor(authService) {
    this.authService = authService;
  }


  /**
   * Handle user authentication credentials check
   */
  login = async (req, res, next) => {
    try {
      const { organizationSlug, email, password, rememberMe } = req.body;
      const requestMeta = {
        ipAddress: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      };

      const result = await this.authService.login(organizationSlug, email, password, rememberMe, requestMeta);

      if (!result.emailVerified) {
        return res.status(200).json(
          ApiResponse.success(result.message, {
            emailVerified: false,
            email: result.email,
          })
        );
      }

      if (result.passwordExpired) {
        return res.status(200).json(
          ApiResponse.success(result.message, {
            emailVerified: true,
            passwordExpired: true,
            email: result.email,
          })
        );
      }

      // Set cookie containing refresh token securely (httpOnly)
      const cookieOpts = getCookieOptions(config.NODE_ENV);
      res.cookie(AUTH_CONSTANTS.COOKIE.REFRESH_TOKEN_NAME, result.refreshToken, cookieOpts);

      return res.status(200).json(
        ApiResponse.success("Authentication successful.", {
          emailVerified: true,
          user: AuthUserDto.toResponse(result.user),
          tokens: AuthTokensDto.toResponse(result.accessToken),
        })
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Refresh JWT access token via Refresh Token Rotation (RTR)
   */
  refresh = async (req, res, next) => {
    try {
      const oldRefreshToken = req.cookies[AUTH_CONSTANTS.COOKIE.REFRESH_TOKEN_NAME] || req.body.refreshToken;
      
      if (!oldRefreshToken) {
        return res.status(401).json(ApiResponse.error("Session token missing."));
      }

      const requestMeta = {
        ipAddress: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      };

      const result = await this.authService.refresh(oldRefreshToken, requestMeta);

      // Rotate secure cookie
      const cookieOpts = getCookieOptions(config.NODE_ENV);
      res.cookie(AUTH_CONSTANTS.COOKIE.REFRESH_TOKEN_NAME, result.refreshToken, cookieOpts);

      return res.status(200).json(
        ApiResponse.success("Session token refreshed.", {
          user: AuthUserDto.toResponse(result.user),
          tokens: AuthTokensDto.toResponse(result.accessToken),
        })
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Terminate active user login session
   */
  logout = async (req, res, next) => {
    try {
      const refreshToken = req.cookies[AUTH_CONSTANTS.COOKIE.REFRESH_TOKEN_NAME] || req.body.refreshToken;
      
      const requestMeta = {
        ipAddress: req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      };

      if (refreshToken) {
        await this.authService.logout(refreshToken, requestMeta);
      }

      // Destroy cookie context
      res.clearCookie(AUTH_CONSTANTS.COOKIE.REFRESH_TOKEN_NAME, {
        path: "/",
        httpOnly: true,
      });

      return res.status(200).json(ApiResponse.success("Logged out successfully."));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Confirm email verification OTP
   */
  verifyEmail = async (req, res, next) => {
    try {
      const { organizationSlug, email, otp } = req.body;
      await this.authService.verifyEmail(organizationSlug, email, otp);
      return res.status(200).json(ApiResponse.success("Email verified successfully. You can now login."));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Resend Email verification OTP
   */
  resendVerificationOtp = async (req, res, next) => {
    try {
      const { organizationSlug, email } = req.body;
      await this.authService.resendVerificationOtp(organizationSlug, email);
      return res.status(200).json(ApiResponse.success("Verification code resent successfully."));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Request forgot password OTP
   */
  forgotPassword = async (req, res, next) => {
    try {
      const { organizationSlug, email } = req.body;
      await this.authService.forgotPassword(organizationSlug, email);
      return res.status(200).json(
        ApiResponse.success("If the account exists, a password reset code has been sent.")
      );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Reset Password with OTP verification
   */
  resetPassword = async (req, res, next) => {
    try {
      const { organizationSlug, email, otp, newPassword } = req.body;
      await this.authService.resetPassword(organizationSlug, email, otp, newPassword);
      return res.status(200).json(ApiResponse.success("Password has been reset successfully. Please login."));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Change user password (authenticated route)
   */
  changePassword = async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      await this.authService.changePassword(req.user.id, oldPassword, newPassword);
      return res.status(200).json(ApiResponse.success("Password changed successfully."));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve active user context profile details
   */
  getMe = async (req, res, next) => {
    try {
      const user = await this.authService.authRepository.findUserById(req.user.id);
      return res.status(200).json(
        ApiResponse.success("Profile retrieved.", AuthUserDto.toResponse(user))
      );
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
