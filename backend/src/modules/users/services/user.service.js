import { AppError } from '../../../shared/response.js';
import { hashPassword } from '../../auth/auth.utils.js';
import { logAudit } from '../../../utils/audit.js';
import { 
  DEFAULT_USER_SETTINGS, 
  USER_ERRORS, 
  REPORTING_HIERARCHY,
  RESERVED_USER_TYPES,
  USER_VALIDATION,
  DEFAULT_PAGINATION
} from '../constants/user.constants.js';

/**
 * Users Service
 * Business logic for user management and reporting hierarchy
 */
export class UserService {
  constructor(usersRepository) {
    this.repo = usersRepository;
  }

  _buildPaginationMeta(total, page, limit) {
    return { total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  _buildListOptions({ page, limit, search, sortBy, sortOrder }) {
    const skip = (page - 1) * limit;
    return { skip, take: limit, search, sortBy, sortOrder };
  }

  async listUsers(organizationId, query, req) {
    // Validate pagination limits
    if (query.limit > DEFAULT_PAGINATION.MAX_LIMIT) {
      query.limit = DEFAULT_PAGINATION.MAX_LIMIT;
    }

    // Validate search query length
    if (query.search && query.search.length < USER_VALIDATION.SEARCH_MIN_LENGTH) {
      throw AppError.badRequest(`Search query must be at least ${USER_VALIDATION.SEARCH_MIN_LENGTH} characters long.`);
    }

    const isSalesManager = req?.user?.roles?.some(r =>
      typeof r === 'string'
        ? r.toLowerCase().includes('sales manager')
        : r.role?.name?.toLowerCase().includes('sales manager') || r.name?.toLowerCase().includes('sales manager')
    );

    const options = this._buildListOptions(query);
    const { users, total } = await this.repo.findUsers(organizationId, {
      ...options,
      isActive: query.isActive,
      branchId: isSalesManager ? req.user.branchId : query.branchId,
      departmentId: isSalesManager ? req.user.departmentId : query.departmentId,
      managerId: isSalesManager ? req.user.id : query.managerId,
      teamId: query.teamId,
      territoryId: query.territoryId,
    });
    return { users, meta: this._buildPaginationMeta(total, query.page, query.limit) };
  }

  async getUser(id, organizationId, req) {
    const user = await this.repo.findUserById(id, organizationId);
    if (!user) throw AppError.notFound('User not found.');

    const isSalesManager = req?.user?.roles?.some(r =>
      typeof r === 'string'
        ? r.toLowerCase().includes('sales manager')
        : r.role?.name?.toLowerCase().includes('sales manager') || r.name?.toLowerCase().includes('sales manager')
    );

    if (isSalesManager && user.managerId !== req.user.id && user.id !== req.user.id) {
      throw AppError.forbidden('Access denied. You can only view users created by you.');
    }

    return user;
  }


  async createUser(organizationId, data, req) {
    // Validate required fields
    if (!data.email?.trim()) {
      throw AppError.badRequest('Email is required.');
    }
    if (!data.firstName?.trim()) {
      throw AppError.badRequest('First name is required.');
    }
    if (!data.lastName?.trim()) {
      throw AppError.badRequest('Last name is required.');
    }

    // Validate field lengths
    if (data.firstName.length > USER_VALIDATION.FIRST_NAME_MAX_LENGTH) {
      throw AppError.badRequest(`First name must not exceed ${USER_VALIDATION.FIRST_NAME_MAX_LENGTH} characters.`);
    }
    if (data.lastName.length > USER_VALIDATION.LAST_NAME_MAX_LENGTH) {
      throw AppError.badRequest(`Last name must not exceed ${USER_VALIDATION.LAST_NAME_MAX_LENGTH} characters.`);
    }
    if (data.email.length > USER_VALIDATION.EMAIL_MAX_LENGTH) {
      throw AppError.badRequest(`Email must not exceed ${USER_VALIDATION.EMAIL_MAX_LENGTH} characters.`);
    }

    // Email uniqueness check within organization
    const existingUser = await this.repo.findUserByEmail(data.email, organizationId);
    if (existingUser && !existingUser.deletedAt) {
      throw AppError.badRequest(USER_ERRORS.EMAIL_EXISTS);
    }

    // Validate user type is not reserved for system creation
    // if (data.type && RESERVED_USER_TYPES.includes(data.type.toLowerCase())) {
    //   throw AppError.badRequest('Reserved user type cannot be manually assigned.');
    // }

    // Validate roles belong to the organization and meet minimum requirements
    const { roleIds, password, ...userFields } = data;
    let effectiveRoleIds = roleIds || [];


    // Enforce Sales Manager scoping and role restrictions
    const isSalesManager = req?.user?.roles?.some(r =>
      typeof r === 'string'
        ? r.toLowerCase().includes('sales manager')
        : r.role?.name?.toLowerCase().includes('sales manager') || r.name?.toLowerCase().includes('sales manager')
    );

    if (isSalesManager) {
      if (req.user.branchId) userFields.branchId = req.user.branchId;
      if (req.user.departmentId) userFields.departmentId = req.user.departmentId;
      userFields.managerId = req.user.id;

      // Force Role to Sales Executive
      const salesExecRole = await this.repo.findSalesExecutiveRole(organizationId);
      if (salesExecRole) {
        effectiveRoleIds = [salesExecRole.id];
      }
    }

    if (!effectiveRoleIds || effectiveRoleIds.length < USER_VALIDATION.ROLE_MIN_COUNT) {
      throw AppError.badRequest(`At least ${USER_VALIDATION.ROLE_MIN_COUNT} role is required.`);
    }
    await this._validateRoles(effectiveRoleIds, organizationId);



    // Validate password requirements
    if (!password || password.length < USER_VALIDATION.PASSWORD_MIN_LENGTH) {
      throw AppError.badRequest(`Password must be at least ${USER_VALIDATION.PASSWORD_MIN_LENGTH} characters long.`);
    }
    if (password.length > USER_VALIDATION.PASSWORD_MAX_LENGTH) {
      throw AppError.badRequest(`Password must not exceed ${USER_VALIDATION.PASSWORD_MAX_LENGTH} characters.`);
    }

    // Validate structural assignments
    await this._validateStructuralAssignments(userFields, organizationId);

    // Validate manager (must be active user in same org)
    if (userFields.managerId) {
      await this._validateManager(userFields.managerId, organizationId, null);
    }

    const passwordHash = await hashPassword(password);

    const user = await this.repo.createUser(
      {
        ...userFields,
        email: data.email, // Kept in User for profile purposes
        organizationId,
      },
      {
        email: data.email,
        passwordHash,
        organizationId,
        emailVerifiedAt: DEFAULT_USER_SETTINGS.AUTO_VERIFY_ADMIN_CREATED ? new Date() : null,
      },
      effectiveRoleIds
    );


    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'user.create',
      moduleName: 'users',
      details: { newUserId: user.id, email: user.email },
      req,
    });

    return user;
  }

