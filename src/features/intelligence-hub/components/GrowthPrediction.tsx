import { motion } from 'framer-motion';
import { CalendarDays, ChevronRight, Sprout, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui';
import type { GrowthPrediction as GrowthPredictionType } from '../types';

export function GrowthPrediction({
  predictions,
}: {
  predictions: GrowthPredictionType[];
}) {
  if (!predictions.length) return null;
  return (
    <Card className="relative overflow-hidden p-5 sm:p-6">
      <div className="absolute -bottom-10 -right-12 size-40 rounded-full bg-brand-soft/58 blur-2xl" />
      <div className="relative">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-muted">
              Plant growth prediction
            </p>
            <p className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
              What’s growing next
            </p>
          </div>
          <TrendingUp size={20} className="text-brand" />
        </div>
        {predictions.map((prediction) => (
          <div key={prediction.plantId} className="mt-6">
            <div className="flex flex-col gap-4 rounded-[18px] border border-line bg-canvas/48 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-[15px] bg-brand-soft text-brand">
                  <Sprout size={20} />
                </span>
                <div>
                  <p className="text-sm font-extrabold">
                    {prediction.plantName}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {prediction.currentStage} now · next:{' '}
                    <b className="text-brand-dark">{prediction.nextStage}</b>
                  </p>
                </div>
              </div>
              <span className="rounded-xl border border-brand/15 bg-surface px-3 py-2 text-xs font-bold text-brand-dark">
                {prediction.confidence}% confidence
              </span>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-xl bg-canvas/62 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                  Flowering time
                </p>
                <p className="mt-1.5 text-xs font-extrabold">
                  {prediction.floweringTime}
                </p>
              </div>
              <div className="rounded-xl bg-canvas/62 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                  Harvest date
                </p>
                <p className="mt-1.5 flex items-center gap-1 text-xs font-extrabold">
                  <CalendarDays size={13} className="text-brand" />{' '}
                  {prediction.harvestDate}
                </p>
              </div>
              <div className="rounded-xl bg-canvas/62 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                  Expected yield
                </p>
                <p className="mt-1.5 text-xs font-extrabold">
                  {prediction.expectedYield}
                </p>
              </div>
            </div>
            <div className="mt-5 overflow-x-auto pb-1">
              <div className="flex min-w-[510px] items-start">
                {prediction.timeline.map((step, index) => (
                  <div key={step.label} className="flex flex-1 items-start">
                    <div className="min-w-[68px] text-center">
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.08 }}
                        className={`mx-auto grid size-8 place-items-center rounded-full text-[11px] font-extrabold ${step.status === 'complete' ? 'bg-brand text-white' : step.status === 'active' ? 'border-2 border-brand bg-brand-soft text-brand' : 'bg-line text-muted'}`}
                      >
                        {step.status === 'complete' ? '✓' : index + 1}
                      </motion.span>
                      <p
                        className={`mt-2 text-[10px] font-bold ${step.status === 'active' ? 'text-brand-dark' : 'text-muted'}`}
                      >
                        {step.label}
                      </p>
                    </div>
                    {index < prediction.timeline.length - 1 && (
                      <span
                        className={`mt-4 h-px flex-1 ${step.status === 'complete' ? 'bg-brand' : 'bg-line'}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="focus-ring mt-4 inline-flex items-center gap-1 text-[11px] font-bold text-brand-dark hover:translate-x-0.5"
            >
              Open full plant profile <ChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
