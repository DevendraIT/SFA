import { Queue } from 'bullmq';
import { config } from '../../../config/env.js';
import { SmtpProvider } from '../email/providers/SmtpProvider.js';
import { SendgridProvider } from '../email/providers/SendgridProvider.js';
import { SesProvider } from '../email/providers/SesProvider.js';

export class EmailDispatchService {
  constructor() {
    this.emailProvider = this._initializeProvider();
    
    // Initialize BullMQ Queue
    this.emailQueue = new Queue('EmailQueue', {
      connection: { 
        url: config.REDIS_URL,
        retryStrategy: () => 10000
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        removeOnFail: 1000 // keep last 1000 failed jobs for debugging
      }
    });
    this.emailQueue.on('error', () => {});
  }

  _initializeProvider() {
    const providerConfig = config.EMAIL.provider;
    
    switch (providerConfig) {
      case 'smtp': return new SmtpProvider();
      case 'sendgrid': return new SendgridProvider();
      case 'ses': return new SesProvider();
      default: return null; // mock mode
    }
  }

  /**
   * Dispatch a single email (pushes to queue).
   */
  async dispatch({ to, subject, body, metadata = {} }) {
    if (metadata.isTest) {
      return this._dispatchNow({ to, subject, body, metadata });
    }

    // Queue the job
    const job = await this.emailQueue.add('send-email', {
      to,
      subject,
      body,
      metadata
    });

    return { success: true, queued: true, jobId: job.id };
  }

  /**
   * Dispatch a batch of emails.
   */
  async dispatchBatch(emails) {
    // For queues, we just add all jobs in bulk
    const jobs = emails.map(e => ({
      name: 'send-email',
      data: {
        to: e.to,
        subject: e.subject,
        body: e.body,
        metadata: e.metadata || {}
      }
    }));

    await this.emailQueue.addBulk(jobs);

    return {
      success: true,
      queued: true,
      totalQueued: jobs.length
    };
  }

  /**
   * Send a single test email (always synchronous, never queued).
   */
  async sendTestEmail(to, subject, body) {
    return this.dispatch({ to, subject, body, metadata: { isTest: true } });
  }

  /**
   * Merge template variables into a body string.
   * Variables: {{ firstName }}, {{ company }}, {{ jobTitle }}
   */
  renderTemplate(templateBody, variables = {}) {
    return templateBody.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
      return variables[key] !== undefined ? variables[key] : `{{${key}}}`;
    });
  }

  /**
   * Internal: calls the actual provider.
   * This is called directly for tests, and by the EmailWorker for queued jobs.
   */
  async _dispatchNow({ to, subject, body, metadata }) {
    if (!this.emailProvider) {
      console.log(`[EmailDispatch MOCK] to=${to} subject="${subject}"`);
      return { success: true, mock: true, messageId: `mock-${Date.now()}` };
    }
    return this.emailProvider.sendEmail(to, subject, body, metadata);
  }
}
