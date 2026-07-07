/**
 * Sales Order Module - Enterprise Modular Monolith
 * External API exports for other modules
 */

// Main service interfaces that other modules can use
export { SalesOrderService } from './services/SalesOrderService.js';

// Repository for direct data access if needed
export { SalesOrderRepository } from './repositories/SalesOrderRepository.js';

// Constants that other modules might need
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
} from './constants/sales-order.constants.js';

// Permissions that other modules might need
export { default as SALES_ORDER_PERMISSIONS, ORDERS_PERMISSIONS } from './constants/sales-order.permissions.js';

// DTOs for data transformation
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

// Helpers for external use
export { 
  OrderNumberGenerator,
  OrderCalculations,
  OrderStatusManager,
  OrderBusinessRules,
  OrderDataSanitizer,
  OrderQueryHelper,
} from './helpers/sales-order.helpers.js';

// Events for inter-module communication
export { 
  SALES_ORDER_EVENTS,
  EventPayloadBuilder,
  SalesOrderEventEmitter,
  salesOrderEventEmitter,
} from './events/sales-order.events.js';

// Jobs for external triggering
export {
  JOB_TYPES,
  OrderReminderJob,
  ERPExportJob,
  OrderCleanupJob,
  OrderNotificationJob,
  BulkOperationJob,
  ApprovalEscalationJob,
  OrderJobManager,
} from './jobs/sales-order.jobs.js';

// Validation functions for external use
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