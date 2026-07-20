import { create } from 'zustand';
import type { RecommendationResult, SmartRecommendationInput } from '../types';

type RecommendationState = {
  latestInput?: SmartRecommendationInput;
  latestResult?: RecommendationResult;
  addedPlantIds: string[];
  setRecommendation: (
    input: SmartRecommendationInput,
    result: RecommendationResult,
  ) => void;
  recordAddedPlant: (plantId: string) => void;
};

/** Shared recommendation context for the garden, assistant, analytics, and intelligence hub. */
export const useRecommendationStore = create<RecommendationState>((set) => ({
  addedPlantIds: [],
  setRecommendation: (latestInput, latestResult) =>
    set({ latestInput, latestResult }),
  recordAddedPlant: (plantId) =>
    set((state) => ({
      addedPlantIds: state.addedPlantIds.includes(plantId)
        ? state.addedPlantIds
        : [...state.addedPlantIds, plantId],
    })),
}));
