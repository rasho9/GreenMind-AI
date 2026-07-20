export type GardenHealthLevel =
  'Excellent' | 'Good' | 'Average' | 'Needs attention';
export type RiskLevel = 'Low' | 'Moderate' | 'High';
export type InsightTone = 'info' | 'warning' | 'success';

export type HubLocation = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  climateZone: string;
  growingSeason: string;
  soilType: string;
  elevation: string;
};

export type WeatherCurrent = {
  condition: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  airQuality: string;
};

export type ForecastDay = {
  day: string;
  date: string;
  condition: 'sunny' | 'cloudy' | 'rain' | 'storm';
  high: number;
  low: number;
  rainChance: number;
  humidity: number;
};

export type GardenHealth = {
  score: number;
  level: GardenHealthLevel;
  change: number;
  detail: string;
  factors: Array<{ label: string; value: number; detail: string }>;
};

export type IntelligenceInsight = {
  id: string;
  title: string;
  detail: string;
  tone: InsightTone;
  source: string;
};

export type SmartRecommendation = {
  id: string;
  title: string;
  detail: string;
  action: string;
  priority: 'Now' | 'This week' | 'When ready';
};

export type DiseaseRisk = {
  id: string;
  name: string;
  probability: number;
  level: RiskLevel;
  prevention: string;
};

export type WaterIntelligence = {
  todayNeed: number;
  saving: number;
  rainAdjustment: string;
  weeklySchedule: Array<{ day: string; need: number; rain: number }>;
};

export type GrowthPrediction = {
  plantId: string;
  plantName: string;
  currentStage: string;
  nextStage: string;
  floweringTime: string;
  harvestDate: string;
  expectedYield: string;
  confidence: number;
  timeline: Array<{
    label: string;
    status: 'complete' | 'active' | 'upcoming';
  }>;
};

export type IntelligenceNotification = {
  id: string;
  title: string;
  detail: string;
  time: string;
  level: RiskLevel;
};

export type ModuleConnection = {
  module:
    | 'AI Assistant'
    | 'Garden Diary'
    | 'Plant Doctor'
    | 'Plant Library'
    | 'Recommendations'
    | 'AI Marketplace'
    | 'Profile'
    | 'Tasks';
  detail: string;
  status: 'Synced' | 'Ready';
};

/** One computed view model keeps all Intelligence Hub cards in sync. */
export type IntelligenceSnapshot = {
  refreshedAt: string;
  location: HubLocation;
  weather: WeatherCurrent;
  forecast: ForecastDay[];
  gardenHealth: GardenHealth;
  insights: IntelligenceInsight[];
  recommendations: SmartRecommendation[];
  diseaseRisks: DiseaseRisk[];
  water: WaterIntelligence;
  growthPredictions: GrowthPrediction[];
  notifications: IntelligenceNotification[];
  connections: ModuleConnection[];
};
