/**
 * EventBus — Singleton Node.js EventEmitter.
 *
 * All modules emit business events here.
 * WorkflowEngine subscribes and reacts.
 *
 * Usage (emitting):
 *   import EventBus from '../../workflow-automation/events/EventBus.js';
 *   EventBus.emit('LEAD_QUALIFIED', { organizationId, leadId, ... });
 *
 * Usage (subscribing):
 *   EventBus.on('LEAD_QUALIFIED', handler);
 */

import { EventEmitter } from 'events';

class SfaEventBus extends EventEmitter {}

const EventBus = new SfaEventBus();

// Prevent memory leak warnings for large numbers of subscribers
EventBus.setMaxListeners(50);

export default EventBus;
