import { prisma } from '../../config/database.js';

export class NotificationsRepository {
  async createNotification(organizationId, userId, data) {
    return prisma.notification.create({
      data: {
        organizationId,
        userId,
        title: data.title,
        message: data.message,
        type: data.type || 'IN_APP',
        referenceType: data.referenceType,
        referenceId: data.referenceId,
      },
    });
  }

  async getUnreadNotifications(organizationId, userId) {
    return prisma.notification.findMany({
      where: { organizationId, userId, status: 'UNREAD' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId, organizationId, userId) {
    return prisma.notification.update({
      where: { id: notificationId, organizationId, userId },
      data: { status: 'READ' },
    });
  }
}
