import type { Coordinates } from '@/services/location';

export type MapView = {
  center: Coordinates;
  zoom: number;
};

export type MapMarker = Coordinates & {
  id: string;
  label: string;
};

export type MapSearchResult = MapMarker & {
  placeName: string;
};
