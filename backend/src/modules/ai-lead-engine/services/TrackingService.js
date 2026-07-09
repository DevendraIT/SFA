import { AppError } from '../../../shared/response.js';
import EventBus from '../../workflow-automation/events/EventBus.js';

export class TrackingService {
  constructor(
    trackingRepo,
    aiAnalysisRepo,
    prospectRepo,
    aiProvider,
    scoringDomainService,
    qualificationDomainService,
    leadEngineService
  ) {
    this.trackingRepo = trackingRepo;
    this.aiAnalysisRepo = aiAnalysisRepo;
    this.prospectRepo = prospectRepo;
    this.aiProvider = aiProvider;
    this.scoringDomainService = scoringDomainService;
    this.qualificationDomainService = qualificationDomainService;
    this.leadEngineService = leadEngineService; // To trigger auto-lead creation
  }

  /**
   * Handle generic webhooks from email provider
   */
  async handleWebhook(events) {
    for (const event of events) {
      await this.processSingleEvent(event);
    }
  }

  async processSingleEvent(event) {
    let type = 'SENT';
    let prospectId = event.prospectId;
    let campaignId = event.campaignId;
    let organizationId = event.organizationId;
    let textContent = event.text;
    let messageId = event.message_id;

    // Normalization for SendGrid
    if (event.sg_event_id) {
      if (event.event === 'delivered') type = 'DELIVERED';
      if (event.event === 'open') type = 'OPENED';
      if (event.event === 'click') type = 'CLICKED';
      if (event.event === 'bounce' || event.event === 'dropped') type = 'BOUNCED';
      if (event.event === 'spamreport' || event.event === 'unsubscribe') type = 'UNSUBSCRIBED';
      messageId = event.sg_message_id;
    }
    // Normalization for AWS SES
    else if (event.eventType) {
      if (event.eventType === 'Delivery') type = 'DELIVERED';
      if (event.eventType === 'Open') type = 'OPENED';
      if (event.eventType === 'Click') type = 'CLICKED';
      if (event.eventType === 'Bounce') type = 'BOUNCED';
      if (event.eventType === 'Complaint') type = 'UNSUBSCRIBED';
      
      messageId = event.mail?.messageId;
      // SES uses tags for custom metadata
      const tags = event.mail?.tags || {};
      prospectId = tags.prospectId?.[0] || prospectId;
      campaignId = tags.campaignId?.[0] || campaignId;
      organizationId = tags.organizationId?.[0] || organizationId;
    }
    // Normalization for Mailgun
    else if (event['event-data']) {
      const mgEvent = event['event-data'];
      if (mgEvent.event === 'delivered') type = 'DELIVERED';
      if (mgEvent.event === 'opened') type = 'OPENED';
      if (mgEvent.event === 'clicked') type = 'CLICKED';
      if (mgEvent.event === 'failed') type = 'BOUNCED';
      if (mgEvent.event === 'complained' || mgEvent.event === 'unsubscribed') type = 'UNSUBSCRIBED';
      
      messageId = mgEvent.message?.headers?.['message-id'];
      const userVariables = mgEvent['user-variables'] || {};
      prospectId = userVariables.prospectId || prospectId;
      campaignId = userVariables.campaignId || campaignId;
      organizationId = userVariables.organizationId || organizationId;
    }
    // Handle generic or parsed inbound replies
    else {
      if (event.event === 'reply' || event.event === 'replied') type = 'REPLIED';
    }

    if (!prospectId || !organizationId) return;

    const activity = await this.trackingRepo.logActivity({
      organizationId,
      campaignId,
      prospectId,
      type,
      providerMsgId: messageId || null,
      metadata: event
    });

    // 1. If it's a REPLY, trigger AI Analysis
    let intent = null;
    let sentiment = null;

    if (type === 'REPLIED' && textContent) {
      const aiResult = await this.aiProvider.analyzeReply(textContent);
      intent = aiResult.intent;
      sentiment = aiResult.sentiment;

      await this.aiAnalysisRepo.saveAnalysis({
        organizationId,
        prospectId,
        emailActivityId: activity.id,
        sentiment: aiResult.sentiment,
        intent: aiResult.intent,
        confidenceScore: aiResult.confidenceScore,
        summary: aiResult.summary,
        rawResponse: aiResult.rawResponse
      });
    }

    // 2. Score Increment
    const scoreIncrement = this.scoringDomainService.calculateScoreIncrement(type, intent);
    
    let prospect = await this.prospectRepo.findById(prospectId, organizationId);
    if (!prospect) return;

    let updatedScore = prospect.score;
    if (scoreIncrement !== 0) {
      await this.prospectRepo.updateScore(prospectId, scoreIncrement);
      updatedScore += scoreIncrement;
    }

    // 3. Qualification Evaluation
    const newStatus = this.qualificationDomainService.determineQualification(updatedScore, intent, sentiment);
    
    if (newStatus !== prospect.qualificationStatus) {
      await this.prospectRepo.update(prospectId, { qualificationStatus: newStatus });
      prospect.qualificationStatus = newStatus;
      
      // 4. Auto Lead Creation Rule (e.g. if HOT or WARM)
      if (newStatus === 'HOT' || newStatus === 'WARM') {
        const systemUserId = prospect.importJob?.uploadedById;
        await this.leadEngineService.autoCreateLead(prospect, systemUserId);

        // Notify workflow automation — prospect is now a qualified lead
        EventBus.emit('LEAD_QUALIFIED', {
          organizationId,
          prospectId,
          qualificationStatus: newStatus,
          score: updatedScore,
          intent,
          sentiment,
        });
      }
    }
  }
}
