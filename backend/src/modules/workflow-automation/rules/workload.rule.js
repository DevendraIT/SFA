import { prisma } from '../../../config/database.js';

export class WorkloadRule {
  /**
   * Check current assigned tasks.
   * Employee with lowest workload gets higher score.
   */
  async evaluate(employee, taskContext) {
    const activeTasksCount = await prisma.task.count({
      where: {
        organizationId: employee.organizationId,
        assignedToId: employee.id,
        status: {
          in: ['PENDING', 'IN_PROGRESS'],
        },
      },
    });

    // Score inversely proportional to workload
    // 0 tasks -> 100 points
    // 1 task -> 80 points
    // >= 5 tasks -> 0 points
    if (activeTasksCount === 0) return 100;
    if (activeTasksCount === 1) return 80;
    if (activeTasksCount === 2) return 60;
    if (activeTasksCount === 3) return 40;
    if (activeTasksCount === 4) return 20;

    return 0; // Heavy workload
  }
}
