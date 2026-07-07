/**
 * Leads Module — Constants
 */

export const LEADS_CONSTANTS = {
  MODULE: 'leads',

  // Valid status transitions — enforced by service layer
  STATUS_TRANSITIONS: {
    NEW:         ['CONTACTED', 'QUALIFIED', 'ARCHIVED'],
    CONTACTED:   ['QUALIFIED', 'PROPOSAL', 'LOST', 'ARCHIVED'],
    QUALIFIED:   ['PROPOSAL', 'LOST', 'ARCHIVED'],
    PROPOSAL:    ['NEGOTIATION', 'WON', 'LOST', 'ARCHIVED'],
    NEGOTIATION: ['WON', 'LOST', 'ARCHIVED'],
    WON:         ['ARCHIVED'],
    LOST:        ['NEW', 'ARCHIVED'],
    ARCHIVED:    ['NEW'],
  },

  AUDIT: {
    CREATED:                'lead.created',
    UPDATED:                'lead.updated',
    DELETED:                'lead.deleted',
    RESTORED:               'lead.restored',
    STATUS_CHANGED:         'lead.status_changed',
    PRIORITY_CHANGED:       'lead.priority_changed',
    ASSIGNED:               'lead.assigned',
    SCORE_UPDATED:          'lead.score_updated',
    QUALIFICATION_CHANGED:  'lead.qualification_changed',
    NOTE_ADDED:             'lead.note_added',
    NOTE_EDITED:            'lead.note_edited',
    NOTE_DELETED:           'lead.note_deleted',
    NOTE_PINNED:            'lead.note_pinned',
    DOCUMENT_UPLOADED:      'lead.document_uploaded',
    DOCUMENT_DELETED:       'lead.document_deleted',
    FOLLOW_UP_SCHEDULED:    'lead.follow_up_scheduled',
    FOLLOW_UP_COMPLETED:    'lead.follow_up_completed',
    FOLLOW_UP_CANCELLED:    'lead.follow_up_cancelled',
    MEETING_SCHEDULED:      'lead.meeting_scheduled',
    MEETING_UPDATED:        'lead.meeting_updated',
    MEETING_COMPLETED:      'lead.meeting_completed',
    MEETING_CANCELLED:      'lead.meeting_cancelled',
    CONVERTED:              'lead.converted',
    BULK_UPDATED:           'lead.bulk_updated',
    BULK_DELETED:           'lead.bulk_deleted',
    EXPORT_REQUESTED:       'lead.export_requested',
    EXPORT_COMPLETED:       'lead.export_completed',
    EXPORT_FAILED:          'lead.export_failed',
  },

  EXPORT: {
    MAX_RECORDS: 50000,
    FILE_EXPIRY_HOURS: 24,
  },

  DOCUMENTS: {
    MAX_SIZE_BYTES: 20 * 1024 * 1024, // 20 MB
    ALLOWED_MIME_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'text/csv',
    ],
    UPLOAD_DIR: 'uploads/leads/documents',
  },

  ASSIGNMENT: {
    MAX_LEADS_PER_USER: 500, // Soft cap for round-robin
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  SCORE: {
    MIN: 0,
    MAX: 100,
  },
};

export default LEADS_CONSTANTS;
