import express from 'express';
import multer from 'multer';
import { authenticate, requireOrganization, authorize } from '../../../middlewares/auth.middleware.js';
import validate from '../../../middlewares/validation.middleware.js';
import { LeadsRepository } from "../repositories/LeadRepository.js";
import { LeadsService } from '../services/LeadService.js';
import { LeadsController } from '../controllers/LeadController.js';
import LEADS_PERMISSIONS from '../permissions/lead.permissions.js';
import {
  listQuerySchema,
  createLeadSchema,
  updateLeadSchema,
  idParamSchema,
  updateStatusSchema,
  updatePrioritySchema,
  updateQualificationSchema,
  updateScoreSchema,
  assignLeadSchema,
  bulkAssignSchema,
  autoAssignSchema,
  bulkUpdateSchema,
  bulkDeleteSchema,
  bulkStatusUpdateSchema,
  createNoteSchema,
  updateNoteSchema,
  noteIdParamSchema,
  documentMetaSchema,
  documentIdParamSchema,
  createFollowUpSchema,
  updateFollowUpSchema,
  followUpActionSchema,
  followUpIdParamSchema,
  createMeetingSchema,
  updateMeetingSchema,
  completeMeetingSchema,
  cancelMeetingSchema,
  meetingIdParamSchema,
  convertLeadSchema,
  exportQuerySchema,
  analyticsQuerySchema,
  activityQuerySchema,
  paginationQuerySchema,
  jobIdParamSchema,
} from '../validators/lead.validation.js';

const router = express.Router();

