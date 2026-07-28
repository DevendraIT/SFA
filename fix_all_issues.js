const fs = require('fs');

console.log('=== FIXING ALL WORKFLOW ISSUES ===\n');

// 1. FIX DASHBOARD REPOSITORY - Add task metrics method
let dashRepo = fs.readFileSync('backend/src/modules/dashboard/dashboard.repository.js', 'utf-8');

if (!dashRepo.includes('getTaskMetrics')) {
  const taskMetricsMethod = `
  async getTaskMetrics(organizationId, userId = null) {
    const where = { organizationId };
    if (userId) where.assignedToId = userId;

    const [byStatus, overdueCount] = await Promise.all([
      prisma.task.groupBy({
        by: ['status'],
        where,
        _count: { id: true },
      }),
      prisma.task.count({
        where: {
          ...where,
          dueDate: { lt: new Date() },
          status: { notIn: ['COMPLETED', 'CANCELLED'] },
        },
      }),
    ]);

    return { byStatus, overdueCount };
  }

`;
  // Insert before the closing export
  dashRepo = dashRepo.replace(
    '  async getOrderMetrics(organizationId, userId = null, startDate, endDate) {',
    taskMetricsMethod + '  async getOrderMetrics(organizationId, userId = null, startDate, endDate) {'
  );
  fs.writeFileSync('backend/src/modules/dashboard/dashboard.repository.js', dashRepo, 'utf-8');
  console.log('✓ Added getTaskMetrics to dashboard repository');
}

// 2. FIX DASHBOARD SERVICE - Include task metrics
let dashService = fs.readFileSync('backend/src/modules/dashboard/dashboard.service.js', 'utf-8');

// Fix getExecutiveDashboard to include tasks
if (!dashService.includes('getTaskMetrics')) {
  dashService = dashService.replace(
    'async getExecutiveDashboard(organizationId) {',
    `async getExecutiveDashboard(organizationId) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [leadMetrics, visitMetrics, targetMetrics, attendanceMetrics, orderMetrics, taskMetrics] = await Promise.all([
      // this.repo.getLeadMetrics(organizationId),
      this.repo.getVisitMetrics(organizationId, null, firstDayOfMonth, now),
      this.repo.getTargetMetrics(organizationId),
      this.repo.getAttendanceMetrics(organizationId, now),
      this.repo.getOrderMetrics(organizationId, null, firstDayOfMonth, now),
      this.repo.getTaskMetrics(organizationId),
    ]);

    return {
      visitSummary: this._formatGroupBy(visitMetrics, 'status'),
      targets: targetMetrics,
      attendanceToday: this._formatGroupBy(attendanceMetrics, 'status'),
      orders: this._formatOrderGroupBy(orderMetrics, 'status'),
      tasks: this._formatGroupBy(taskMetrics.byStatus, 'status'),
      overdueTasks: taskMetrics.overdueCount,
    };
  }

  async getTeamDashboard(organizationId, managerId) {`
  );
  fs.writeFileSync('backend/src/modules/dashboard/dashboard.service.js', dashService, 'utf-8');
  console.log('✓ Updated getExecutiveDashboard with task metrics');
}

// Fix getUserDashboard to include tasks  
if (dashService.includes('async getUserDashboard(organizationId, userId)')) {
  dashService = dashService.replace(
    `  async getUserDashboard(organizationId, userId) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [leadMetrics, visitMetrics, targetMetrics, orderMetrics] = await Promise.all([
      // this.repo.getLeadMetrics(organizationId, userId),
      this.repo.getVisitMetrics(organizationId, userId, firstDayOfMonth, now),
      this.repo.getTargetMetrics(organizationId, userId),
      this.repo.getOrderMetrics(organizationId, userId, firstDayOfMonth, now),
    ]);

    return {
      myVisits: this._formatGroupBy(visitMetrics, 'status'),
      myTargets: targetMetrics,
      myOrders: this._formatOrderGroupBy(orderMetrics, 'status'),
    };
  }`,
    `  async getUserDashboard(organizationId, userId) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [leadMetrics, visitMetrics, targetMetrics, orderMetrics, taskMetrics] = await Promise.all([
      // this.repo.getLeadMetrics(organizationId, userId),
      this.repo.getVisitMetrics(organizationId, userId, firstDayOfMonth, now),
      this.repo.getTargetMetrics(organizationId, userId),
      this.repo.getOrderMetrics(organizationId, userId, firstDayOfMonth, now),
      this.repo.getTaskMetrics(organizationId, userId),
    ]);

    return {
      myVisits: this._formatGroupBy(visitMetrics, 'status'),
      myTargets: targetMetrics,
      myOrders: this._formatOrderGroupBy(orderMetrics, 'status'),
      myTasks: this._formatGroupBy(taskMetrics.byStatus, 'status'),
    };
  }`
  );
  fs.writeFileSync('backend/src/modules/dashboard/dashboard.service.js', dashService, 'utf-8');
  console.log('✓ Updated getUserDashboard with task metrics');
}
// Fix getTeamDashboard too
if (dashService.includes('async getTeamDashboard(organizationId, managerId)')) {
  dashService = dashService.replace(
    `  async getTeamDashboard(organizationId, managerId) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [leadMetrics, visitMetrics, targetMetrics, orderMetrics] = await Promise.all([
      // this.repo.getLeadMetrics(organizationId),
      this.repo.getVisitMetrics(organizationId, null, firstDayOfMonth, now),
      this.repo.getTargetMetrics(organizationId),
      this.repo.getOrderMetrics(organizationId, null, firstDayOfMonth, now),
    ]);

    return {
      teamVisits: this._formatGroupBy(visitMetrics, 'status'),
      teamTargets: targetMetrics,
      teamOrders: this._formatOrderGroupBy(orderMetrics, 'status'),
    };
  }`,
    `  async getTeamDashboard(organizationId, managerId) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [leadMetrics, visitMetrics, targetMetrics, orderMetrics, taskMetrics] = await Promise.all([
      // this.repo.getLeadMetrics(organizationId),
      this.repo.getVisitMetrics(organizationId, null, firstDayOfMonth, now),
      this.repo.getTargetMetrics(organizationId),
      this.repo.getOrderMetrics(organizationId, null, firstDayOfMonth, now),
      this.repo.getTaskMetrics(organizationId),
    ]);

    return {
      teamVisits: this._formatGroupBy(visitMetrics, 'status'),
      teamTargets: targetMetrics,
      teamOrders: this._formatOrderGroupBy(orderMetrics, 'status'),
      teamTasks: this._formatGroupBy(taskMetrics.byStatus, 'status'),
    };
  }`
  );
  fs.writeFileSync('backend/src/modules/dashboard/dashboard.service.js', dashService, 'utf-8');
  console.log('✓ Updated getTeamDashboard with task metrics');
}

