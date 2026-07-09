import sgMail from '@sendgrid/mail';
import { config } from '../../../../config/env.js';

export class SendgridProvider {
  constructor() {
    sgMail.setApiKey(config.EMAIL.sendgrid.apiKey);
  }

  async sendEmail(to, subject, body, metadata = {}) {
    const msg = {
      to,
      from: {
        name: config.EMAIL.fromName,
        email: config.EMAIL.fromAddress,
      },
      subject,
      html: body,
      customArgs: {
        campaignId: metadata.campaignId || 'none',
        prospectId: metadata.prospectId || 'none',
        organizationId: metadata.organizationId || 'none'
      }
    };

    const [response] = await sgMail.send(msg);
    
    // SendGrid returns x-message-id in headers
    const messageId = response.headers['x-message-id'];

    return {
      success: true,
      messageId: messageId,
      provider: 'sendgrid'
    };
  }
}
