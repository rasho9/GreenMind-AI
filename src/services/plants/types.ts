/** Provider-neutral plant record. New plant APIs must be parsed into this shape. */
export type PlantProfile = {
  id: string;
  commonName: string;
  scientificName: string;
  imageUrl?: string;
  description?: string;
  family?: string;
  origin?: string;
  idealClimate?: string;
  idealTemperature?: string;
  idealSoil?: string;
  waterRequirement?: string;
  sunlight?: string;
  humidity?: string;
  growingSeason?: string;
  harvestTime?: string;
  fertilizer?: string;
  category?: string;
  indoor?: boolean;
  diseases: string[];
  medicines: string[];
  growthDifficulty?: string;
  companionPlants: string[];
};

export type PlantSearchFilters = {
  query: string;
  sunlight?: string;
  watering?: string;
  indoor?: boolean;
};
