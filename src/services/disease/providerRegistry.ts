import type { PlantDiseaseProvider } from './types';

/** Provider registry keeps a future vision vendor swap to one file. */
class DiseaseProviderRegistry {
  private providers = new Map<string, PlantDiseaseProvider>();

  register(provider: PlantDiseaseProvider) {
    this.providers.set(provider.id, provider);
  }

  get(providerId: PlantDiseaseProvider['id']) {
    return this.providers.get(providerId);
  }
}

export const diseaseProviderRegistry = new DiseaseProviderRegistry();
