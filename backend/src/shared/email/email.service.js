import transporter from "./transporter.js";
import config from "../../config/env.js";

class EmailService {
  async sendMail({ to, subject, html }) {
    return transporter.sendMail({
      from: `"${config.EMAIL.fromName}" <${config.EMAIL.fromAddress}>`,
      to,
      subject,
      html,
    });
  }

  async sendForgotPasswordEmail(email, resetLink) {
    return this.sendMail({
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Reset Password</h2>

        <p>You requested to reset your password.</p>

        <p>
          <a href="${resetLink}">
            Click here to reset your password
          </a>
        </p>

        <p>If you didn't request this, ignore this email.</p>
      `,
    });
  }

  async sendVerificationEmail(email, verificationLink) {
    return this.sendMail({
      to: email,
      subject: "Verify Your Email",
      html: `
        <h2>Email Verification</h2>

        <p>Please verify your email.</p>

        <a href="${verificationLink}">
            Verify Email
        </a>
      `,
    });
  }
}

export default new EmailService();