export type PlantHealthStatus = 'Healthy' | 'Warning' | 'Critical';
export type PlantHealthLevel =
  'Excellent' | 'Good' | 'Average' | 'Poor' | 'Critical';
export type DiseaseSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type DiseaseRecord = {
  id: string;
  name: string;
  category: string;
  symptoms: string[];
  description: string;
  prevention: string;
};

export type AnalysisStage =
  | 'Uploading Image'
  | 'Detecting Plant Species'
  | 'Analyzing Leaf'
  | 'Checking Diseases'
  | 'Checking Nutrient Deficiency'
  | 'Generating Treatment'
  | 'Preparing Final Report';

export type TreatmentMilestone = {
  day: string;
  title: string;
  detail: string;
};

/**
 * Provider-neutral result returned by the live server-side vision service.
 */
export type PlantDoctorAnalysis = {
  plantName: string;
  scientificName: string;
  plantPart: string;
  diseaseId: string;
  diseaseName: string;
  confidence: number;
  healthScore: number;
  overallHealth: PlantHealthLevel;
  status: PlantHealthStatus;
  severity: DiseaseSeverity;
  symptoms: string[];
  description: string;
  possibleCauses: string[];
  treatmentPlan: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  preventionTips: string[];
  recoveryTime: string;
  wateringAdvice: string;
  sunlightAdvice: string;
  fertilizerAdvice: string;
  recoveryPercentage: number;
  nextInspectionDate: string;
  gptInsight: string;
  workflow: Record<AnalysisStage, string>;
  timeline: TreatmentMilestone[];
};

export type PlantScan = {
  id: string;
  filename: string;
  imageUrl?: string;
  date: string;
  favorite: boolean;
  analysis: PlantDoctorAnalysis;
};

export const analysisStages: AnalysisStage[] = [
  'Uploading Image',
  'Detecting Plant Species',
  'Analyzing Leaf',
  'Checking Diseases',
  'Checking Nutrient Deficiency',
  'Generating Treatment',
  'Preparing Final Report',
];

/** A compact seed database that can later be backed by a plant-health provider. */
export const diseaseDatabase: DiseaseRecord[] = [
  {
    id: 'early-blight',
    name: 'Early Blight',
    category: 'Fungal',
    symptoms: ['Concentric brown rings', 'Yellow lower leaves'],
    description:
      'A common fungal disease that can progress from lower leaves upward.',
    prevention: 'Water at soil level and keep foliage dry.',
  },
  {
    id: 'late-blight',
    name: 'Late Blight',
    category: 'Fungal-like',
    symptoms: ['Dark water-soaked lesions', 'Rapid collapse'],
    description: 'A fast-moving disease favoured by cool, wet weather.',
    prevention: 'Remove infected material quickly and improve airflow.',
  },
  {
    id: 'powdery-mildew',
    name: 'Powdery Mildew',
    category: 'Fungal',
    symptoms: ['White powdery growth', 'Curling leaves'],
    description:
      'A surface fungal growth that thrives in crowded, humid spaces.',
    prevention: 'Give plants room and avoid excess nitrogen.',
  },
  {
    id: 'leaf-spot',
    name: 'Leaf Spot',
    category: 'Fungal / bacterial',
    symptoms: ['Dark leaf spots', 'Yellow halos'],
    description: 'A broad symptom category often associated with wet foliage.',
    prevention: 'Sanitize tools and avoid splashing soil onto leaves.',
  },
  {
    id: 'root-rot',
    name: 'Root Rot',
    category: 'Fungal',
    symptoms: ['Wilting in wet soil', 'Brown roots'],
    description:
      'Root damage caused by overly wet, poorly aerated growing media.',
    prevention: 'Use free-draining soil and pots with drainage holes.',
  },
  {
    id: 'rust',
    name: 'Rust',
    category: 'Fungal',
    symptoms: ['Orange pustules', 'Premature leaf drop'],
    description:
      'A fungal disease that often appears as orange or brown spores.',
    prevention: 'Remove infected leaves and avoid overhead watering.',
  },
  {
    id: 'anthracnose',
    name: 'Anthracnose',
    category: 'Fungal',
    symptoms: ['Sunken dark lesions', 'Fruit spotting'],
    description: 'A fungal disease that affects leaves, stems, and fruit.',
    prevention: 'Use clean seed stock and keep plant debris removed.',
  },
  {
    id: 'bacterial-wilt',
    name: 'Bacterial Wilt',
    category: 'Bacterial',
    symptoms: ['Sudden wilt', 'Brown vascular tissue'],
    description:
      'A serious soil-borne bacterial disease that blocks water movement.',
    prevention: 'Rotate crops and avoid moving contaminated soil.',
  },
  {
    id: 'mosaic-virus',
    name: 'Mosaic Virus',
    category: 'Viral',
    symptoms: ['Mottled leaves', 'Distorted growth'],
    description:
      'A viral disease typically spread by pests or contaminated tools.',
    prevention: 'Control insect vectors and disinfect cutting tools.',
  },
  {
    id: 'nutrient-deficiency',
    name: 'Nutrient Deficiency',
    category: 'Nutritional',
    symptoms: ['Interveinal yellowing', 'Slow growth'],
    description: 'A nutrient imbalance that can resemble disease symptoms.',
    prevention: 'Test soil and use a balanced, measured feeding routine.',
  },
];
