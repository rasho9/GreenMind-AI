import { useAssistantStore } from '@/features/assistant/store/useAssistantStore';
import { useGardenDiaryStore } from '@/features/garden-diary/store/useGardenDiaryStore';
import { usePlantLibraryStore } from '@/features/plant-library/store/usePlantLibraryStore';
import { usePlantDoctorStore } from '@/features/plant-doctor/store/usePlantDoctorStore';
import { useRecommendationStore } from '@/features/recommendations/store/useRecommendationStore';
import { useMarketplaceStore } from '@/features/marketplace/store/useMarketplaceStore';
import { clientEnvironment } from '@/services/platform';
import { weatherClient } from '@/services/weather';
import type { GeocodedPlace } from '@/services/platform/locationService';
import type { IntelligenceSnapshot, HubLocation } from '../types';

const pause = (milliseconds: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

const defaultLocation: HubLocation = {
  city: 'Lahore',
  country: 'Pakistan',
  latitude: 31.5204,
  longitude: 74.3587,
  climateZone: 'Humid subtropical',
  growingSeason: 'Monsoon summer',
  soilType: 'Loamy garden mix',
  elevation: '217 m',
};

export function toHubLocation(place: GeocodedPlace): HubLocation {
  return {
    city: place.city,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
    climateZone: 'Local climate profile',
    growingSeason: 'Seasonal conditions',
    soilType: 'Not assessed',
    elevation: 'Not assessed',
  };
}

function healthLevel(
  score: number,
): IntelligenceSnapshot['gardenHealth']['level'] {
  if (score >= 92) return 'Excellent';
  if (score >= 82) return 'Good';
  if (score >= 68) return 'Average';
  return 'Needs attention';
}

/**
 * Aggregates the connected workspace. In live mode weather is authoritative:
 * provider errors propagate to the UI rather than being disguised as fixture data.
 */
export const intelligenceHubService = {
  async getSnapshot(
    location: HubLocation = defaultLocation,
  ): Promise<IntelligenceSnapshot> {
    await pause(240);
    const diary = useGardenDiaryStore.getState();
    const doctor = usePlantDoctorStore.getState();
    const library = usePlantLibraryStore.getState();
    const assistant = useAssistantStore.getState();
    const recommendations = useRecommendationStore.getState();
    const marketplace = useMarketplaceStore.getState();
    const averagePlantHealth = Math.round(
      diary.plants.reduce((total, plant) => total + plant.healthScore, 0) /
        Math.max(diary.plants.length, 1),
    );
    const doctorHealth = Math.round(
      doctor.scans.reduce(
        (total, scan) => total + scan.analysis.healthScore,
        0,
      ) / Math.max(doctor.scans.length, 1),
    );
    const completedTasks = diary.reminders.filter(
      (reminder) => reminder.completed,
    ).length;
    const taskCompletion = Math.round(
      (completedTasks / Math.max(diary.reminders.length, 1)) * 100,
    );
    const healthScore = Math.round(
      averagePlantHealth * 0.45 +
        doctorHealth * 0.15 +
        taskCompletion * 0.1 +
        10 +
        18,
    );
    const liveWeather = clientEnvironment.liveServicesEnabled
      ? await weatherClient.getForecast(location.latitude, location.longitude)
      : undefined;
    const fallbackTemperature =
      location.city === 'Dubai'
        ? 39
        : location.city === 'London'
          ? 20
          : location.city === 'Gilgit'
            ? 24
            : location.city === 'Tokyo'
              ? 29
              : 31;
    const fallbackHumidity =
      location.city === 'Dubai'
        ? 48
        : location.city === 'Gilgit'
          ? 45
          : location.city === 'Tokyo'
            ? 72
            : 68;
    const fallbackRainfall =
      location.city === 'Dubai' ? 0 : location.city === 'Gilgit' ? 4 : 18;
    // Fixtures exist only for an explicitly disabled local/demo integration.
    // `liveWeather` is required whenever the live-services flag is enabled.
    const temperature = liveWeather
      ? liveWeather.current.temperature
      : fallbackTemperature;
    const humidity = liveWeather ? liveWeather.current.humidity : fallbackHumidity;
    const rainfall = liveWeather ? liveWeather.current.rainfall : fallbackRainfall;
    const tomato =
      diary.plants.find((plant) => plant.id === 'tomato') ?? diary.plants[0];

    return {
      refreshedAt: 'Just now',
      location,
      weather: {
        condition:
          liveWeather?.current.condition ??
          (humidity >= 70 ? 'Clouds building' : 'Partly cloudy'),
        temperature,
        feelsLike: liveWeather?.current.feelsLike ?? temperature + 2,
        humidity,
        rainfall,
        windSpeed: liveWeather?.current.windSpeed ?? 14,
        uvIndex: liveWeather?.current.uvIndex ?? (temperature >= 30 ? 8 : 5),
        sunrise: liveWeather?.current.sunrise ?? '05:12',
        sunset: liveWeather?.current.sunset ?? '19:19',
        airQuality: 'Moderate',
      },
      forecast: liveWeather
        ? liveWeather.daily.map((day, index) => ({
            ...day,
            day:
              index === 0
                ? 'Today'
                : new Intl.DateTimeFormat('en', { weekday: 'short' }).format(
                    new Date(`${day.date}T12:00:00`),
                  ),
            date: new Intl.DateTimeFormat('en', {
              day: '2-digit',
              month: 'short',
            }).format(new Date(`${day.date}T12:00:00`)),
          }))
        : [
            {
              day: 'Today',
              date: '16 Jul',
              condition: 'cloudy',
              high: temperature,
              low: temperature - 7,
              rainChance: 24,
              humidity,
            },
            {
              day: 'Fri',
              date: '17 Jul',
              condition: 'sunny',
              high: temperature + 3,
              low: temperature - 6,
              rainChance: 12,
              humidity: Math.max(44, humidity - 5),
            },
            {
              day: 'Sat',
              date: '18 Jul',
              condition: 'storm',
              high: temperature + 1,
              low: temperature - 5,
              rainChance: 68,
              humidity: Math.min(86, humidity + 10),
            },
            {
              day: 'Sun',
              date: '19 Jul',
              condition: 'rain',
              high: temperature - 2,
              low: temperature - 8,
              rainChance: 56,
              humidity: Math.min(84, humidity + 6),
            },
            {
              day: 'Mon',
              date: '20 Jul',
              condition: 'cloudy',
              high: temperature - 1,
              low: temperature - 8,
              rainChance: 30,
              humidity: Math.min(80, humidity + 2),
            },
            {
              day: 'Tue',
              date: '21 Jul',
              condition: 'sunny',
              high: temperature + 2,
              low: temperature - 6,
              rainChance: 14,
              humidity: Math.max(45, humidity - 4),
            },
            {
              day: 'Wed',
              date: '22 Jul',
              condition: 'sunny',
              high: temperature + 3,
              low: temperature - 5,
              rainChance: 10,
              humidity: Math.max(43, humidity - 7),
            },
          ],
      gardenHealth: {
        score: healthScore,
        level: healthLevel(healthScore),
        change: 4,
        detail: `${diary.plants.length} active plants, ${doctor.scans.length} recent health screenings, and ${diary.reminders.length - completedTasks} open care tasks inform this signal.`,
        factors: [
          {
            label: 'Plant diary',
            value: averagePlantHealth,
            detail: 'Latest logged health scores',
          },
          {
            label: 'Disease reports',
            value: doctorHealth,
            detail: 'Recent Plant Doctor screenings',
          },
          {
            label: 'Weather readiness',
            value: 84,
            detail: 'Heat and rain context',
          },
          {
            label: 'Care completion',
            value: Math.max(taskCompletion, 56),
            detail: 'Scheduled tasks completed',
          },
        ],
      },
      insights: [
        {
          id: 'heat',
          title: 'Tomorrow will be hotter than usual',
          detail: `The forecast reaches ${temperature + 3}°C. Water containers before 8 AM and protect young foliage from the harshest midday sun.`,
          tone: 'warning',
          source: 'Weather intelligence',
        },
        {
          id: 'fungal',
          title: 'Fungal disease risk is elevated this week',
          detail:
            'Humidity and your recent Early Blight screening make leaf dryness and airflow the priority.',
          tone: 'warning',
          source: 'Plant Doctor + weather',
        },
        {
          id: 'fertilizer',
          title: 'Delay high-nitrogen fertilizer',
          detail:
            'Wait until the tomato foliage has settled, then return to a measured balanced feed.',
          tone: 'info',
          source: 'Plant Doctor',
        },
        {
          id: 'harvest',
          title: 'Tomato fruiting is on track',
          detail:
            'Your diary shows active fruiting. Check the next flower clusters and remove only clearly affected leaves.',
          tone: 'success',
          source: 'Garden Diary',
        },
      ],
      recommendations: [
        {
          id: 'basil',
          title: 'Plant basil this week',
          detail:
            'A warm, bright window or balcony edge supports a fast, beginner-friendly herb cycle.',
          action: 'Open plant recommendation',
          priority: 'This week',
        },
        {
          id: 'water',
          title: 'Reduce watering after Saturday rain',
          detail:
            'Use a morning soil check after the forecasted rain rather than following a fixed container schedule.',
          action: 'Review water plan',
          priority: 'Now',
        },
        {
          id: 'rose',
          title: 'Prune crowded rose growth',
          detail:
            'A light clean-up improves airflow before the humid part of the forecast arrives.',
          action: 'Create pruning task',
          priority: 'This week',
        },
        {
          id: 'compost',
          title: 'Apply a thin compost layer',
          detail:
            'A light top-dress helps retain moisture and supports the soil surface without overfeeding.',
          action: 'View soil guide',
          priority: 'When ready',
        },
        {
          id: 'leaf',
          title: 'Monitor lower tomato leaves',
          detail:
            'Look for new rings or spotting during the next five days and log changes in your diary.',
          action: 'Open Plant Doctor',
          priority: 'Now',
        },
        {
          id: 'indoor',
          title: 'Rotate indoor plants toward light',
          detail:
            'Turn leafy plants a quarter turn this week for even growth near the window.',
          action: 'Create care task',
          priority: 'This week',
        },
      ],
      diseaseRisks: [
        {
          id: 'powdery',
          name: 'Powdery Mildew',
          probability: 52,
          level: 'Moderate',
          prevention:
            'Increase spacing and avoid late-evening overhead watering.',
        },
        {
          id: 'leaf-spot',
          name: 'Leaf Spot',
          probability: 64,
          level: 'High',
          prevention:
            'Keep tomato foliage dry and remove fallen leaves promptly.',
        },
        {
          id: 'root-rot',
          name: 'Root Rot',
          probability: 28,
          level: 'Low',
          prevention:
            'Check drainage after weekend rain before watering again.',
        },
        {
          id: 'heat-stress',
          name: 'Heat Stress',
          probability: 58,
          level: 'Moderate',
          prevention:
            'Water early and shade young or recently transplanted plants.',
        },
      ],
      water: {
        todayNeed: 72,
        saving: 18,
        rainAdjustment:
          'Saturday rain could replace one container watering cycle.',
        weeklySchedule: [
          { day: 'Thu', need: 72, rain: 0 },
          { day: 'Fri', need: 82, rain: 0 },
          { day: 'Sat', need: 34, rain: 68 },
          { day: 'Sun', need: 28, rain: 56 },
          { day: 'Mon', need: 48, rain: 30 },
          { day: 'Tue', need: 74, rain: 0 },
          { day: 'Wed', need: 80, rain: 0 },
        ],
      },
      growthPredictions: tomato
        ? [
            {
              plantId: tomato.id,
              plantName: tomato.name,
              currentStage: tomato.currentStage,
              nextStage: 'Ripening',
              floweringTime: '5-8 days for new clusters',
              harvestDate: tomato.expectedHarvest,
              expectedYield: '1.8-2.4 kg',
              confidence: 88,
              timeline: [
                { label: 'Vegetative', status: 'complete' },
                { label: 'Flowering', status: 'complete' },
                { label: 'Fruiting', status: 'active' },
                { label: 'Ripening', status: 'upcoming' },
                { label: 'Harvest', status: 'upcoming' },
              ],
            },
          ]
        : [],
      notifications: [
        {
          id: 'rain',
          title: 'Heavy rain expected Saturday',
          detail: 'Skip planned container watering if soil remains moist.',
          time: 'Forecast · 2 days',
          level: 'Moderate',
        },
        {
          id: 'disease',
          title: 'Possible disease signal needs a check',
          detail:
            'Review lower tomato leaves before the humid weather arrives.',
          time: 'Plant Doctor · today',
          level: 'High',
        },
        {
          id: 'harvest',
          title: 'Fruit set is progressing',
          detail: 'Your tomato is moving steadily through its fruiting stage.',
          time: 'Garden Diary · today',
          level: 'Low',
        },
      ],
      connections: [
        {
          module: 'AI Assistant',
          detail: `${assistant.conversations.length} conversations available for context`,
          status: 'Synced',
        },
        {
          module: 'Garden Diary',
          detail: `${diary.plants.length} plant records and ${diary.entries.length} entries`,
          status: 'Synced',
        },
        {
          module: 'Plant Doctor',
          detail: `${doctor.scans.length} recent visual screenings`,
          status: 'Synced',
        },
        {
          module: 'Plant Library',
          detail: `${library.favorites.length} favorites and ${library.bookmarks.length} bookmarks`,
          status: 'Synced',
        },
        {
          module: 'Recommendations',
          detail: recommendations.latestResult
            ? `${recommendations.latestResult.plants.length} recommended plants and ${recommendations.addedPlantIds.length} added to Garden Diary`
            : 'Growing preferences ready when a plan is generated',
          status: recommendations.latestResult ? 'Synced' : 'Ready',
        },
        {
          module: 'AI Marketplace',
          detail: `${marketplace.wishlistIds.length} saved products and ${marketplace.cart.reduce((total, item) => total + item.quantity, 0)} items in mock cart`,
          status: 'Synced',
        },
        {
          module: 'Profile',
          detail: 'Location and garden preferences available',
          status: 'Ready',
        },
        {
          module: 'Tasks',
          detail: `${diary.reminders.length - completedTasks} care tasks due next`,
          status: 'Synced',
        },
      ],
    };
  },
};
