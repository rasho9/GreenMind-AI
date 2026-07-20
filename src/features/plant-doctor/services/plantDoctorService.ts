import type { PlantVisionClient } from './integrationContracts';
import type { PlantDoctorAnalysis } from '../types';
import { clientRateLimiter } from '@/services/security';

const pause = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

/**
 * A stable, reviewable fixture for the UI. It deliberately does not infer from an uploaded
 * image or generate random diagnoses. Replace this adapter with a server-side vision client.
 */
export const structuredMockAnalysis: PlantDoctorAnalysis = {
  plantName: 'Cherry Tomato',
  scientificName: 'Solanum lycopersicum var. cerasiforme',
  plantPart: 'Leaf',
  diseaseId: 'early-blight',
  diseaseName: 'Early Blight',
  confidence: 91,
  healthScore: 72,
  overallHealth: 'Average',
  status: 'Warning',
  severity: 'Medium',
  symptoms: ['Yellow lower leaves', 'Brown concentric spots', 'Dry leaf edges'],
  description:
    'The visible pattern is consistent with an early, manageable fungal leaf infection. It is currently limited to a small area of foliage.',
  possibleCauses: [
    'Extended leaf wetness after watering or rain',
    'Lower foliage close to splashing soil',
    'Limited airflow around dense growth',
  ],
  treatmentPlan: [
    'Remove the most affected leaves with clean, disinfected shears.',
    'Water the soil early in the day; keep foliage dry.',
    'Create breathing room around stems and monitor new growth.',
  ],
  organicTreatment: [
    'Apply a labelled copper or biofungicide product only as directed.',
    'Clear fallen leaves and refresh the mulch surface.',
  ],
  chemicalTreatment: [
    'If symptoms spread, consult a local horticulture professional for a registered fungicide suitable for edible crops.',
    'Follow the product label, protective equipment, and harvest interval exactly.',
  ],
  preventionTips: [
    'Rotate tomato-family crops next season.',
    'Use a stake or cage to keep leaves off the soil.',
    'Clean tools between plants and remove plant debris weekly.',
  ],
  recoveryTime: '7-14 days with consistent care',
  wateringAdvice:
    'Water deeply at the soil line every 2-3 days, adjusting for heat and rainfall.',
  sunlightAdvice: 'Keep in 6-8 hours of direct morning to afternoon sunlight.',
  fertilizerAdvice:
    'Pause high-nitrogen feeding for one week; resume a balanced tomato feed after new growth looks clear.',
  recoveryPercentage: 86,
  nextInspectionDate: '21 July 2026',
  gptInsight:
    'Based on the visible symptoms, the leaves show early signs of fungal infection. Reduce overhead watering, improve airflow around the plant, and remove affected leaves. Monitor the plant for the next 5-7 days.',
  workflow: {
    'Uploading Image': 'Image quality verified for visual screening',
    'Detecting Plant Species': 'Tomato foliage identified',
    'Analyzing Leaf': 'Leaf texture and discoloration reviewed',
    'Checking Diseases': 'Early blight pattern matched',
    'Checking Nutrient Deficiency':
      'No severe nutrient deficiency pattern found',
    'Generating Treatment': 'Low-risk care plan prepared',
    'Preparing Final Report': 'Diagnosis and follow-up timeline assembled',
  },
  timeline: [
    {
      day: 'Today',
      title: 'Contain and tidy',
      detail: 'Remove affected leaves and clear any fallen foliage.',
    },
    {
      day: 'Tomorrow',
      title: 'Correct watering',
      detail: 'Water at the soil line early in the day.',
    },
    {
      day: '3 days',
      title: 'Check new growth',
      detail: 'Look for fresh spotting on the lower leaves.',
    },
    {
      day: '7 days',
      title: 'Review progress',
      detail: 'Compare leaves and repeat treatment only if spread continues.',
    },
    {
      day: '14 days',
      title: 'Restore routine',
      detail: 'Resume measured tomato feed if new growth remains clear.',
    },
    {
      day: '30 days',
      title: 'Prevent recurrence',
      detail: 'Review airflow, staking, mulch, and crop hygiene.',
    },
  ],
};

export const plantDoctorService: PlantVisionClient = {
  async analyze() {
    clientRateLimiter.consume('plant-doctor', 6, 60_000);
    await pause(3400);
    return structuredMockAnalysis;
  },
};
