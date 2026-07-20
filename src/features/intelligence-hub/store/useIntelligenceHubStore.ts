import { create } from 'zustand';
import { intelligenceHubService } from '../services/intelligenceHubService';
import type { HubLocation, IntelligenceSnapshot } from '../types';

type IntelligenceHubState = {
  snapshot: IntelligenceSnapshot | null;
  isLoading: boolean;
  error: string;
  load: (location?: HubLocation) => Promise<void>;
};

/** A single client state boundary for the aggregated intelligence snapshot. */
export const useIntelligenceHubStore = create<IntelligenceHubState>((set) => ({
  snapshot: null,
  isLoading: false,
  error: '',
  load: async (location) => {
    set({ isLoading: true, error: '' });
    try {
      set({
        snapshot: await intelligenceHubService.getSnapshot(location),
        isLoading: false,
      });
    } catch {
      set({
        error: 'Intelligence signals could not be refreshed. Please try again.',
        isLoading: false,
      });
    }
  },
}));
