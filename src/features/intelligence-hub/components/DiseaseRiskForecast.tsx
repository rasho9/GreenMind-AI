import { AlertCircle, ShieldCheck } from 'lucide-react';
import { Card, SectionHeader } from '@/components/ui';
import type { DiseaseRisk } from '../types';

const riskColor = {
  Low: 'bg-success',
  Moderate: 'bg-warning',
  High: 'bg-danger',
};
const riskText = {
  Low: 'text-success-text',
  Moderate: 'text-warning-text',
  High: 'text-danger-text',
};

export function DiseaseRiskForecast({ risks }: { risks: DiseaseRisk[] }) {
  return (
    <Card className="p-5 sm:p-6">
      <SectionHeader
        eyebrow="Disease risk forecast"
        title="Prevent before symptoms spread"
        description="A humidity, rainfall, and plant-screening aware risk meter."
      />
      <div className="mt-6 space-y-4">
        {risks.map((risk) => (
          <div
            key={risk.id}
            className="rounded-[17px] border border-line bg-canvas/42 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold tracking-[-0.02em]">
                  {risk.name}
                </p>
                <p className="mt-1.5 text-xs leading-5 text-muted">
                  {risk.prevention}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${riskText[risk.level]}`}
              >
                <AlertCircle size={12} /> {risk.level}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="progress-track h-2 flex-1 overflow-hidden rounded-full">
                <div
                  className={`h-full rounded-full ${riskColor[risk.level]}`}
                  style={{ width: `${risk.probability}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs font-extrabold">
                {risk.probability}%
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 flex items-center gap-2 rounded-xl border border-brand/15 bg-brand-soft/32 px-3 py-2.5 text-[11px] leading-5 text-brand-dark">
        <ShieldCheck size={15} className="shrink-0 text-brand" /> Prevention
        guidance is a planning aid. Follow local product labels and seek expert
        advice if symptoms spread quickly.
      </p>
    </Card>
  );
}
