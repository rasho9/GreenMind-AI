import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  RecommendationHero,
  RecommendationResults,
  SmartRecommendationForm,
} from './components';
import { recommendationService } from './services/recommendationService';
import type { RecommendationResult, SmartRecommendationInput } from './types';
import { useAppStore } from '@/store/appStore';
import { useRecommendationStore } from './store/useRecommendationStore';
import { workspaceIntegrationService } from '@/services/workspaceIntegrationService';

export function RecommendationsPage() {
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [latestInput, setLatestInput] =
    useState<SmartRecommendationInput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useAppStore((state) => state.showToast);
  const setRecommendation = useRecommendationStore(
    (state) => state.setRecommendation,
  );
  const generateRecommendations = async (values: SmartRecommendationInput) => {
    setIsLoading(true);
    try {
      const response = await recommendationService.generate(values);
      setLatestInput(values);
      setResult(response);
      setRecommendation(values, response);
      window.setTimeout(
        () =>
          document
            .getElementById('recommendation-results')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        120,
      );
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : 'Recommendations could not be generated. Please retry.',
        'warning',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-4">
      <RecommendationHero />
      <motion.section
        id="recommendation-context"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
        className="mt-7"
      >
        <SmartRecommendationForm
          onComplete={generateRecommendations}
          isLoading={isLoading}
        />
      </motion.section>
      <AnimatePresence>
        {result && latestInput && (
          <RecommendationResults
            result={result}
            input={latestInput}
            onRefine={() =>
              document
                .getElementById('recommendation-context')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            onAction={(message) => showToast(message, 'success')}
            onAddToGarden={(plant) => {
              const outcome = workspaceIntegrationService.addRecommendedPlant(
                plant,
                latestInput,
              );
              showToast(
                outcome.alreadyAdded
                  ? `${plant.name} is already in Garden Diary.`
                  : `${plant.name} was added to Garden Diary with two care tasks.`,
                outcome.alreadyAdded ? 'info' : 'success',
              );
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
