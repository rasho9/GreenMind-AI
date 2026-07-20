import { aiClient } from '@/services/ai';
import { isDemoMode, withDemoFallback } from '@/services/demo';
import { clientRateLimiter } from '@/services/security';
import { ProviderError } from '@/services/utils';
import type { PlantDoctorAnalysis } from '../types';
import type {
  PlantVisionClient,
  PlantVisionInput,
} from './integrationContracts';

const MAX_ENCODED_IMAGE_BYTES = 2_900_000;

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () =>
      reject(new Error('The selected image could not be read.'));
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('The selected image could not be prepared.'));
        return;
      }
      if (new Blob([reader.result]).size > MAX_ENCODED_IMAGE_BYTES) {
        reject(
          new Error(
            'This image is still too large for secure analysis. Choose a smaller or more tightly cropped photo.',
          ),
        );
        return;
      }
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function parseAnalysis(output: string): PlantDoctorAnalysis {
  let value: unknown;
  try {
    value = JSON.parse(output) as unknown;
  } catch {
    throw new ProviderError(
      'GreenMind AI returned an unreadable health report. Please try again.',
      'INVALID_RESPONSE',
    );
  }
  if (
    !value ||
    typeof value !== 'object' ||
    !('plantName' in value) ||
    !('diseaseName' in value) ||
    !('workflow' in value) ||
    !('timeline' in value)
  ) {
    throw new ProviderError(
      'GreenMind AI returned an incomplete health report. Please try again.',
      'INVALID_RESPONSE',
    );
  }
  return value as PlantDoctorAnalysis;
}

function demoInspectionDate(daysFromNow: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
}

/** A stable, medically cautious demo report used when vision is unavailable. */
function createDemoAnalysis(input: PlantVisionInput): PlantDoctorAnalysis {
  const name = input.image.name.toLowerCase();
  const isRose = name.includes('rose');
  const isPepper = name.includes('pepper');
  const plantName = isRose ? 'Rose' : isPepper ? 'Sweet Pepper' : 'Tomato';
  const scientificName = isRose
    ? 'Rosa spp.'
    : isPepper
      ? 'Capsicum annuum'
      : 'Solanum lycopersicum';
  const diseaseName = isRose
    ? 'Black Spot'
    : isPepper
      ? 'Leaf Spot'
      : 'Early Blight';
  return {
    plantName,
    scientificName,
    plantPart: 'Leaf',
    diseaseId: diseaseName.toLowerCase().replace(/\s+/g, '-'),
    diseaseName,
    confidence: 91,
    healthScore: 72,
    overallHealth: 'Average',
    status: 'Warning',
    severity: 'Medium',
    symptoms: ['Yellow lower leaves', 'Brown leaf spots', 'Slight edge drying'],
    description:
      'This structured demo screening shows an early, manageable leaf-spot pattern rather than a severe whole-plant decline.',
    possibleCauses: [
      'Moist foliage combined with limited airflow',
      'Splashing soil onto lower leaves',
      'Crowded growth around the plant base',
    ],
    treatmentPlan: [
      'Remove only the clearly affected lower leaves with clean scissors.',
      'Water at the soil line early in the day and keep foliage dry.',
      'Improve spacing so air can move around the plant.',
      'Recheck leaf spotting after five to seven days before escalating treatment.',
    ],
    organicTreatment: [
      'Apply a locally approved neem or copper-based product only as directed on its label.',
      'Add a light organic mulch layer to reduce soil splash.',
    ],
    chemicalTreatment: [
      'If symptoms spread, consult a local agricultural expert for a crop-appropriate fungicide and follow the label exactly.',
    ],
    preventionTips: [
      'Avoid overhead watering.',
      'Sanitize pruning tools between plants.',
      'Remove fallen leaves from the soil surface.',
      'Rotate susceptible crops in future seasons.',
    ],
    recoveryTime: '7-14 days',
    wateringAdvice:
      'Water deeply only when the top layer of soil begins to dry; skip a cycle after meaningful rain.',
    sunlightAdvice:
      'Keep the plant in bright morning light with good airflow; avoid sudden harsh heat changes.',
    fertilizerAdvice:
      'Pause high-nitrogen feeding until new growth looks healthy, then resume a measured balanced feed.',
    recoveryPercentage: 84,
    nextInspectionDate: demoInspectionDate(6),
    gptInsight:
      'This demo report prioritizes low-risk care: dry foliage, better airflow, and close monitoring before any chemical intervention.',
    workflow: {
      'Uploading Image': 'Complete',
      'Detecting Plant Species': 'Complete',
      'Analyzing Leaf': 'Complete',
      'Checking Diseases': 'Complete',
      'Checking Nutrient Deficiency': 'Complete',
      'Generating Treatment': 'Complete',
      'Preparing Final Report': 'Complete',
    },
    timeline: [
      {
        day: 'Today',
        title: 'Clean up',
        detail: 'Remove visibly affected leaves and clear fallen debris.',
      },
      {
        day: 'Tomorrow',
        title: 'Adjust watering',
        detail: 'Water at soil level only if the root zone needs it.',
      },
      {
        day: '3 Days',
        title: 'Check spread',
        detail: 'Look for new spotting on lower and inner leaves.',
      },
      {
        day: '7 Days',
        title: 'Review recovery',
        detail: 'Continue the plan if new growth remains clean.',
      },
      {
        day: '14 Days',
        title: 'Resume routine',
        detail: 'Return gradually to normal feeding if recovery is stable.',
      },
      {
        day: '30 Days',
        title: 'Prevent recurrence',
        detail: 'Review airflow, spacing, and crop hygiene.',
      },
    ],
  };
}

/** Sends the validated plant image to the secure GreenMind AI route for live vision analysis. */
export const plantDoctorService: PlantVisionClient = {
  async analyze(input: PlantVisionInput) {
    const demoAnalysis = () => createDemoAnalysis(input);
    if (isDemoMode()) return demoAnalysis();
    const dataUrl = await fileToDataUrl(input.image);
    return withDemoFallback(async () => {
      clientRateLimiter.consume('plant-doctor', 6, 60_000);
      const output = await aiClient.complete({
        task: 'plant-doctor',
        input: `Analyze this plant image as a cautious gardening health screening. Return a structured report only. Weather context: ${JSON.stringify(input.weatherContext ?? null)}. Locale: ${input.locale ?? 'not provided'}.`,
        images: [{ dataUrl }],
      });
      return parseAnalysis(output);
    }, demoAnalysis);
  },
};
