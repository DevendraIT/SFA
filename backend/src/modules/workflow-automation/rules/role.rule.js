export class RoleRule {
  /**
   * STRICT ENFORCEMENT:
   * Only Sales Executive should receive tasks via auto assignment.
   * Managers, Head of Sales, Admins etc. must be rejected.
   */
  async evaluate(employee, taskContext) {
    if (!employee.roles || !Array.isArray(employee.roles)) {
      return -1000; // Instantly reject if no roles
    }

    const isSalesExecutive = employee.roles.some(
      (ur) => ur.role.name === 'Sales Executive'
    );

    if (isSalesExecutive) {
      return 100; // Perfect match
    }

    return -1000; // Reject explicitly
  }
}
