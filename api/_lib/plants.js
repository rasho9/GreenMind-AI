function firstString(value) {
  if (Array.isArray(value)) return firstString(value[0]);
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function stringList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === 'string' && item.trim())
    .map((item) => item.trim())
    .slice(0, 12);
}

/** Maps Perenual list and detail payloads into the client-safe provider contract. */
export function normalizePlant(item) {
  const hardiness = item?.hardiness;
  const minHardiness = firstString(hardiness?.min);
  const maxHardiness = firstString(hardiness?.max);
  return {
    id: String(item?.id ?? ''),
    commonName: firstString(item?.common_name) ?? 'Unnamed plant',
    scientificName:
      firstString(item?.scientific_name) ?? 'Scientific name unavailable',
    imageUrl:
      firstString(item?.default_image?.regular_url) ??
      firstString(item?.default_image?.medium_url) ??
      firstString(item?.default_image?.thumbnail),
    description: firstString(item?.description),
    family: firstString(item?.family),
    origin: firstString(item?.origin),
    idealClimate:
      minHardiness && maxHardiness
        ? `Hardiness zones ${minHardiness}-${maxHardiness}`
        : undefined,
    idealTemperature: firstString(item?.hardiness_location?.full_url),
    idealSoil: firstString(item?.soil),
    waterRequirement: firstString(item?.watering),
    sunlight: stringList(item?.sunlight).join(', ') || undefined,
    humidity: firstString(item?.humidity),
    growingSeason:
      firstString(item?.flowering_season) ?? firstString(item?.cycle),
    harvestTime: firstString(item?.harvest_season),
    fertilizer: firstString(item?.fertilizer),
    growthDifficulty: firstString(item?.care_level),
    category: firstString(item?.type),
    indoor: typeof item?.indoor === 'boolean' ? item.indoor : undefined,
    diseases: stringList(item?.pest_susceptibility),
    medicines: [],
    companionPlants: stringList(item?.companion_plants),
  };
}
