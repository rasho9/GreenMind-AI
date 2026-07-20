import { useGardenDiaryStore } from '@/features/garden-diary/store/useGardenDiaryStore';
import { useRecommendationStore } from '@/features/recommendations/store/useRecommendationStore';
import type {
  PlantRecommendation,
  SmartRecommendationInput,
} from '@/features/recommendations/types';
import type { PlantScan } from '@/features/plant-doctor/types';
import { useAppStore } from '@/store/appStore';

const dateInDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const reminderDate = () => dateInDays(2);

/**
 * Coordinates local feature stores until authenticated backend events are available.
 * Each method is intentionally deterministic and idempotent around duplicate plant names.
 */
export const workspaceIntegrationService = {
  addRecommendedPlant(
    recommendation: PlantRecommendation,
    context: SmartRecommendationInput,
  ) {
    const diary = useGardenDiaryStore.getState();
    const existing = diary.plants.find(
      (plant) => plant.name.toLowerCase() === recommendation.name.toLowerCase(),
    );
    if (existing) {
      return { plantId: existing.id, alreadyAdded: true };
    }

    const plantId = diary.addPlant({
      name: recommendation.name,
      category: recommendation.type,
      variety: recommendation.botanicalName,
      plantingDate: new Date().toISOString().slice(0, 10),
      expectedHarvest: dateInDays(75),
      location: context.city
        ? `${context.space} in ${context.city}`
        : context.space,
      gardenArea: context.space,
      potSize:
        context.space === 'Farm' || context.space === 'Garden'
          ? 'Garden bed'
          : '12 L container',
      source: 'GreenMind AI recommendation',
      notes: `AI match ${recommendation.confidence}%. ${recommendation.why}`,
    });
    diary.addReminder({
      plantId,
      title: `Check moisture for ${recommendation.name}`,
      type: 'Watering',
      date: reminderDate(),
      time: '07:30',
    });
    diary.addReminder({
      plantId,
      title: `Review ${recommendation.name} growth plan`,
      type: 'Fertilizer',
      date: dateInDays(14),
      time: '08:00',
    });
    useRecommendationStore.getState().recordAddedPlant(plantId);
    useAppStore.getState().addNotification({
      title: `${recommendation.name} joined Garden Diary`,
      detail: 'A first watering check and growth-plan review are now in Tasks.',
      time: 'Just now',
      type: 'recommendation',
    });
    return { plantId, alreadyAdded: false };
  },

  syncDoctorScanToDiary(scan: PlantScan) {
    const diary = useGardenDiaryStore.getState();
    const scanName = scan.analysis.plantName.toLowerCase();
    const matchedPlant = diary.plants.find((plant) => {
      const plantName = plant.name.toLowerCase();
      return (
        scanName.includes(plantName) ||
        plantName.includes(scanName) ||
        scanName
          .split(/\s+/)
          .some((token) => token.length > 3 && plantName.includes(token))
      );
    });
    const addedToDiary = !matchedPlant;
    const plantId =
      matchedPlant?.id ??
      diary.addPlant({
        name: scan.analysis.plantName,
        category: 'Plant Doctor import',
        variety: scan.analysis.scientificName,
        plantingDate: new Date().toISOString().slice(0, 10),
        expectedHarvest: '',
        location: 'Plant Doctor scan',
        gardenArea: 'Unassigned',
        potSize: 'Not recorded',
        source: 'GreenMind AI Plant Doctor',
        notes: `Imported from a visual screening: ${scan.analysis.diseaseName}. ${scan.analysis.description}`,
      });
    const alreadyScheduled = diary.reminders.some(
      (reminder) =>
        reminder.plantId === plantId &&
        reminder.title.includes('Plant Doctor follow-up') &&
        !reminder.completed,
    );
    if (!alreadyScheduled) {
      diary.addReminder({
        plantId,
        title: `Plant Doctor follow-up: ${scan.analysis.plantName}`,
        type: 'Disease Inspection',
        date: reminderDate(),
        time: '08:00',
      });
    }
    useAppStore.getState().addNotification({
      title: addedToDiary
        ? `${scan.analysis.plantName} added to Garden Diary`
        : `${scan.analysis.diseaseName} follow-up scheduled`,
      detail: addedToDiary
        ? 'The screening and its next inspection are now connected to Garden Diary and Tasks.'
        : `A Plant Doctor inspection task was added for ${scan.analysis.plantName}.`,
      time: 'Just now',
      type: 'health',
    });
    return { plantId, addedToDiary, reminderScheduled: !alreadyScheduled };
  },
};
