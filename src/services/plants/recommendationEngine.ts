import type { SmartRecommendationInput } from '@/features/recommendations/types';
import { weatherClient } from '@/services/weather';
import type { PlantProfile } from './types';

export type RecommendationSignals = {
  environment: SmartRecommendationInput;
  weather?: Awaited<ReturnType<typeof weatherClient.getForecast>>;
  candidatePlants: PlantProfile[];
};

/**
 * Provider-agnostic recommendation input assembler. A server endpoint or an
 * OpenAI tool call can consume this without React components knowing providers.
 */
export async function buildRecommendationSignals(
  environment: SmartRecommendationInput,
  candidates: PlantProfile[] = [],
): Promise<RecommendationSignals> {
  const weather =
    environment.latitude !== undefined && environment.longitude !== undefined
      ? await weatherClient
          .getForecast(environment.latitude, environment.longitude)
          .catch(() => undefined)
      : undefined;
  return { environment, weather, candidatePlants: candidates };
}
