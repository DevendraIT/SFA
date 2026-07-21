import { notificationsService } from './notifications.routes.js';
import logger from '../../utils/logger.js';
import { TeamRepository } from '../team/team.repository.js';

const teamRepo = new TeamRepository();

export function registerNotificationListeners() {
  // EventBus.on(WORKFLOW_EVENTS.LEAD_ASSIGNED, async (payload) => {
  // try {
  // const { organizationId, assignedToId, leadId } = payload;
  // if (!assignedToId) return;
  // 
  // await notificationsService.sendNotification(organizationId, assignedToId, {
  // title: 'New Lead Assigned',
  // message: 'A new lead has been automatically assigned to you.',
  // type: 'IN_APP',
  // referenceType: 'Lead',
  // referenceId: leadId,
  // });
  //   } catch (err) {
  //     logger.error(`[notifications] Error processing LEAD_ASSIGNED: ${err.message}`);
  //   }
  // });

  // EventBus.on(WORKFLOW_EVENTS.ATTENDANCE_CHECKED_IN, async (payload) => {
  // try {
  // const { organizationId, userId } = payload;
  // const managerId = await teamRepo.findManagerByUserId(userId);
  // 
  // if (managerId) {
  // await notificationsService.sendNotification(organizationId, managerId, {
  // title: 'Team Member Checked In',
  // message: 'A team member has checked in for the day.',
  // type: 'IN_APP',
  // referenceType: 'User',
  // referenceId: userId,
  // });
  //     }
  //   } catch (err) {
  //     logger.error(`[notifications] Error processing ATTENDANCE_CHECKED_IN: ${err.message}`);
  //   }
  // });

  // EventBus.on(WORKFLOW_EVENTS.TARGET_ACHIEVED, async (payload) => {
  // try {
  // const { organizationId, userId, metric } = payload;
  // 
  // // Notify the user
  // await notificationsService.sendNotification(organizationId, userId, {
  // title: 'Target Achieved! 🎉',
  // message: `Congratulations! You have achieved your ${metric} target.`,
  // type: 'IN_APP',
  // });

  //     // Notify the manager
  //     const managerId = await teamRepo.findManagerByUserId(userId);
  //     if (managerId) {
  //       await notificationsService.sendNotification(organizationId, managerId, {
  //         title: 'Team Target Achieved',
  //         message: `A team member has achieved their ${metric} target.`,
  //         type: 'IN_APP',
  //       });
  //     }
  //   } catch (err) {
  //     logger.error(`[notifications] Error processing TARGET_ACHIEVED: ${err.message}`);
  //   }
  // });

  // ─── Workflow Engine → Notification Bridge ──────────────────────────
  // When the WorkflowEngine dispatches SEND_NOTIFICATION action,
  // it emits this event. We pick it up and call the real service.
  // EventBus.on('WORKFLOW_SEND_NOTIFICATION', async (payload) => {
  // try {
  // const { organizationId, recipientId, recipientRole, channel, title, message, metadata } = payload;
  // 
  // const userId = recipientId;
  // if (!userId || !organizationId) return;
  // 
  // await notificationsService.sendNotification(organizationId, userId, {
  // title:         title   || 'Workflow Notification',
  // message:       message || '',
  // type:          channel || 'IN_APP',
  // referenceType: metadata?.entityType || null,
  // referenceId:   metadata?.entityId   || null,
  // });
  //   } catch (err) {
  //     logger.error(`[notifications] Error processing WORKFLOW_SEND_NOTIFICATION: ${err.message}`);
  //   }
  // });

  // ─── Workflow Engine → DAR Bridge ──────────────────────────────────
  // When the WorkflowEngine dispatches GENERATE_DAR action,
  // it emits this event. We forward to the FieldForceService.
  // EventBus.on('WORKFLOW_GENERATE_DAR', async (payload) => {
  // try {
  // const { organizationId, userId, summary } = payload;
  // const { FieldForceRepository } = await import('../field-force/field-force.repository.js');
  // const { FieldForceService }    = await import('../field-force/field-force.service.js');
  // 
  // const repo    = new FieldForceRepository();
  // const service = new FieldForceService(repo);
  // await service.generateDar(organizationId, userId, { summary, status: 'DRAFT' });
  // 
  // logger.info(`[notifications] DAR generated for user ${userId} via workflow action.`);
  // } catch (err) {
  // logger.error(`[notifications] Error processing WORKFLOW_GENERATE_DAR: ${err.message}`);
  // }
  // });

  // ─── Target Missed Escalation ───────────────────────────────────────
  // EventBus.on(WORKFLOW_EVENTS.TARGET_MISSED, async (payload) => {
  // try {
  // const { organizationId, userId, metric } = payload;
  // 
  // const managerId = await teamRepo.findManagerByUserId(userId);
  // if (managerId) {
  // await notificationsService.sendNotification(organizationId, managerId, {
  // title:   'Target Missed — Action Required',
  // message: `A team member has missed their ${metric} target. Escalation required.`,
  // type:    'IN_APP',
  // });
  //     }
  //
  //     // Also notify the user themselves
  //     await notificationsService.sendNotification(organizationId, userId, {
  //       title:   'Target Missed',
  //       message: `You have missed your ${metric} target. Please connect with your manager.`,
  //       type:    'IN_APP',
  //     });
  //   } catch (err) {
  //     logger.error(`[notifications] Error processing TARGET_MISSED: ${err.message}`);
  //   }
  // });

  // ─── Visit Completed — follow-up reminder ──────────────────────────
  // EventBus.on(WORKFLOW_EVENTS.VISIT_COMPLETED, async (payload) => {
  // try {
  // const { organizationId, userId } = payload;
  // 
  // await notificationsService.sendNotification(organizationId, userId, {
  // title:   'Visit Completed',
  // message: 'Your visit has been recorded. Remember to update your Daily Activity Report.',
  // type:    'IN_APP',
  // });
  //   } catch (err) {
  //     logger.error(`[notifications] Error processing VISIT_COMPLETED: ${err.message}`);
  //   }
  // });
}
