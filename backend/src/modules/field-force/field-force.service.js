import { AppError } from '../../shared/response.js';
import config from "../../config/env.js";

export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return 0;
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export class FieldForceService {
  constructor(fieldForceRepository) {
    this.repo = fieldForceRepository;
  }

  async checkIn(organizationId, userId, data) {
    if (!data.location || !data.location.lat || !data.location.lng) {
      throw AppError.badRequest('GPS Verification Failed: Location coordinates are required to check in.');
    }
    
    const attendance = await this.repo.checkIn(organizationId, userId, data);

    
    return attendance;
  }

  async checkOut(organizationId, userId, data) {
    const attendance = await this.repo.checkOut(organizationId, userId, data);

    
    return attendance;
  }

  async planVisit(organizationId, userId, data) {
    return this.repo.createVisit(organizationId, userId, data);
  }

  async startVisit(visitId, organizationId, userId) {
    const visit = await this.repo.updateVisitStatus(visitId, organizationId, 'IN_PROGRESS');

    
    return visit;
  }

  async completeVisit(visitId, organizationId, userId, data) {
    const visit = await this.repo.updateVisitStatus(visitId, organizationId, 'COMPLETED', data);

    
    return visit;
  }

  async addVisitNotes(visitId, organizationId, notes) {
    return this.repo.updateVisitStatus(visitId, organizationId, undefined, { notes });
  }

  async uploadVisitPhoto(visitId, organizationId, photoUrl) {
    return this.repo.updateVisitStatus(visitId, organizationId, undefined, { photoUrl });
  }

  async logExpense(organizationId, userId, data) {
    return this.repo.createExpense(organizationId, userId, data);
  }

  async createTask(organizationId, userId, data) {
    const task = await this.repo.createTask(organizationId, userId, data);
        return task;
  }

  async generateDar(organizationId, userId, data) {
    const { prisma } = await import('../../config/database.js');
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // const [visitsCount, ordersCount] = await Promise.all([
    //   prisma.visit.count({
    //     where: {
    //       organizationId,
    //       userId,
    //       scheduledAt: { gte: today, lt: tomorrow },
    //     }
    //   }),
    //   prisma.order.count({
    //     where: {
    //       organizationId,
    //       ownerId: userId,
    //       createdAt: { gte: today, lt: tomorrow },
    //       isDeleted: false,
    //     }
    //   })
    // ]);

      const visitsCount = await prisma.visit.count({
      where: {
        organizationId,
        userId,
      },
    });

    const ordersCount = await prisma.order.count({
      where: {
        organizationId,
        ownerId: userId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
        isDeleted: false,
      },
    });

    const darData = {
      ...data,
      totalVisits: visitsCount,
      totalOrders: ordersCount,
    };

    return this.repo.createDar(organizationId, userId, darData);
  }

  async createBeatPlan(organizationId, userId, data) {
    return this.repo.createBeatPlan(organizationId, userId, data);
  }

  async assignBeatPlan(organizationId, managerId, data) {
    if (!data.assignedTo) {
      throw AppError.badRequest('Subordinate user ID is required to assign a beat plan.');
    }
    return this.repo.createBeatPlan(organizationId, data.assignedTo, data);
  }

  async approveBeatPlan(planId, organizationId, userId) {
    return this.repo.updateBeatPlanStatus(planId, organizationId, 'APPROVED');
  }

  async createCalendarEvent(organizationId, userId, data) {
    return this.repo.createCalendarEvent(organizationId, userId, data);
  }

  async optimizeRoute(organizationId, userId, visitIds) {
    const { prisma } = await import('../../config/database.js');
    
    // Sort visits chronologically based on database records instead of faking a map route
    const visits = await prisma.visit.findMany({
      where: {
        organizationId,
        id: { in: visitIds }
      },
      orderBy: { scheduledAt: 'asc' },
      select: { id: true, scheduledAt: true }
    });

    return {
      optimizedOrder: visits.map(v => v.id),
      estimatedDistance: 'N/A (Maps Disabled)',
      estimatedDuration: 'N/A (Maps Disabled)'
    };
  }

//   async testTomTom() {

//   const address = "Indore";

//   const url =
//     `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(address)}.json?key=${config.TOMTOM_API_KEY}`;

//   console.log("TomTom API Key:", config.TOMTOM_API_KEY);
//   console.log("URL:", url);

//   const response = await fetch(url);

//   const data = await response.json();

//   console.log(data);

//   return data;
// }


  // ===== GET/LIST SERVICE METHODS =====

  async getAttendance(organizationId, userId, date) {
    return this.repo.getAttendance(organizationId, userId, date);
  }

  async listAttendance(organizationId, filters = {}) {
    return this.repo.listAttendance(organizationId, filters);
  }

  async getVisit(visitId, organizationId) {
    const visit = await this.repo.getVisit(visitId, organizationId);
    if (!visit) throw AppError.notFound('Visit not found');
    return visit;
  }

  async listVisits(organizationId, filters = {}) {
    return this.repo.listVisits(organizationId, filters);
  }

  async getExpense(expenseId, organizationId) {
    const expense = await this.repo.getExpense(expenseId, organizationId);
    if (!expense) throw AppError.notFound('Expense not found');
    return expense;
  }

  async listExpenses(organizationId, filters = {}) {
    return this.repo.listExpenses(organizationId, filters);
  }

  async approveExpense(expenseId, organizationId, userId) {
    const expense = await this.getExpense(expenseId, organizationId);
    const updated = await this.repo.updateExpenseStatus(expenseId, organizationId, 'APPROVED', userId);
    
    
    return updated;
  }

  async rejectExpense(expenseId, organizationId) {
    return await this.repo.updateExpenseStatus(expenseId, organizationId, 'REJECTED');
  }

  async getDailyActivityReport(darId, organizationId) {
    const dar = await this.repo.getDailyActivityReport(darId, organizationId);
    if (!dar) throw AppError.notFound('Daily Activity Report not found');
    return dar;
  }

  async listDailyActivityReports(organizationId, filters = {}) {
    return this.repo.listDailyActivityReports(organizationId, filters);
  }

  async submitDailyActivityReport(darId, organizationId) {
    const dar = await this.getDailyActivityReport(darId, organizationId);
    const updated = await this.repo.updateDarStatus(darId, organizationId, 'SUBMITTED');

    
    return updated;
  }

  async approveDailyActivityReport(darId, organizationId) {
    return await this.repo.updateDarStatus(darId, organizationId, 'APPROVED');
  }

  async getTask(taskId, organizationId) {
    const task = await this.repo.getTask(taskId, organizationId);
    if (!task) throw AppError.notFound('Task not found');
    return task;
  }

  async listTasks(organizationId, filters = {}) {
    return this.repo.listTasks(organizationId, filters);
  }

  async completeTask(taskId, organizationId, data) {
    return await this.repo.completeTask(taskId, organizationId, data);
  }

  async updateTaskStatus(taskId, organizationId, userId, payload) {
    const task = await this.repo.getTask(taskId, organizationId);
    if (!task) throw AppError.notFound('Task not found');

    const { status, location, notes, completionNotes, payment, photoUrl, signature } = payload;
    const now = new Date();
    const updateFields = { status };

    // Geo-fence validation for ARRIVED and CHECKED_IN
    if (status === 'ARRIVED' || status === 'CHECKED_IN') {
      const metadata = task.metadata || {};
      const targetCustomer = metadata.customer || {};
      const targetLocation = metadata.location || {};
      const targetLat = targetCustomer.lat ?? targetLocation.lat;
      const targetLng = targetCustomer.lng ?? targetLocation.lng;

      if (targetLat != null && targetLng != null && location?.lat != null && location?.lng != null) {
        const distance = calculateHaversineDistance(location.lat, location.lng, Number(targetLat), Number(targetLng));
        if (distance > 100) {
          throw AppError.badRequest(`Geo-fence check failed: You are ${distance}m away from customer location. Arrive/Check-In requires being within 100m radius.`);
        }
      }
    }

    // Set specific timestamp and field updates according to status transition
    if (status === 'ACCEPTED') updateFields.acceptedAt = now;
    if (status === 'IN_PROGRESS') updateFields.startedAt = now;
    if (status === 'NAVIGATING') updateFields.navigatingAt = now;
    if (status === 'ARRIVED') updateFields.arrivedAt = now;
    if (status === 'CHECKED_IN') {
      updateFields.checkedInAt = now;
      if (location) updateFields.checkInLocation = location;
    }
    if (status === 'DELIVERY_IN_PROGRESS') updateFields.deliveryStartedAt = now;
    if (status === 'PAYMENT_COLLECTED') {
      updateFields.paymentCollectedAt = now;
      if (payment) {
        updateFields.paymentAmount = payment.amount;
        updateFields.paymentMethod = payment.method || 'CASH';
        updateFields.paymentStatus = payment.status || 'COLLECTED';
      }
    }
    if (status === 'PHOTO_UPLOADED') {
      updateFields.photoUploadedAt = now;
      if (photoUrl) updateFields.photos = photoUrl;
    }
    if (status === 'VISIT_NOTES_COMPLETED') {
      updateFields.visitNotesCompletedAt = now;
      if (notes) updateFields.visitNotes = notes;
    }
    if (status === 'CHECKED_OUT') {
      updateFields.checkedOutAt = now;
      if (location) updateFields.checkOutLocation = location;
      if (signature) {
        updateFields.signatureCapturedAt = now;
        updateFields.customerSignature = signature;
      }
    }
    if (status === 'COMPLETED') {
      updateFields.completedAt = now;
      if (completionNotes || notes) updateFields.completionNotes = completionNotes || notes;
    }

    const historyEntry = {
      status,
      timestamp: now.toISOString(),
      userId,
      location: location || null,
      notes: notes || completionNotes || null,
    };

    const gpsLogEntry = location ? {
      lat: location.lat,
      lng: location.lng,
      accuracy: location.accuracy || null,
      timestamp: now.toISOString(),
      status,
    } : null;

    return this.repo.updateTaskExecutionState(taskId, organizationId, updateFields, historyEntry, gpsLogEntry);
  }

  async getTaskRoute(taskId, organizationId, userLocation) {
    const task = await this.repo.getTask(taskId, organizationId);
    if (!task) throw AppError.notFound('Task not found');

    const metadata = task.metadata || {};
    const customer = metadata.customer || {};
    const destLat = customer.lat ?? metadata.location?.lat ?? 22.7196;
    const destLng = customer.lng ?? metadata.location?.lng ?? 75.8577;

    const originLat = userLocation?.lat ?? destLat - 0.01;
    const originLng = userLocation?.lng ?? destLng - 0.01;

    const distanceMeters = calculateHaversineDistance(originLat, originLng, destLat, destLng);
    const estimatedMinutes = Math.max(1, Math.round((distanceMeters / 1000) * 3));

    return {
      taskId,
      origin: { lat: originLat, lng: originLng },
      destination: { lat: destLat, lng: destLng, address: customer.address || customer.name || 'Customer Location' },
      distanceMeters,
      distanceKm: (distanceMeters / 1000).toFixed(2),
      estimatedMinutes,
      googleMapsUrl: `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`,
    };
  }

  async getAssignedTasks(organizationId, managerId) {
    return await this.repo.getAssignedTasks(organizationId, managerId);
  }

  async getBeatPlan(beatPlanId, organizationId) {
    const plan = await this.repo.getBeatPlan(beatPlanId, organizationId);
    if (!plan) throw AppError.notFound('Beat Plan not found');
    return plan;
  }

  async listBeatPlans(organizationId, filters = {}) {
    return this.repo.listBeatPlans(organizationId, filters);
  }

  async getCalendarEvent(eventId, organizationId) {
    const event = await this.repo.getCalendarEvent(eventId, organizationId);
    if (!event) throw AppError.notFound('Calendar Event not found');
    return event;
  }

  async listCalendarEvents(organizationId, filters = {}) {
    return this.repo.listCalendarEvents(organizationId, filters);
  }

  async getAttendanceSummary(organizationId, userId, startDate, endDate) {
    return this.repo.getAttendanceSummary(organizationId, userId, startDate, endDate);
  }

  async getVisitsSummary(organizationId, userId, startDate, endDate) {
    return this.repo.getVisitsSummary(organizationId, userId, startDate, endDate);
  }

  async getExpenseSummary(organizationId, userId, startDate, endDate) {
    return this.repo.getExpenseSummary(organizationId, userId, startDate, endDate);
  }
}