import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import { Card, SectionHeader } from '@/components/ui';
import type { IntelligenceInsight } from '../types';

const toneStyle = {
  info: {
    icon: Lightbulb,
    shell: 'border-brand/15 bg-brand-soft/34',
    iconClass: 'bg-brand-soft text-brand',
  },
  warning: {
    icon: AlertTriangle,
    shell: 'status-warning',
    iconClass: 'bg-warning-soft text-warning-text',
  },
  success: {
    icon: CheckCircle2,
    shell: 'status-success',
    iconClass: 'bg-success-soft text-success-text',
  },
};

export function InsightsPanel({
  insights,
}: {
  insights: IntelligenceInsight[];
}) {
  return (
    <section>
      <SectionHeader
        eyebrow="Proactive intelligence"
        title="What needs your attention"
        description="Signals across weather, plant health, and care history—prioritized into calm next steps."
      />
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {insights.map((insight, index) => {
          const style = toneStyle[insight.tone];
          const Icon = style.icon;
          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 9 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`group h-full p-4 transition-all hover:-translate-y-0.5 hover:shadow-elevated ${style.shell}`}
              >
                <div className="flex gap-3">
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-[14px] ${style.iconClass}`}
                  >
                    <Icon size={18} />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-extrabold tracking-[-0.02em]">
                        {insight.title}
                      </p>
                      <span className="rounded-full bg-surface/65 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-muted">
                        {insight.source}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted">
                      {insight.detail}
                    </p>
                    <button
                      type="button"
                      className="focus-ring mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-brand-dark transition-transform group-hover:translate-x-0.5"
                    >
                      Review signal <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