// Multer for document uploads — stores to temp dir, service moves to final path
const upload = multer({
  dest: 'uploads/temp/',
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

const repo       = new LeadsRepository();
const service    = new LeadsService(repo);
const controller = new LeadsController(service);

const P = LEADS_PERMISSIONS;

// All routes require auth + org context
router.use(authenticate, requireOrganization);

// ── Stats & Analytics ──────────────────────────────────────────────────────
router.get('/stats',                authorize(P.VIEW_ANALYTICS),  controller.getStats);
router.get('/analytics',            authorize(P.VIEW_ANALYTICS),  validate(analyticsQuerySchema, 'query'), controller.getAnalytics);

// ── Export ─────────────────────────────────────────────────────────────────
router.get('/export',               authorize(P.EXPORT), validate(exportQuerySchema, 'query'), controller.exportLeads);
router.get('/export/jobs',          authorize(P.EXPORT), validate(paginationQuerySchema, 'query'), controller.listExportJobs);
router.get('/export/jobs/:jobId',   authorize(P.EXPORT), validate(jobIdParamSchema, 'params'), controller.getExportJob);
router.get('/export/jobs/:jobId/download', authorize(P.EXPORT), validate(jobIdParamSchema, 'params'), controller.downloadExport);

// ── Follow-ups (overdue — org-wide) ───────────────────────────────────────
router.get('/follow-ups/overdue',   authorize(P.MANAGE_FOLLOWUPS), controller.getOverdueFollowUps);

// ── Bulk Operations ────────────────────────────────────────────────────────
router.put('/bulk',                 authorize(P.UPDATE), validate(bulkUpdateSchema, 'body'), controller.bulkUpdate);
router.put('/bulk/status',          authorize(P.UPDATE), validate(bulkStatusUpdateSchema, 'body'), controller.bulkStatusUpdate);
router.put('/bulk/assign',          authorize(P.ASSIGN), validate(bulkAssignSchema, 'body'), controller.bulkAssign);
router.post('/bulk/auto-assign',    authorize(P.ASSIGN), validate(autoAssignSchema, 'body'), controller.autoAssign);
router.delete('/bulk',              authorize(P.DELETE), validate(bulkDeleteSchema, 'body'), controller.bulkDelete);

// ── Lead CRUD ──────────────────────────────────────────────────────────────
router.get('/',                     authorize(P.READ),   validate(listQuerySchema, 'query'), controller.listLeads);
router.post('/',                    authorize(P.CREATE), validate(createLeadSchema, 'body'), controller.createLead);
router.get('/:id',                  authorize(P.READ),   validate(idParamSchema, 'params'), controller.getLead);
router.put('/:id',                  authorize(P.UPDATE), validate(idParamSchema, 'params'), validate(updateLeadSchema, 'body'), controller.updateLead);
router.delete('/:id',               authorize(P.DELETE), validate(idParamSchema, 'params'), controller.deleteLead);
router.patch('/:id/restore',        authorize(P.UPDATE), validate(idParamSchema, 'params'), controller.restoreLead);

// ── Status Workflow ────────────────────────────────────────────────────────
router.patch('/:id/status',         authorize(P.UPDATE), validate(idParamSchema, 'params'), validate(updateStatusSchema, 'body'), controller.updateStatus);
router.patch('/:id/priority',       authorize(P.UPDATE), validate(idParamSchema, 'params'), validate(updatePrioritySchema, 'body'), controller.updatePriority);
router.patch('/:id/qualification',  authorize(P.UPDATE), validate(idParamSchema, 'params'), validate(updateQualificationSchema, 'body'), controller.updateQualification);
router.patch('/:id/score',          authorize(P.UPDATE), validate(idParamSchema, 'params'), validate(updateScoreSchema, 'body'), controller.updateScore);

// ── Assignment ─────────────────────────────────────────────────────────────
router.patch('/:id/assign',         authorize(P.ASSIGN), validate(idParamSchema, 'params'), validate(assignLeadSchema, 'body'), controller.assignLead);
router.get('/:id/assignment-history', authorize(P.READ), validate(idParamSchema, 'params'), validate(paginationQuerySchema, 'query'), controller.getAssignmentHistory);

// ── Activity Timeline ──────────────────────────────────────────────────────
router.get('/:id/activities',       authorize(P.READ),   validate(idParamSchema, 'params'), validate(activityQuerySchema, 'query'), controller.listActivities);

// ── Notes ──────────────────────────────────────────────────────────────────
router.get('/:id/notes',            authorize(P.READ),             validate(idParamSchema, 'params'), validate(paginationQuerySchema, 'query'), controller.listNotes);
router.post('/:id/notes',           authorize(P.MANAGE_NOTES),     validate(idParamSchema, 'params'), validate(createNoteSchema, 'body'), controller.createNote);
router.put('/:id/notes/:noteId',    authorize(P.MANAGE_NOTES),     validate(noteIdParamSchema, 'params'), validate(updateNoteSchema, 'body'), controller.updateNote);
router.delete('/:id/notes/:noteId', authorize(P.MANAGE_NOTES),     validate(noteIdParamSchema, 'params'), controller.deleteNote);

// ── Documents ──────────────────────────────────────────────────────────────
router.get('/:id/documents',                     authorize(P.READ),              validate(idParamSchema, 'params'), validate(paginationQuerySchema, 'query'), controller.listDocuments);
router.post('/:id/documents',                    authorize(P.MANAGE_DOCUMENTS),  validate(idParamSchema, 'params'), upload.single('file'), validate(documentMetaSchema, 'body'), controller.uploadDocument);
router.get('/:id/documents/:documentId',         authorize(P.READ),              validate(documentIdParamSchema, 'params'), controller.getDocument);
router.get('/:id/documents/:documentId/download',authorize(P.READ),              validate(documentIdParamSchema, 'params'), controller.downloadDocument);
router.post('/:id/documents/:documentId/replace',authorize(P.MANAGE_DOCUMENTS),  validate(documentIdParamSchema, 'params'), upload.single('file'), validate(documentMetaSchema, 'body'), controller.replaceDocument);
router.delete('/:id/documents/:documentId',      authorize(P.MANAGE_DOCUMENTS),  validate(documentIdParamSchema, 'params'), controller.deleteDocument);

// ── Follow-ups ─────────────────────────────────────────────────────────────
router.get('/:id/follow-ups',                        authorize(P.READ),              validate(idParamSchema, 'params'), validate(paginationQuerySchema, 'query'), controller.listFollowUps);
router.post('/:id/follow-ups',                       authorize(P.MANAGE_FOLLOWUPS),  validate(idParamSchema, 'params'), validate(createFollowUpSchema, 'body'), controller.createFollowUp);
router.put('/:id/follow-ups/:followUpId',             authorize(P.MANAGE_FOLLOWUPS),  validate(followUpIdParamSchema, 'params'), validate(updateFollowUpSchema, 'body'), controller.updateFollowUp);
router.patch('/:id/follow-ups/:followUpId/complete',  authorize(P.MANAGE_FOLLOWUPS),  validate(followUpIdParamSchema, 'params'), validate(followUpActionSchema, 'body'), controller.completeFollowUp);
router.patch('/:id/follow-ups/:followUpId/cancel',    authorize(P.MANAGE_FOLLOWUPS),  validate(followUpIdParamSchema, 'params'), validate(followUpActionSchema, 'body'), controller.cancelFollowUp);
router.delete('/:id/follow-ups/:followUpId',          authorize(P.MANAGE_FOLLOWUPS),  validate(followUpIdParamSchema, 'params'), controller.deleteFollowUp);

// ── Meetings ───────────────────────────────────────────────────────────────
router.get('/:id/meetings',                        authorize(P.READ),             validate(idParamSchema, 'params'), validate(paginationQuerySchema, 'query'), controller.listMeetings);
router.post('/:id/meetings',                       authorize(P.MANAGE_MEETINGS),  validate(idParamSchema, 'params'), validate(createMeetingSchema, 'body'), controller.createMeeting);
router.get('/:id/meetings/:meetingId',             authorize(P.READ),             validate(meetingIdParamSchema, 'params'), controller.getMeeting);
router.put('/:id/meetings/:meetingId',             authorize(P.MANAGE_MEETINGS),  validate(meetingIdParamSchema, 'params'), validate(updateMeetingSchema, 'body'), controller.updateMeeting);
router.patch('/:id/meetings/:meetingId/complete',  authorize(P.MANAGE_MEETINGS),  validate(meetingIdParamSchema, 'params'), validate(completeMeetingSchema, 'body'), controller.completeMeeting);
router.patch('/:id/meetings/:meetingId/cancel',    authorize(P.MANAGE_MEETINGS),  validate(meetingIdParamSchema, 'params'), validate(cancelMeetingSchema, 'body'), controller.cancelMeeting);
router.delete('/:id/meetings/:meetingId',          authorize(P.MANAGE_MEETINGS),  validate(meetingIdParamSchema, 'params'), controller.deleteMeeting);

// ── Conversion ─────────────────────────────────────────────────────────────
router.post('/:id/convert',         authorize(P.CONVERT), validate(idParamSchema, 'params'), validate(convertLeadSchema, 'body'), controller.convertLead);
router.get('/:id/conversions',      authorize(P.READ),    validate(idParamSchema, 'params'), controller.getConversions);

export default router;
export { controller as leadsController, service as leadsService, repo as leadsRepository };
