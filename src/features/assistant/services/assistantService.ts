import type { GreenMindAssistantClient } from './integrationContracts';
import type { AssistantResponse } from '../types';
import { clientRateLimiter } from '@/services/security';
import { aiClient } from '@/services/ai';
import { isDemoMode } from '@/services/demo';
import { streamDemoAssistantResponse } from './demoAssistantService';

/** Maps the streamed Responses API text into the presentation model without inventing content. */
function responseFromLiveOutput(output: string): AssistantResponse {
  return {
    summary: output.trim(),
    detailedExplanation: [],
    quickTips: [],
    warnings: [],
    recommendedActions: [],
    relatedPlants: [],
    sources: [],
    followUps: [
      'Create a care schedule',
      'Ask about watering',
      'Explain this in simple words',
    ],
  };
}

/**
 * Uses the secure live route when enabled and falls back to structured local
 * guidance whenever a provider is disabled, unavailable, or rate-limited.
 */
export const greenMindAssistantService: GreenMindAssistantClient = {
  async *streamResponse(request) {
    if (!isDemoMode()) {
      try {
        clientRateLimiter.consume('assistant', 12, 60_000);
        const output = await aiClient.complete({
          input: request.message,
          context: request.context,
          history: request.history,
          conversationId: request.conversationId,
          task: 'assistant',
        });
        const response = responseFromLiveOutput(output);
        for (const delta of response.summary.match(/.{1,64}(?:\s|$)/g) ?? [
          response.summary,
        ]) {
          yield { type: 'text', delta };
        }
        yield { type: 'complete', response };
        return;
      } catch {
        // Provider failures intentionally fall through to the local demo response.
      }
    }
    for await (const chunk of streamDemoAssistantResponse(request)) {
      yield chunk;
    }
  },
};
