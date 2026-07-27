export class ActiveUserRule {
  /**
   * Checks if the employee is active and not deleted.
   */
  async evaluate(employee, taskContext) {
    const isActive = employee.isActive === true;
    const isNotDeleted = employee.deletedAt === null || employee.deletedAt === undefined;

    if (isActive && isNotDeleted) {
      return 100;
    }

    // Explicitly reject inactive or deleted users
    return -1000;
  }
}
