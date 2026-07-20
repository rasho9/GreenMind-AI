type ClientEnvironment = {
  apiBaseUrl?: string;
  liveServicesEnabled: boolean;
  mapTilerApiKey?: string;
  mapTilerStyle: string;
  nominatimBaseUrl: string;
  osmTileUrl: string;
  mapAttribution: string;
};

const env = import.meta.env as Record<string, string | undefined>;

/** Client-safe values only. API keys belong in a server-side environment, never VITE_ variables. */
export const clientEnvironment: ClientEnvironment = {
  apiBaseUrl: env.VITE_API_BASE_URL,
  liveServicesEnabled: env.VITE_ENABLE_LIVE_SERVICES === 'true',
  // MapTiler browser tokens are public by design, but must be restricted to
  // your deployed domains in the MapTiler dashboard. They are not secrets.
  mapTilerApiKey: env.VITE_MAPTILER_API_KEY,
  mapTilerStyle: env.VITE_MAPTILER_STYLE ?? 'streets-v2',
  nominatimBaseUrl:
    env.VITE_NOMINATIM_BASE_URL ?? 'https://nominatim.openstreetmap.org',
  osmTileUrl:
    env.VITE_OSM_TILE_URL ??
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  mapAttribution: env.VITE_OSM_ATTRIBUTION ?? '© OpenStreetMap contributors',
};
