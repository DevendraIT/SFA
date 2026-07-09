import { OpenAI } from 'openai';
import { AiProvider } from '../AiProvider.js';
import { config } from '../../../../config/env.js';

export class OpenAiProvider extends AiProvider {
  constructor() {
    super();
    this.client = new OpenAI({
      apiKey: config.AI.openai.apiKey,
    });
  }

  async analyzeReply(text) {
    const prompt = `
    Analyze the following email reply from a prospect.
    Extract the sentiment and intent.

    Sentiment must be one of: POSITIVE, NEUTRAL, NEGATIVE.
    Intent must be one of: NONE, MEETING_REQUEST, CALL_REQUEST, PRICING_REQUEST, DEMO_REQUEST, MORE_INFO, NOT_INTERESTED, OUT_OF_OFFICE, WRONG_PERSON.

    Reply text:
    "${text}"
    `;

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'ReplyAnalysis',
          schema: {
            type: 'object',
            properties: {
              sentiment: { type: 'string', enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'] },
              intent: { type: 'string', enum: ['NONE', 'MEETING_REQUEST', 'CALL_REQUEST', 'PRICING_REQUEST', 'DEMO_REQUEST', 'MORE_INFO', 'NOT_INTERESTED', 'OUT_OF_OFFICE', 'WRONG_PERSON'] },
              confidenceScore: { type: 'number' },
              summary: { type: 'string' }
            },
            required: ['sentiment', 'intent', 'confidenceScore', 'summary'],
            additionalProperties: false
          },
          strict: true
        }
      }
    });

    const resultStr = response.choices[0].message.content;
    const parsed = JSON.parse(resultStr);

    return {
      sentiment: parsed.sentiment,
      intent: parsed.intent,
      confidenceScore: parsed.confidenceScore,
      summary: parsed.summary,
      rawResponse: response
    };
  }
}
