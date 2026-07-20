import { create } from 'zustand';
import type {
  DiaryEntry,
  DiaryEntryInput,
  DiaryPlant,
  DiaryReminder,
  GardenAchievement,
  PlantRecordInput,
} from '../types';

const plants: DiaryPlant[] = [
  {
    id: 'tomato',
    name: 'Cherry Tomato',
    category: 'Vegetable',
    variety: 'Sweet 100',
    plantingDate: '2026-05-18',
    expectedHarvest: '2026-08-09',
    location: 'South balcony',
    gardenArea: 'Container garden',
    potSize: '18 L',
    source: 'Local nursery',
    notes: 'Staked and thriving near the railing.',
    visual: 'tomato',
    currentStage: 'Fruiting',
    healthScore: 92,
    height: 74,
    status: 'Healthy',
  },
  {
    id: 'basil',
    name: 'Genovese Basil',
    category: 'Herb',
    variety: 'Italian Large Leaf',
    plantingDate: '2026-06-10',
    expectedHarvest: '2026-07-28',
    location: 'Kitchen window',
    gardenArea: 'Indoor shelf',
    potSize: '3 L',
    source: 'Seed packet',
    notes: 'Pinched after its third leaf set.',
    visual: 'basil',
    currentStage: 'Vegetative',
    healthScore: 88,
    height: 28,
    status: 'Healthy',
  },
  {
    id: 'jasmine',
    name: 'Arabian Jasmine',
    category: 'Flower',
    variety: 'Maid of Orleans',
    plantingDate: '2026-05-02',
    expectedHarvest: '2026-08-16',
    location: 'East terrace',
    gardenArea: 'Terrace border',
    potSize: '12 L',
    source: 'Cutting',
    notes: 'Needs close attention after heavy rain.',
    visual: 'jasmine',
    currentStage: 'Flowering',
    healthScore: 74,
    height: 51,
    status: 'Observation',
  },
];

const entries: DiaryEntry[] = [
  {
    id: 'entry-1',
    plantId: 'tomato',
    date: '2026-07-16',
    height: 74,
    leafColor: 'Deep green',
    flowerStatus: 'Blooming',
    fruitStatus: 'Small green fruit',
    soilMoisture: 58,
    weatherNotes: 'Bright morning, humid afternoon',
    waterGiven: 650,
    fertilizerApplied: 'Tomato feed',
    pesticideUsed: 'None',
    growthRating: 5,
    healthRating: 5,
    personalNotes: 'Two new flower clusters opened today.',
    aiAnalysis: '',
    stage: 'Fruiting',
  },
  {
    id: 'entry-2',
    plantId: 'basil',
    date: '2026-07-15',
    height: 28,
    leafColor: 'Fresh green',
    flowerStatus: 'No buds',
    fruitStatus: 'Not applicable',
    soilMoisture: 46,
    weatherNotes: 'Warm and clear',
    waterGiven: 320,
    fertilizerApplied: 'None',
    pesticideUsed: 'None',
    growthRating: 4,
    healthRating: 5,
    personalNotes: 'Pinched two tips for pasta tonight.',
    aiAnalysis: '',
    stage: 'Vegetative',
  },
  {
    id: 'entry-3',
    plantId: 'jasmine',
    date: '2026-07-14',
    height: 51,
    leafColor: 'Pale at lower leaves',
    flowerStatus: 'Two open flowers',
    fruitStatus: 'Not applicable',
    soilMoisture: 72,
    weatherNotes: 'Heavy rain overnight',
    waterGiven: 0,
    fertilizerApplied: 'None',
    pesticideUsed: 'None',
    growthRating: 3,
    healthRating: 3,
    personalNotes: 'Lower leaves feel softer after rain.',
    aiAnalysis: '',
    stage: 'Flowering',
  },
  {
    id: 'entry-4',
    plantId: 'tomato',
    date: '2026-07-09',
    height: 63,
    leafColor: 'Green',
    flowerStatus: 'Several flowers',
    fruitStatus: 'First set',
    soilMoisture: 41,
    weatherNotes: 'Sunny and dry',
    waterGiven: 700,
    fertilizerApplied: 'Balanced feed',
    pesticideUsed: 'None',
    growthRating: 4,
    healthRating: 5,
    personalNotes: 'Added a taller support stake.',
    aiAnalysis: '',
    stage: 'Flowering',
  },
];

