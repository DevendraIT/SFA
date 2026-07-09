import nodemailer from 'nodemailer';
import { config } from '../../../../config/env.js';

export class SmtpProvider {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.EMAIL.smtp.host,
      port: config.EMAIL.smtp.port,
      secure: config.EMAIL.smtp.port === 465,
      auth: {
        user: config.EMAIL.smtp.user,
        pass: config.EMAIL.smtp.pass,
      },
    });
  }

  async sendEmail(to, subject, body, metadata = {}) {
    const mailOptions = {
      from: `"${config.EMAIL.fromName}" <${config.EMAIL.fromAddress}>`,
      to,
      subject,
      html: body,
      headers: {
        'X-Campaign-ID': metadata.campaignId || '',
        'X-Prospect-ID': metadata.prospectId || '',
      }
    };

    const info = await this.transporter.sendMail(mailOptions);
    return {
      success: true,
      messageId: info.messageId,
      provider: 'smtp'
    };
  }
}
