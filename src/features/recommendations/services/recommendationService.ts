import { Flower2, Leaf, Salad, Sprout } from 'lucide-react';
import { openAIClient } from '@/services/openai';
import { clientRateLimiter } from '@/services/security';
import { ProviderError } from '@/services/utils';
import type {
  PlantRecommendation,
  RecommendationInput,
  RecommendationResult,
  SmartRecommendationInput,
} from '../types';

type GeneratedRecommendation = Omit<PlantRecommendation, 'visual' | 'icon'>;

type GeneratedResult = {
  plants: GeneratedRecommendation[];
  plan: RecommendationResult['plan'];
};

function parseJson(output: string): unknown {
  try {
    return JSON.parse(output) as unknown;
  } catch {
    throw new ProviderError(
      'GreenMind AI returned an unreadable recommendation plan. Please try again.',
      'INVALID_RESPONSE',
    );
  }
}

function visualFor(plant: GeneratedRecommendation): PlantRecommendation['visual'] {
  const value = `${plant.name} ${plant.type}`.toLowerCase();
  if (value.includes('tomato')) return 'tomato';
  if (value.includes('basil')) return 'basil';
  if (value.includes('pepper')) return 'pepper';
  if (value.includes('marigold') || value.includes('flower')) return 'marigold';
  return 'spinach';
}

function iconFor(visual: PlantRecommendation['visual']) {
  if (visual === 'tomato') return Salad;
  if (visual === 'basil') return Sprout;
  if (visual === 'marigold') return Flower2;
  return Leaf;
}

function isGeneratedResult(value: unknown): value is GeneratedResult {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<GeneratedResult>;
  return (
    Array.isArray(candidate.plants) &&
    candidate.plants.length >= 1 &&
    Boolean(candidate.plan) &&
    typeof candidate.plan === 'object'
  );
}

function normalizeResult(value: unknown): RecommendationResult {
  if (!isGeneratedResult(value)) {
    throw new ProviderError(
      'GreenMind AI returned an incomplete recommendation plan. Please try again.',
      'INVALID_RESPONSE',
    );
  }
  const plants = value.plants.map((plant) => {
    const visual = visualFor(plant);
    return { ...plant, visual, icon: iconFor(visual) };
  });
  return { featured: plants[0], plants, plan: value.plan };
}

/** Generates a validated, structured plan through the secure OpenAI server route. */
export const recommendationService = {
  async generate(
    profile: RecommendationInput | SmartRecommendationInput,
  ): Promise<RecommendationResult> {
    clientRateLimiter.consume('recommendations', 8, 60_000);
    const output = await openAIClient.complete({
      task: 'recommendations',
      input: `Create 4 to 6 suitable plant recommendations and a practical garden plan for this environment. Use only the information supplied below.\n\n${JSON.stringify(profile)}`,
    });
    return normalizeResult(parseJson(output));
  },
};
