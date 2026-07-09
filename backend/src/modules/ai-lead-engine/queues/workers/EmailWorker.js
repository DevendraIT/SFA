import { Worker } from 'bullmq';
import { config } from '../../../../config/env.js';

export class EmailWorker {
  constructor(emailDispatchService) {
    this.emailDispatchService = emailDispatchService;
    
    this.worker = new Worker('EmailQueue', async (job) => {
      const { to, subject, body, metadata } = job.data;
      
      try {
        const result = await this.emailDispatchService._dispatchNow({ to, subject, body, metadata });
        
        if (!result.success) {
          throw new Error('Email dispatch failed');
        }
        
        return result;
      } catch (err) {
        console.error(`[EmailWorker] Failed to process job ${job.id}:`, err);
        throw err; // Trigger BullMQ retry mechanism
      }
    }, {
      connection: { 
        url: config.REDIS_URL,
        retryStrategy: () => 10000
      },
      concurrency: 10, // Process 10 emails concurrently
      limiter: {
        max: 50,
        duration: 1000 // rate limit to 50 emails per second
      }
    });

    this.worker.on('completed', job => {
      console.log(`[EmailWorker] Job ${job.id} completed successfully.`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`[EmailWorker] Job ${job.id} failed with error ${err.message}`);
    });
    this.worker.on('error', () => {});
  }

  async close() {
    await this.worker.close();
  }
}
