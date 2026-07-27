export class TerritoryRule {
  /**
   * Checks if the employee belongs to the required territory.
   * If yes, awards points. Otherwise, gives 0 points.
   */
  async evaluate(employee, taskContext) {
    // If no specific territory is required, everyone passes this rule
    if (!taskContext.territoryId) {
      return 10;
    }

    // Check if the employee belongs to the requested territory
    if (employee.territoryId === taskContext.territoryId) {
      return 100; // Strong match for same territory
    }

    return 0; // Does not match territory
  }
}
