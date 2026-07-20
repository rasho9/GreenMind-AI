import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, Sparkles } from 'lucide-react';
import { Card, SectionHeader } from '@/components/ui';
import type { SmartRecommendation } from '../types';

const priorityStyle = {
  Now: 'status-warning',
  'This week': 'bg-brand-soft text-brand-dark',
  'When ready': 'bg-canvas text-muted',
};

export function SmartRecommendations({
  recommendations,
  onAction,
}: {
  recommendations: SmartRecommendation[];
  onAction: (action: string) => void;
}) {
  const [completed, setCompleted] = useState<string[]>([]);
  const markComplete = (recommendation: SmartRecommendation) => {
    setCompleted((items) =>
      items.includes(recommendation.id)
        ? items.filter((id) => id !== recommendation.id)
        : [...items, recommendation.id],
    );
    onAction(recommendation.action);
  };
  return (
    <section>
      <SectionHeader
        eyebrow="Smart recommendations"
        title="Small decisions with a meaningful effect"
        description="Each suggestion is grounded in the intelligence snapshot and framed as an easy next move."
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {recommendations.map((recommendation, index) => {
          const isComplete = completed.includes(recommendation.id);
          return (
            <motion.div
              key={recommendation.id}
              initial={{ opacity: 0, y: 9 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card
                className={`group h-full p-4 transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-elevated ${isComplete ? 'bg-brand-soft/24' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`grid size-9 place-items-center rounded-xl ${isComplete ? 'bg-brand text-white' : 'bg-brand-soft text-brand'}`}
                  >
                    {isComplete ? (
                      <Check size={17} strokeWidth={3} />
                    ) : (
                      <Sparkles size={17} />
                    )}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${priorityStyle[recommendation.priority]}`}
                  >
                    {recommendation.priority}
                  </span>
                </div>
                <p className="mt-4 text-sm font-extrabold tracking-[-0.02em]">
                  {recommendation.title}
                </p>
                <p className="mt-1.5 text-xs leading-5 text-muted">
                  {recommendation.detail}
                </p>
                <button
                  type="button"
                  onClick={() => markComplete(recommendation)}
                  className="focus-ring mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-brand-dark transition-transform group-hover:translate-x-0.5"
                >
                  {isComplete ? 'Completed' : recommendation.action}{' '}
                  <ChevronRight size={14} />
                </button>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
