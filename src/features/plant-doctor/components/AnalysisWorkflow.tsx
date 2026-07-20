import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, CircleDashed, ScanSearch, Sparkles } from 'lucide-react';
import { analysisStages } from '../types';

type AnalysisWorkflowProps = { isAnalyzing: boolean };

export function AnalysisWorkflow({ isAnalyzing }: AnalysisWorkflowProps) {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    if (!isAnalyzing) {
      setActiveStage(0);
      return undefined;
    }
    setActiveStage(0);
    const interval = window.setInterval(() => {
      setActiveStage((current) =>
        Math.min(current + 1, analysisStages.length - 1),
      );
    }, 430);
    return () => window.clearInterval(interval);
  }, [isAnalyzing]);

  if (!isAnalyzing) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-5 overflow-hidden rounded-[22px] border border-brand/15 bg-[linear-gradient(130deg,rgb(var(--surface)),rgb(var(--brand-soft)/.5))] p-5 shadow-card sm:p-6"
      aria-live="polite"
    >
      <div className="flex gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-[15px] bg-brand text-white shadow-[0_9px_20px_rgb(34_121_81_/_0.2)]">
          <ScanSearch size={20} />
        </span>
        <div>
          <p className="text-[15px] font-extrabold tracking-[-0.025em]">
            GreenMind AI is preparing your diagnosis
          </p>
          <p className="mt-1 text-xs leading-5 text-muted">
            Building a structured health screening and care plan.
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">
        {analysisStages.map((stage, index) => {
          const isComplete = index < activeStage;
          const isActive = index === activeStage;
          return (
            <div
              key={stage}
              className={`rounded-xl border px-3 py-3 transition-colors ${isActive ? 'border-brand/35 bg-surface shadow-sm' : isComplete ? 'border-brand/15 bg-brand-soft/55' : 'border-line/80 bg-surface/55'}`}
            >
              <span
                className={`grid size-6 place-items-center rounded-full ${isComplete ? 'bg-brand text-white' : isActive ? 'bg-brand-soft text-brand' : 'bg-canvas text-muted'}`}
              >
                {isComplete ? (
                  <Check size={14} strokeWidth={3} />
                ) : isActive ? (
                  <CircleDashed size={14} className="animate-spin" />
                ) : (
                  <Sparkles size={13} />
                )}
              </span>
              <p
                className={`mt-2 text-[11px] font-bold leading-4 ${isActive ? 'text-brand-dark' : 'text-muted'}`}
              >
                {stage}
              </p>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
