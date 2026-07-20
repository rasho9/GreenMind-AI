import type { PlantDoctorAnalysis } from '@/features/plant-doctor/types';

export type PlantVisionRequest = {
  image: File;
  locale?: string;
  weatherContext?: { temperature: number; humidity: number };
};

/** Any vision provider must return this normalized result before React sees it. */
export interface PlantDiseaseProvider {
  readonly id: 'openai-vision' | 'plant-id' | 'plantnet' | 'google-vision';
  analyze(
    request: PlantVisionRequest,
    signal?: AbortSignal,
  ): Promise<PlantDoctorAnalysis>;
}
