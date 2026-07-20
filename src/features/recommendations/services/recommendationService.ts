import { Flower2, Leaf, Salad, Sprout } from 'lucide-react';
import { aiClient } from '@/services/ai';
import { isDemoMode, withDemoFallback } from '@/services/demo';
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

function visualFor(
  plant: GeneratedRecommendation,
): PlantRecommendation['visual'] {
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

function createDemoResult(
  profile: RecommendationInput | SmartRecommendationInput,
): RecommendationResult {
  const location =
    'city' in profile
      ? profile.city || profile.country || 'your growing space'
      : profile.region || profile.country || 'your growing space';
  const plants: GeneratedRecommendation[] = [
    {
      name: 'Cherry Tomato',
      botanicalName: 'Solanum lycopersicum var. cerasiforme',
      type: 'Vegetable',
      confidence: 96,
      difficulty: 'Easy',
      water: '3-4 times weekly',
      sunlight: '6-8 hours of sun',
      growthTime: '60-75 days',
      growthSpeed: 'Fast',
      expectedHeight: '90-150 cm',
      temperature: '18-29°C',
      humidity: '50-70%',
      soil: 'Rich, well-draining loam',
      bestSeason: 'Spring to early summer',
      harvestTime: '8-10 weeks',
      yield: '3-5 kg per plant',
      benefits: [
        'High yield in containers',
        'Beginner friendly',
        'Continuous harvests',
      ],
      why: `Warm light and a manageable watering routine make cherry tomatoes a strong match for ${location}.`,
      pros: ['Productive in pots', 'Clear visual growth cues'],
      challenges: ['Needs support', 'Keep foliage dry in humid weather'],
      careTip:
        'Water at soil level in the morning and remove only damaged lower leaves.',
    },
    {
      name: 'Genovese Basil',
      botanicalName: 'Ocimum basilicum',
      type: 'Herb',
      confidence: 94,
      difficulty: 'Easy',
      water: '2-3 times weekly',
      sunlight: '4-6 hours of sun',
      growthTime: '35-50 days',
      growthSpeed: 'Fast',
      expectedHeight: '30-60 cm',
      temperature: '20-32°C',
      humidity: '45-70%',
      soil: 'Loose, compost-rich mix',
      bestSeason: 'Warm season',
      harvestTime: '5-7 weeks',
      yield: 'Regular leaf harvests',
      benefits: [
        'Compact companion plant',
        'Frequent harvests',
        'Fragrant foliage',
      ],
      why: 'Basil thrives beside tomatoes and rewards regular light pruning with more usable leaves.',
      pros: ['Quick results', 'Suitable for a balcony or windowsill'],
      challenges: ['Sensitive to cold', 'Can flower early in heat'],
      careTip:
        'Pinch the top pair of leaves weekly once the plant is established.',
    },
    {
      name: 'Sweet Pepper',
      botanicalName: 'Capsicum annuum',
      type: 'Vegetable',
      confidence: 91,
      difficulty: 'Moderate',
      water: '2-3 deep waterings weekly',
      sunlight: '6-8 hours of sun',
      growthTime: '70-90 days',
      growthSpeed: 'Moderate',
      expectedHeight: '45-75 cm',
      temperature: '20-30°C',
      humidity: '45-65%',
      soil: 'Fertile, free-draining soil',
      bestSeason: 'Late spring',
      harvestTime: '10-13 weeks',
      yield: '6-10 peppers per plant',
      benefits: ['Container capable', 'Nutritious harvest', 'Warm climate fit'],
      why: 'Its warm-weather preference pairs well with a sunny, protected growing position.',
      pros: ['Compact growth', 'Long harvest window'],
      challenges: ['Needs consistent moisture', 'Slow in cool weather'],
      careTip:
        'Use a stake early and feed lightly after the first flowers set.',
    },
    {
      name: 'French Marigold',
      botanicalName: 'Tagetes patula',
      type: 'Flower',
      confidence: 89,
      difficulty: 'Easy',
      water: '1-2 times weekly',
      sunlight: 'Full sun',
      growthTime: '45-60 days',
      growthSpeed: 'Fast',
      expectedHeight: '25-40 cm',
      temperature: '18-32°C',
      humidity: '40-65%',
      soil: 'Average, well-draining soil',
      bestSeason: 'Spring through autumn',
      harvestTime: 'Flowers in 6-8 weeks',
      yield: 'Continuous seasonal blooms',
      benefits: [
        'Pollinator friendly',
        'Low maintenance',
        'Companion planting',
      ],
      why: 'Marigolds add resilient colour and help create a diverse, easy-care planting mix.',
      pros: ['Fast blooms', 'Tolerates containers'],
      challenges: ['Needs sun for best flowering', 'Avoid soggy soil'],
      careTip: 'Deadhead spent flowers to extend the blooming period.',
    },
  ];
  return normalizeResult({
    plants,
    plan: {
      month: 'This month',
      successRate: 91,
      planting: [
        'Start basil and marigold now.',
        'Plant tomato and pepper in the brightest available position.',
      ],
      weeklyCare: [
        'Check soil moisture every morning.',
        'Inspect lower leaves and tie new tomato growth to support.',
      ],
      watering: [
        'Water deeply when the top 2-3 cm of soil feels dry.',
        'Skip watering after meaningful rainfall.',
      ],
      fertilizer: [
        'Add compost at planting.',
        'Use a balanced feed every two weeks after active growth begins.',
      ],
      harvest: [
        'Begin basil pinching in week five.',
        'Expect first cherry tomatoes in roughly eight to ten weeks.',
      ],
    },
  });
}

/** Generates a validated, structured plan through the secure GreenMind AI route. */
export const recommendationService = {
  async generate(
    profile: RecommendationInput | SmartRecommendationInput,
  ): Promise<RecommendationResult> {
    const demoResult = () => createDemoResult(profile);
    if (isDemoMode()) return demoResult();
    return withDemoFallback(async () => {
      clientRateLimiter.consume('recommendations', 8, 60_000);
      const output = await aiClient.complete({
        task: 'recommendations',
        input: `Create 4 to 6 suitable plant recommendations and a practical garden plan for this environment. Use only the information supplied below.\n\n${JSON.stringify(profile)}`,
      });
      return normalizeResult(parseJson(output));
    }, demoResult);
  },
};
