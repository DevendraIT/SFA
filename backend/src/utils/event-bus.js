import { EventEmitter } from 'events';
import logger from './logger.js';

class EventBus extends EventEmitter {
  constructor() {
    super();
    // Increase limit if we have many listeners
    this.setMaxListeners(20);
  }

  /**
   * Safely emit an event and log it.
   */
  emitEvent(eventName, payload) {
    try {
      logger.info(`[EventBus] Emitting event: ${eventName}`);
      this.emit(eventName, payload);
    } catch (error) {
      logger.error(`[EventBus] Error emitting event ${eventName}: ${error.message}`);
    }
  }
}

export const eventBus = new EventBus();
