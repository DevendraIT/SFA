import { ApiResponse } from '../../../shared/response.js';
import { createReadStream, existsSync } from 'fs';
import path from 'path';

/**
 * Leads Controller
 * Thin HTTP layer — calls service, returns standardised responses.
 */
export class LeadsController {
  constructor(leadsService) {
    this.service = leadsService;
  }

  // ── Lead CRUD ──────────────────────────────────────────────

  listLeads = async (req, res, next) => {
    try {
      const { leads, meta } = await this.service.listLeads(req.user.organizationId, req.query);
      res.json(ApiResponse.success('Leads retrieved successfully.', { leads }, meta));
    } catch (e) { next(e); }
  };

  getLead = async (req, res, next) => {
    try {
      const lead = await this.service.getLead(req.params.id, req.user.organizationId);
      res.json(ApiResponse.success('Lead retrieved successfully.', lead));
    } catch (e) { next(e); }
  };

  createLead = async (req, res, next) => {
    try {
      const lead = await this.service.createLead(req.user.organizationId, req.body, req);
      res.status(201).json(ApiResponse.success('Lead created successfully.', lead));
    } catch (e) { next(e); }
  };

  updateLead = async (req, res, next) => {
    try {
      const lead = await this.service.updateLead(req.params.id, req.user.organizationId, req.body, req);
      res.json(ApiResponse.success('Lead updated successfully.', lead));
    } catch (e) { next(e); }
  };

  deleteLead = async (req, res, next) => {
    try {
      await this.service.deleteLead(req.params.id, req.user.organizationId, req);
      res.json(ApiResponse.success('Lead deleted successfully.'));
    } catch (e) { next(e); }
  };

  restoreLead = async (req, res, next) => {
    try {
      const lead = await this.service.restoreLead(req.params.id, req.user.organizationId, req);
      res.json(ApiResponse.success('Lead restored successfully.', lead));
    } catch (e) { next(e); }
  };

  // ── Status Workflow ────────────────────────────────────────

  updateStatus = async (req, res, next) => {
    try {
      const lead = await this.service.updateStatus(req.params.id, req.user.organizationId, req.body.status, req.body.note, req);
      res.json(ApiResponse.success('Lead status updated.', lead));
    } catch (e) { next(e); }
  };

  updatePriority = async (req, res, next) => {
    try {
      const lead = await this.service.updatePriority(req.params.id, req.user.organizationId, req.body.priority, req);
      res.json(ApiResponse.success('Lead priority updated.', lead));
    } catch (e) { next(e); }
  };

  updateQualification = async (req, res, next) => {
    try {
      const lead = await this.service.updateQualification(req.params.id, req.user.organizationId, req.body.qualification, req.body.note, req);
      res.json(ApiResponse.success('Lead qualification updated.', lead));
    } catch (e) { next(e); }
  };

  updateScore = async (req, res, next) => {
    try {
      const lead = await this.service.updateScore(req.params.id, req.user.organizationId, req.body.score, req.body.note, req);
      res.json(ApiResponse.success('Lead score updated.', lead));
    } catch (e) { next(e); }
  };

  // ── Assignment ─────────────────────────────────────────────

  assignLead = async (req, res, next) => {
    try {
      const lead = await this.service.assignLead(req.params.id, req.user.organizationId, req.body.assignedToId, req.body.assignmentType, req.body.note, req);
      res.json(ApiResponse.success('Lead assignment updated.', lead));
    } catch (e) { next(e); }
  };

  autoAssign = async (req, res, next) => {
    try {
      const { ids, assignmentType, teamId, territoryId } = req.body;
      let result;
      if (assignmentType === 'ROUND_ROBIN')      result = await this.service.autoAssignRoundRobin(req.user.organizationId, ids, teamId, req);
      else if (assignmentType === 'TERRITORY_BASED') result = await this.service.autoAssignByTerritory(req.user.organizationId, ids, territoryId, req);
      else throw new Error('Invalid assignmentType for auto-assign. Use ROUND_ROBIN or TERRITORY_BASED.');
      res.json(ApiResponse.success(`${result.assigned} lead(s) auto-assigned.`, result));
    } catch (e) { next(e); }
  };

