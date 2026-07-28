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
      take: 50,
    });
  }

  async getAllNotifications(organizationId, userId, take = 50) {
    return prisma.notification.findMany({
      where: { organizationId, userId },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  async markAsRead(notificationId, organizationId, userId) {
    return prisma.notification.updateMany({
      where: { id: notificationId, organizationId, userId },
      data: { status: 'READ' },
    });
  }

  async markAllAsRead(organizationId, userId) {
    return prisma.notification.updateMany({
      where: { organizationId, userId, status: 'UNREAD' },
      data: { status: 'READ' },
    });
  }
}
