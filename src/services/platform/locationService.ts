import { ApiError, requestJson } from './apiClient';
import { clientEnvironment } from './environment';

export type Coordinates = { latitude: number; longitude: number };
export type GeocodedPlace = Coordinates & { city: string; country: string };

type NominatimResult = {
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
  };
};

function toGeocodedPlace(result: NominatimResult): GeocodedPlace {
  return {
    latitude: Number(result.lat),
    longitude: Number(result.lon),
    city:
      result.address?.city ??
      result.address?.town ??
      result.address?.village ??
      'Selected location',
    country: result.address?.country ?? 'Selected country',
  };
}

export const browserLocationService = {
  async getCurrentPosition(): Promise<Coordinates> {
    if (!navigator.geolocation) {
      throw new ApiError(
        'Location services are not supported in this browser.',
        'NETWORK',
      );
    }
    return new Promise<Coordinates>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            latitude: Number(position.coords.latitude.toFixed(5)),
            longitude: Number(position.coords.longitude.toFixed(5)),
          }),
        () =>
          reject(
            new ApiError(
              'Location permission was denied. You can enter a city instead.',
              'NETWORK',
            ),
          ),
        { enableHighAccuracy: true, timeout: 8_000, maximumAge: 300_000 },
      ),
    );
  },
};

/** Nominatim adapter. A production server proxy can add compliant caching and request headers. */
export const geocodingService = {
  async reverse({ latitude, longitude }: Coordinates): Promise<GeocodedPlace> {
    const query = new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
      format: 'jsonv2',
      addressdetails: '1',
    });
    const result = await requestJson<NominatimResult>(
      `${clientEnvironment.nominatimBaseUrl}/reverse?${query}`,
    );
    return toGeocodedPlace({
      ...result,
      lat: String(latitude),
      lon: String(longitude),
    });
  },

  async search(query: string): Promise<GeocodedPlace[]> {
    const term = query.trim();
    if (!term) return [];
    const params = new URLSearchParams({
      q: term,
      format: 'jsonv2',
      addressdetails: '1',
      limit: '5',
    });
    const results = await requestJson<NominatimResult[]>(
      `${clientEnvironment.nominatimBaseUrl}/search?${params}`,
    );
    return results.map(toGeocodedPlace);
  },
};
