import type { GreenMindAssistantClient } from './integrationContracts';
import type { AssistantResponse } from '../types';
import { clientRateLimiter } from '@/services/security';
import { openAIClient } from '@/services/openai';

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

const tomatoResponse: AssistantResponse = {
  summary:
    'Yellowing tomato leaves are most often linked to watering stress, nutrition, or an early disease pattern. Start by checking where the yellowing appears before changing several things at once.',
  detailedExplanation: [
    'If the oldest, lowest leaves yellow first, the plant may be redirecting energy to fruit or responding to uneven watering. If yellowing sits between green veins, look at nutrition and root health. Spots, rings, or rapid spread should be treated as a plant-health signal rather than a feeding issue.',
    'Your connected Plant Doctor context shows an Early Blight warning on a Cherry Tomato. Keep leaves dry, remove the most affected foliage with clean shears, and check new growth every few days.',
  ],
  quickTips: [
    'Water at the soil line in the morning, not over the leaves.',
    'Remove only leaves with clear damage; avoid stripping the whole plant.',
    'Use a balanced tomato feed after the plant has settled for one week.',
  ],
  warnings: [
    'Do not fertilize heavily while the plant is stressed.',
    'If brown rings or spots spread quickly, seek local horticulture guidance for edible-crop treatment options.',
  ],
  recommendedActions: [
    'Inspect the lower third of the plant today.',
    'Create airflow by tying stems to a support.',
    'Schedule a follow-up inspection in 5 days.',
  ],
  relatedPlants: ['Cherry Tomato', 'Roma Tomato', 'Basil'],
  sources: [
    {
      label: 'Plant Doctor context',
      detail: 'Latest visual screening · 72% health score',
    },
    {
      label: 'Garden Diary',
      detail: 'Tomato planted on 18 May · fruiting stage',
    },
  ],
  confidence: 91,
  followUps: [
    'Create a tomato care schedule',
    'Ask about fungal diseases',
    'Explain this in simple words',
  ],
  table: {
    caption: 'Quick symptom guide',
    columns: ['What you notice', 'Most likely next check'],
    rows: [
      ['Lower leaves yellowing', 'Watering rhythm and natural aging'],
      ['Yellowing between green veins', 'Nutrition and root conditions'],
      ['Brown rings or spots', 'Fungal disease screening'],
    ],
  },
};

const wateringResponse: AssistantResponse = {
  summary:
    'A good watering schedule follows the soil, the weather, and the plant stage—not a fixed daily alarm. For your warm, humid summer context, aim for fewer deep waterings and check moisture before each one.',
  detailedExplanation: [
    'For container tomatoes, test the top 3 cm of soil each morning. When it is dry, water slowly at the soil line until a small amount drains from the pot. In sustained heat, this may be every 1-2 days; after rain or a humid spell, wait until the soil needs it.',
    'Basil prefers evenly moist soil, while jasmine should dry slightly between watering. Grouping all plants into one schedule usually creates more problems than it solves.',
  ],
  quickTips: [
    'Water before 9 AM where possible.',
    'Use a saucer only briefly; empty standing water after 20 minutes.',
    'Add a thin mulch layer to reduce evaporation.',
  ],
  warnings: [
    'Do not water just because the leaves look soft at midday; check again in the evening.',
    'Avoid frequent shallow watering because it encourages weak roots.',
  ],
  recommendedActions: [
    'Set one morning moisture check for the next seven days.',
    'Log water given in your Garden Diary.',
    'Adjust after rainfall instead of following the calendar blindly.',
  ],
  relatedPlants: ['Cherry Tomato', 'Genovese Basil', 'Arabian Jasmine'],
  sources: [
    { label: 'Weather context', detail: 'Warm, humid summer profile' },
    {
      label: 'Garden Diary',
      detail: 'Upcoming tomato watering reminder · 18 Jul',
    },
  ],
  confidence: 89,
  followUps: [
    'Create a 7-day watering schedule',
    'Ask about fertilizer',
    'Show related plants',
  ],
  table: {
    caption: 'A flexible morning check',
    columns: ['Plant', 'Check', 'When to water'],
    rows: [
      ['Cherry Tomato', 'Top 3 cm of soil', 'Dry; water deeply at soil line'],
      ['Basil', 'Surface feels just dry', 'Water lightly and evenly'],
      ['Jasmine', 'Top layer and pot weight', 'Let top layer dry slightly'],
    ],
  },
};

const generalResponse: AssistantResponse = {
  summary:
    'I can help you turn that into a clear garden decision. I will combine your plant, space, climate, and recent care context so the next action is practical—not generic.',
  detailedExplanation: [
    'Start with the signal you can observe: which plant is affected, what changed recently, and when symptoms began. A photo, the plant name, and a short note about water or weather will make the guidance more precise.',
    'GreenMind AI can also connect that question to your Plant Library, Garden Diary, plant screening, local weather, and upcoming care tasks when those services are connected.',
  ],
  quickTips: [
    'Mention the plant and its growing location.',
    'Describe the change you noticed and when it began.',
    'Include a close-up photo when diagnosing symptoms.',
  ],
  warnings: ['Avoid changing water, feed, and light all at the same time.'],
  recommendedActions: [
    'Open the Plant Library for plant-specific care data.',
    'Use Plant Doctor if you see visual symptoms.',
    'Create a care reminder once a plan is chosen.',
  ],
  relatedPlants: ['Cherry Tomato', 'Genovese Basil', 'Aloe Vera'],
  sources: [
    {
      label: 'GreenMind workspace',
      detail: 'Structured garden context is available',
    },
  ],
  confidence: 86,
  followUps: [
    'Recommend plants for my city',
    'Create a watering schedule',
    'Help me grow indoor plants',
  ],
  codeBlock: {
    language: 'garden-note',
    code: 'Plant: [name]\nLocation: [balcony / garden / indoor]\nChange noticed: [symptom]\nStarted: [when]\nRecent care: [water / feed / weather]',
  },
};

