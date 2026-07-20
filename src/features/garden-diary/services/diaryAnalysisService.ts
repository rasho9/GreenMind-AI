import { aiClient } from '@/services/ai';
import { isDemoMode, withDemoFallback } from '@/services/demo';
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

function createDemoAnalysis(entry: DiaryEntryInput): DiaryAnalysis {
  const stage: GrowthStage =
    entry.fruitStatus === 'Ready to harvest'
      ? 'Harvested'
      : entry.fruitStatus === 'Developing fruit' ||
          entry.fruitStatus === 'First set'
        ? 'Fruiting'
        : entry.flowerStatus === 'Blooming' || entry.flowerStatus === 'Budding'
          ? 'Flowering'
          : entry.height < 12
            ? 'Seedling'
            : 'Vegetative';
  const moistureNote =
    entry.soilMoisture >= 72
      ? 'Let the top layer dry slightly before watering again.'
      : entry.soilMoisture <= 32
        ? 'Check the root zone tomorrow and water slowly if it remains dry.'
        : 'Current soil moisture looks balanced for steady growth.';
  return {
    stage,
    message: `Demo growth insight: ${moistureNote} Keep noting leaf colour and new growth so the next care decision has a clear baseline.`,
  };
}

/** Generates a live, structured observation insight through the secure GreenMind AI route. */
export const diaryAnalysisService = {
  async analyze(entry: DiaryEntryInput): Promise<DiaryAnalysis> {
    const demoAnalysis = () => createDemoAnalysis(entry);
    if (isDemoMode()) return demoAnalysis();
    return withDemoFallback(async () => {
      const output = await aiClient.complete({
        task: 'diary-analysis',
        input: `Analyze this garden diary observation. Keep guidance cautious and practical.\n\n${JSON.stringify(entry)}`,
      });
      return parseAnalysis(output);
    }, demoAnalysis);
  },
};
