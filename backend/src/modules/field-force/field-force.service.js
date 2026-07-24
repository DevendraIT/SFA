import { AppError } from '../../shared/response.js';
import config from "../../config/env.js";

// const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${config.GOOGLE_MAPS_API_KEY}`;
// console.log("Google Maps API Key:", config.GOOGLE_MAPS_API_KEY);

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
    const { config } = await import('../../config/env.js');
    
    const visits = await prisma.visit.findMany({
      where: {
        organizationId,
        id: { in: visitIds }
      },
      select: { id: true, scheduledAt: true, location: true }
    });

    // Ensure we keep the order of visitIds as requested, or at least process them.
    // If not all visits have location, fallback to chronological
    const visitsWithLocation = visits.filter(v => v.location && v.location.lat && v.location.lng);
    
    if (config.TOMTOM_API_KEY && visitsWithLocation.length > 1 && visitsWithLocation.length === visits.length) {
      try {
        // TomTom format: lat,lon:lat,lon...
        const points = visits.map(v => `${v.location.lat},${v.location.lng}`).join(':');
        
        // computeBestOrder=true only optimizes the intermediate waypoints. 
        // If we want a fully optimal route we can use it, but start and end are kept fixed by TomTom.
        const url = `https://api.tomtom.com/routing/1/calculateRoute/${points}/json?key=${config.TOMTOM_API_KEY}&computeBestOrder=true`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const summary = route.summary;
          
          // data.optimizedWaypoints returns the optimized indices for intermediate waypoints
          // Index 0 is the start point, the last is the end point.
          let optimizedOrder = [...visits];
          if (data.optimizedWaypoints) {
            // optimizedWaypoints gives the new order of the intermediate points.
            // Example: original 0, 1, 2, 3. optimizedWaypoints might say index 0 is mapped to provided index 2.
            const intermediate = data.optimizedWaypoints.map(wp => visits[wp.providedIndex + 1]);
            optimizedOrder = [visits[0], ...intermediate, visits[visits.length - 1]];
          }
          
          return {
            optimizedOrder: optimizedOrder.map(v => v.id),
            estimatedDistance: `${(summary.lengthInMeters / 1000).toFixed(2)} km`,
            estimatedDuration: `${Math.ceil(summary.travelTimeInSeconds / 60)} mins`
          };
        }
      } catch (err) {
        console.error("TomTom Routing error:", err);
      }
    }

    // Fallback: Sort visits chronologically based on database records
    const sortedVisits = [...visits].sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

    return {
      optimizedOrder: sortedVisits.map(v => v.id),
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
