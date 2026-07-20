import { clientEnvironment } from '@/services/platform';
import type { Coordinates } from '@/services/location';
import { ProviderError, requestCache } from '@/services/utils';
import type { MapSearchResult, MapView } from './types';

type MapTilerFeature = {
  id?: string | number;
  place_name?: string;
  text?: string;
  center?: [number, number];
};

type MapTilerFeatureCollection = { features?: MapTilerFeature[] };

function toMapSearchResult(
  feature: MapTilerFeature,
  fallbackId: string,
): MapSearchResult | null {
  if (!feature.center) return null;
  return {
    id: String(feature.id ?? fallbackId),
    latitude: feature.center[1],
    longitude: feature.center[0],
    label: feature.text ?? feature.place_name ?? 'Selected location',
    placeName: feature.place_name ?? feature.text ?? 'Selected location',
  };
}

/**
 * Browser-map configuration. MapTiler tokens are designed for browser use but
 * must be restricted by allowed domain in the MapTiler dashboard.
 */
export const mapTilerClient = {
  isConfigured() {
    return Boolean(clientEnvironment.mapTilerApiKey);
  },
  getConfig() {
    return {
      apiKey: clientEnvironment.mapTilerApiKey,
      style: clientEnvironment.mapTilerStyle,
    };
  },
  getInitialView(center: Coordinates, zoom = 12): MapView {
    return { center, zoom };
  },
  async search(
    query: string,
    signal?: AbortSignal,
  ): Promise<MapSearchResult[]> {
    const term = query.trim();
    const { apiKey } = this.getConfig();
    if (!term || !apiKey) return [];
    return requestCache.getOrLoad(
      `map-search:${term.toLowerCase()}`,
      10 * 60 * 1_000,
      async () => {
        const response = await fetch(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(term)}.json?key=${encodeURIComponent(apiKey)}`,
          { signal, headers: { Accept: 'application/json' } },
        );
        if (!response.ok) {
          throw new ProviderError(
            'Map search is unavailable. Check the MapTiler key and its allowed domains.',
            response.status === 403 ? 'FORBIDDEN' : 'NETWORK',
            response.status,
          );
        }
        const payload = (await response.json()) as MapTilerFeatureCollection;
        return (payload.features ?? [])
          .slice(0, 5)
          .map((feature, index) =>
            toMapSearchResult(feature, `result-${index}`),
          )
          .filter((result): result is MapSearchResult => result !== null);
      },
    );
  },
  async reverse(
    coordinates: Coordinates,
    signal?: AbortSignal,
  ): Promise<MapSearchResult | null> {
    const { apiKey } = this.getConfig();
    if (!apiKey) return null;
    const cacheKey = `map-reverse:${coordinates.latitude.toFixed(4)}:${coordinates.longitude.toFixed(4)}`;
    return requestCache.getOrLoad(cacheKey, 10 * 60 * 1_000, async () => {
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${coordinates.longitude},${coordinates.latitude}.json?key=${encodeURIComponent(apiKey)}`,
        { signal, headers: { Accept: 'application/json' } },
      );
      if (!response.ok) {
        throw new ProviderError(
          'Map reverse geocoding is unavailable.',
          response.status === 403 ? 'FORBIDDEN' : 'NETWORK',
          response.status,
        );
      }
      const payload = (await response.json()) as MapTilerFeatureCollection;
      const feature = payload.features?.[0];
      return feature ? toMapSearchResult(feature, 'reverse-result') : null;
    });
  },
};
