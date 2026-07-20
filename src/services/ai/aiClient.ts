import { clientEnvironment } from '@/services/platform';
import { tokenManager } from '@/services/security/tokenManager';
import { ProviderError } from '@/services/utils';
import type { AIStreamEvent, AIStreamRequest } from './types';

function getApiUrl(path: string) {
  return path.startsWith('http')
    ? path
    : `${clientEnvironment.apiBaseUrl ?? ''}${path}`;
}

function parseEventBlock(block: string) {
  const data = block
    .replace(/\r/g, '')
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trim())
    .join('\n');
  if (!data || data === '[DONE]') return null;
  try {
    return JSON.parse(data) as {
      type?: string;
      delta?: string;
      response?: { id?: string };
      error?: { message?: string; code?: string };
    };
  } catch {
    return null;
  }
}

function errorCodeForStatus(status: number) {
  if (status === 401 || status === 502) return 'UNAUTHORIZED' as const;
  if (status === 403) return 'FORBIDDEN' as const;
  if (status === 429) return 'RATE_LIMITED' as const;
  if (status === 503) return 'CONFIGURATION' as const;
  return 'NETWORK' as const;
}

/**
 * Streams the provider-neutral GreenMind AI proxy. Provider credentials are
 * read only by api/ai/respond.js and never reach the browser.
 */
export const aiClient = {
  isEnabled() {
    return clientEnvironment.liveServicesEnabled;
  },

  async *stream(
    request: AIStreamRequest,
    signal?: AbortSignal,
  ): AsyncGenerator<AIStreamEvent, void, undefined> {
    if (!this.isEnabled()) {
      throw new ProviderError(
        'Live AI is disabled. Set VITE_ENABLE_LIVE_SERVICES=true after configuring the secure server endpoint.',
        'CONFIGURATION',
      );
    }
    const accessToken = tokenManager.getAccessToken();
    let response: Response;
    try {
      response = await fetch(getApiUrl('/api/ai/respond'), {
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
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ProviderError('AI response was cancelled.', 'NETWORK');
      }
      if (!navigator.onLine) {
        throw new ProviderError(
          'You appear to be offline. Reconnect to use GreenMind AI.',
          'OFFLINE',
        );
      }
      throw new ProviderError(
        'GreenMind AI could not reach the secure server. Please try again.',
        'NETWORK',
      );
    }
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
        errorCodeForStatus(response.status),
        response.status,
        Number(response.headers.get('Retry-After') || undefined) || undefined,
      );
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let completed = false;
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
            completed = true;
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
      if (buffer.trim()) {
        const event = parseEventBlock(buffer);
        if (event?.type === 'response.completed') {
          completed = true;
          yield { type: 'complete', responseId: event.response?.id };
        } else if (
          event?.type === 'error' ||
          event?.type === 'response.failed'
        ) {
          throw new ProviderError(
            event.error?.message ?? 'The AI response could not be completed.',
            'NETWORK',
          );
        }
      }
      if (!completed) {
        throw new ProviderError(
          'The AI response ended before completion. Please try again.',
          'NETWORK',
        );
      }
    } finally {
      reader.releaseLock();
    }
  },

  async complete(request: AIStreamRequest, signal?: AbortSignal) {
    let output = '';
    let completed = false;
    for await (const event of this.stream(request, signal)) {
      if (event.type === 'text') output += event.delta;
      if (event.type === 'error') {
        throw new ProviderError(event.message, 'NETWORK');
      }
      if (event.type === 'complete') completed = true;
    }
    if (!completed || !output.trim()) {
      throw new ProviderError(
        'GreenMind AI returned an empty response. Please try again.',
        'INVALID_RESPONSE',
      );
    }
    return output.trim();
  },
};
