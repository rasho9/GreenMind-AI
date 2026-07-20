import type { GreenMindAssistantClient } from './integrationContracts';
import type { AssistantResponse } from '../types';
import { clientRateLimiter } from '@/services/security';
import { aiClient } from '@/services/ai';

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
 * The only assistant execution path. It deliberately has no local answer catalog:
 * disabled, unavailable, or failed live AI is surfaced to the UI as an error.
 */
export const greenMindAssistantService: GreenMindAssistantClient = {
  async *streamResponse(request) {
    clientRateLimiter.consume('assistant', 12, 60_000);
    let output = '';
    let completed = false;

    for await (const event of aiClient.stream({
      input: request.message,
      context: request.context,
      history: request.history,
      conversationId: request.conversationId,
      task: 'assistant',
    })) {
      if (event.type === 'text') {
        output += event.delta;
        yield { type: 'text', delta: event.delta };
      }
      if (event.type === 'error') throw new Error(event.message);
      if (event.type === 'complete') {
        completed = true;
        break;
      }
    }

    if (!completed || !output.trim()) {
      throw new Error(
        'GreenMind AI did not return a complete response. Please try again.',
      );
    }
    yield { type: 'complete', response: responseFromLiveOutput(output) };
  },
};
