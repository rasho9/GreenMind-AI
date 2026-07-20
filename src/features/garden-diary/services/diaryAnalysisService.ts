import { aiClient } from '@/services/ai';
import { ProviderError } from '@/services/utils';
import type { DiaryEntryInput, GrowthStage } from '../types';

type DiaryAnalysis = { message: string; stage: GrowthStage };

const growthStages = new Set<GrowthStage>([
  'Seedling',
  'Vegetative',
  'Flowering',
  'Fruiting',
  'Harvested',
]);

function parseAnalysis(output: string): DiaryAnalysis {
  try {
    const value = JSON.parse(output) as Partial<DiaryAnalysis>;
    if (!value.message || !value.stage || !growthStages.has(value.stage)) {
      throw new Error('Invalid diary analysis.');
    }
    return { message: value.message, stage: value.stage };
  } catch {
    throw new ProviderError(
      'GreenMind AI returned an incomplete diary analysis. Please try again.',
      'INVALID_RESPONSE',
    );
  }
}

/** Generates a live, structured observation insight through the secure GreenMind AI route. */
export const diaryAnalysisService = {
  async analyze(entry: DiaryEntryInput): Promise<DiaryAnalysis> {
    const output = await aiClient.complete({
      task: 'diary-analysis',
      input: `Analyze this garden diary observation. Keep guidance cautious and practical.\n\n${JSON.stringify(entry)}`,
    });
    return parseAnalysis(output);
  },
};