  bulkAssign = async (req, res, next) => {
    try {
      const result = await this.service.bulkAssign(req.user.organizationId, req.body.ids, req.body.assignedToId, req.body.assignmentType, req.body.note, req);
      res.json(ApiResponse.success(`${result.assigned} lead(s) assigned successfully.`, result));
    } catch (e) { next(e); }
  };

  getAssignmentHistory = async (req, res, next) => {
    try {
      const { history, meta } = await this.service.getAssignmentHistory(req.params.id, req.user.organizationId, req.query);
      res.json(ApiResponse.success('Assignment history retrieved.', { history }, meta));
    } catch (e) { next(e); }
  };

  // ── Bulk Operations ────────────────────────────────────────

  bulkUpdate = async (req, res, next) => {
    try {
      const result = await this.service.bulkUpdate(req.user.organizationId, req.body.ids, req.body.update, req);
      res.json(ApiResponse.success(`${result.updated} lead(s) updated.`, result));
    } catch (e) { next(e); }
  };

  bulkStatusUpdate = async (req, res, next) => {
    try {
      const result = await this.service.bulkStatusUpdate(req.user.organizationId, req.body.ids, req.body.status, req.body.note, req);
      res.json(ApiResponse.success(`${result.updated} lead(s) updated. ${result.skipped} skipped.`, result));
    } catch (e) { next(e); }
  };

  bulkDelete = async (req, res, next) => {
    try {
      const result = await this.service.bulkDelete(req.user.organizationId, req.body.ids, req);
      res.json(ApiResponse.success(`${result.deleted} lead(s) deleted.`, result));
    } catch (e) { next(e); }
  };

  // ── Notes ──────────────────────────────────────────────────

  listNotes = async (req, res, next) => {
    try {
      const { notes, meta } = await this.service.listNotes(req.params.id, req.user.organizationId, req.query);
      res.json(ApiResponse.success('Notes retrieved successfully.', { notes }, meta));
    } catch (e) { next(e); }
  };

  createNote = async (req, res, next) => {
    try {
      const note = await this.service.createNote(req.params.id, req.user.organizationId, req.body, req);
      res.status(201).json(ApiResponse.success('Note created successfully.', note));
    } catch (e) { next(e); }
  };

  updateNote = async (req, res, next) => {
    try {
      const note = await this.service.updateNote(req.params.id, req.params.noteId, req.user.organizationId, req.body, req);
      res.json(ApiResponse.success('Note updated successfully.', note));
    } catch (e) { next(e); }
  };

  deleteNote = async (req, res, next) => {
    try {
      await this.service.deleteNote(req.params.id, req.params.noteId, req.user.organizationId, req);
      res.json(ApiResponse.success('Note deleted successfully.'));
    } catch (e) { next(e); }
  };

  // ── Documents ──────────────────────────────────────────────

  listDocuments = async (req, res, next) => {
    try {
      const { documents, meta } = await this.service.listDocuments(req.params.id, req.user.organizationId, req.query);
      res.json(ApiResponse.success('Documents retrieved successfully.', { documents }, meta));
    } catch (e) { next(e); }
  };

  uploadDocument = async (req, res, next) => {
    try {
      const doc = await this.service.uploadDocument(req.params.id, req.user.organizationId, req.file, req.body, req);
      res.status(201).json(ApiResponse.success('Document uploaded successfully.', doc));
    } catch (e) { next(e); }
  };

  replaceDocument = async (req, res, next) => {
    try {
      const doc = await this.service.replaceDocument(req.params.id, req.params.documentId, req.user.organizationId, req.file, req.body, req);
      res.json(ApiResponse.success('Document replaced successfully.', doc));
    } catch (e) { next(e); }
  };

  getDocument = async (req, res, next) => {
    try {
      const doc = await this.service.getDocument(req.params.id, req.params.documentId, req.user.organizationId);
      res.json(ApiResponse.success('Document retrieved successfully.', doc));
    } catch (e) { next(e); }
  };

