import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui';
import type { GardenHealth } from '../types';

export function GardenHealthCard({ health }: { health: GardenHealth }) {
  return (
    <Card className="health-dashboard relative overflow-hidden !bg-[rgb(var(--health-surface))] p-5 sm:p-6">
      <div className="absolute -right-10 -top-10 size-44 rounded-full bg-success/15 blur-2xl" />
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="health-dashboard-label text-[11px] font-bold uppercase tracking-[0.13em]">
              AI garden health
            </p>
            <p className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
              {health.level} garden
            </p>
          </div>
          <Sparkles size={18} className="health-dashboard-accent" />
        </div>
        <div className="mt-6 flex items-center gap-5">
          <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="grid size-[118px] shrink-0 place-items-center rounded-full p-[8px]"
            style={{
              background: `conic-gradient(rgb(var(--health-accent)) ${health.score * 3.6}deg, rgb(var(--progress-track)) 0deg)`,
            }}
          >
            <div className="health-dashboard-panel grid size-full place-items-center rounded-full text-center">
              <p className="text-3xl font-extrabold tracking-[-0.07em]">
                {health.score}%
              </p>
              <p className="health-dashboard-label mt-1 text-[10px] font-bold uppercase tracking-[0.1em]">
                Health score
              </p>
            </div>
          </motion.div>
          <p className="health-dashboard-label text-xs leading-6">
            {health.detail}
          </p>
        </div>
        <div className="mt-6 space-y-3">
          {health.factors.map((factor) => (
            <div key={factor.label}>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold">{factor.label}</span>
                <span className="health-dashboard-accent font-bold">
                  {factor.value}%
                </span>
              </div>
              <div className="progress-track mt-1.5 h-1.5 overflow-hidden rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.value}%` }}
                  transition={{ duration: 0.7 }}
                  className="progress-fill h-full rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
        <p className="health-dashboard-label mt-5 flex items-center gap-2 text-[10px] leading-5">
          <CheckCircle2 size={13} className="health-dashboard-accent" /> Score
          considers diary, disease reports, weather, watering signals, growth,
          and task completion.
        </p>
      </div>
    </Card>
  );
}