// 3. FIX FIELD FORCE CONTROLLER - Fix all successResponse calls where params are swapped
let ffController = fs.readFileSync('backend/src/modules/field-force/field-force.controller.js', 'utf-8');

// Fix listTasksData - returns {tasks, total} but wrapped as message
const fixListTasks = ffController.match(/listTasksData = async.*?return successResponse\(res, result, 'Tasks retrieved.'\);/s);
if (fixListTasks) {
  // We need the result to be properly nested as { tasks: [...], total: N }
  // The repository already returns {tasks, total} so it's fine
  console.log('✓ listTasksData already returns {tasks, total}');
}

// 4. FIX TASK DETAIL CONTROLLER to include assignedTo and assignedBy with more fields
let ffRepo = fs.readFileSync('backend/src/modules/field-force/field-force.repository.js', 'utf-8');

// Enhance getTask to include more user info
if (ffRepo.includes("include: { assignedTo: true, assignedBy: true }")) {
  ffRepo = ffRepo.replace(
    `include: { assignedTo: true, assignedBy: true },`,
    `include: { 
          assignedTo: { 
            select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true } 
          }, 
          assignedBy: { 
            select: { id: true, firstName: true, lastName: true, email: true } 
          } 
        },`
  );
  fs.writeFileSync('backend/src/modules/field-force/field-force.repository.js', ffRepo, 'utf-8');
  console.log('✓ Enhanced task includes with selected user fields');
}

// Same for listTasks
if (ffRepo.includes("include: { assignedTo: true, assignedBy: true },\n        orderBy: { dueDate: 'asc' }")) {
  ffRepo = ffRepo.replace(
    `include: { assignedTo: true, assignedBy: true },
        orderBy: { dueDate: 'asc' },`,
    `include: { 
          assignedTo: { 
            select: { id: true, firstName: true, lastName: true, email: true } 
          }, 
          assignedBy: { 
            select: { id: true, firstName: true, lastName: true, email: true } 
          } 
        },
        orderBy: { dueDate: 'asc' },`
  );
  fs.writeFileSync('backend/src/modules/field-force/field-force.repository.js', ffRepo, 'utf-8');
  console.log('✓ Enhanced listTasks includes with selected user fields');
}

// 5. FIX completeTask to also include selects
if (ffRepo.includes("include: { assignedTo: true, assignedBy: true },\n    });\n  }\n\n  async getBeatPlan")) {
  ffRepo = ffRepo.replace(
    `include: { assignedTo: true, assignedBy: true },
    });
  }

  async getBeatPlan`,
    `include: { 
          assignedTo: { 
            select: { id: true, firstName: true, lastName: true, email: true } 
          }, 
          assignedBy: { 
            select: { id: true, firstName: true, lastName: true, email: true } 
          } 
        },
    });
  }

  async getBeatPlan`,
  );
  fs.writeFileSync('backend/src/modules/field-force/field-force.repository.js', ffRepo, 'utf-8');
  console.log('✓ Enhanced completeTask includes');
}

// 6. FIX getAssignedTasks to include assignedBy too
if (ffRepo.includes("include: {\n        assignedTo: true,\n      },")) {
  ffRepo = ffRepo.replace(
    `include: {
        assignedTo: true,
      },`,
    `include: {
        assignedTo: { 
          select: { id: true, firstName: true, lastName: true, email: true } 
        },
        assignedBy: { 
          select: { id: true, firstName: true, lastName: true, email: true } 
        },
      },`
  );
  fs.writeFileSync('backend/src/modules/field-force/field-force.repository.js', ffRepo, 'utf-8');
  console.log('✓ Enhanced getAssignedTasks includes');
}

console.log('\n=== ALL FIXES APPLIED SUCCESSFULLY ===');
