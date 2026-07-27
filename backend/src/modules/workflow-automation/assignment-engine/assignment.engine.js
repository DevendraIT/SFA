import { prisma } from '../../../config/database.js';
import { logger } from '../../../utils/index.js';
import { TerritoryRule } from '../rules/territory.rule.js';
import { ActiveUserRule } from '../rules/availability.rule.js';
import { RoleRule } from '../rules/role.rule.js';
import { WorkloadRule } from '../rules/workload.rule.js';

export class AssignmentEngine {
  constructor() {
    this.rules = [
      new TerritoryRule(),
      new ActiveUserRule(),
      new RoleRule(),
      new WorkloadRule(),
    ];
  }

  /**
   * Fetches eligible employees, executes every rule, scores employees, and returns the best employee ID.
   */
  async findBestEmployee(organizationId, taskContext) {
    try {
      logger.info(`[AssignmentEngine] Finding best employee for org: ${organizationId}`);
      
      // 1. Fetch eligible employees
      // We will fetch all active users in the organization for a broad search
      // Depending on scale, this could be filtered by managerId, branchId, etc.
      const employees = await prisma.user.findMany({
        where: {
          organizationId,
          isActive: true,
          roles: {
            some: {
              role: {
                name: 'Sales Executive'
              }
            }
          }
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!employees || employees.length === 0) {
        logger.warn(`[AssignmentEngine] No active employees found in org: ${organizationId}`);
        return null;
      }

      let bestEmployee = null;
      let highestScore = -1;

      // 2. Execute rules and score
      for (const employee of employees) {
        let totalScore = 0;
        let ruleDetails = {};

        for (const rule of this.rules) {
          const ruleName = rule.constructor.name;
          const score = await rule.evaluate(employee, taskContext);
          totalScore += score;
          ruleDetails[ruleName] = score;
        }

        logger.info(`[AssignmentEngine] Evaluated employee ${employee.email} - Score: ${totalScore}`, ruleDetails);

        if (totalScore > highestScore) {
          highestScore = totalScore;
          bestEmployee = employee;
        }
      }

      if (bestEmployee) {
        logger.info(`[AssignmentEngine] Best employee selected: ${bestEmployee.email} with score ${highestScore}`);
        return bestEmployee.id;
      }

      return null;
    } catch (error) {
      logger.error(`[AssignmentEngine] Error in engine: ${error.message}`);
      throw error;
    }
  }
}
