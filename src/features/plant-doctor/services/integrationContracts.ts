import type { PlantDoctorAnalysis } from '../types';

export type PlantVisionInput = {
  image: File;
  locale?: string;
  weatherContext?: { temperature: number; humidity: number };
};

/**
 * Provider boundary for Gemini Vision. Keep API keys and provider calls on a future server,
 * then map that response to PlantDoctorAnalysis before it reaches React.
 */
export interface PlantVisionClient {
  analyze(input: PlantVisionInput): Promise<PlantDoctorAnalysis>;
}

/** Optional future enrichment interfaces for specialist plant and weather data. */
export interface PlantIdentificationClient {
  identify(
    image: File,
  ): Promise<{ commonName: string; scientificName: string }>;
}

export interface WeatherContextClient {
  getCurrentConditions(
    latitude: number,
    longitude: number,
  ): Promise<{
    temperature: number;
    humidity: number;
    rainfall: number;
  }>;
}

// Planned adapters: Gemini Vision, Plant.id, PlantNet, and OpenWeather.
