import { Worker } from 'bullmq';
import { config } from '../../../../config/env.js';

export class CampaignWorker {
  constructor(campaignService, emailDispatchService) {
    this.campaignService = campaignService;
    this.emailDispatchService = emailDispatchService;
    
    this.worker = new Worker('CampaignQueue', async (job) => {
      const { campaignId, organizationId } = job.data;
      
      try {
        // Fetch campaign and its prospects
        const campaign = await this.campaignService.getCampaign(campaignId, organizationId);
        
        if (!campaign || campaign.status !== 'SCHEDULED') {
          console.warn(`[CampaignWorker] Campaign ${campaignId} not found or not SCHEDULED.`);
          return;
        }

        // Move to RUNNING
        await this.campaignService.repo.update(campaignId, { status: 'RUNNING' });

        // Retrieve all prospects for this campaign (in a real scenario, this would be chunked/paginated)
        const campaignProspects = await this.campaignService.repo.getProspectsForCampaign(campaignId, 10000, 0);
        const prospects = campaignProspects.map(cp => cp.prospect);
        
        // Push individual emails to the EmailQueue
        const emailJobs = prospects.map(prospect => {
          // Extremely basic merge (would use a proper templating engine in production)
          const body = this.emailDispatchService.renderTemplate(campaign.template.body, {
            firstName: prospect.firstName || '',
            lastName: prospect.lastName || '',
            company: prospect.company || ''
          });

          return {
            to: prospect.email,
            subject: campaign.template.subject,
            body,
            metadata: {
              campaignId,
              prospectId: prospect.id,
              organizationId
            }
          };
        });

        await this.emailDispatchService.dispatchBatch(emailJobs);

        // Move to COMPLETED
        await this.campaignService.repo.update(campaignId, { status: 'COMPLETED' });

        return { dispatched: emailJobs.length };
      } catch (err) {
        console.error(`[CampaignWorker] Failed to process campaign ${campaignId}:`, err);
        await this.campaignService.repo.update(campaignId, { status: 'FAILED' });
        throw err;
      }
    }, {
      connection: { 
        url: config.REDIS_URL,
        retryStrategy: () => 10000
      },
      concurrency: 2
    });
    this.worker.on('error', () => {});
  }

  async close() {
    await this.worker.close();
  }
}
