import logger from '../../utils/logger.js';
import EventBus from '../workflow-automation/events/EventBus.js';
import { WORKFLOW_EVENTS } from '../workflow-automation/constants/workflow.events.js';

export class NotificationsService {
  constructor(notificationsRepository) {
    this.repo = notificationsRepository;
  }

  async sendNotification(organizationId, userId, data) {
    const notification = await this.repo.createNotification(organizationId, userId, data);

    if (data.type === 'EMAIL') {
      this._sendEmail(userId, data.title, data.message);
    } else if (data.type === 'SMS') {
      this._sendSMS(userId, data.message);
    } else {
      this._sendInAppPush(userId, data);
    }

    return notification;
  }

  async getMyNotifications(organizationId, userId) {
    return this.repo.getUnreadNotifications(organizationId, userId);
  }

  async markAsRead(notificationId, organizationId, userId) {
    return this.repo.markAsRead(notificationId, organizationId, userId);
  }

  // Mocks for actual external integrations (e.g. AWS SES, Twilio, WebSockets)
  _sendEmail(userId, subject, text) {
    logger.info(`[Notification] Sending EMAIL to User ${userId}: ${subject}`);
  }

  _sendSMS(userId, text) {
    logger.info(`[Notification] Sending SMS to User ${userId}: ${text}`);
  }

  _sendInAppPush(userId, data) {
    logger.info(`[Notification] Sending IN_APP push to User ${userId}: ${data.title}`);
  }
}
