import type {
  AssistantRequest,
  AssistantResponse,
  AssistantStreamChunk,
} from '../types';

const pause = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

function gardenFocus(request: AssistantRequest) {
  const text = request.message.toLowerCase();
  if (/yellow|spot|blight|disease|leaf|pest/.test(text)) return 'plant health';
  if (/water|rain|humid|weather|heat/.test(text)) return 'watering and weather';
  if (/fertili[sz]|soil|compost/.test(text)) return 'soil and feeding';
  if (/tomato|harvest|crop|vegetable/.test(text)) return 'productive growing';
  if (/indoor|houseplant|balcony|light/.test(text)) return 'your growing space';
  return 'your garden plan';
}

export function createDemoAssistantResponse(
  request: AssistantRequest,
): AssistantResponse {
  const focus = gardenFocus(request);
  const activeContext = request.context
    .filter((item) => item.active)
    .slice(0, 2)
    .map((item) => item.label)
    .join(' and ');
  const contextDetail = activeContext
    ? ` I also considered ${activeContext}.`
    : '';

  return {
    summary: `For ${focus}, start with the lowest-risk care step first: observe the plant and soil closely, then adjust one variable at a time.${contextDetail}`,
    detailedExplanation: [
      'Check the root zone and leaf surface before making a change; moisture, airflow, and light often explain the first visible symptoms.',
      'Make one adjustment, then reassess after a few days so you can tell which action helped.',
    ],
    quickTips: [
      'Water early at the soil line instead of wetting foliage.',
      'Remove only clearly damaged leaves with clean tools.',
      'Keep a short diary note so the next care decision has context.',
    ],
    warnings: [
      'Avoid applying chemicals until the issue is confirmed and the local product label is appropriate for the plant.',
    ],
    recommendedActions: [
      'Create a care reminder',
      'Review the latest Plant Doctor scan',
      'Open the Garden Diary',
    ],
    relatedPlants: ['Tomato', 'Basil', 'Marigold'],
    sources: [
      {
        label: 'GreenMind demo knowledge base',
        detail: 'Structured gardening guidance for the current demo session.',
      },
    ],
    confidence: 91,
    followUps: [
      'Create a care schedule',
      'Ask about watering',
      'Explain this in simple words',
    ],
  };
}

/** Emits the same chunk contract as the live route for unchanged chat animation. */
export async function* streamDemoAssistantResponse(
  request: AssistantRequest,
): AsyncGenerator<AssistantStreamChunk, void, undefined> {
  const response = createDemoAssistantResponse(request);
  const chunks = response.summary.match(/.{1,64}(?:\s|$)/g) ?? [
    response.summary,
  ];
  for (const delta of chunks) {
    await pause(18);
    yield { type: 'text', delta };
  }
  yield { type: 'complete', response };
}
