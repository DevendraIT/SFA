import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { config } from '../../../../config/env.js';

export class SesProvider {
  constructor() {
    this.client = new SESClient({
      region: config.EMAIL.aws.region,
      credentials: {
        accessKeyId: config.EMAIL.aws.accessKeyId,
        secretAccessKey: config.EMAIL.aws.secretAccessKey,
      }
    });
  }

  async sendEmail(to, subject, body, metadata = {}) {
    const params = {
      Destination: { ToAddresses: [to] },
      Message: {
        Body: {
          Html: { Charset: "UTF-8", Data: body }
        },
        Subject: { Charset: "UTF-8", Data: subject }
      },
      Source: `"${config.EMAIL.fromName}" <${config.EMAIL.fromAddress}>`,
      Tags: [
        { Name: 'campaignId', Value: metadata.campaignId || 'none' },
        { Name: 'prospectId', Value: metadata.prospectId || 'none' }
      ]
    };

    const command = new SendEmailCommand(params);
    const response = await this.client.send(command);

    return {
      success: true,
      messageId: response.MessageId,
      provider: 'ses'
    };
  }
}
