import type { LucideIcon } from 'lucide-react';

export type RecommendationInput = {
  country: string;
  region: string;
  climateZone: string;
  season: string;
  soilType: string;
  availableSpace: 'Balcony' | 'Small Garden' | 'Large Garden' | 'Farm';
  sunlightExposure: 'Low light' | 'Partial sun' | 'Full sun';
  waterAvailability: number;
  gardeningExperience: 'Beginner' | 'Intermediate' | 'Experienced';
  budget: number;
  preferredPlantType:
    'Vegetables' | 'Fruits' | 'Herbs' | 'Flowers' | 'Indoor Plants';
};

export type RecommendationMethod =
  'current-location' | 'manual-location' | 'place-photo' | 'description';

export type SmartRecommendationInput = {
  method: RecommendationMethod;
  country: string;
  city: string;
  latitude?: number;
  longitude?: number;
  photoName?: string;
  placeDescription: string;
  sunlight: 'Full Sun' | 'Partial Sun' | 'Shade';
  space: 'Indoor' | 'Balcony' | 'Terrace' | 'Garden' | 'Farm';
  maintenance: 'Low' | 'Medium' | 'High';
  purposes: Array<
    | 'Decoration'
    | 'Food'
    | 'Medicine'
    | 'Air Purification'
    | 'Organic Farming'
    | 'Pet Friendly'
    | 'Fast Growing'
  >;
  budget: 'Low' | 'Medium' | 'High';
};

export type PlantRecommendation = {
  name: string;
  botanicalName: string;
  type: string;
  confidence: number;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  water: string;
  sunlight: string;
  growthTime: string;
  growthSpeed: string;
  expectedHeight: string;
  temperature: string;
  humidity: string;
  soil: string;
  bestSeason: string;
  harvestTime: string;
  yield: string;
  benefits: string[];
  why: string;
  pros: string[];
  challenges: string[];
  careTip: string;
  visual: 'tomato' | 'basil' | 'pepper' | 'marigold' | 'spinach';
  icon: LucideIcon;
};

export type GardenPlan = {
  month: string;
  successRate: number;
  planting: string[];
  weeklyCare: string[];
  watering: string[];
  fertilizer: string[];
  harvest: string[];
};

export type RecommendationResult = {
  featured: PlantRecommendation;
  plants: PlantRecommendation[];
  plan: GardenPlan;
};