const reminders: DiaryReminder[] = [
  {
    id: 'reminder-1',
    plantId: 'tomato',
    title: 'Deep water Cherry Tomato',
    type: 'Watering',
    date: '2026-07-18',
    time: '07:30',
    completed: false,
  },
  {
    id: 'reminder-2',
    plantId: 'jasmine',
    title: 'Inspect jasmine drainage',
    type: 'Disease Inspection',
    date: '2026-07-17',
    time: '08:00',
    completed: false,
  },
  {
    id: 'reminder-3',
    plantId: 'basil',
    title: 'Pinch basil tips',
    type: 'Pruning',
    date: '2026-07-20',
    time: '18:00',
    completed: false,
  },
  {
    id: 'reminder-4',
    plantId: 'tomato',
    title: 'Apply fruiting feed',
    type: 'Fertilizer',
    date: '2026-07-23',
    time: '07:30',
    completed: false,
  },
];

const achievements: GardenAchievement[] = [
  {
    id: 'first-plant',
    title: 'First Plant Added',
    description: 'Your garden story has begun.',
    icon: 'sprout',
    unlocked: true,
  },
  {
    id: 'growth-30',
    title: '30 Days Growth',
    description: 'You kept showing up for the small moments.',
    icon: 'leaf',
    unlocked: true,
  },
  {
    id: 'first-harvest',
    title: 'First Harvest',
    description: 'Your first homegrown taste is close.',
    icon: 'tomato',
    unlocked: false,
  },
  {
    id: 'healthy-garden',
    title: 'Healthy Garden',
    description: 'Maintain an 85% health average.',
    icon: 'flower',
    unlocked: true,
  },
  {
    id: 'expert',
    title: 'Garden Expert',
    description: 'Complete 50 diary entries.',
    icon: 'trophy',
    unlocked: false,
  },
];

type DiaryState = {
  plants: DiaryPlant[];
  entries: DiaryEntry[];
  reminders: DiaryReminder[];
  achievements: GardenAchievement[];
  addPlant: (input: PlantRecordInput) => string;
  addEntry: (
    input: DiaryEntryInput,
    analysis: { message: string; stage: DiaryEntry['stage'] },
  ) => void;
  addReminder: (reminder: Omit<DiaryReminder, 'id' | 'completed'>) => void;
  toggleReminder: (id: string) => void;
};

/** Session-level diary state; persist to a user account once the backend is available. */
export const useGardenDiaryStore = create<DiaryState>((set) => ({
  plants,
  entries,
  reminders,
  achievements,
  addPlant: (input) => {
    const id = `plant-${Date.now()}`;
    const normalizedName = input.name.toLowerCase();
    const visual = normalizedName.includes('tomato')
      ? 'tomato'
      : normalizedName.includes('basil')
        ? 'basil'
        : normalizedName.includes('jasmine') ||
            normalizedName.includes('marigold')
          ? 'jasmine'
          : 'pepper';
    set((state) => ({
      plants: [
        ...state.plants,
        {
          id,
          name: input.name,
          category: input.category,
          variety: input.variety,
          plantingDate: input.plantingDate,
          expectedHarvest: input.expectedHarvest,
          location: input.location,
          gardenArea: input.gardenArea,
          potSize: input.potSize,
          source: input.source,
          notes: input.notes,
          visual,
          photoUrl: input.photo?.[0]
            ? URL.createObjectURL(input.photo[0])
            : undefined,
          currentStage: 'Seedling',
          healthScore: 80,
          height: 8,
          status: 'Healthy',
        },
      ],
    }));
    return id;
  },
  addEntry: (input, analysis) =>
    set((state) => ({
      entries: [
        {
          id: `entry-${Date.now()}`,
          plantId: input.plantId,
          date: new Date().toISOString().slice(0, 10),
          photoUrl: input.photo?.[0]
            ? URL.createObjectURL(input.photo[0])
            : undefined,
          height: input.height,
          leafColor: input.leafColor,
          flowerStatus: input.flowerStatus,
          fruitStatus: input.fruitStatus,
          soilMoisture: input.soilMoisture,
          weatherNotes: input.weatherNotes,
          waterGiven: input.waterGiven,
          fertilizerApplied: input.fertilizerApplied,
          pesticideUsed: input.pesticideUsed,
          growthRating: input.growthRating,
          healthRating: input.healthRating,
          personalNotes: input.personalNotes,
          aiAnalysis: analysis.message,
          stage: analysis.stage,
        },
        ...state.entries,
      ],
      plants: state.plants.map((plant) =>
        plant.id === input.plantId
          ? {
              ...plant,
              height: input.height,
              healthScore: input.healthRating * 20,
              currentStage: analysis.stage,
              status: input.healthRating <= 3 ? 'Observation' : 'Healthy',
            }
          : plant,
      ),
    })),
  addReminder: (reminder) =>
    set((state) => ({
      reminders: [
        ...state.reminders,
        { ...reminder, id: `reminder-${Date.now()}`, completed: false },
      ],
    })),
  toggleReminder: (id) =>
    set((state) => ({
      reminders: state.reminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder,
      ),
    })),
}));
