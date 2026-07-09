import { ENGINE_CONSTANTS } from '../constants/engine.constants.js';

export class QualificationDomainService {
  /**
   * Determines qualification status based on score and intent
   */
  determineQualification(score, intent, sentiment) {
    if (intent === 'NOT_INTERESTED' || intent === 'WRONG_PERSON' || sentiment === 'NEGATIVE') {
      return 'DISQUALIFIED';
    }

    if (intent === 'MEETING_REQUEST' || intent === 'DEMO_REQUEST' || intent === 'PRICING_REQUEST') {
      return 'HOT';
    }

    if (score >= ENGINE_CONSTANTS.QUALIFICATION_THRESHOLDS.HOT) {
      return 'HOT';
    }
    
    if (score >= ENGINE_CONSTANTS.QUALIFICATION_THRESHOLDS.WARM) {
      return 'WARM';
    }

    if (score >= ENGINE_CONSTANTS.QUALIFICATION_THRESHOLDS.COLD) {
      return 'COLD';
    }

    if (score < 0) {
      return 'SPAM'; // E.g., multiple hard bounces or spam reports drop score below 0
    }

    return 'UNQUALIFIED';
  }
}
