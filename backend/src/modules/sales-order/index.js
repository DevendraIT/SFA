/**
 * Sales Order Module - Enterprise Modular Monolith
 * Main module exports
 */

// Import routes
import salesOrderRouter from './routes/sales-order.routes.js';

// Controllers
export { SalesOrderController } from './controllers/SalesOrderController.js';

// Services
export { SalesOrderService } from './services/SalesOrderService.js';

// Repository
export { SalesOrderRepository } from './repositories/SalesOrderRepository.js';

// Constants
export { 
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
} from './constants/sales-order.constants.js';

// Validators
export { 
  listOrdersQuerySchema,
  orderLineItemSchema,
  createOrderSchema,
  updateOrderSchema,
  updateOrderStatusSchema,
  bulkOrderIdsSchema,
  bulkOrderStatusSchema,
  idParamSchema,
} from './validators/sales-order.validation.js';

// Permissions
export { default as SALES_ORDER_PERMISSIONS, ORDERS_PERMISSIONS } from './constants/sales-order.permissions.js';

// DTOs
export { 
  OrderItemDto,
  OrderListDto,
  OrderDetailsDto,
  OrderCreateDto,
  OrderUpdateDto,
  OrderStatusDto,
  OrderActivityDto,
  BulkOperationResultDto,
} from './dto/sales-order.dto.js';

// Helpers
export { 
  OrderNumberGenerator,
  OrderCalculations,
  OrderStatusManager,
  OrderBusinessRules,
  OrderDataSanitizer,
  OrderQueryHelper,
} from './helpers/sales-order.helpers.js';

// Events
export { 
  SALES_ORDER_EVENTS,
  EventPayloadBuilder,
  SalesOrderEventEmitter,
  SalesOrderEventListeners,
  salesOrderEventEmitter,
} from './events/sales-order.events.js';

// Jobs
export {
  JOB_TYPES,
  JOB_PRIORITY,
  JOB_RETRY_CONFIG,
  OrderReminderJob,
  ERPExportJob,
  OrderCleanupJob,
  OrderNotificationJob,
  BulkOperationJob,
  ApprovalEscalationJob,
  OrderJobManager,
} from './jobs/sales-order.jobs.js';

// Middleware
export {
  requireReadOrderPermission,
  requireCreateOrderPermission,
  requireUpdateOrderPermission,
  requireDeleteOrderPermission,
  requireOrderAccess,
  loadOrder,
  validateStatusTransition,
  requireEditableOrder,
  validateBusinessRules,
  checkApprovalRequirements,
  orderCreationRateLimit,
  bulkOperationRateLimit,
  auditOrderOperation,
  parsePagination,
  parseSorting,
  parseFilters,
} from './middleware/sales-order.middleware.js';

// Initialize event listeners
import { SalesOrderEventListeners } from './events/sales-order.events.js';
SalesOrderEventListeners.registerDefaultListeners();

// Initialize job processors (when queue system is available)
import { OrderJobManager } from './jobs/sales-order.jobs.js';
// OrderJobManager.initializeProcessors();

// Default export (routes)
export default salesOrderRouter;