const marketplaceResponse: AssistantResponse = {
  summary:
    'For your current tomato and plant-health context, I would start with a focused treatment-and-prevention kit instead of buying several overlapping products. Prioritize leaf-dryness, clean pruning, and steady root care first.',
  detailedExplanation: [
    'Your connected Plant Doctor signal points to an Early Blight pattern on a tomato. That makes a targeted fungicide, clean pruning shears, and a soil-level watering approach more useful than a broad “plant booster” purchase.',
    'GreenMind AI Marketplace can surface a Copper Guard Fungicide, Soft-Tie Garden Stake Set, Cedar Mulch Layer, and Tomato Bloom Nutrition with an explanation for each recommendation. Chemical products should always be verified against the local label and crop guidance before use.',
  ],
  quickTips: [
    'Remove only leaves with clear spotting before treating.',
    'Use supports and mulch to reduce foliage contact with damp soil.',
    'Avoid adding heavy fertilizer while a plant is stressed.',
  ],
  warnings: [
    'Never combine products unless their real product labels explicitly allow it.',
    'For edible crops, verify local guidance before applying any chemical treatment.',
  ],
  recommendedActions: [
    'Open AI Marketplace to review the treatment-aware product list.',
    'Add only the products that fit the immediate care plan.',
    'Create a five-day inspection reminder after treatment.',
  ],
  relatedPlants: ['Cherry Tomato', 'Roma Tomato', 'Rose'],
  sources: [
    {
      label: 'Plant Doctor context',
      detail: 'Early Blight warning · 91% screening confidence',
    },
    {
      label: 'AI Marketplace',
      detail: 'Context-aware mock catalog and kit engine',
    },
  ],
  confidence: 90,
  followUps: [
    'Open AI Marketplace',
    'Explain organic treatment options',
    'Create a recovery schedule',
  ],
  table: {
    caption: 'A focused product plan',
    columns: ['Need', 'Recommended product type', 'Why it matters'],
    rows: [
      [
        'Early blight prevention',
        'Targeted fungicide',
        'Supports the treatment plan after label verification',
      ],
      [
        'Leaf cleanup',
        'Clean pruning shears',
        'Reduces spread through damaged foliage',
      ],
      [
        'Foliage splash control',
        'Mulch layer',
        'Keeps lower leaves cleaner during watering or rain',
      ],
    ],
  },
};

/** A complete prior conversation result used for the initial history preview. */
export const assistantSeedResponse = tomatoResponse;

function responseFor(message: string) {
  const normalized = message.toLowerCase();
  if (
    normalized.includes('buy') ||
    normalized.includes('product') ||
    normalized.includes('aphid') ||
    normalized.includes('soil is dry') ||
    normalized.includes('marketplace')
  ) {
    return marketplaceResponse;
  }
  if (
    normalized.includes('tomato') ||
    normalized.includes('yellow') ||
    normalized.includes('disease') ||
    normalized.includes('scan')
  ) {
    return tomatoResponse;
  }
  if (
    normalized.includes('water') ||
    normalized.includes('schedule') ||
    normalized.includes('rain')
  ) {
    return wateringResponse;
  }
  return generalResponse;
}

/** Maps a safe plain-text Responses API result into the existing rich chat UI. */
function responseFromLiveOutput(output: string): AssistantResponse {
  return {
    summary:
      output.trim() ||
      'GreenMind AI did not return any text. Please try again.',
    detailedExplanation: [output.trim()],
    quickTips: [],
    warnings: [],
    recommendedActions: [],
    relatedPlants: [],
    sources: [
      {
        label: 'GreenMind AI',
        detail: 'Live answer generated from your connected workspace context.',
      },
    ],
    confidence: 0,
    followUps: [
      'Create a care schedule',
      'Ask about watering',
      'Explain this in simple words',
    ],
  };
}

/**
 * Stable structured demo adapter. It maps query categories to reviewable fixtures and never
 * analyzes local user data or produces random output. Replace it with a secure GPT-5.6 adapter.
 */
export const greenMindAssistantService: GreenMindAssistantClient = {
  async *streamResponse(request) {
    clientRateLimiter.consume('assistant', 12, 60_000);
    if (openAIClient.isEnabled()) {
      let output = '';
      for await (const event of openAIClient.stream({
        input: request.message,
        context: request.context,
        conversationId: request.conversationId,
        attachment: request.attachments?.[0],
      })) {
        if (event.type === 'text') {
          output += event.delta;
          yield { type: 'text', delta: event.delta };
        }
        if (event.type === 'error') throw new Error(event.message);
        if (event.type === 'complete') {
          yield { type: 'complete', response: responseFromLiveOutput(output) };
          return;
        }
      }
      yield { type: 'complete', response: responseFromLiveOutput(output) };
      return;
    }

    const response = responseFor(request.message);
    const words = response.summary.split(' ');
    for (let index = 0; index < words.length; index += 4) {
      await wait(50);
      yield {
        type: 'text',
        delta: `${words.slice(index, index + 4).join(' ')} `,
      };
    }
    await wait(160);
    yield { type: 'complete', response };
  },
};
