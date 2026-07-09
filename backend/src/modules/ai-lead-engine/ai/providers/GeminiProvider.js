import { GoogleGenerativeAI, Schema, Type } from '@google/generative-ai';
import { AiProvider } from '../AiProvider.js';
import { config } from '../../../../config/env.js';

export class GeminiProvider extends AiProvider {
  constructor() {
    super();
    const genAI = new GoogleGenerativeAI(config.AI.gemini.apiKey);
    
    const schema = {
      type: Type.OBJECT,
      properties: {
        sentiment: {
          type: Type.STRING,
          enum: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'],
          description: "The sentiment of the email reply."
        },
        intent: {
          type: Type.STRING,
          enum: ['NONE', 'MEETING_REQUEST', 'CALL_REQUEST', 'PRICING_REQUEST', 'DEMO_REQUEST', 'MORE_INFO', 'NOT_INTERESTED', 'OUT_OF_OFFICE', 'WRONG_PERSON'],
          description: "The main intent of the email reply."
        },
        confidenceScore: {
          type: Type.NUMBER,
          description: "Confidence score between 0 and 1."
        },
        summary: {
          type: Type.STRING,
          description: "A short one-sentence summary of the reply."
        }
      },
      required: ["sentiment", "intent", "confidenceScore", "summary"]
    };

    this.model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });
  }

  async analyzeReply(text) {
    const prompt = `Analyze the following email reply from a prospect. Extract the sentiment and intent.

    Reply text:
    "${text}"`;

    const result = await this.model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    return {
      sentiment: parsed.sentiment,
      intent: parsed.intent,
      confidenceScore: parsed.confidenceScore,
      summary: parsed.summary,
      rawResponse: result.response
    };
  }
}
