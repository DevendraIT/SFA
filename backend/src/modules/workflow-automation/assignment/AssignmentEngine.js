import { TeamRepository } from '../../team/team.repository.js';
import { TeamService } from '../../team/team.service.js';

/**
 * AssignmentEngine
 *
 * Resolves which user should be assigned to a record based
 * on configurable strategies. Business logic of lead/order
 * assignment stays in their own modules — this engine only
 * resolves the user and returns the ID.
 *
 * Supported strategies:
 *  - ROUND_ROBIN    – cycle through users with a given role
 *  - TERRITORY      – match by prospect/lead territory
 *  - MANAGER        – find the direct manager of a given user
 *  - LEAST_WORKLOAD – pick the user with the fewest open leads
 *  - DIRECT_USER    – use a hard-coded userId from config
 *  - DIRECT_ROLE    – pick the first user with the given roleId
 */
export class AssignmentEngine {
  constructor() {
    const repo = new TeamRepository();
    this.teamService = new TeamService(repo);
  }

  /**
   * Resolve an assignee based on the action config and event payload.
   *
   * @param {object} config - Action config from WorkflowRule
   * @param {object} payload - Event payload
   * @returns {string|null} userId or null
   */
  async resolve(config = {}, payload = {}) {
    const strategy = config.strategy || 'DIRECT_USER';
    const organizationId = payload.organizationId;

    switch (strategy) {
      case 'DIRECT_USER':
        return config.userId || null;

      case 'DIRECT_ROLE':
        return this.teamService.resolveUserByRole(organizationId, config.roleId);

      case 'ROUND_ROBIN':
        return this.teamService.resolveRoundRobin(organizationId, config.roleId, payload);

      case 'TERRITORY':
        return this.teamService.resolveByTerritory(organizationId, payload.territoryId);

      case 'MANAGER':
        return this.teamService.resolveManager(payload.userId || payload.assignedToId);

      case 'LEAST_WORKLOAD':
        return this.teamService.resolveLeastWorkload(organizationId, config.roleId);

      default:
        return null;
    }
  }
}
