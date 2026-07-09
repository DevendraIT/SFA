import { config } from '../../../config/env.js';

/**
 * Interface/Abstraction for AI Provider.
 */
export class AiProvider {
  /**
   * @param {string} text 
   * @returns {Promise<{ sentiment: string, intent: string, confidenceScore: number, summary: string, rawResponse: any }>}
   */
  async analyzeReply(text) {
    throw new Error('Not implemented');
  }
}

/**
 * Mock/Stub implementation for now.
 * Can be swapped with OpenAIProvider or GeminiProvider.
 */
export class MockAiProvider extends AiProvider {
  async analyzeReply(text) {
    const lower = text.toLowerCase();
    
    let sentiment = 'NEUTRAL';
    let intent = 'NONE';
    let confidence = 0.5;

    // Extremely naive deterministic rules to mock AI
    if (lower.includes('meeting') || lower.includes('call') || lower.includes('zoom')) {
      intent = 'MEETING_REQUEST';
      sentiment = 'POSITIVE';
      confidence = 0.85;
    } else if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing')) {
      intent = 'PRICING_REQUEST';
      sentiment = 'POSITIVE';
      confidence = 0.8;
    } else if (lower.includes('not interested') || lower.includes('unsubscribe') || lower.includes('stop')) {
      intent = 'NOT_INTERESTED';
      sentiment = 'NEGATIVE';
      confidence = 0.95;
    } else if (lower.includes('out of office')) {
      intent = 'OUT_OF_OFFICE';
      sentiment = 'NEUTRAL';
      confidence = 0.99;
    } else if (lower.includes('thank') || lower.includes('sounds good')) {
      sentiment = 'POSITIVE';
      confidence = 0.7;
    }

    return {
      sentiment,
      intent,
      confidenceScore: confidence,
      summary: `Detected intent ${intent} with ${sentiment} sentiment.`,
      rawResponse: { mocked: true }
    };
  }
}

/**
 * Factory to instantiate the correct AI Provider
 */
export class AiProviderFactory {
  static async createProvider() {
    const providerConfig = config.AI.provider;

    if (providerConfig === 'openai') {
      const { OpenAiProvider } = await import('./providers/OpenAiProvider.js');
      return new OpenAiProvider();
    }
    
    if (providerConfig === 'gemini') {
      const { GeminiProvider } = await import('./providers/GeminiProvider.js');
      return new GeminiProvider();
    }

    return new MockAiProvider();
  }
}
