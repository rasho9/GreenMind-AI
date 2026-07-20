import {
  AlertTriangle,
  CalendarClock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui';
import { HealthScore } from './HealthScore';
import type { PlantDoctorAnalysis } from '../types';

type PlantHealthDashboardProps = { analysis?: PlantDoctorAnalysis | null };

const statusStyles = {
  Healthy: 'status-success',
  Warning: 'status-warning',
  Critical: 'status-danger',
};

export function PlantHealthDashboard({ analysis }: PlantHealthDashboardProps) {
  const score = analysis?.healthScore ?? 72;
  const status = analysis?.status ?? 'Warning';
  const disease = analysis?.diseaseName ?? 'Early Blight';
  const confidence = analysis?.confidence ?? 91;
  const severity = analysis?.severity ?? 'Medium';
  const overallHealth = analysis?.overallHealth ?? 'Average';
  return (
    <Card className="health-dashboard !bg-[rgb(var(--health-surface))] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="health-dashboard-label text-[11px] font-bold uppercase tracking-[0.13em]">
            Plant health dashboard
          </p>
          <p className="mt-2 text-lg font-extrabold tracking-[-0.035em]">
            {analysis?.plantName ?? 'Latest screening'}
          </p>
        </div>
        <span className="health-dashboard-panel health-dashboard-accent grid size-9 shrink-0 place-items-center rounded-xl">
          <Sparkles size={17} />
        </span>
      </div>

      <div className="mt-6 grid gap-8 md:grid-cols-[120px_minmax(0,1fr)] md:items-center">
        <div className="flex shrink-0 justify-center md:justify-start">
          <HealthScore score={score} status={status} size="sm" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold tracking-[-0.035em]">
            {disease}
          </h3>
          <p className="health-dashboard-label mt-2 text-xs leading-5">
            A clear treatment sequence is ready when you are.
          </p>
          <p className="health-dashboard-accent mt-4 text-[11px] font-bold">
            {confidence}% screening confidence
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={`${statusStyles[status]} inline-flex items-center rounded-lg px-3 py-2 text-[11px] font-bold`}
            >
              {status}
            </span>
            <span className="health-dashboard-panel inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-semibold">
              <AlertTriangle size={14} className="text-warning" /> {severity}{' '}
              priority
            </span>
            <span className="health-dashboard-panel inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-semibold">
              <CalendarClock size={14} className="text-success" />{' '}
              {overallHealth} health
            </span>
          </div>
        </div>
      </div>

      <p className="health-dashboard-label mt-5 flex items-center gap-2 text-[11px] leading-5">
        <ShieldCheck size={14} className="health-dashboard-accent shrink-0" />
        Visual screening supports plant care; escalate severe or spreading
        symptoms to a local expert.
      </p>
    </Card>
  );
}
