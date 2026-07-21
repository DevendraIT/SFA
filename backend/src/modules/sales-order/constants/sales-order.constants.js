/**
 * Sales Order Module - Enterprise Business Constants
 */

// --------------------------------------------------
// Order Status Workflow
// --------------------------------------------------
export const ORDER_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  ON_HOLD: 'on_hold',
};

export const ORDER_STATUS_TRANSITIONS = {
  [ORDER_STATUS.DRAFT]: [ORDER_STATUS.PENDING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.APPROVED, ORDER_STATUS.REJECTED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.APPROVED]: [ORDER_STATUS.COMPLETED, ORDER_STATUS.ON_HOLD, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.REJECTED]: [ORDER_STATUS.PENDING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.ON_HOLD]: [ORDER_STATUS.APPROVED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CANCELLED]: [], // Terminal status
  [ORDER_STATUS.COMPLETED]: [], // Terminal status
};

// --------------------------------------------------
// Approval Levels
// --------------------------------------------------
export const APPROVAL_LEVELS = {
  L1: 'level_1', // Basic approval
  L2: 'level_2', // Manager approval
  L3: 'level_3', // Senior management
};

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// --------------------------------------------------
// Order Types
// --------------------------------------------------
export const ORDER_TYPE = {
  STANDARD: 'standard',
  URGENT: 'urgent',
  BULK: 'bulk',
  RECURRING: 'recurring',
};

// --------------------------------------------------
// Payment Terms
// --------------------------------------------------
export const PAYMENT_TERMS = {
  IMMEDIATE: 'immediate',
  NET_15: 'net_15',
  NET_30: 'net_30',
  NET_60: 'net_60',
  NET_90: 'net_90',
  COD: 'cash_on_delivery',
};

// --------------------------------------------------
// Delivery Terms
// --------------------------------------------------
export const DELIVERY_TERMS = {
  EXW: 'ex_works',
  FOB: 'free_on_board',
  CIF: 'cost_insurance_freight',
  DDP: 'delivered_duty_paid',
};

// --------------------------------------------------
// Order Priorities
// --------------------------------------------------
export const ORDER_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
};

// --------------------------------------------------
// Activity Types
// --------------------------------------------------
export const ACTIVITY_TYPE = {
  CREATED: 'order_created',
  UPDATED: 'order_updated',
  STATUS_CHANGED: 'status_changed',
  APPROVED: 'order_approved',
  REJECTED: 'order_rejected',
  CANCELLED: 'order_cancelled',
  COMPLETED: 'order_completed',
  NOTE_ADDED: 'note_added',
  DOCUMENT_ATTACHED: 'document_attached',
  ASSIGNMENT_CHANGED: 'assignment_changed',
  ERP_SYNC: 'erp_sync',
  NOTIFICATION_SENT: 'notification_sent',
};

// --------------------------------------------------
// Business Rules
// --------------------------------------------------
export const BUSINESS_RULES = {
  MAX_ORDER_ITEMS: 100,
  MAX_ORDER_VALUE: 1000000, // 1 Million in base currency
  MIN_ORDER_VALUE: 0.01,
  DEFAULT_CURRENCY: 'USD',
  DEFAULT_TAX_RATE: 0.10, // 10%
  BULK_OPERATION_LIMIT: 100,
  ORDER_RETENTION_DAYS: 2555, // 7 years
  AUTO_APPROVAL_THRESHOLD: 10000,
  MANAGER_APPROVAL_THRESHOLD: 50000,
};

// --------------------------------------------------
// Integration Constants  
// --------------------------------------------------
export const INTEGRATION_EVENTS = {
  ORDER_CREATED: 'integration.order.created',
  ORDER_APPROVED: 'integration.order.approved',
  ORDER_CANCELLED: 'integration.order.cancelled',
  ORDER_COMPLETED: 'integration.order.completed',
  ERP_EXPORT_REQUIRED: 'integration.erp.export_required',
  INVENTORY_CHECK_REQUIRED: 'integration.inventory.check_required',
};

// --------------------------------------------------
// Notification Templates
// --------------------------------------------------
export const NOTIFICATION_TEMPLATES = {
  ORDER_CREATED: 'order_created',
  ORDER_APPROVED: 'order_approved',
  ORDER_REJECTED: 'order_rejected',
  ORDER_CANCELLED: 'order_cancelled',
  APPROVAL_REQUIRED: 'approval_required',
  ORDER_OVERDUE: 'order_overdue',
};

// --------------------------------------------------
// Export Configuration
// --------------------------------------------------
export const EXPORT_FORMATS = {
  CSV: 'csv',
  EXCEL: 'excel',
  PDF: 'pdf',
};

export const EXPORT_FIELDS = {
  BASIC: ['id', 'orderNumber', 'customerName', 'status', 'orderDate', 'totalAmount'],
  DETAILED: [
    'id', 'orderNumber', 'customerName', 'customerEmail', 'status', 'orderType', 
    'orderDate', 'expectedDeliveryDate', 'priority', 'paymentTerms', 'deliveryTerms',
    'subtotal', 'discountAmount', 'taxAmount', 'totalAmount', 'currency',
    'notes', 'createdBy', 'createdAt', 'updatedAt'
  ],
};

// --------------------------------------------------
// Sorting Options
// --------------------------------------------------
export const SORT_FIELDS = {
  ORDER_NUMBER: 'orderNumber',
  CUSTOMER_NAME: 'customerName',
  ORDER_DATE: 'orderDate',
  TOTAL_AMOUNT: 'totalAmount',
  STATUS: 'status',
  PRIORITY: 'priority',
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
};

export default {
  ORDER_STATUS,
  ORDER_STATUS_TRANSITIONS,
  APPROVAL_LEVELS,
  APPROVAL_STATUS,
  ORDER_TYPE,
  PAYMENT_TERMS,
  DELIVERY_TERMS,
  ORDER_PRIORITY,
  ACTIVITY_TYPE,
  BUSINESS_RULES,
  INTEGRATION_EVENTS,
  NOTIFICATION_TEMPLATES,
  EXPORT_FORMATS,
  EXPORT_FIELDS,
  SORT_FIELDS,
};