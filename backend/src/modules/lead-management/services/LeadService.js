import { AppError } from '../../../shared/response.js';
import { logAudit } from '../../../utils/audit.js';
import { writeLeadsCsv, writeLeadsExcel, buildExportFileName } from '../helpers/lead.export.js';
import LEADS_CONSTANTS from '../constants/lead.constants.js';
import EventBus from '../../workflow-automation/events/EventBus.js';
import { mkdirSync, existsSync, renameSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = join(__dirname, '..', '..', '..', 'uploads', 'leads', 'documents');

const ensureUploadDir = () => {
  if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });
};

export class LeadsService {
  constructor(leadsRepository) {
    this.repo = leadsRepository;
  }

  _meta(total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    return { total, page, limit, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 };
  }

  _opts({ page, limit, sortBy, sortOrder, ...filters }) {
    return { skip: (page - 1) * limit, take: limit, sortBy, sortOrder, ...filters };
  }

  async _requireLead(id, organizationId) {
    const lead = await this.repo.findLeadById(id, organizationId);
    if (!lead) throw AppError.notFound('Lead not found.');
    return lead;
  }

  async _validateAssignee(assignedToId, organizationId) {
    if (!assignedToId) return;
    if (!(await this.repo.userBelongsToOrg(assignedToId, organizationId)))
      throw AppError.badRequest('Assigned user not found in your organization.');
  }

  async _validateTerritory(id, organizationId) {
    if (!id) return;
    if (!(await this.repo.territoryBelongsToOrg(id, organizationId)))
      throw AppError.badRequest('Territory not found in your organization.');
  }

  async _validateBranch(id, organizationId) {
    if (!id) return;
    if (!(await this.repo.branchBelongsToOrg(id, organizationId)))
      throw AppError.badRequest('Branch not found in your organization.');
  }

  async _validateTeam(id, organizationId) {
    if (!id) return;
    if (!(await this.repo.teamBelongsToOrg(id, organizationId)))
      throw AppError.badRequest('Team not found in your organization.');
  }

  async _activity(data) {
    await this.repo.createActivity(data);
  }

  // ============================================================
  // LEAD CRUD
  // ============================================================

  async listLeads(organizationId, query) {
    const opts = this._opts(query);
    const { leads, total } = await this.repo.findLeads(organizationId, opts);
    return { leads, meta: this._meta(total, query.page, query.limit) };
  }

  async getLead(id, organizationId) {
    return this._requireLead(id, organizationId);
  }

