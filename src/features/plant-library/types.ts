import type { LucideIcon } from 'lucide-react';

export type PlantDifficulty = 'Easy' | 'Moderate' | 'Advanced';

export type Plant = {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  suitability: number;
  difficulty: PlantDifficulty;
  description: string;
  visual: 'tomato' | 'basil' | 'jasmine' | 'lemon' | 'aloe' | 'snake';
  icon: LucideIcon;
  family: string;
  origin: string;
  climate: string;
  countries: string[];
  season: string;
  harvest: string;
  water: string;
  sunlight: string;
  soil: string;
  temperature: string;
  humidity: string;
  fertilizer: string;
  diseases: string[];
  treatment: string;
  pruning: string;
  companions: string[];
  avoid: string[];
  yield: string;
  aiTip: string;
  facts: string[];
  successRate: number;
  growthStages: Array<{ label: string; days: string; description: string }>;
  growthTrend: Array<{ label: string; value: number }>;
  waterSchedule: Array<{ day: string; value: number }>;
};

export type PlantFilters = {
  categories: string[];
  season: string;
  country: string;
  climate: string;
  difficulty: string;
};