  downloadDocument = async (req, res, next) => {
    try {
      const doc = await this.service.getDocument(req.params.id, req.params.documentId, req.user.organizationId);
      if (!doc.filePath || !existsSync(doc.filePath)) return res.status(404).json(ApiResponse.error('Document file not found.'));
      res.setHeader('Content-Disposition', `attachment; filename="${doc.originalName}"`);
      res.setHeader('Content-Type', doc.mimeType);
      createReadStream(doc.filePath).pipe(res);
    } catch (e) { next(e); }
  };

  deleteDocument = async (req, res, next) => {
    try {
      await this.service.deleteDocument(req.params.id, req.params.documentId, req.user.organizationId, req);
      res.json(ApiResponse.success('Document deleted successfully.'));
    } catch (e) { next(e); }
  };

  // ── Follow-ups ─────────────────────────────────────────────

  listFollowUps = async (req, res, next) => {
    try {
      const { followUps, meta } = await this.service.listFollowUps(req.params.id, req.user.organizationId, req.query);
      res.json(ApiResponse.success('Follow-ups retrieved successfully.', { followUps }, meta));
    } catch (e) { next(e); }
  };

  createFollowUp = async (req, res, next) => {
    try {
      const followUp = await this.service.createFollowUp(req.params.id, req.user.organizationId, req.body, req);
      res.status(201).json(ApiResponse.success('Follow-up scheduled successfully.', followUp));
    } catch (e) { next(e); }
  };

  updateFollowUp = async (req, res, next) => {
    try {
      const followUp = await this.service.updateFollowUp(req.params.id, req.params.followUpId, req.user.organizationId, req.body, req);
      res.json(ApiResponse.success('Follow-up updated successfully.', followUp));
    } catch (e) { next(e); }
  };

  completeFollowUp = async (req, res, next) => {
    try {
      const followUp = await this.service.completeFollowUp(req.params.id, req.params.followUpId, req.user.organizationId, req.body.note, req);
      res.json(ApiResponse.success('Follow-up marked as completed.', followUp));
    } catch (e) { next(e); }
  };

  cancelFollowUp = async (req, res, next) => {
    try {
      const followUp = await this.service.cancelFollowUp(req.params.id, req.params.followUpId, req.user.organizationId, req.body.note, req);
      res.json(ApiResponse.success('Follow-up cancelled.', followUp));
    } catch (e) { next(e); }
  };

  deleteFollowUp = async (req, res, next) => {
    try {
      await this.service.deleteFollowUp(req.params.id, req.params.followUpId, req.user.organizationId, req);
      res.json(ApiResponse.success('Follow-up deleted successfully.'));
    } catch (e) { next(e); }
  };

  getOverdueFollowUps = async (req, res, next) => {
    try {
      const followUps = await this.service.getOverdueFollowUps(req.user.organizationId, req.query);
      res.json(ApiResponse.success('Overdue follow-ups retrieved.', { followUps }));
    } catch (e) { next(e); }
  };

  // ── Meetings ───────────────────────────────────────────────

  listMeetings = async (req, res, next) => {
    try {
      const { meetings, meta } = await this.service.listMeetings(req.params.id, req.user.organizationId, req.query);
      res.json(ApiResponse.success('Meetings retrieved successfully.', { meetings }, meta));
    } catch (e) { next(e); }
  };

  createMeeting = async (req, res, next) => {
    try {
      const meeting = await this.service.createMeeting(req.params.id, req.user.organizationId, req.body, req);
      res.status(201).json(ApiResponse.success('Meeting scheduled successfully.', meeting));
    } catch (e) { next(e); }
  };

  getMeeting = async (req, res, next) => {
    try {
      const meeting = await this.service.getMeeting(req.params.id, req.params.meetingId, req.user.organizationId);
      res.json(ApiResponse.success('Meeting retrieved successfully.', meeting));
    } catch (e) { next(e); }
  };

  updateMeeting = async (req, res, next) => {
    try {
      const meeting = await this.service.updateMeeting(req.params.id, req.params.meetingId, req.user.organizationId, req.body, req);
      res.json(ApiResponse.success('Meeting updated successfully.', meeting));
    } catch (e) { next(e); }
  };

