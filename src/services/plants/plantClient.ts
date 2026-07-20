import { apiClient } from '@/services/api';
import { requestCache } from '@/services/utils';
import type { PlantProfile, PlantSearchFilters } from './types';

const PLANT_TTL_MS = 60 * 60 * 1_000;

/** Calls the server Perenual adapter; API credentials stay server-side. */
export const plantClient = {
  search(filters: PlantSearchFilters, signal?: AbortSignal) {
    const params = new URLSearchParams({ q: filters.query.trim() });
    if (filters.sunlight) params.set('sunlight', filters.sunlight);
    if (filters.watering) params.set('watering', filters.watering);
    if (filters.indoor !== undefined)
      params.set('indoor', String(filters.indoor));
    const key = `plants:${params.toString()}`;
    return requestCache.getOrLoad(key, PLANT_TTL_MS, () =>
      apiClient.request<PlantProfile[]>(`/api/plants/search?${params}`, {
        timeoutMs: 12_000,
        retryCount: 1,
        signal,
      }),
    );
  },
  getById(id: string, signal?: AbortSignal) {
    const normalizedId = id.trim();
    const key = `plant:${normalizedId}`;
    return requestCache.getOrLoad(key, PLANT_TTL_MS, () =>
      apiClient.request<PlantProfile>(
        `/api/plants/${encodeURIComponent(normalizedId)}`,
        { timeoutMs: 12_000, retryCount: 1, signal },
      ),
    );
  },
};
