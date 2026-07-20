import { clientEnvironment } from '@/services/platform';
import { tokenManager } from '@/services/security/tokenManager';
import { ProviderError } from '@/services/utils';
import type { OpenAIStreamEvent, OpenAIStreamRequest } from './types';

function getApiUrl(path: string) {
  return path.startsWith('http')
    ? path
    : `${clientEnvironment.apiBaseUrl ?? ''}${path}`;
}

function parseEventBlock(block: string) {
  const dataLine = block
    .split('\n')
    .find((line) => line.startsWith('data:'))
    ?.slice(5)
    .trim();
  if (!dataLine || dataLine === '[DONE]') return null;
  try {
    return JSON.parse(dataLine) as {
      type?: string;
      delta?: string;
      response?: { id?: string };
      error?: { message?: string };
    };
  } catch {
    return null;
  }
}

/**
 * Streams a Responses API proxy. The browser only knows the GreenMind route;
 * OPENAI_API_KEY is read exclusively by api/ai/respond.js on the server.
 */
export const openAIClient = {
  isEnabled() {
    return clientEnvironment.liveServicesEnabled;
  },

  async *stream(
    request: OpenAIStreamRequest,
    signal?: AbortSignal,
  ): AsyncGenerator<OpenAIStreamEvent, void, undefined> {
    if (!this.isEnabled()) {
      throw new ProviderError(
        'Live AI is disabled. Set VITE_ENABLE_LIVE_SERVICES=true after configuring the secure server endpoint.',
        'CONFIGURATION',
      );
    }
    const accessToken = tokenManager.getAccessToken();
    const response = await fetch(getApiUrl('/api/ai/respond'), {
      method: 'POST',
      credentials: 'include',
      signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(request),
    });
    if (!response.ok || !response.body) {
      let message = 'GreenMind AI could not respond right now.';
      try {
        const body = (await response.json()) as {
          error?: { message?: string };
        };
        message = body.error?.message ?? message;
      } catch {
        // Keep the generic message when a proxy or CDN sends non-JSON.
      }
      throw new ProviderError(
        message,
        response.status === 429 ? 'RATE_LIMITED' : 'NETWORK',
        response.status,
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    try {
      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';
        for (const rawEvent of events) {
          const event = parseEventBlock(rawEvent);
          if (!event) continue;
          if (event.type === 'response.output_text.delta' && event.delta) {
            yield { type: 'text', delta: event.delta };
          } else if (event.type === 'response.completed') {
            yield { type: 'complete', responseId: event.response?.id };
          } else if (
            event.type === 'error' ||
            event.type === 'response.failed'
          ) {
            yield {
              type: 'error',
              message:
                event.error?.message ??
                'The AI response could not be completed.',
            };
          }
        }
        if (done) break;
      }
    } finally {
      reader.releaseLock();
    }
  },
};
