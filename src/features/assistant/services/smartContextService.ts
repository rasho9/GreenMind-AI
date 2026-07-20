import { useGardenDiaryStore } from '@/features/garden-diary/store/useGardenDiaryStore';
import { usePlantDoctorStore } from '@/features/plant-doctor/store/usePlantDoctorStore';
import { useRecommendationStore } from '@/features/recommendations/store/useRecommendationStore';
import { useMarketplaceStore } from '@/features/marketplace/store/useMarketplaceStore';
import type { ContextResolver } from './integrationContracts';

/**
 * Reads live workspace state into the provider-neutral assistant context contract.
 * A server implementation can preserve this shape while resolving authenticated data instead.
 */
export const smartContextService: ContextResolver = {
  async getContext() {
    const diary = useGardenDiaryStore.getState();
    const doctor = usePlantDoctorStore.getState();
    const recommendations = useRecommendationStore.getState();
    const marketplace = useMarketplaceStore.getState();
    const latestScan = doctor.scans[0];
    const openTasks = diary.reminders.filter((reminder) => !reminder.completed);
    return [
      {
        module: 'Plant Doctor',
        label: latestScan ? 'Latest plant screening' : 'Plant health screening',
        detail: latestScan
          ? `${latestScan.analysis.plantName} - ${latestScan.analysis.diseaseName} - ${latestScan.analysis.healthScore}% health`
          : 'No recent screening saved',
        active: Boolean(latestScan),
      },
      {
        module: 'Garden Diary',
        label: 'Garden diary',
        detail: `${diary.plants.length} active plants - ${diary.entries.length} entries - ${openTasks.length} open care tasks`,
        active: diary.plants.length > 0,
      },
      {
        module: 'Weather',
        label: 'Local conditions',
        detail: 'Lahore - warm and humid - summer profile',
        active: true,
      },
      {
        module: 'Plant Recommendations',
        label: recommendations.latestResult
          ? 'Latest recommendation plan'
          : 'Recommendation preferences',
        detail: recommendations.latestResult
          ? `${recommendations.latestResult.plants.length} matches - ${recommendations.addedPlantIds.length} added to Garden Diary`
          : 'No recommendation plan generated yet',
        active: Boolean(recommendations.latestResult),
      },
      {
        module: 'AI Marketplace',
        label: 'AI-matched garden products',
        detail: `${marketplace.wishlistIds.length} saved · ${marketplace.cart.reduce((total, item) => total + item.quantity, 0)} in mock cart · catalog ready for provider integration`,
        active: true,
      },
    ];
  },
};