  async updateUser(id, organizationId, data, req) {
    const user = await this.repo.findUserById(id, organizationId);
    if (!user) throw AppError.notFound(USER_ERRORS.NOT_FOUND);

    const isSalesManager = req?.user?.roles?.some(r =>
      typeof r === 'string'
        ? r.toLowerCase().includes('sales manager')
        : r.role?.name?.toLowerCase().includes('sales manager') || r.name?.toLowerCase().includes('sales manager')
    );

    if (isSalesManager) {
      if (user.managerId !== req.user.id) {
        throw AppError.forbidden('Access denied. You can only update users created by you.');
      }
      if (req.user.branchId) data.branchId = req.user.branchId;
      if (req.user.departmentId) data.departmentId = req.user.departmentId;
      data.managerId = req.user.id;
    }

    // Validate field lengths if provided
    if (data.firstName && data.firstName.length > USER_VALIDATION.FIRST_NAME_MAX_LENGTH) {
      throw AppError.badRequest(`First name must not exceed ${USER_VALIDATION.FIRST_NAME_MAX_LENGTH} characters.`);
    }
    if (data.lastName && data.lastName.length > USER_VALIDATION.LAST_NAME_MAX_LENGTH) {
      throw AppError.badRequest(`Last name must not exceed ${USER_VALIDATION.LAST_NAME_MAX_LENGTH} characters.`);
    }
    if (data.email && data.email.length > USER_VALIDATION.EMAIL_MAX_LENGTH) {
      throw AppError.badRequest(`Email must not exceed ${USER_VALIDATION.EMAIL_MAX_LENGTH} characters.`);
    }

    // Email uniqueness check if changing email
    if (data.email && data.email !== user.email) {
      const existingUser = await this.repo.findUserByEmail(data.email, organizationId);
      if (existingUser && !existingUser.deletedAt) {
        throw AppError.badRequest(USER_ERRORS.EMAIL_EXISTS);
      }
    }

    // Prevent modification of reserved user types
    if (data.type && RESERVED_USER_TYPES.includes(data.type.toLowerCase()) && !user.type || 
        user.type && RESERVED_USER_TYPES.includes(user.type.toLowerCase())) {
      throw AppError.badRequest('Reserved user type cannot be modified.');
    }

    // Validate structural assignments if changing
    await this._validateStructuralAssignments(data, organizationId);

    // Validate new manager — must not create circular reporting chain
    if (data.managerId !== undefined) {
      if (data.managerId !== null) {
        await this._validateManager(data.managerId, organizationId, id);
      }
    }

    const updated = await this.repo.updateUser(id, data);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'user.update',
      moduleName: 'users',
      details: { targetUserId: id, changes: Object.keys(data) },
      req,
    });

    return updated;
  }

  async updateUserRoles(id, organizationId, roleIds, req) {
    const isSalesManager = req?.user?.roles?.some(r =>
      typeof r === 'string'
        ? r.toLowerCase().includes('sales manager')
        : r.role?.name?.toLowerCase().includes('sales manager') || r.name?.toLowerCase().includes('sales manager')
    );

    if (isSalesManager) {
      throw AppError.forbidden('Sales Managers are not authorized to modify user roles.');
    }

    const user = await this.repo.findUserById(id, organizationId);
    if (!user) throw AppError.notFound(USER_ERRORS.NOT_FOUND);

    await this._validateRoles(roleIds, organizationId);

    const updated = await this.repo.updateUserRoles(id, roleIds);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'user.roles.update',
      moduleName: 'users',
      details: { targetUserId: id, newRoleIds: roleIds },
      req,
    });

    return updated;
  }

  async activateUser(id, organizationId, req) {
    const user = await this.repo.findUserById(id, organizationId);
    if (!user) throw AppError.notFound(USER_ERRORS.NOT_FOUND);

    const isSalesManager = req?.user?.roles?.some(r =>
      typeof r === 'string'
        ? r.toLowerCase().includes('sales manager')
        : r.role?.name?.toLowerCase().includes('sales manager') || r.name?.toLowerCase().includes('sales manager')
    );

    if (isSalesManager && user.managerId !== req.user.id) {
      throw AppError.forbidden('Access denied. You can only activate users created by you.');
    }
    
    if (user.isActive) {
      throw AppError.badRequest('User is already active.');
    }

    const updated = await this.repo.updateUser(id, { isActive: true });

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'user.activate',
      moduleName: 'users',
      details: { targetUserId: id, previousStatus: false },
      req,
    });

    return updated;
  }

  async deactivateUser(id, organizationId, req) {
    // Prevent self-deactivation
    if (id === req.user.id) {
      throw AppError.badRequest('You cannot deactivate your own account.');
    }

    const user = await this.repo.findUserById(id, organizationId);
    if (!user) throw AppError.notFound(USER_ERRORS.NOT_FOUND);

    const isSalesManager = req?.user?.roles?.some(r =>
      typeof r === 'string'
        ? r.toLowerCase().includes('sales manager')
        : r.role?.name?.toLowerCase().includes('sales manager') || r.name?.toLowerCase().includes('sales manager')
    );

    if (isSalesManager && user.managerId !== req.user.id) {
      throw AppError.forbidden('Access denied. You can only deactivate users created by you.');
    }
    
    if (!user.isActive) {
      throw AppError.badRequest('User is already inactive.');
    }

    const updated = await this.repo.updateUser(id, { isActive: false });

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'user.deactivate',
      moduleName: 'users',
      details: { targetUserId: id, previousStatus: true },
      req,
    });

    return updated;
  }

  async deleteUser(id, organizationId, req) {
    // Prevent self-deletion
    if (id === req.user.id) {
      throw AppError.badRequest(USER_ERRORS.CANNOT_DELETE_SELF);
    }

    const user = await this.repo.findUserById(id, organizationId);
    if (!user) throw AppError.notFound(USER_ERRORS.NOT_FOUND);

    const isSalesManager = req?.user?.roles?.some(r =>
      typeof r === 'string'
        ? r.toLowerCase().includes('sales manager')
        : r.role?.name?.toLowerCase().includes('sales manager') || r.name?.toLowerCase().includes('sales manager')
    );

    if (isSalesManager && user.managerId !== req.user.id) {
      throw AppError.forbidden('Access denied. You can only delete users created by you.');
    }


    // Prevent deletion of reserved user types
    // if (user.type && RESERVED_USER_TYPES.includes(user.type.toLowerCase())) {
    //   throw AppError.badRequest('Reserved user types cannot be deleted.');
    // }

    // Check if user has subordinates - prevent deletion
    const subordinates = await this.repo.findSubordinatesRecursive(id);
    if (subordinates.length > 0) {
      throw AppError.badRequest(`Cannot delete user with ${subordinates.length} subordinates. Please reassign subordinates first.`);
    }

    // Check if user has active records that would prevent deletion
    const activeRecords = await this._checkActiveUserRecords(id);
    if (activeRecords.hasActiveRecords) {
      throw AppError.conflict(`Cannot delete user with active ${activeRecords.recordTypes.join(', ')}. Please reassign or complete these records first.`);
    }

    await this.repo.softDeleteUser(id);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'user.delete',
      moduleName: 'users',
      details: { targetUserId: id, email: user.email },
      req,
    });
  }

  // --------------------------------------------------
  // Reporting Hierarchy
  // --------------------------------------------------

  async getSubordinates(id, organizationId) {
    const user = await this.repo.findUserById(id, organizationId);
    if (!user) throw AppError.notFound(USER_ERRORS.NOT_FOUND);

    const subordinates = await this.repo.findSubordinatesRecursive(id);
    
    // Check hierarchy depth limit
    const maxDepth = Math.max(...subordinates.map(s => s.depth || 0));
    if (maxDepth >= REPORTING_HIERARCHY.MAX_DEPTH) {
      console.warn(`User ${id} has hierarchy depth ${maxDepth} exceeding recommended limit ${REPORTING_HIERARCHY.MAX_DEPTH}`);
    }

    // Check subordinate count limit for immediate subordinates
    const immediateSubordinates = subordinates.filter(s => s.depth === 1);
    if (immediateSubordinates.length > REPORTING_HIERARCHY.MAX_SUBORDINATES) {
      console.warn(`User ${id} has ${immediateSubordinates.length} immediate subordinates exceeding recommended limit ${REPORTING_HIERARCHY.MAX_SUBORDINATES}`);
    }

    return { user: { id: user.id, firstName: user.firstName, lastName: user.lastName }, subordinates };
  }

  async getManagerHierarchy(id, organizationId) {
    const user = await this.repo.findUserById(id, organizationId);
    if (!user) throw AppError.notFound('User not found.');

    const chain = await this.repo.findManagerHierarchy(id);
    return { chain };
  }

  async bulkUpdateUsers(organizationId, userIds, data, req) {
    // Validate bulk operation limits
    const MAX_BULK_OPERATIONS = 100;
    if (!userIds?.length) {
      throw AppError.badRequest('User IDs are required for bulk operations.');
    }
    if (userIds.length > MAX_BULK_OPERATIONS) {
      throw AppError.badRequest(`Bulk operations are limited to ${MAX_BULK_OPERATIONS} users at a time.`);
    }

    // Prevent bulk modification of reserved user types
    const users = await this.repo.findUsersByIds(userIds, organizationId);
    const reservedUsers = users.filter(user => 
      user.type && RESERVED_USER_TYPES.includes(user.type.toLowerCase())
    );
    if (reservedUsers.length > 0) {
      throw AppError.badRequest(`Cannot bulk modify reserved user types: ${reservedUsers.map(u => u.email).join(', ')}`);
    }

    // Validate structural assignments if provided
    if (Object.keys(data).some(key => ['branchId', 'departmentId', 'teamId', 'territoryId'].includes(key))) {
      await this._validateStructuralAssignments(data, organizationId);
    }

    const results = await this.repo.bulkUpdateUsers(userIds, data);

    await logAudit({
      organizationId,
      userId: req.user.id,
      action: 'user.bulk.update',
      moduleName: 'users',
      details: { 
        targetUserIds: userIds, 
        changes: Object.keys(data),
        affectedCount: results.count 
      },
      req,
    });

    return results;
  }

  // --------------------------------------------------
  // Private Validation Helpers
  // --------------------------------------------------

  async _validateRoles(roleIds, organizationId) {
    if (!roleIds?.length) return;
    const validRoles = await this.repo.findRolesByIds(roleIds, organizationId);
    if (validRoles.length !== roleIds.length) {
      throw AppError.badRequest(USER_ERRORS.INVALID_ROLES);
    }
  }

  async _validateStructuralAssignments(data, organizationId) {
    if (data.branchId) {
      const valid = await this.repo.branchBelongsToOrg(data.branchId, organizationId);
      if (!valid) throw AppError.badRequest(USER_ERRORS.BRANCH_NOT_FOUND);
    }
    if (data.departmentId) {
      const valid = await this.repo.departmentBelongsToOrg(data.departmentId, organizationId);
      if (!valid) throw AppError.badRequest(USER_ERRORS.DEPARTMENT_NOT_FOUND);
    }
    if (data.teamId) {
      const valid = await this.repo.teamBelongsToOrg(data.teamId, organizationId);
      if (!valid) throw AppError.badRequest(USER_ERRORS.TEAM_NOT_FOUND);
    }
    if (data.territoryId) {
      const valid = await this.repo.territoryBelongsToOrg(data.territoryId, organizationId);
      if (!valid) throw AppError.badRequest(USER_ERRORS.TERRITORY_NOT_FOUND);
    }
  }

  /**
   * Validates a manager assignment:
   * 1. Manager must exist in the same organization
   * 2. Manager must be active
   * 3. Manager cannot be the user themselves
   * 4. Manager cannot be a subordinate of the user (circular chain prevention)
   */
  async _validateManager(managerId, organizationId, userId) {
    const manager = await this.repo.findUserById(managerId, organizationId);
    if (!manager) throw AppError.badRequest(USER_ERRORS.INVALID_MANAGER);

    // Check if manager is active
    if (!manager.isActive) {
      throw AppError.badRequest('Manager must be an active user.');
    }

    if (userId && managerId === userId) {
      throw AppError.badRequest(USER_ERRORS.SELF_MANAGER);
    }

    // Check for circular reporting chain: if assigning managerId = X,
    // ensure X is not already a subordinate of userId
    if (userId) {
      const subordinates = await this.repo.findSubordinatesRecursive(userId);
      const isCircular = subordinates.some((s) => s.id === managerId);
      if (isCircular) {
        throw AppError.badRequest(USER_ERRORS.CIRCULAR_HIERARCHY);
      }
    }
  }

  /**
   * Check if user has active records that would prevent deletion
   */
  async _checkActiveUserRecords(userId) {
    const recordTypes = [];
    let hasActiveRecords = false;

    // Check for active leads assigned to user (if lead module exists)
    try {
      const activeLeads = await this.repo.countActiveLeadsByUser?.(userId);
      if (activeLeads > 0) {
        hasActiveRecords = true;
        recordTypes.push('leads');
      }
    } catch (error) {
      // Lead module might not exist, continue
    }

    // Check for active sales orders (if sales module exists)
    try {
      const activeSalesOrders = await this.repo.countActiveSalesOrdersByUser?.(userId);
      if (activeSalesOrders > 0) {
        hasActiveRecords = true;
        recordTypes.push('sales orders');
      }
    } catch (error) {
      // Sales module might not exist, continue
    }

    // Check for active tasks assigned to user
    try {
      const activeTasks = await this.repo.countActiveTasksByUser?.(userId);
      if (activeTasks > 0) {
        hasActiveRecords = true;
        recordTypes.push('tasks');
      }
    } catch (error) {
      // Task functionality might not exist, continue
    }

    return { hasActiveRecords, recordTypes };
  }
}