  completeMeeting = async (req, res, next) => {
    try {
      const meeting = await this.service.completeMeeting(req.params.id, req.params.meetingId, req.user.organizationId, req.body, req);
      res.json(ApiResponse.success('Meeting marked as completed.', meeting));
    } catch (e) { next(e); }
  };

  cancelMeeting = async (req, res, next) => {
    try {
      const meeting = await this.service.cancelMeeting(req.params.id, req.params.meetingId, req.user.organizationId, req.body.cancelReason, req);
      res.json(ApiResponse.success('Meeting cancelled.', meeting));
    } catch (e) { next(e); }
  };

  deleteMeeting = async (req, res, next) => {
    try {
      await this.service.deleteMeeting(req.params.id, req.params.meetingId, req.user.organizationId, req);
      res.json(ApiResponse.success('Meeting deleted successfully.'));
    } catch (e) { next(e); }
  };

  // ── Conversion ─────────────────────────────────────────────

  convertLead = async (req, res, next) => {
    try {
      const conversion = await this.service.convertLead(req.params.id, req.user.organizationId, req.body.conversionType, req.body.notes, req);
      res.status(201).json(ApiResponse.success('Lead converted successfully.', conversion));
    } catch (e) { next(e); }
  };

  getConversions = async (req, res, next) => {
    try {
      const conversions = await this.service.getConversions(req.params.id, req.user.organizationId);
      res.json(ApiResponse.success('Conversions retrieved successfully.', { conversions }));
    } catch (e) { next(e); }
  };

  // ── Activity Timeline ──────────────────────────────────────

  listActivities = async (req, res, next) => {
    try {
      const { activities, meta } = await this.service.listActivities(req.params.id, req.user.organizationId, req.query);
      res.json(ApiResponse.success('Activity timeline retrieved.', { activities }, meta));
    } catch (e) { next(e); }
  };

  // ── Export ─────────────────────────────────────────────────

  exportLeads = async (req, res, next) => {
    try {
      const result = await this.service.exportLeads(req.user.organizationId, req.query, req);
      res.json(ApiResponse.success(`Export completed. ${result.totalRecords} lead(s) exported.`, { jobId: result.jobId, totalRecords: result.totalRecords, expiresAt: result.expiresAt }));
    } catch (e) { next(e); }
  };

  downloadExport = async (req, res, next) => {
    try {
      const job = await this.service.getExportJob(req.params.jobId, req.user.organizationId);
      if (job.status !== 'COMPLETED') return res.status(400).json(ApiResponse.error('Export is not ready for download.'));
      if (!job.filePath || !existsSync(job.filePath)) return res.status(404).json(ApiResponse.error('Export file not found or has expired.'));
      if (job.expiresAt && new Date() > new Date(job.expiresAt)) return res.status(410).json(ApiResponse.error('Export file has expired.'));
      const mimeType = job.format === 'EXCEL' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'text/csv';
      res.setHeader('Content-Disposition', `attachment; filename="${path.basename(job.filePath)}"`);
      res.setHeader('Content-Type', mimeType);
      createReadStream(job.filePath).pipe(res);
    } catch (e) { next(e); }
  };

  listExportJobs = async (req, res, next) => {
    try {
      const { jobs, meta } = await this.service.listExportJobs(req.user.organizationId, req.query);
      res.json(ApiResponse.success('Export jobs retrieved.', { jobs }, meta));
    } catch (e) { next(e); }
  };

  getExportJob = async (req, res, next) => {
    try {
      const job = await this.service.getExportJob(req.params.jobId, req.user.organizationId);
      res.json(ApiResponse.success('Export job retrieved.', job));
    } catch (e) { next(e); }
  };

  // ── Analytics ──────────────────────────────────────────────

  getStats = async (req, res, next) => {
    try {
      const stats = await this.service.getStats(req.user.organizationId);
      res.json(ApiResponse.success('Lead statistics retrieved.', stats));
    } catch (e) { next(e); }
  };

  getAnalytics = async (req, res, next) => {
    try {
      const analytics = await this.service.getAnalytics(req.user.organizationId, req.query);
      res.json(ApiResponse.success('Lead analytics retrieved.', analytics));
    } catch (e) { next(e); }
  };
}
