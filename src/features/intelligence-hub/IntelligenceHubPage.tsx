import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  DiseaseRiskForecast,
  GardenHealthCard,
  GrowthPrediction,
  HubHero,
  HubLoading,
  InsightsPanel,
  LocationIntelligence,
  ModuleConnections,
  NotificationsPanel,
  SmartRecommendations,
  WaterIntelligence,
  WeatherPanel,
  WeeklyForecast,
} from './components';
import { useIntelligenceHubStore } from './store/useIntelligenceHubStore';
import type { HubLocation } from './types';
import { useGardenDiaryStore } from '@/features/garden-diary/store/useGardenDiaryStore';
import { usePlantDoctorStore } from '@/features/plant-doctor/store/usePlantDoctorStore';
import { useRecommendationStore } from '@/features/recommendations/store/useRecommendationStore';
import { useMarketplaceStore } from '@/features/marketplace/store/useMarketplaceStore';
import { useAppStore } from '@/store/appStore';
import { AsyncState } from '@/components/ui';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function IntelligenceHubPage() {
  const navigate = useNavigate();
  const { snapshot, isLoading, error, load } = useIntelligenceHubStore();
  const showToast = useAppStore((state) => state.showToast);
  const isOnline = useOnlineStatus();
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!snapshot) void load();
  }, [load, snapshot]);

  useEffect(() => {
    let refreshTimer: number | undefined;
    const scheduleRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(
        () => void load(snapshot?.location),
        160,
      );
    };
    const subscriptions = [
      useGardenDiaryStore.subscribe(scheduleRefresh),
      usePlantDoctorStore.subscribe(scheduleRefresh),
      useRecommendationStore.subscribe(scheduleRefresh),
      useMarketplaceStore.subscribe(scheduleRefresh),
    ];
    return () => {
      window.clearTimeout(refreshTimer);
      subscriptions.forEach((unsubscribe) => unsubscribe());
    };
  }, [load, snapshot?.location]);

  const refresh = () => {
    void load(snapshot?.location);
    setNotice('Refreshing intelligence signals from the connected workspace.');
  };
  const changeLocation = (location: HubLocation) => {
    void load(location);
    setNotice(
      `Refreshing weather and garden intelligence for ${location.city}.`,
    );
  };
  const handleRecommendationAction = (action: string) => {
    if (action.includes('Plant Doctor')) {
      navigate('/plant-doctor');
    } else if (action.includes('recommendation')) {
      navigate('/recommendations');
    } else if (action.includes('soil')) {
      navigate('/plant-library');
    } else if (action.includes('task')) {
      const diary = useGardenDiaryStore.getState();
      const plant = diary.plants[0];
      if (plant) {
        diary.addReminder({
          plantId: plant.id,
          title: action.replace('Create ', ''),
          type: action.toLowerCase().includes('pruning')
            ? 'Pruning'
            : 'Watering',
          date: new Date().toISOString().slice(0, 10),
          time: '08:00',
        });
        showToast(
          'A care task was added to your connected Tasks list.',
          'success',
        );
        navigate('/tasks');
      }
    } else {
      navigate('/tasks');
    }
    setNotice(
      `${action} is now connected to the relevant GreenMind workspace.`,
    );
  };

  if (!snapshot && isLoading) return <HubLoading />;
  if (!snapshot && error) {
    return (
      <AsyncState
        title={isOnline ? 'Intelligence needs a refresh' : 'You are offline'}
        description={error}
        onRetry={() => void load()}
      />
    );
  }
  if (!snapshot) return <HubLoading />;

  return (
    <div className="pb-3">
      <HubHero snapshot={snapshot} isLoading={isLoading} onRefresh={refresh} />
      <AnimatePresence>
        {(notice || error) && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className={`mt-5 rounded-xl border px-4 py-3 text-xs font-semibold leading-5 ${error ? 'border-[#efd0c9] bg-[#fff6f4] text-[#a64f44]' : 'border-brand/15 bg-brand-soft/45 text-brand-dark'}`}
          >
            {error || notice}
          </motion.p>
        )}
      </AnimatePresence>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.04fr_.96fr]">
        <WeatherPanel snapshot={snapshot} />
        <GardenHealthCard health={snapshot.gardenHealth} />
      </section>
      <section className="mt-5">
        <WeeklyForecast forecast={snapshot.forecast} />
      </section>
      <section className="mt-5">
        <LocationIntelligence
          location={snapshot.location}
          onLocationChange={changeLocation}
          onNotice={setNotice}
        />
      </section>

      <section className="mt-9">
        <InsightsPanel insights={snapshot.insights} />
      </section>
      <section className="mt-9">
        <SmartRecommendations
          recommendations={snapshot.recommendations}
          onAction={handleRecommendationAction}
        />
      </section>

      <section className="mt-9 grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <DiseaseRiskForecast risks={snapshot.diseaseRisks} />
        <WaterIntelligence water={snapshot.water} />
      </section>
      <section className="mt-9 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <GrowthPrediction predictions={snapshot.growthPredictions} />
        <NotificationsPanel notifications={snapshot.notifications} />
      </section>
      <section className="mt-9">
        <ModuleConnections connections={snapshot.connections} />
      </section>
      <div className="mt-8 rounded-[18px] border border-brand/15 bg-brand-soft/34 px-5 py-4 text-xs leading-5 text-brand-dark">
        <b>Future-ready intelligence.</b> Weather, map, location, soil, plant,
        and GPT-5.6 analysis are separated behind dedicated service contracts;
        provider data can be added without rewriting this dashboard.
      </div>
    </div>
  );
}
