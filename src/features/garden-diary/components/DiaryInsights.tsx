import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui';
import type { DiaryEntry, DiaryPlant } from '../types';

export function DiaryInsights({
  plants,
  entries,
}: {
  plants: DiaryPlant[];
  entries: DiaryEntry[];
}) {
  const alerts = entries.filter((entry) => entry.healthRating <= 3);
  return (
    <Card className="emphasis-card relative overflow-hidden !bg-[rgb(var(--emphasis-surface))] p-5 sm:p-6">
      <div className="absolute -right-6 -top-8 size-40 rounded-full bg-success/15 blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="emphasis-card-muted inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
            <BrainCircuit size={17} />
            AI growth analysis
          </span>
          <Sparkles size={18} className="emphasis-card-accent" />
        </div>
        <h2 className="mt-5 text-xl font-extrabold tracking-[-0.045em]">
          Your garden’s quiet signals.
        </h2>
        <p className="emphasis-card-muted mt-3 text-sm leading-6">
          {plants.filter((plant) => plant.status === 'Healthy').length} plants
          are progressing steadily. One plant could benefit from a little closer
          observation this week.
        </p>
        <div className="mt-5 space-y-2.5 border-t border-border pt-4">
          {alerts.length ? (
            alerts.map((entry) => (
              <div
                key={entry.id}
                className="status-warning flex gap-2 rounded-xl p-3 text-[11px] leading-5"
              >
                <AlertTriangle
                  size={15}
                  className="mt-0.5 shrink-0 text-warning"
                />
                <span>{entry.aiAnalysis}</span>
              </div>
            ))
          ) : (
            <div className="status-success flex gap-2 rounded-xl p-3 text-[11px] leading-5">
              <CheckCircle2
                size={15}
                className="mt-0.5 shrink-0 text-success"
              />
              <span>
                Save a diary observation to receive a live AI growth analysis.
              </span>
            </div>
          )}
        </div>
        <p className="emphasis-card-accent mt-4 text-[10px] font-bold">
          Live analysis appears after a new observation is saved.
        </p>
      </div>
    </Card>
  );
}
