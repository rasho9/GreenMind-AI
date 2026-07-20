import type {
  ForecastDay,
  HubLocation,
  IntelligenceInsight,
  SmartRecommendation,
  WeatherCurrent,
} from '../types';

/** Open-Meteo adapter boundary. Fetch server-side where a durable cache and retry policy can live. */
export interface WeatherIntelligenceClient {
  getCurrent(location: HubLocation): Promise<WeatherCurrent>;
  getForecast(location: HubLocation): Promise<ForecastDay[]>;
}

export interface GeolocationIntelligenceClient {
  getCurrentLocation(): Promise<Pick<HubLocation, 'latitude' | 'longitude'>>;
}

export interface GeocodingIntelligenceClient {
  searchCity(query: string): Promise<HubLocation[]>;
}

export interface MapIntelligenceClient {
  getMapUrl(location: HubLocation): Promise<string>;
}

export interface SoilIntelligenceClient {
  getSoilProfile(
    location: HubLocation,
  ): Promise<{ soilType: string; elevation: string }>;
}

/** Server-side GPT-5.6 adapter for proactive insight generation after trusted signals are resolved. */
export interface GardenIntelligenceClient {
  analyze(input: {
    location: HubLocation;
    weather: WeatherCurrent;
    moduleSignals: unknown;
  }): Promise<{
    insights: IntelligenceInsight[];
    recommendations: SmartRecommendation[];
  }>;
}

// Planned providers: OpenAI GPT-5.6, Open-Meteo, browser geolocation, OpenStreetMap / Mapbox,
// and future soil and plant data APIs. Keys and model calls must stay off the client.
