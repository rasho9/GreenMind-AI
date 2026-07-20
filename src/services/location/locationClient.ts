import { browserLocationService, geocodingService } from '@/services/platform';
import type {
  Coordinates,
  LocationPermissionState,
  ResolvedLocation,
} from './types';

/** Browser GPS plus a manual-search fallback. It never blocks a user who declines GPS. */
export const locationClient = {
  async getPermissionStatus(): Promise<LocationPermissionState> {
    if (!navigator.geolocation) return 'unsupported';
    if (!navigator.permissions?.query) return 'prompt';
    try {
      const permission = await navigator.permissions.query({
        name: 'geolocation',
      });
      return permission.state;
    } catch {
      return 'prompt';
    }
  },

  async getCurrentLocation(): Promise<Coordinates> {
    return browserLocationService.getCurrentPosition();
  },

  async reverseGeocode(coordinates: Coordinates): Promise<ResolvedLocation> {
    return geocodingService.reverse(coordinates);
  },

  async searchCity(query: string): Promise<ResolvedLocation[]> {
    return geocodingService.search(query);
  },
};
