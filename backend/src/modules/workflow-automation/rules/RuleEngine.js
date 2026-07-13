import { prisma } from '../../../config/database.js';

/**
 * RuleEngine
 *
 * Evaluates JSON-based conditions against an event payload.
 * Dispatches the configured actions when conditions pass.
 *
 * Condition format:
 *   { logic: 'AND'|'OR', rules: [{ field, operator, value }] }
 *
 * Action format:
 *   [{ type: 'SEND_NOTIFICATION', config: { ... } }, ...]
 */
export class RuleEngine {
  /**
   * Evaluate a set of conditions against a payload object.
   * Returns true if all (AND) or any (OR) conditions pass.
   */
  evaluate(conditions = {}, payload = {}) {
    const { logic = 'AND', rules = [] } = conditions;

    if (rules.length === 0) return true;

    const results = rules.map(rule => this._checkCondition(rule, payload));

    return logic === 'OR'
      ? results.some(Boolean)
      : results.every(Boolean);
  }

  _checkCondition({ field, operator, value }, payload) {
    // Support nested fields: e.g. "lead.score"
    const actual = field.split('.').reduce((obj, key) => obj?.[key], payload);

    switch (operator) {
      case 'eq':       return actual == value;
      case 'neq':      return actual != value;
      case 'gt':       return Number(actual) > Number(value);
      case 'gte':      return Number(actual) >= Number(value);
      case 'lt':       return Number(actual) < Number(value);
      case 'lte':      return Number(actual) <= Number(value);
      case 'in':       return Array.isArray(value) && value.includes(actual);
      case 'contains': return String(actual ?? '').toLowerCase().includes(String(value).toLowerCase());
      default:         return false;
    }
  }

  /**
   * Dispatch a list of actions. Each action handler is called with the config and payload.
   * Returns an array of per-action result objects.
   */
  async dispatchActions(actions = [], payload = {}, actionHandlers = {}) {
    const results = [];

    for (const action of actions) {
      try {
        const handler = actionHandlers[action.type];

        if (!handler) {
          results.push({ type: action.type, status: 'SKIPPED', reason: 'No handler registered' });
          continue;
        }

        const result = await handler(action.config, payload);
        results.push({ type: action.type, status: 'OK', result });
      } catch (err) {
        results.push({ type: action.type, status: 'ERROR', reason: err.message });
      }
    }

    return results;
  }
}
