import { HeartPulse } from 'lucide-react';
import type { PlantHealthStatus } from '../types';

type HealthScoreProps = {
  score: number;
  status: PlantHealthStatus;
  size?: 'sm' | 'lg';
};

const statusColors: Record<PlantHealthStatus, string> = {
  Healthy: 'rgb(var(--success))',
  Warning: 'rgb(var(--warning))',
  Critical: 'rgb(var(--danger))',
};

export function HealthScore({ score, status, size = 'lg' }: HealthScoreProps) {
  const dimension =
    size === 'lg' ? 'size-36 sm:size-40' : 'size-[120px] min-w-[110px]';
  return (
    <div
      className={`score-panel ${dimension} relative grid shrink-0 place-items-center rounded-full border border-border p-[7px]`}
      style={{
        background: `conic-gradient(${statusColors[status]} ${score * 3.6}deg, rgb(var(--progress-track)) 0deg)`,
      }}
      aria-label={`${status} plant health score: ${score}%`}
      role="img"
    >
      <div className="score-panel-inner grid size-full place-items-center rounded-full bg-card text-center text-text-primary shadow-[inset_0_0_0_1px_rgb(var(--border)/.9)]">
        <div>
          <p
            className={
              size === 'lg'
                ? 'text-3xl font-extrabold tracking-[-0.06em]'
                : 'text-xl font-extrabold tracking-[-0.06em]'
            }
          >
            {score}%
          </p>
          <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted">
            <HeartPulse size={11} style={{ color: statusColors[status] }} />
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}
