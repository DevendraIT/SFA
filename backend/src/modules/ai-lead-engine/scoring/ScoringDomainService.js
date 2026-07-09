import { ENGINE_CONSTANTS } from '../constants/engine.constants.js';

export class ScoringDomainService {
  /**
   * Calculate incremental score based on email activity and AI intent
   */
  calculateScoreIncrement(activityType, intent, sentiment) {
    let increment = 0;
    
    switch(activityType) {
      case 'DELIVERED':
        increment += ENGINE_CONSTANTS.SCORING_WEIGHTS.EMAIL_DELIVERED;
        break;
      case 'OPENED':
        increment += ENGINE_CONSTANTS.SCORING_WEIGHTS.EMAIL_OPENED;
        break;
      case 'CLICKED':
        increment += ENGINE_CONSTANTS.SCORING_WEIGHTS.EMAIL_CLICKED;
        break;
      case 'REPLIED':
        // Base score for reply, modified by intent
        increment += 5;
        break;
      case 'BOUNCED':
      case 'FAILED':
      case 'UNSUBSCRIBED':
        increment -= 50; // Heavily penalize
        break;
    }

    if (intent) {
      if (intent === 'MEETING_REQUEST') {
        increment += ENGINE_CONSTANTS.SCORING_WEIGHTS.MEETING_INTENT;
      } else if (intent === 'DEMO_REQUEST') {
        increment += ENGINE_CONSTANTS.SCORING_WEIGHTS.DEMO_INTENT;
      } else if (intent === 'PRICING_REQUEST') {
        increment += ENGINE_CONSTANTS.SCORING_WEIGHTS.PRICING_INTENT;
      } else if (intent === 'NOT_INTERESTED') {
        increment += ENGINE_CONSTANTS.SCORING_WEIGHTS.NEGATIVE_REPLY;
      } else if (intent === 'MORE_INFO' || sentiment === 'POSITIVE') {
        increment += ENGINE_CONSTANTS.SCORING_WEIGHTS.POSITIVE_REPLY;
      }
    } else if (sentiment === 'POSITIVE') {
      increment += ENGINE_CONSTANTS.SCORING_WEIGHTS.POSITIVE_REPLY;
    } else if (sentiment === 'NEGATIVE') {
      increment += ENGINE_CONSTANTS.SCORING_WEIGHTS.NEGATIVE_REPLY;
    }

    return increment;
  }

  /**
   * Calculate initial base score based on demographic/firmographic data
   */
  calculateDemographicScore(prospect) {
    let score = 0;

    // Job Title scoring
    if (prospect.jobTitle) {
      const title = prospect.jobTitle.toLowerCase();
      if (title.includes('ceo') || title.includes('cfo') || title.includes('cto') || title.includes('chief') || title.includes('founder')) {
        score += ENGINE_CONSTANTS.SCORING_WEIGHTS.JOB_TITLE_C_LEVEL;
      } else if (title.includes('vp') || title.includes('vice president')) {
        score += ENGINE_CONSTANTS.SCORING_WEIGHTS.JOB_TITLE_VP;
      } else if (title.includes('director') || title.includes('head')) {
        score += ENGINE_CONSTANTS.SCORING_WEIGHTS.JOB_TITLE_DIRECTOR;
      } else if (title.includes('manager')) {
        score += ENGINE_CONSTANTS.SCORING_WEIGHTS.JOB_TITLE_MANAGER;
      }
    }

    // Company Size scoring
    if (prospect.companySize) {
      const sizeStr = prospect.companySize.toLowerCase();
      if (sizeStr.includes('1000') || sizeStr.includes('10000') || sizeStr.includes('enterprise')) {
        score += ENGINE_CONSTANTS.SCORING_WEIGHTS.COMPANY_SIZE_LARGE;
      } else if (sizeStr.includes('50') || sizeStr.includes('100') || sizeStr.includes('500')) {
        score += ENGINE_CONSTANTS.SCORING_WEIGHTS.COMPANY_SIZE_MED;
      }
    }

    // Target Industry scoring (Example: Software, Tech, Healthcare)
    if (prospect.industry) {
      const ind = prospect.industry.toLowerCase();
      if (ind.includes('software') || ind.includes('technology') || ind.includes('health') || ind.includes('finance')) {
        score += ENGINE_CONSTANTS.SCORING_WEIGHTS.INDUSTRY_TARGET;
      }
    }

    return Math.min(100, Math.max(0, score)); // Clamp 0-100
  }
}
