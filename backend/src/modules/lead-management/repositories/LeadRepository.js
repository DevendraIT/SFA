import { prisma } from '../../../config/database.js';

/**
 * Leads Repository
 * All Prisma database operations for the Leads module.
 * No business logic — pure data access layer.
 */
export class LeadsRepository {

  // ============================================================
  // SHARED SELECT SHAPES
  // ============================================================

  get _leadListSelect() {
    return {
      id:             true,
      organizationId: true,
      assignedToId:   true,
      createdById:    true,
      territoryId:    true,
      branchId:       true,
      teamId:         true,
      firstName:      true,
      lastName:       true,
      email:          true,
      phone:          true,
      company:        true,
      jobTitle:       true,
      source:         true,
      status:         true,
      priority:       true,
      qualification:  true,
      score:          true,
      tags:           true,
      isConverted:    true,
      deletedAt:      true,
      createdAt:      true,
      updatedAt:      true,
      assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
      territory:  { select: { id: true, name: true } },
    };
  }

  get _leadDetailSelect() {
    return {
      id:             true,
      organizationId: true,
      assignedToId:   true,
      createdById:    true,
      territoryId:    true,
      branchId:       true,
      teamId:         true,
      firstName:      true,
      lastName:       true,
      email:          true,
      phone:          true,
      company:        true,
      jobTitle:       true,
      website:        true,
      industry:       true,
      companySize:    true,
      source:         true,
      addressLine1:   true,
      city:           true,
      state:          true,
      country:        true,
      postalCode:     true,
      status:         true,
      priority:       true,
      qualification:  true,
      score:          true,
      notes:          true,
      tags:           true,
      isConverted:    true,
      convertedAt:    true,
      deletedAt:      true,
      createdAt:      true,
      updatedAt:      true,
      assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
      createdBy:  { select: { id: true, firstName: true, lastName: true } },
      territory:  { select: { id: true, name: true } },
      _count: {
        select: {
          activities:        true,
          notes_list:        true,
          documents:         true,
          followUps:         true,
          meetings:          true,
          assignmentHistory: true,
          conversions:       true,
        },
      },
    };
  }

  // ============================================================
  // WHERE BUILDER
  // ============================================================

