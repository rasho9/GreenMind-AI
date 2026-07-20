import { useAssistantStore } from '@/features/assistant/store/useAssistantStore';
import { useGardenDiaryStore } from '@/features/garden-diary/store/useGardenDiaryStore';
import { plantCatalog } from '@/features/plant-library/services/plantLibraryService';
import { usePlantDoctorStore } from '@/features/plant-doctor/store/usePlantDoctorStore';
import { useRecommendationStore } from '@/features/recommendations/store/useRecommendationStore';
import { marketplaceCatalog } from '@/features/marketplace/services/marketplaceService';
import { useAppStore } from '@/store/appStore';
import { ClientRateLimitError, clientRateLimiter } from '@/services/security';

export type SearchResult = {
  id: string;
  title: string;
  detail: string;
  type:
    | 'Plant'
    | 'Diary'
    | 'AI chat'
    | 'Disease scan'
    | 'Recommendation'
    | 'Task'
    | 'Notification'
    | 'Profile'
    | 'Support'
    | 'Marketplace';
  path: string;
  keywords: string;
};

export function searchGreenMind(query: string): SearchResult[] {
  try {
    clientRateLimiter.consume('global-search', 90, 60_000);
  } catch (error) {
    if (error instanceof ClientRateLimitError) {
      return [
        {
          id: 'search-rate-limited',
          title: 'Search is taking a short pause',
          detail: `Try again in ${error.retryAfterSeconds} seconds.`,
          type: 'Support',
          path: '/rate-limited',
          keywords: 'rate limited',
        },
      ];
    }
    return [];
  }
  const normalized = query.trim().toLowerCase();
  if (!normalized)
    return [
      {
        id: 'quick-plants',
        title: 'Plant Library',
        detail: 'Search care guides, climate, season, and categories',
        type: 'Plant',
        path: '/plant-library',
        keywords: 'plants scientific climate country category season',
      },
      {
        id: 'quick-assistant',
        title: 'Ask GreenMind AI',
        detail: 'Start a context-aware garden conversation',
        type: 'AI chat',
        path: '/assistant',
        keywords: 'ai chats assistant recommendations',
      },
      {
        id: 'quick-intelligence',
        title: 'AI Intelligence Hub',
        detail: 'Weather, health alerts, and recommendations',
        type: 'Recommendation',
        path: '/intelligence-hub',
        keywords: 'weather location garden recommendations',
      },
      {
        id: 'quick-marketplace',
        title: 'AI Marketplace',
        detail: 'AI-matched garden products and treatment kits',
        type: 'Marketplace',
        path: '/marketplace',
        keywords: 'marketplace products fertilizer fungicide soil tools cart',
      },
    ];
  const diary = useGardenDiaryStore.getState();
  const doctor = usePlantDoctorStore.getState();
  const assistant = useAssistantStore.getState();
  const recommendations = useRecommendationStore.getState();
  const app = useAppStore.getState();
  const items: SearchResult[] = [
    ...plantCatalog.map((plant) => ({
      id: `plant-${plant.id}`,
      title: plant.name,
      detail: `${plant.scientificName} · ${plant.category} · ${plant.climate}`,
      type: 'Plant' as const,
      path: `/plant-library/${plant.id}`,
      keywords: `${plant.name} ${plant.scientificName} ${plant.category} ${plant.climate} ${plant.countries.join(' ')} ${plant.season}`,
    })),
    ...marketplaceCatalog.map((product) => ({
      id: `marketplace-${product.id}`,
      title: product.name,
      detail: `${product.category} · ${product.aiMatch}% AI match`,
      type: 'Marketplace' as const,
      path: `/marketplace/product/${product.id}`,
      keywords: `${product.name} ${product.brand} ${product.category} ${product.description} ${product.aiReason} ${product.tags.join(' ')} ${product.suitablePlants.join(' ')}`,
    })),
    ...diary.plants.map((plant) => ({
      id: `diary-${plant.id}`,
      title: plant.name,
      detail: `${plant.currentStage} · ${plant.location} · diary record`,
      type: 'Diary' as const,
      path: `/garden-diary/${plant.id}`,
      keywords: `${plant.name} ${plant.category} ${plant.location} ${plant.currentStage} garden diary`,
    })),
    ...doctor.scans.map((scan) => ({
      id: `scan-${scan.id}`,
      title: `${scan.analysis.plantName}: ${scan.analysis.diseaseName}`,
      detail: `${scan.analysis.healthScore}% health · ${scan.date}`,
      type: 'Disease scan' as const,
      path: '/plant-doctor',
      keywords: `${scan.analysis.plantName} ${scan.analysis.diseaseName} disease health scan ${scan.analysis.status}`,
    })),
    ...assistant.conversations.map((conversation) => ({
      id: `chat-${conversation.id}`,
      title: conversation.title,
      detail: `${conversation.messages.length} messages · ${conversation.updatedAt}`,
      type: 'AI chat' as const,
      path: '/assistant',
      keywords: `${conversation.title} ${conversation.messages.map((message) => message.content).join(' ')} ai chat`,
    })),
    ...diary.reminders.map((reminder) => ({
      id: `task-${reminder.id}`,
      title: reminder.title,
      detail: `${reminder.type} - ${reminder.date} at ${reminder.time}`,
      type: 'Task' as const,
      path: '/tasks',
      keywords: `${reminder.title} ${reminder.type} ${reminder.date} task reminder care`,
    })),
    ...app.notifications.map((notification) => ({
      id: `notification-${notification.id}`,
      title: notification.title,
      detail: notification.detail,
      type: 'Notification' as const,
      path:
        notification.type === 'health'
          ? '/plant-doctor'
          : notification.type === 'task'
            ? '/tasks'
            : '/intelligence-hub',
      keywords: `${notification.title} ${notification.detail} ${notification.type} notification alert`,
    })),
    ...(recommendations.latestResult?.plants.map((plant) => ({
      id: `recommendation-${plant.name}`,
      title: `${plant.name} recommendation`,
      detail: `${plant.confidence}% match - ${plant.bestSeason}`,
      type: 'Recommendation' as const,
      path: '/recommendations',
      keywords: `${plant.name} ${plant.botanicalName} ${plant.type} ${plant.bestSeason} recommendation`,
    })) ?? []),
    {
      id: 'recommendations',
      title: 'AI Plant Recommendations',
      detail: 'Personalized plants for climate, season, and space',
      type: 'Recommendation',
      path: '/recommendations',
      keywords: 'recommend plant city climate country season balcony farm',
    },
    {
      id: 'marketplace',
      title: 'AI Marketplace',
      detail: 'Discover context-aware products, kits, and garden tools',
      type: 'Marketplace',
      path: '/marketplace',
      keywords:
        'marketplace shopping cart product fertilizer fungicide organic kit',
    },
    {
      id: 'profile-settings',
      title: 'Profile and Settings',
      detail: 'Profile, privacy, language, notifications, and connected APIs',
      type: 'Profile',
      path: '/settings',
      keywords:
        'profile settings privacy language units api account export delete',
    },
    {
      id: 'security-center',
      title: 'Security Center',
      detail: 'Password, two-factor authentication, devices, and sessions',
      type: 'Profile',
      path: '/settings/security',
      keywords:
        'security password two factor authentication 2fa sessions devices login history trusted logout privacy',
    },
    {
      id: 'help-center',
      title: 'Help Center',
      detail: 'Quick start, FAQs, documentation, and AI growing tips',
      type: 'Support',
      path: '/help',
      keywords: 'help support faq documentation quick start contact ai tips',
    },
  ];
  return items
    .filter((item) =>
      `${item.title} ${item.detail} ${item.keywords}`
        .toLowerCase()
        .includes(normalized),
    )
    .slice(0, 8);
}
