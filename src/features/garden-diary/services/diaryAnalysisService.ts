import type { DiaryEntryInput, GrowthStage } from '../types';

type DiaryAnalysis = { message: string; stage: GrowthStage };

/** Replace this deterministic analysis with a secure GPT-5.6 multimodal service later. */
export const diaryAnalysisService = {
  async analyze(entry: DiaryEntryInput): Promise<DiaryAnalysis> {
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    if (entry.healthRating <= 2)
      return {
        message:
          'Leaves suggest the plant needs closer observation. Check soil moisture and review the most recent fertilizer dose.',
        stage: 'Vegetative',
      };
    if (entry.soilMoisture < 35)
      return {
        message:
          'Watering frequency may need a small adjustment. Aim for even moisture rather than a deep dry-down.',
        stage: 'Vegetative',
      };
    if (entry.flowerStatus === 'Blooming')
      return {
        message:
          'The plant is progressing well. Flowering is on track—keep watering consistent while buds develop.',
        stage: 'Flowering',
      };
    return {
      message:
        'The plant appears healthy and is following a steady growth pattern for this stage.',
      stage: 'Vegetative',
    };
  },
};