  _buildWhere(organizationId, filters = {}) {
    const {
      search, status, priority, qualification, source,
      assignedToId, territoryId, branchId, teamId,
      scoreMin, scoreMax, tags, isConverted, includeDeleted,
    } = filters;

    const tagList = tags
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : undefined;

    return {
      organizationId,
      deletedAt: includeDeleted ? undefined : null,
      ...(status        && { status }),
      ...(priority      && { priority }),
      ...(qualification && { qualification }),
      ...(source        && { source }),
      ...(assignedToId  !== undefined && { assignedToId: assignedToId || null }),
      ...(territoryId   && { territoryId }),
      ...(branchId      && { branchId }),
      ...(teamId        && { teamId }),
      ...(isConverted   !== undefined && { isConverted }),
      ...(scoreMin !== undefined || scoreMax !== undefined
        ? { score: { gte: scoreMin ?? 0, lte: scoreMax ?? 100 } }
        : {}),
      ...(tagList?.length && { tags: { hasSome: tagList } }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName:  { contains: search, mode: 'insensitive' } },
          { email:     { contains: search, mode: 'insensitive' } },
          { company:   { contains: search, mode: 'insensitive' } },
          { phone:     { contains: search, mode: 'insensitive' } },
          { jobTitle:  { contains: search, mode: 'insensitive' } },
        ],
      }),
    };
  }

  // ============================================================
  // LEAD CRUD
  // ============================================================

  async findLeads(organizationId, { skip, take, sortBy, sortOrder, ...filters }) {
    const where = this._buildWhere(organizationId, filters);
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        select: this._leadListSelect,
      }),
      prisma.lead.count({ where }),
    ]);
    return { leads, total };
  }

  async findLeadById(id, organizationId) {
    return prisma.lead.findFirst({
      where: { id, organizationId, deletedAt: null },
      select: this._leadDetailSelect,
    });
  }

  async findLeadByIdIncludeDeleted(id, organizationId) {
    return prisma.lead.findFirst({
      where: { id, organizationId },
      select: this._leadDetailSelect,
    });
  }

  async findByFilter(organizationId, filters = {}) {
    const where = this._buildWhere(organizationId, filters);
    
    // Explicitly add filter for email if required
    if (filters.hasEmail) {
      where.email = { not: null };
    }

    return prisma.lead.findMany({
      where,
      select: this._leadListSelect,
    });
  }

  async findLeadsByIds(ids, organizationId) {
    return prisma.lead.findMany({
      where: { id: { in: ids }, organizationId, deletedAt: null },
      select: {
        id:            true,
        status:        true,
        priority:      true,
        qualification: true,
        assignedToId:  true,
        territoryId:   true,
        teamId:        true,
        isConverted:   true,
      },
    });
  }

  async createLead(data) {
    return prisma.lead.create({
      data,
      select: this._leadDetailSelect,
    });
  }

  async updateLead(id, data) {
    return prisma.lead.update({
      where: { id },
      data,
      select: this._leadDetailSelect,
    });
  }

  async softDeleteLead(id) {
    return prisma.lead.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { id: true, deletedAt: true },
    });
  }

  async restoreLead(id) {
    return prisma.lead.update({
      where: { id },
      data: { deletedAt: null },
      select: this._leadDetailSelect,
    });
  }

  async bulkUpdateLeads(ids, data) {
    return prisma.lead.updateMany({ where: { id: { in: ids } }, data });
  }

  async bulkSoftDeleteLeads(ids) {
    return prisma.lead.updateMany({
      where: { id: { in: ids } },
      data: { deletedAt: new Date() },
    });
  }

  async findLeadsForExport(organizationId, filters = {}) {
    const where = this._buildWhere(organizationId, { ...filters, includeDeleted: false });
    return prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, firstName: true, lastName: true, email: true,
        phone: true, company: true, jobTitle: true, website: true,
        industry: true, companySize: true, source: true, status: true,
        priority: true, qualification: true, score: true,
        addressLine1: true, city: true, state: true, country: true,
        postalCode: true, tags: true, notes: true, isConverted: true,
        createdAt: true, updatedAt: true,
        assignedTo: { select: { firstName: true, lastName: true, email: true } },
        territory:  { select: { name: true } },
      },
    });
  }

  // Duplicate check: same email + org + not deleted
  async findActiveDuplicateByEmail(email, organizationId, excludeId = null) {
    return prisma.lead.findFirst({
      where: {
        organizationId,
        email: { equals: email, mode: 'insensitive' },
        deletedAt: null,
        ...(excludeId && { id: { not: excludeId } }),
      },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
  }

  // ============================================================
  // ASSIGNMENT HISTORY
  // ============================================================

  async createAssignmentHistory(data) {
    return prisma.leadAssignmentHistory.create({ data });
  }

  async findAssignmentHistory(leadId, organizationId, { skip, take }) {
    const where = { leadId, organizationId };
    const [history, total] = await Promise.all([
      prisma.leadAssignmentHistory.findMany({
        where,
        skip,
        take,
        orderBy: { assignedAt: 'desc' },
        include: {
          assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      }),
      prisma.leadAssignmentHistory.count({ where }),
    ]);
    return { history, total };
  }

  // Round-robin: count active leads per user in a team
  async countLeadsByAssignee(userIds, organizationId) {
    return prisma.lead.groupBy({
      by: ['assignedToId'],
      where: {
        organizationId,
        assignedToId: { in: userIds },
        deletedAt: null,
        status: { notIn: ['WON', 'LOST', 'ARCHIVED'] },
      },
      _count: { assignedToId: true },
    });
  }

  // Get active users in a team
  async findActiveUsersInTeam(teamId, organizationId) {
    return prisma.user.findMany({
      where: { teamId, organizationId, isActive: true, deletedAt: null },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
  }

  // Get active users in a territory
  async findActiveUsersInTerritory(territoryId, organizationId) {
    return prisma.user.findMany({
      where: { territoryId, organizationId, isActive: true, deletedAt: null },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
  }

  // ============================================================
  // NOTES
  // ============================================================

  async createNote(data) {
    return prisma.leadNote.create({
      data,
      include: { author: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async findNotes(leadId, organizationId, { skip, take, isPinned }) {
    const where = {
      leadId,
      organizationId,
      deletedAt: null,
      ...(isPinned !== undefined && { isPinned }),
    };
    const [notes, total] = await Promise.all([
      prisma.leadNote.findMany({
        where,
        skip,
        take,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        include: { author: { select: { id: true, firstName: true, lastName: true } } },
      }),
      prisma.leadNote.count({ where }),
    ]);
    return { notes, total };
  }

  async findNoteById(noteId, leadId, organizationId) {
    return prisma.leadNote.findFirst({
      where: { id: noteId, leadId, organizationId, deletedAt: null },
      include: { author: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async updateNote(noteId, data) {
    return prisma.leadNote.update({
      where: { id: noteId },
      data,
      include: { author: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async softDeleteNote(noteId) {
    return prisma.leadNote.update({
      where: { id: noteId },
      data: { deletedAt: new Date() },
      select: { id: true },
    });
  }

  // ============================================================
  // DOCUMENTS
  // ============================================================

  async createDocument(data) {
    return prisma.leadDocument.create({
      data,
      include: { uploadedBy: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async findDocuments(leadId, organizationId, { skip, take, category }) {
    const where = {
      leadId,
      organizationId,
      deletedAt: null,
      parentId: null, // Only show root documents (not versions)
      ...(category && { category }),
    };
    const [documents, total] = await Promise.all([
      prisma.leadDocument.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: { select: { id: true, firstName: true, lastName: true } },
          _count: { select: { versions: true } },
        },
      }),
      prisma.leadDocument.count({ where }),
    ]);
    return { documents, total };
  }

  async findDocumentById(documentId, leadId, organizationId) {
    return prisma.leadDocument.findFirst({
      where: { id: documentId, leadId, organizationId, deletedAt: null },
      include: {
        uploadedBy: { select: { id: true, firstName: true, lastName: true } },
        versions: {
          where: { deletedAt: null },
          orderBy: { version: 'desc' },
          include: { uploadedBy: { select: { id: true, firstName: true, lastName: true } } },
        },
      },
    });
  }

  async getLatestDocumentVersion(parentId) {
    const latest = await prisma.leadDocument.findFirst({
      where: { OR: [{ id: parentId }, { parentId }], deletedAt: null },
      orderBy: { version: 'desc' },
      select: { version: true },
    });
    return latest?.version ?? 0;
  }

  async softDeleteDocument(documentId) {
    return prisma.leadDocument.update({
      where: { id: documentId },
      data: { deletedAt: new Date() },
      select: { id: true },
    });
  }

  // ============================================================
  // FOLLOW-UPS
  // ============================================================

  async createFollowUp(data) {
    return prisma.leadFollowUp.create({
      data,
      include: { owner: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async findFollowUps(leadId, organizationId, { skip, take, status }) {
    const where = {
      leadId,
      organizationId,
      deletedAt: null,
      ...(status && { status }),
    };
    const [followUps, total] = await Promise.all([
      prisma.leadFollowUp.findMany({
        where,
        skip,
        take,
        orderBy: { dueAt: 'asc' },
        include: { owner: { select: { id: true, firstName: true, lastName: true } } },
      }),
      prisma.leadFollowUp.count({ where }),
    ]);
    return { followUps, total };
  }

  async findFollowUpById(followUpId, leadId, organizationId) {
    return prisma.leadFollowUp.findFirst({
      where: { id: followUpId, leadId, organizationId, deletedAt: null },
      include: { owner: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async updateFollowUp(followUpId, data) {
    return prisma.leadFollowUp.update({
      where: { id: followUpId },
      data,
      include: { owner: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async softDeleteFollowUp(followUpId) {
    return prisma.leadFollowUp.update({
      where: { id: followUpId },
      data: { deletedAt: new Date() },
      select: { id: true },
    });
  }

  // Overdue detection: mark scheduled follow-ups past their due date
  async markOverdueFollowUps(organizationId) {
    return prisma.leadFollowUp.updateMany({
      where: {
        organizationId,
        status: 'SCHEDULED',
        dueAt: { lt: new Date() },
        deletedAt: null,
      },
      data: { status: 'OVERDUE' },
    });
  }

  async findOverdueFollowUps(organizationId, ownerId) {
    return prisma.leadFollowUp.findMany({
      where: {
        organizationId,
        status: 'OVERDUE',
        deletedAt: null,
        ...(ownerId && { ownerId }),
      },
      orderBy: { dueAt: 'asc' },
      include: {
        lead:  { select: { id: true, firstName: true, lastName: true, company: true } },
        owner: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  // ============================================================
  // MEETINGS
  // ============================================================

  async createMeeting(data) {
    return prisma.leadMeeting.create({
      data,
      include: { organizer: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async findMeetings(leadId, organizationId, { skip, take, status }) {
    const where = {
      leadId,
      organizationId,
      deletedAt: null,
      ...(status && { status }),
    };
    const [meetings, total] = await Promise.all([
      prisma.leadMeeting.findMany({
        where,
        skip,
        take,
        orderBy: { scheduledAt: 'desc' },
        include: { organizer: { select: { id: true, firstName: true, lastName: true } } },
      }),
      prisma.leadMeeting.count({ where }),
    ]);
    return { meetings, total };
  }

  async findMeetingById(meetingId, leadId, organizationId) {
    return prisma.leadMeeting.findFirst({
      where: { id: meetingId, leadId, organizationId, deletedAt: null },
      include: { organizer: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async updateMeeting(meetingId, data) {
    return prisma.leadMeeting.update({
      where: { id: meetingId },
      data,
      include: { organizer: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async softDeleteMeeting(meetingId) {
    return prisma.leadMeeting.update({
      where: { id: meetingId },
      data: { deletedAt: new Date() },
      select: { id: true },
    });
  }

  // ============================================================
  // ACTIVITY TIMELINE
  // ============================================================

  async createActivity(data) {
    return prisma.leadActivity.create({ data });
  }

  async findActivities(leadId, organizationId, { skip, take, activityType }) {
    const where = {
      leadId,
      organizationId,
      ...(activityType && { activityType }),
    };
    const [activities, total] = await Promise.all([
      prisma.leadActivity.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          performedBy: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      prisma.leadActivity.count({ where }),
    ]);
    return { activities, total };
  }

  // ============================================================
  // CONVERSION
  // ============================================================

  async createConversion(data) {
    return prisma.leadConversion.create({
      data,
      include: { convertedBy: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async findConversions(leadId, organizationId) {
    return prisma.leadConversion.findMany({
      where: { leadId, organizationId },
      orderBy: { convertedAt: 'desc' },
      include: { convertedBy: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async findConversionByType(leadId, conversionType) {
    return prisma.leadConversion.findFirst({
      where: { leadId, conversionType },
    });
  }

  // ============================================================
  // EXPORT JOB
  // ============================================================

  async createExportJob(data) {
    return prisma.leadExportJob.create({ data });
  }

  async findExportJobById(id, organizationId) {
    return prisma.leadExportJob.findFirst({ where: { id, organizationId } });
  }

  async findExportJobs(organizationId, { skip, take }) {
    const [jobs, total] = await Promise.all([
      prisma.leadExportJob.findMany({
        where: { organizationId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.leadExportJob.count({ where: { organizationId } }),
    ]);
    return { jobs, total };
  }

  async updateExportJob(id, data) {
    return prisma.leadExportJob.update({ where: { id }, data });
  }

  // ============================================================
  // ANALYTICS
  // ============================================================

  async getLeadStats(organizationId) {
    const [total, byStatus, byPriority, byQualification, bySource, converted] = await Promise.all([
      prisma.lead.count({ where: { organizationId, deletedAt: null } }),
      prisma.lead.groupBy({
        by: ['status'],
        where: { organizationId, deletedAt: null },
        _count: { status: true },
      }),
      prisma.lead.groupBy({
        by: ['priority'],
        where: { organizationId, deletedAt: null },
        _count: { priority: true },
      }),
      prisma.lead.groupBy({
        by: ['qualification'],
        where: { organizationId, deletedAt: null },
        _count: { qualification: true },
      }),
      prisma.lead.groupBy({
        by: ['source'],
        where: { organizationId, deletedAt: null },
        _count: { source: true },
      }),
      prisma.lead.count({ where: { organizationId, deletedAt: null, isConverted: true } }),
    ]);
    return { total, converted, byStatus, byPriority, byQualification, bySource };
  }

  async getLeadsByTerritory(organizationId, filters) {
    return prisma.lead.groupBy({
      by: ['territoryId'],
      where: {
        organizationId,
        deletedAt: null,
        ...(filters.from && { createdAt: { gte: filters.from } }),
        ...(filters.to   && { createdAt: { lte: filters.to   } }),
      },
      _count: { id: true },
      _avg:   { score: true },
    });
  }

  async getLeadsByTeam(organizationId, filters) {
    return prisma.lead.groupBy({
      by: ['teamId'],
      where: {
        organizationId,
        deletedAt: null,
        ...(filters.from && { createdAt: { gte: filters.from } }),
        ...(filters.to   && { createdAt: { lte: filters.to   } }),
      },
      _count: { id: true },
      _avg:   { score: true },
    });
  }

  async getLeadsByAssignee(organizationId, filters) {
    return prisma.lead.groupBy({
      by: ['assignedToId'],
      where: {
        organizationId,
        deletedAt: null,
        ...(filters.from       && { createdAt: { gte: filters.from } }),
        ...(filters.to         && { createdAt: { lte: filters.to   } }),
        ...(filters.territoryId && { territoryId: filters.territoryId }),
        ...(filters.teamId      && { teamId:      filters.teamId      }),
      },
      _count: { id: true },
      _avg:   { score: true },
    });
  }

  async getConversionsByType(organizationId, filters) {
    return prisma.leadConversion.groupBy({
      by: ['conversionType'],
      where: {
        organizationId,
        ...(filters.from && { convertedAt: { gte: filters.from } }),
        ...(filters.to   && { convertedAt: { lte: filters.to   } }),
      },
      _count: { conversionType: true },
    });
  }

  async getLeadCreationTrend(organizationId, from, to) {
    // Raw query for date-bucketed trend data
    return prisma.$queryRaw`
      SELECT
        DATE_TRUNC('day', "createdAt") AS date,
        COUNT(*)::int                  AS count
      FROM "Lead"
      WHERE
        "organizationId" = ${organizationId}::uuid
        AND "deletedAt"  IS NULL
        AND "createdAt"  >= ${from}
        AND "createdAt"  <= ${to}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date ASC
    `;
  }

  async getActivityStats(organizationId, filters) {
    return prisma.leadActivity.groupBy({
      by: ['activityType'],
      where: {
        organizationId,
        ...(filters.from && { createdAt: { gte: filters.from } }),
        ...(filters.to   && { createdAt: { lte: filters.to   } }),
      },
      _count: { activityType: true },
    });
  }

  // ============================================================
  // EXISTENCE / VALIDATION
  // ============================================================

  async userBelongsToOrg(userId, organizationId) {
    const user = await prisma.user.findFirst({
      where: { id: userId, organizationId, isActive: true, deletedAt: null },
      select: { id: true },
    });
    return !!user;
  }

  async territoryBelongsToOrg(territoryId, organizationId) {
    const t = await prisma.territory.findFirst({
      where: { id: territoryId, organizationId },
      select: { id: true },
    });
    return !!t;
  }

  async branchBelongsToOrg(branchId, organizationId) {
    const b = await prisma.branch.findFirst({
      where: { id: branchId, company: { organizationId } },
      select: { id: true },
    });
    return !!b;
  }

  async teamBelongsToOrg(teamId, organizationId) {
    const t = await prisma.team.findFirst({
      where: { id: teamId, organizationId },
      select: { id: true },
    });
    return !!t;
  }

  // ============================================================
  // FOLLOW-UP METHODS
  // ============================================================

  async findFollowUps(leadId, { skip, take }) {
    const followUps = await prisma.leadFollowUp.findMany({
      where: { leadId, deletedAt: null },
      skip,
      take,
      orderBy: { dueAt: 'asc' },
      include: { owner: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
    const total = await prisma.leadFollowUp.count({
      where: { leadId, deletedAt: null },
    });
    return { followUps, total };
  }

  async findFollowUpById(followUpId, leadId) {
    return await prisma.leadFollowUp.findFirst({
      where: { id: followUpId, leadId, deletedAt: null },
      include: { owner: true },
    });
  }

  async createFollowUp(data) {
    return await prisma.leadFollowUp.create({
      data,
      include: { owner: true },
    });
  }

  async updateFollowUp(followUpId, data) {
    return await prisma.leadFollowUp.update({
      where: { id: followUpId },
      data,
      include: { owner: true },
    });
  }

  async softDeleteFollowUp(followUpId) {
    return await prisma.leadFollowUp.update({
      where: { id: followUpId },
      data: { deletedAt: new Date() },
    });
  }

  async findOverdueFollowUps(organizationId, { skip, take }) {
    const followUps = await prisma.leadFollowUp.findMany({
      where: {
        lead: { organizationId },
        status: 'SCHEDULED',
        dueAt: { lt: new Date() },
        deletedAt: null,
      },
      skip,
      take,
      include: { lead: true, owner: true },
      orderBy: { dueAt: 'asc' },
    });
    const total = await prisma.leadFollowUp.count({
      where: {
        lead: { organizationId },
        status: 'SCHEDULED',
        dueAt: { lt: new Date() },
        deletedAt: null,
      },
    });
    return { followUps, total };
  }

  // ============================================================
  // MEETING METHODS
  // ============================================================

  async findMeetings(leadId, { skip, take }) {
    const meetings = await prisma.leadMeeting.findMany({
      where: { leadId, deletedAt: null },
      skip,
      take,
      orderBy: { scheduledAt: 'asc' },
      include: { organizer: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
    const total = await prisma.leadMeeting.count({
      where: { leadId, deletedAt: null },
    });
    return { meetings, total };
  }

  async findMeetingById(meetingId, leadId) {
    return await prisma.leadMeeting.findFirst({
      where: { id: meetingId, leadId, deletedAt: null },
      include: { organizer: true },
    });
  }

  async createMeeting(data) {
    return await prisma.leadMeeting.create({
      data,
      include: { organizer: true },
    });
  }

  async updateMeeting(meetingId, data) {
    return await prisma.leadMeeting.update({
      where: { id: meetingId },
      data,
      include: { organizer: true },
    });
  }

  async softDeleteMeeting(meetingId) {
    return await prisma.leadMeeting.update({
      where: { id: meetingId },
      data: { deletedAt: new Date() },
    });
  }

  // ============================================================
  // CONVERSION METHODS
  // ============================================================

  async createConversion(data) {
    return await prisma.leadConversion.create({
      data,
      include: { convertedBy: true },
    });
  }

  async findConversionsByLeadId(leadId) {
    return await prisma.leadConversion.findMany({
      where: { leadId },
      include: { convertedBy: true },
      orderBy: { convertedAt: 'desc' },
    });
  }

  // ============================================================
  // ACTIVITY METHODS
  // ============================================================

  async findActivities(leadId, { skip, take }) {
    const activities = await prisma.leadActivity.findMany({
      where: { leadId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        performedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
    const total = await prisma.leadActivity.count({ where: { leadId } });
    return { activities, total };
  }

  // ============================================================
  // EXPORT/IMPORT METHODS
  // ============================================================

  async findLeadsForExport(organizationId, filters = {}) {
    return await prisma.lead.findMany({
      where: {
        organizationId,
        deletedAt: null,
        ...(filters.status && { status: filters.status }),
        ...(filters.qualification && { qualification: filters.qualification }),
        ...(filters.assignedToId && { assignedToId: filters.assignedToId }),
      },
      include: {
        assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createExportJob(data) {
    return await prisma.leadExportJob.create({ data });
  }

  async findExportJobs(organizationId, { skip, take }) {
    const jobs = await prisma.leadExportJob.findMany({
      where: { organizationId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
    const total = await prisma.leadExportJob.count({
      where: { organizationId },
    });
    return { jobs, total };
  }

  async findExportJobById(jobId, organizationId) {
    return await prisma.leadExportJob.findFirst({
      where: { id: jobId, organizationId },
    });
  }

  // ============================================================
  // ANALYTICS METHODS
  // ============================================================

  async getLeadStats(organizationId) {
    const [totalLeads, leadsByStatus, leadsByQualification, leadsByAssignee] = await Promise.all([
      prisma.lead.count({ where: { organizationId, deletedAt: null } }),
      prisma.lead.groupBy({
        by: ['status'],
        where: { organizationId, deletedAt: null },
        _count: { id: true },
      }),
      prisma.lead.groupBy({
        by: ['qualification'],
        where: { organizationId, deletedAt: null },
        _count: { id: true },
      }),
      prisma.lead.groupBy({
        by: ['assignedToId'],
        where: { organizationId, deletedAt: null },
        _count: { id: true },
      }),
    ]);
    return {
      totalLeads,
      byStatus: Object.fromEntries(leadsByStatus.map(s => [s.status, s._count.id])),
      byQualification: Object.fromEntries(leadsByQualification.map(q => [q.qualification, q._count.id])),
      byAssignee: leadsByAssignee,
    };
  }

  async getLeadAnalytics(organizationId, query = {}) {
    return await prisma.lead.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      select: {
        id: true,
        status: true,
        qualification: true,
        priority: true,
        score: true,
        isConverted: true,
        assignedToId: true,
        territoryId: true,
        source: true,
        createdAt: true,
        updatedAt: true,
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit || 100,
      skip: ((query.page || 1) - 1) * (query.limit || 100),
    });
  }

  // ============================================================
  // VALIDATION HELPER METHODS
  // ============================================================

  async findActiveUsersInTeam(teamId, organizationId) {
    return await prisma.user.findMany({
      where: {
        teamId,
        organizationId,
        isActive: true,
        deletedAt: null,
      },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
  }

  async findActiveUsersInTerritory(territoryId, organizationId) {
    return await prisma.user.findMany({
      where: {
        territoryId,
        organizationId,
        isActive: true,
        deletedAt: null,
      },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
  }

  async findLeadsByIds(ids, organizationId) {
    return await prisma.lead.findMany({
      where: {
        id: { in: ids },
        organizationId,
        deletedAt: null,
      },
    });
  }
}