  async createLead(organizationId, data, req) {
    if (data.email) {
      const dup = await this.repo.findActiveDuplicateByEmail(data.email, organizationId);
      if (dup) throw AppError.conflict(`An active lead with email "${data.email}" already exists.`);
    }
    await Promise.all([
      this._validateAssignee(data.assignedToId, organizationId),
      this._validateTerritory(data.territoryId, organizationId),
      this._validateBranch(data.branchId, organizationId),
      this._validateTeam(data.teamId, organizationId),
    ]);
    const lead = await this.repo.createLead({ ...data, organizationId, createdById: req.user.id });
    await this._activity({ organizationId, leadId: lead.id, performedById: req.user.id, activityType: 'CREATED', title: 'Lead created', description: `${lead.firstName} ${lead.lastName} added as a new lead.` });
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.CREATED, moduleName: LEADS_CONSTANTS.MODULE, details: { leadId: lead.id }, req });

    EventBus.emit('LEAD_CREATED', {
      organizationId,
      entityId: lead.id,
      leadId:   lead.id,
      userId:   req.user.id,
      source:   lead.source,
      status:   lead.status,
    });

    return lead;
  }

  async updateLead(id, organizationId, data, req) {
    await this._requireLead(id, organizationId);
    if (data.email) {
      const dup = await this.repo.findActiveDuplicateByEmail(data.email, organizationId, id);
      if (dup) throw AppError.conflict(`Another active lead with email "${data.email}" already exists.`);
    }
    await Promise.all([
      this._validateTerritory(data.territoryId, organizationId),
      this._validateBranch(data.branchId, organizationId),
      this._validateTeam(data.teamId, organizationId),
    ]);
    const updated = await this.repo.updateLead(id, data);
    await this._activity({ organizationId, leadId: id, performedById: req.user.id, activityType: 'UPDATED', title: 'Lead updated', metadata: { changes: Object.keys(data) } });
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.UPDATED, moduleName: LEADS_CONSTANTS.MODULE, details: { leadId: id, changes: Object.keys(data) }, req });
    return updated;
  }

  async deleteLead(id, organizationId, req) {
    const lead = await this._requireLead(id, organizationId);
    await this.repo.softDeleteLead(id);
    await this._activity({ organizationId, leadId: id, performedById: req.user.id, activityType: 'DELETED', title: 'Lead deleted' });
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.DELETED, moduleName: LEADS_CONSTANTS.MODULE, details: { leadId: id, name: `${lead.firstName} ${lead.lastName}` }, req });
  }

  async restoreLead(id, organizationId, req) {
    const lead = await this.repo.findLeadByIdIncludeDeleted(id, organizationId);
    if (!lead) throw AppError.notFound('Lead not found.');
    if (!lead.deletedAt) throw AppError.badRequest('Lead is not deleted.');
    const restored = await this.repo.restoreLead(id);
    await this._activity({ organizationId, leadId: id, performedById: req.user.id, activityType: 'RESTORED', title: 'Lead restored' });
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.RESTORED, moduleName: LEADS_CONSTANTS.MODULE, details: { leadId: id }, req });
    return restored;
  }

  // ============================================================
  // STATUS WORKFLOW
  // ============================================================

  async updateStatus(id, organizationId, status, note, req) {
    const lead = await this._requireLead(id, organizationId);
    if (lead.status === status) throw AppError.badRequest(`Lead is already in "${status}" status.`);
    const allowed = LEADS_CONSTANTS.STATUS_TRANSITIONS[lead.status] || [];
    if (!allowed.includes(status)) throw AppError.badRequest(`Invalid status transition from "${lead.status}" to "${status}". Allowed: ${allowed.join(', ')}.`);
    const previousStatus = lead.status;
    const updated = await this.repo.updateLead(id, { status });
    await this._activity({ organizationId, leadId: id, performedById: req.user.id, activityType: 'STATUS_CHANGED', title: `Status changed to ${status}`, description: note ?? `Status changed from ${previousStatus} to ${status}.`, metadata: { previousStatus, newStatus: status } });
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.STATUS_CHANGED, moduleName: LEADS_CONSTANTS.MODULE, details: { leadId: id, previousStatus, newStatus: status }, req });

    EventBus.emit('LEAD_STATUS_CHANGED', {
      organizationId,
      entityId:       id,
      leadId:         id,
      userId:         req.user.id,
      previousStatus,
      newStatus:      status,
    });

    return updated;
  }

  async updatePriority(id, organizationId, priority, req) {
    const lead = await this._requireLead(id, organizationId);
    const previousPriority = lead.priority;
    const updated = await this.repo.updateLead(id, { priority });
    await this._activity({ organizationId, leadId: id, performedById: req.user.id, activityType: 'PRIORITY_CHANGED', title: `Priority changed to ${priority}`, metadata: { previousPriority, newPriority: priority } });
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.PRIORITY_CHANGED, moduleName: LEADS_CONSTANTS.MODULE, details: { leadId: id, previousPriority, newPriority: priority }, req });
    return updated;
  }

  async updateQualification(id, organizationId, qualification, note, req) {
    const lead = await this._requireLead(id, organizationId);
    const previous = lead.qualification;
    const updated = await this.repo.updateLead(id, { qualification });
    await this._activity({ organizationId, leadId: id, performedById: req.user.id, activityType: 'QUALIFICATION_CHANGED', title: `Qualification changed to ${qualification}`, description: note ?? `Updated from ${previous} to ${qualification}.`, metadata: { previous, qualification } });
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.QUALIFICATION_CHANGED, moduleName: LEADS_CONSTANTS.MODULE, details: { leadId: id, previous, qualification }, req });
    return updated;
  }

  async updateScore(id, organizationId, score, note, req) {
    const lead = await this._requireLead(id, organizationId);
    const previousScore = lead.score;
    const updated = await this.repo.updateLead(id, { score });
    await this._activity({ organizationId, leadId: id, performedById: req.user.id, activityType: 'SCORE_UPDATED', title: `Score updated to ${score}`, description: note ?? `Score changed from ${previousScore} to ${score}.`, metadata: { previousScore, newScore: score } });
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.SCORE_UPDATED, moduleName: LEADS_CONSTANTS.MODULE, details: { leadId: id, previousScore, newScore: score }, req });
    return updated;
  }

  // ============================================================
  // ASSIGNMENT
  // ============================================================

  async assignLead(id, organizationId, assignedToId, assignmentType, note, req) {
    const lead = await this._requireLead(id, organizationId);
    if (assignedToId) await this._validateAssignee(assignedToId, organizationId);
    const previousAssignee = lead.assignedToId;
    const updated = await this.repo.updateLead(id, { assignedToId: assignedToId ?? null });
    await this.repo.createAssignmentHistory({ organizationId, leadId: id, assignedToId: assignedToId ?? null, assignedById: req.user.id, assignmentType: assignmentType ?? 'MANUAL', reason: note ?? null });
    await this._activity({ organizationId, leadId: id, performedById: req.user.id, activityType: 'ASSIGNED', title: assignedToId ? 'Lead assigned' : 'Lead unassigned', description: note, metadata: { previousAssignee, newAssignee: assignedToId ?? null, assignmentType } });
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.ASSIGNED, moduleName: LEADS_CONSTANTS.MODULE, details: { leadId: id, previousAssignee, newAssignee: assignedToId ?? null, assignmentType }, req });

    if (assignedToId) {
      EventBus.emit('LEAD_ASSIGNED', {
        organizationId,
        entityId:     id,
        leadId:       id,
        assignedToId,
        assignedById: req.user.id,
        assignmentType: assignmentType ?? 'MANUAL',
      });
    }

    return updated;
  }

  async autoAssignRoundRobin(organizationId, ids, teamId, req) {
    const users = await this.repo.findActiveUsersInTeam(teamId, organizationId);
    if (!users.length) throw AppError.badRequest('No active users found in the specified team.');
    const leads = await this.repo.findLeadsByIds(ids, organizationId);
    if (!leads.length) throw AppError.notFound('No matching leads found.');
    const counts = await this.repo.countLeadsByAssignee(users.map(u => u.id), organizationId);
    const countMap = Object.fromEntries(counts.map(c => [c.assignedToId, c._count.assignedToId]));
    const sorted = [...users].sort((a, b) => (countMap[a.id] ?? 0) - (countMap[b.id] ?? 0));
    let assigned = 0;
    for (let i = 0; i < leads.length; i++) {
      const user = sorted[i % sorted.length];
      await this.repo.updateLead(leads[i].id, { assignedToId: user.id });
      await this.repo.createAssignmentHistory({ organizationId, leadId: leads[i].id, assignedToId: user.id, assignedById: req.user.id, assignmentType: 'ROUND_ROBIN', reason: 'Auto round-robin assignment' });
      await this._activity({ organizationId, leadId: leads[i].id, performedById: req.user.id, activityType: 'ASSIGNED', title: 'Lead assigned via round-robin', metadata: { assignedToId: user.id, assignmentType: 'ROUND_ROBIN' } });
      assigned++;
    }
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.ASSIGNED, moduleName: LEADS_CONSTANTS.MODULE, details: { type: 'ROUND_ROBIN', teamId, count: assigned }, req });
    return { assigned };
  }

  async autoAssignByTerritory(organizationId, ids, territoryId, req) {
    const users = await this.repo.findActiveUsersInTerritory(territoryId, organizationId);
    if (!users.length) throw AppError.badRequest('No active users found in the specified territory.');
    const leads = await this.repo.findLeadsByIds(ids, organizationId);
    if (!leads.length) throw AppError.notFound('No matching leads found.');
    const counts = await this.repo.countLeadsByAssignee(users.map(u => u.id), organizationId);
    const countMap = Object.fromEntries(counts.map(c => [c.assignedToId, c._count.assignedToId]));
    const sorted = [...users].sort((a, b) => (countMap[a.id] ?? 0) - (countMap[b.id] ?? 0));
    let assigned = 0;
    for (let i = 0; i < leads.length; i++) {
      const user = sorted[i % sorted.length];
      await this.repo.updateLead(leads[i].id, { assignedToId: user.id, territoryId });
      await this.repo.createAssignmentHistory({ organizationId, leadId: leads[i].id, assignedToId: user.id, assignedById: req.user.id, assignmentType: 'TERRITORY_BASED', reason: `Assigned via territory ${territoryId}` });
      await this._activity({ organizationId, leadId: leads[i].id, performedById: req.user.id, activityType: 'ASSIGNED', title: 'Lead assigned via territory', metadata: { assignedToId: user.id, territoryId, assignmentType: 'TERRITORY_BASED' } });
      assigned++;
    }
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.ASSIGNED, moduleName: LEADS_CONSTANTS.MODULE, details: { type: 'TERRITORY_BASED', territoryId, count: assigned }, req });
    return { assigned };
  }

  async bulkAssign(organizationId, ids, assignedToId, assignmentType, note, req) {
    if (assignedToId) await this._validateAssignee(assignedToId, organizationId);
    const found = await this.repo.findLeadsByIds(ids, organizationId);
    if (!found.length) throw AppError.notFound('No matching leads found.');
    const foundIds = found.map(l => l.id);
    await this.repo.bulkUpdateLeads(foundIds, { assignedToId: assignedToId ?? null });
    await Promise.all(foundIds.map(leadId =>
      this.repo.createAssignmentHistory({ organizationId, leadId, assignedToId: assignedToId ?? null, assignedById: req.user.id, assignmentType: assignmentType ?? 'MANUAL', reason: note ?? null })
    ));
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.ASSIGNED, moduleName: LEADS_CONSTANTS.MODULE, details: { count: foundIds.length, assignedToId, assignmentType }, req });
    return { assigned: foundIds.length };
  }

  async getAssignmentHistory(leadId, organizationId, query) {
    await this._requireLead(leadId, organizationId);
    const skip = (query.page - 1) * query.limit;
    const { history, total } = await this.repo.findAssignmentHistory(leadId, organizationId, { skip, take: query.limit });
    return { history, meta: this._meta(total, query.page, query.limit) };
  }

  // ============================================================
  // BULK OPERATIONS
  // ============================================================

  async bulkUpdate(organizationId, ids, updateData, req) {
    const found = await this.repo.findLeadsByIds(ids, organizationId);
    if (!found.length) throw AppError.notFound('No matching leads found.');
    const foundIds = found.map(l => l.id);
    if (updateData.assignedToId) await this._validateAssignee(updateData.assignedToId, organizationId);
    if (updateData.territoryId) await this._validateTerritory(updateData.territoryId, organizationId);
    await this.repo.bulkUpdateLeads(foundIds, updateData);
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.BULK_UPDATED, moduleName: LEADS_CONSTANTS.MODULE, details: { count: foundIds.length, fields: Object.keys(updateData) }, req });
    return { updated: foundIds.length };
  }

  async bulkStatusUpdate(organizationId, ids, status, note, req) {
    const found = await this.repo.findLeadsByIds(ids, organizationId);
    if (!found.length) throw AppError.notFound('No matching leads found.');
    const validIds = found.filter(l => {
      const allowed = LEADS_CONSTANTS.STATUS_TRANSITIONS[l.status] || [];
      return allowed.includes(status);
    }).map(l => l.id);
    if (!validIds.length) throw AppError.badRequest(`No leads can transition to "${status}" from their current status.`);
    await this.repo.bulkUpdateLeads(validIds, { status });
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.BULK_UPDATED, moduleName: LEADS_CONSTANTS.MODULE, details: { count: validIds.length, status }, req });
    return { updated: validIds.length, skipped: found.length - validIds.length };
  }

  async bulkDelete(organizationId, ids, req) {
    const found = await this.repo.findLeadsByIds(ids, organizationId);
    if (!found.length) throw AppError.notFound('No matching leads found.');
    const foundIds = found.map(l => l.id);
    await this.repo.bulkSoftDeleteLeads(foundIds);
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.BULK_DELETED, moduleName: LEADS_CONSTANTS.MODULE, details: { count: foundIds.length }, req });
    return { deleted: foundIds.length };
  }

  // ============================================================
  // NOTES
  // ============================================================

  async listNotes(leadId, organizationId, query) {
    await this._requireLead(leadId, organizationId);
    const skip = (query.page - 1) * query.limit;
    const { notes, total } = await this.repo.findNotes(leadId, organizationId, { skip, take: query.limit, isPinned: query.isPinned });
    return { notes, meta: this._meta(total, query.page, query.limit) };
  }

  async createNote(leadId, organizationId, data, req) {
    await this._requireLead(leadId, organizationId);
    const note = await this.repo.createNote({ leadId, organizationId, authorId: req.user.id, ...data });
    await this._activity({ organizationId, leadId, performedById: req.user.id, activityType: 'NOTE_ADDED', title: data.isPinned ? 'Pinned note added' : 'Note added', description: data.content.substring(0, 200) });
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.NOTE_ADDED, moduleName: LEADS_CONSTANTS.MODULE, details: { leadId, noteId: note.id }, req });
    return note;
  }

  async updateNote(leadId, noteId, organizationId, data, req) {
    await this._requireLead(leadId, organizationId);
    const note = await this.repo.findNoteById(noteId, leadId, organizationId);
    if (!note) throw AppError.notFound('Note not found.');
    if (note.author.id !== req.user.id) throw AppError.forbidden('You can only edit your own notes.');
    const updated = await this.repo.updateNote(noteId, { ...data, editedAt: new Date() });
    const actType = data.isPinned !== undefined ? 'NOTE_PINNED' : 'NOTE_EDITED';
    await this._activity({ organizationId, leadId, performedById: req.user.id, activityType: actType, title: actType === 'NOTE_PINNED' ? (data.isPinned ? 'Note pinned' : 'Note unpinned') : 'Note edited' });
    await logAudit({ organizationId, userId: req.user.id, action: actType === 'NOTE_PINNED' ? LEADS_CONSTANTS.AUDIT.NOTE_PINNED : LEADS_CONSTANTS.AUDIT.NOTE_EDITED, moduleName: LEADS_CONSTANTS.MODULE, details: { leadId, noteId }, req });
    return updated;
  }

  async deleteNote(leadId, noteId, organizationId, req) {
    await this._requireLead(leadId, organizationId);
    const note = await this.repo.findNoteById(noteId, leadId, organizationId);
    if (!note) throw AppError.notFound('Note not found.');
    if (note.author.id !== req.user.id) throw AppError.forbidden('You can only delete your own notes.');
    await this.repo.softDeleteNote(noteId);
    await this._activity({ organizationId, leadId, performedById: req.user.id, activityType: 'NOTE_DELETED', title: 'Note deleted' });
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.NOTE_DELETED, moduleName: LEADS_CONSTANTS.MODULE, details: { leadId, noteId }, req });
  }

  // ============================================================
  // DOCUMENTS
  // ============================================================

  async listDocuments(leadId, organizationId, query) {
    await this._requireLead(leadId, organizationId);
    const skip = (query.page - 1) * query.limit;
    const { documents, total } = await this.repo.findDocuments(leadId, organizationId, { skip, take: query.limit, category: query.category });
    return { documents, meta: this._meta(total, query.page, query.limit) };
  }

  async uploadDocument(leadId, organizationId, file, meta, req) {
    await this._requireLead(leadId, organizationId);
    if (!file) throw AppError.badRequest('No file uploaded.');
    if (!LEADS_CONSTANTS.DOCUMENTS.ALLOWED_MIME_TYPES.includes(file.mimetype))
      throw AppError.badRequest('File type not allowed.');
    if (file.size > LEADS_CONSTANTS.DOCUMENTS.MAX_SIZE_BYTES)
      throw AppError.badRequest('File size exceeds 20 MB limit.');
    ensureUploadDir();
    const ext = extname(file.originalname);
    const storedName = `${Date.now()}_${leadId.slice(0, 8)}${ext}`;
    const filePath = join(UPLOAD_DIR, storedName);
    renameSync(file.path, filePath);
    const doc = await this.repo.createDocument({ leadId, organizationId, uploadedById: req.user.id, parentId: null, category: meta.category ?? 'GENERAL', name: meta.name ?? file.originalname, originalName: file.originalname, mimeType: file.mimetype, sizeBytes: file.size, filePath, version: 1, description: meta.description ?? null });
    await this._activity({ organizationId, leadId, performedById: req.user.id, activityType: 'DOCUMENT_UPLOADED', title: `Document uploaded: ${doc.name}`, metadata: { documentId: doc.id, category: doc.category } });
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.DOCUMENT_UPLOADED, moduleName: LEADS_CONSTANTS.MODULE, details: { leadId, documentId: doc.id, name: doc.name }, req });
    return doc;
  }

  async replaceDocument(leadId, documentId, organizationId, file, meta, req) {
    await this._requireLead(leadId, organizationId);
    const parent = await this.repo.findDocumentById(documentId, leadId, organizationId);
    if (!parent) throw AppError.notFound('Document not found.');
    if (!file) throw AppError.badRequest('No file uploaded.');
    if (!LEADS_CONSTANTS.DOCUMENTS.ALLOWED_MIME_TYPES.includes(file.mimetype))
      throw AppError.badRequest('File type not allowed.');
    ensureUploadDir();
    const ext = extname(file.originalname);
    const storedName = `${Date.now()}_${leadId.slice(0, 8)}${ext}`;
    const filePath = join(UPLOAD_DIR, storedName);
    renameSync(file.path, filePath);
    const latestVersion = await this.repo.getLatestDocumentVersion(documentId);
    const newVersion = await this.repo.createDocument({ leadId, organizationId, uploadedById: req.user.id, parentId: documentId, category: parent.category, name: meta.name ?? parent.name, originalName: file.originalname, mimeType: file.mimetype, sizeBytes: file.size, filePath, version: latestVersion + 1, description: meta.description ?? null });
    await this._activity({ organizationId, leadId, performedById: req.user.id, activityType: 'DOCUMENT_UPLOADED', title: `Document replaced: ${newVersion.name} (v${newVersion.version})`, metadata: { documentId: newVersion.id, parentId: documentId } });
    return newVersion;
  }

  async getDocument(leadId, documentId, organizationId) {
    await this._requireLead(leadId, organizationId);
    const doc = await this.repo.findDocumentById(documentId, leadId, organizationId);
    if (!doc) throw AppError.notFound('Document not found.');
    return doc;
  }

  async deleteDocument(leadId, documentId, organizationId, req) {
    await this._requireLead(leadId, organizationId);
    const doc = await this.repo.findDocumentById(documentId, leadId, organizationId);
    if (!doc) throw AppError.notFound('Document not found.');
    await this.repo.softDeleteDocument(documentId);
    await this._activity({ organizationId, leadId, performedById: req.user.id, activityType: 'DOCUMENT_DELETED', title: `Document deleted: ${doc.name}` });
    await logAudit({ organizationId, userId: req.user.id, action: LEADS_CONSTANTS.AUDIT.DOCUMENT_DELETED, moduleName: LEADS_CONSTANTS.MODULE, details: { leadId, documentId, name: doc.name }, req });
  }

  // ============================================================
  // FOLLOW-UPS
  // ============================================================

  async listFollowUps(leadId, organizationId, query) {
    await this._requireLead(leadId, organizationId);
    const skip = (query.page - 1) * query.limit;
    const { followUps, total } = await this.repo.findFollowUps(leadId, { skip, take: query.limit });
    return { followUps, meta: this._meta(total, query.page, query.limit) };
  }

  async createFollowUp(leadId, organizationId, data, req) {
    await this._requireLead(leadId, organizationId);
    const followUp = await this.repo.createFollowUp({
      leadId,
      organizationId,
      ownerId: req.user.id,
      ...data,
    });
    await this._activity({ leadId, organizationId, actionType: 'FOLLOW_UP_SCHEDULED', performedById: req.user.id });
    return followUp;
  }

  async updateFollowUp(leadId, followUpId, organizationId, data, req) {
    await this._requireLead(leadId, organizationId);
    const followUp = await this.repo.findFollowUpById(followUpId, leadId);
    if (!followUp) throw AppError.notFound('Follow-up not found.');
    const updated = await this.repo.updateFollowUp(followUpId, data);
    await this._activity({ leadId, organizationId, actionType: 'FOLLOW_UP_UPDATED', performedById: req.user.id });
    return updated;
  }

  async completeFollowUp(leadId, followUpId, organizationId, data, req) {
    await this._requireLead(leadId, organizationId);
    const followUp = await this.repo.findFollowUpById(followUpId, leadId);
    if (!followUp) throw AppError.notFound('Follow-up not found.');
    const updated = await this.repo.updateFollowUp(followUpId, { status: 'COMPLETED', completedAt: new Date() });
    await this._activity({ leadId, organizationId, actionType: 'FOLLOW_UP_COMPLETED', performedById: req.user.id });
    return updated;
  }

  async cancelFollowUp(leadId, followUpId, organizationId, data, req) {
    await this._requireLead(leadId, organizationId);
    const followUp = await this.repo.findFollowUpById(followUpId, leadId);
    if (!followUp) throw AppError.notFound('Follow-up not found.');
    const updated = await this.repo.updateFollowUp(followUpId, { status: 'CANCELLED', cancelledAt: new Date() });
    await this._activity({ leadId, organizationId, actionType: 'FOLLOW_UP_CANCELLED', performedById: req.user.id });
    return updated;
  }

  async deleteFollowUp(leadId, followUpId, organizationId, req) {
    await this._requireLead(leadId, organizationId);
    const followUp = await this.repo.findFollowUpById(followUpId, leadId);
    if (!followUp) throw AppError.notFound('Follow-up not found.');
    await this.repo.softDeleteFollowUp(followUpId);
    await this._activity({ leadId, organizationId, actionType: 'FOLLOW_UP_DELETED', performedById: req.user.id });
  }

  async getOverdueFollowUps(organizationId, query) {
    const skip = (query.page - 1) * query.limit;
    const { followUps, total } = await this.repo.findOverdueFollowUps(organizationId, { skip, take: query.limit });
    return { followUps, meta: this._meta(total, query.page, query.limit) };
  }

  // ============================================================
  // MEETINGS
  // ============================================================

  async listMeetings(leadId, organizationId, query) {
    await this._requireLead(leadId, organizationId);
    const skip = (query.page - 1) * query.limit;
    const { meetings, total } = await this.repo.findMeetings(leadId, { skip, take: query.limit });
    return { meetings, meta: this._meta(total, query.page, query.limit) };
  }

  async createMeeting(leadId, organizationId, data, req) {
    await this._requireLead(leadId, organizationId);
    const meeting = await this.repo.createMeeting({
      leadId,
      organizationId,
      organizerId: req.user.id,
      ...data,
    });
    await this._activity({ leadId, organizationId, actionType: 'MEETING_SCHEDULED', performedById: req.user.id });
    return meeting;
  }

  async getMeeting(leadId, meetingId, organizationId) {
    await this._requireLead(leadId, organizationId);
    const meeting = await this.repo.findMeetingById(meetingId, leadId);
    if (!meeting) throw AppError.notFound('Meeting not found.');
    return meeting;
  }

  async updateMeeting(leadId, meetingId, organizationId, data, req) {
    await this._requireLead(leadId, organizationId);
    const meeting = await this.repo.findMeetingById(meetingId, leadId);
    if (!meeting) throw AppError.notFound('Meeting not found.');
    const updated = await this.repo.updateMeeting(meetingId, data);
    await this._activity({ leadId, organizationId, actionType: 'MEETING_UPDATED', performedById: req.user.id });
    return updated;
  }

  async completeMeeting(leadId, meetingId, organizationId, data, req) {
    await this._requireLead(leadId, organizationId);
    const meeting = await this.repo.findMeetingById(meetingId, leadId);
    if (!meeting) throw AppError.notFound('Meeting not found.');
    const updated = await this.repo.updateMeeting(meetingId, {
      status: 'COMPLETED',
      meetingNotes: data.notes,
    });
    await this._activity({ leadId, organizationId, actionType: 'MEETING_COMPLETED', performedById: req.user.id });
    return updated;
  }

  async cancelMeeting(leadId, meetingId, organizationId, data, req) {
    await this._requireLead(leadId, organizationId);
    const meeting = await this.repo.findMeetingById(meetingId, leadId);
    if (!meeting) throw AppError.notFound('Meeting not found.');
    const updated = await this.repo.updateMeeting(meetingId, {
      status: 'CANCELLED',
      cancelledAt: new Date(),
      cancelReason: data.reason,
    });
    await this._activity({ leadId, organizationId, actionType: 'MEETING_CANCELLED', performedById: req.user.id });
    return updated;
  }

  async deleteMeeting(leadId, meetingId, organizationId, req) {
    await this._requireLead(leadId, organizationId);
    const meeting = await this.repo.findMeetingById(meetingId, leadId);
    if (!meeting) throw AppError.notFound('Meeting not found.');
    await this.repo.softDeleteMeeting(meetingId);
    await this._activity({ leadId, organizationId, actionType: 'MEETING_DELETED', performedById: req.user.id });
  }

  // ============================================================
  // CONVERSION
  // ============================================================

  async convertLead(id, organizationId, data, req) {
    const lead = await this._requireLead(id, organizationId);
    if (lead.isConverted) throw AppError.conflict('Lead is already converted.');

    await this.repo.updateLead(id, { isConverted: true, convertedAt: new Date() });
    const conversion = await this.repo.createConversion({
      leadId: id,
      organizationId,
      convertedById: req.user.id,
      conversionType: data.conversionType,
      targetEntityId: data.targetEntityId,
      targetEntityType: data.targetEntityType,
      notes: data.notes,
    });
    await this._activity({ leadId: id, organizationId, actionType: 'CONVERTED', performedById: req.user.id });
    return conversion;
  }

  async getConversions(id, organizationId) {
    await this._requireLead(id, organizationId);
    return await this.repo.findConversionsByLeadId(id);
  }

  // ============================================================
  // ACTIVITY TIMELINE
  // ============================================================

  async listActivities(leadId, organizationId, query) {
    await this._requireLead(leadId, organizationId);
    const skip = (query.page - 1) * query.limit;
    const { activities, total } = await this.repo.findActivities(leadId, { skip, take: query.limit });
    return { activities, meta: this._meta(total, query.page, query.limit) };
  }

  // ============================================================
  // EXPORT & ANALYTICS
  // ============================================================

  async getStats(organizationId) {
    return await this.repo.getLeadStats(organizationId);
  }

  async getAnalytics(organizationId, query) {
    return await this.repo.getLeadAnalytics(organizationId, query);
  }

  async exportLeads(organizationId, query, req) {
    const { format = 'CSV', filters = {} } = query;
    
    const leads = await this.repo.findLeadsForExport(organizationId, filters);
    if (!leads.length) throw AppError.notFound('No leads found to export.');

    const fileName = buildExportFileName(format);
    let fileBuffer;

    if (format.toUpperCase() === 'EXCEL') {
      fileBuffer = await writeLeadsExcel(leads, fileName);
    } else {
      fileBuffer = await writeLeadsCsv(leads, fileName);
    }

    const exportJob = await this.repo.createExportJob({
      organizationId,
      requestedById: req.user.id,
      format,
      filters,
      totalRecords: leads.length,
      status: 'COMPLETED',
      filePath: fileName,
    });

    return { fileBuffer, fileName, exportJob };
  }

  async listExportJobs(organizationId, query) {
    const skip = (query.page - 1) * query.limit;
    const { jobs, total } = await this.repo.findExportJobs(organizationId, { skip, take: query.limit });
    return { jobs, meta: this._meta(total, query.page, query.limit) };
  }

  async getExportJob(organizationId, jobId) {
    const job = await this.repo.findExportJobById(jobId, organizationId);
    if (!job) throw AppError.notFound('Export job not found.');
    return job;
  }

  async downloadExport(organizationId, jobId) {
    const job = await this.repo.findExportJobById(jobId, organizationId);
    if (!job) throw AppError.notFound('Export job not found.');
    if (job.status !== 'COMPLETED') throw AppError.badRequest('Export is not yet ready.');
    return job;
  }
}