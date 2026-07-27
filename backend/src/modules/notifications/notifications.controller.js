import { successResponse } from '../../shared/response.js';

export class NotificationsController {
  constructor(notificationsService) {
    this.service = notificationsService;
  }

  getMyNotifications = async (req, res, next) => {
    try {
      const result = await this.service.getMyNotifications(req.user.organizationId, req.user.id);
      return successResponse(res, result, 'Notifications retrieved.');
    } catch (err) {
      next(err);
    }
  };

  markAsRead = async (req, res, next) => {
    try {
      const result = await this.service.markAsRead(req.params.id, req.user.organizationId, req.user.id);
      return successResponse(res, result, 'Notification marked as read.');
    } catch (err) {
      next(err);
    }
  };
}
