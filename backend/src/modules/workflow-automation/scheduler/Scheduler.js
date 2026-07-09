import { Queue, Worker } from 'bullmq';
import { config } from '../../../config/env.js';
import EventBus from '../events/EventBus.js';

/**
 * Scheduler
 *
 * Uses BullMQ repeatable jobs to emit time-based workflow events.
 * Each scheduled job fires an EventBus event with the configured
 * eventName and payload, which the WorkflowEngine then picks up.
 *
 * This lets workflow rules be scheduled via the same rule engine
 * without any special cron-specific code paths.
 */
export class Scheduler {
  constructor() {
    const connection = { 
      url: config.REDIS_URL,
      retryStrategy: () => 10000
    };

    this.queue = new Queue('WorkflowScheduler', {
      connection,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 500,
      },
    });
    this.queue.on('error', () => {});

    // Worker: fires EventBus events for scheduled jobs
    this.worker = new Worker('WorkflowScheduler', async (job) => {
      const { eventName, payload } = job.data;
      EventBus.emit(eventName, { ...payload, scheduledJobId: job.id });
    }, { connection });

    this.worker.on('failed', (job, err) => {
      console.error(`[Scheduler] Job ${job?.id} failed: ${err.message}`);
    });
    this.worker.on('error', () => {});
  }

  /**
   * Schedule a recurring workflow event.
   *
   * @param {string} jobKey    - Unique identifier (e.g. "daily-followup-reminder")
   * @param {string} cron      - Cron expression (e.g. "0 9 * * 1-5" = 9am weekdays)
   * @param {string} eventName - The WORKFLOW_EVENTS constant to emit
   * @param {object} payload   - Static payload merged into the event
   */
  async scheduleRecurring(jobKey, cron, eventName, payload = {}) {
    await this.queue.add(jobKey, { eventName, payload }, {
      repeat: { pattern: cron },
      jobId: jobKey, // Ensures idempotency — won't create duplicates
    });
  }

  /**
   * Schedule a one-shot delayed workflow event.
   *
   * @param {string} jobKey    - Unique identifier
   * @param {number} delayMs   - Delay in milliseconds
   * @param {string} eventName - Event to emit
   * @param {object} payload
   */
  async scheduleDelayed(jobKey, delayMs, eventName, payload = {}) {
    await this.queue.add(jobKey, { eventName, payload }, {
      delay: delayMs,
      jobId: jobKey,
    });
  }

  /** Remove a scheduled recurring job. */
  async cancelRecurring(jobKey) {
    await this.queue.removeRepeatable(jobKey, { jobId: jobKey });
  }

  async close() {
    await this.worker.close();
    await this.queue.close();
  }
}
