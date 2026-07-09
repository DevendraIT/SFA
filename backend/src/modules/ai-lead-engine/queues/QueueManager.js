import { Queue } from 'bullmq';
import { config } from '../../../config/env.js';

export class QueueManager {
  constructor() {
    this.connection = { 
      url: config.REDIS_URL,
      retryStrategy: () => 10000 // Slow down retries to every 10s
    };
    
    this.queues = {
      emailQueue: new Queue('EmailQueue', { connection: this.connection }),
      campaignQueue: new Queue('CampaignQueue', { connection: this.connection }),
      aiAnalysisQueue: new Queue('AiAnalysisQueue', { connection: this.connection }),
    };

    // Suppress unhandled error events to avoid console spam when Redis is offline
    Object.values(this.queues).forEach(q => q.on('error', () => {}));
  }

  getQueue(name) {
    return this.queues[name];
  }

  async closeAll() {
    await Promise.all(Object.values(this.queues).map(q => q.close()));
  }
}
