export type PlantStatus = 'Healthy' | 'Observation' | 'Harvested';
export type GrowthStage =
  'Seedling' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Harvested';
export type ReminderType =
  | 'Watering'
  | 'Fertilizer'
  | 'Pruning'
  | 'Harvest'
  | 'Disease Inspection'
  | 'Repotting';

export type DiaryPlant = {
  id: string;
  name: string;
  category: string;
  variety: string;
  plantingDate: string;
  expectedHarvest: string;
  location: string;
  gardenArea: string;
  potSize: string;
  source: string;
  notes: string;
  visual: 'tomato' | 'basil' | 'jasmine' | 'pepper';
  photoUrl?: string;
  currentStage: GrowthStage;
  healthScore: number;
  height: number;
  status: PlantStatus;
};

export type DiaryEntry = {
  id: string;
  plantId: string;
  date: string;
  photoUrl?: string;
  height: number;
  leafColor: string;
  flowerStatus: string;
  fruitStatus: string;
  soilMoisture: number;
  weatherNotes: string;
  waterGiven: number;
  fertilizerApplied: string;
  pesticideUsed: string;
  growthRating: number;
  healthRating: number;
  personalNotes: string;
  aiAnalysis: string;
  stage: GrowthStage;
};

export type DiaryReminder = {
  id: string;
  plantId?: string;
  title: string;
  type: ReminderType;
  date: string;
  time: string;
  completed: boolean;
};

export type GardenAchievement = {
  id: string;
  title: string;
  description: string;
  icon: 'sprout' | 'leaf' | 'tomato' | 'flower' | 'trophy';
  unlocked: boolean;
};

export type PlantRecordInput = Omit<
  DiaryPlant,
  | 'id'
  | 'visual'
  | 'currentStage'
  | 'healthScore'
  | 'height'
  | 'status'
  | 'photoUrl'
> & { photo?: FileList };
export type DiaryEntryInput = Omit<
  DiaryEntry,
  'id' | 'photoUrl' | 'aiAnalysis' | 'stage'
> & { photo?: FileList };
