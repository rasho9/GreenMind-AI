export type Coordinates = { latitude: number; longitude: number };

export type LocationPermissionState =
  'granted' | 'denied' | 'prompt' | 'unsupported';

export type ResolvedLocation = Coordinates & {
  city: string;
  country: string;
  displayName?: string;
};
