import { motion } from 'framer-motion';
import { Activity, RefreshCw, Sparkles, Waves } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import type { IntelligenceSnapshot } from '../types';

type HubHeroProps = {
  snapshot: IntelligenceSnapshot;
  isLoading: boolean;
  onRefresh: () => void;
};

export function HubHero({ snapshot, isLoading, onRefresh }: HubHeroProps) {
  return (
    <section className="premium-hero relative overflow-hidden rounded-[28px] border border-[#d4eadb] bg-[radial-gradient(circle_at_88%_15%,rgb(185_231_199_/_0.78),transparent_24%),radial-gradient(circle_at_10%_105%,rgb(218_242_225_/_82),transparent_34%),linear-gradient(125deg,#f8fdf9,#eaf7ed)] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
      <motion.span
        aria-hidden="true"
        animate={{ y: [0, -11, 0], rotate: [-7, 3, -7] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-3 top-6 grid size-32 place-items-center rounded-full border border-white/60 bg-white/30 text-brand/20 shadow-[0_16px_45px_rgb(22_84_50_/_0.09)] backdrop-blur"
      >
        <Activity size={62} strokeWidth={1.2} />
      </motion.span>
      <motion.span
        aria-hidden="true"
        animate={{ y: [0, 9, 0], rotate: [20, 7, 20] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-6 right-[19%] size-9 rounded-tl-[23px] rounded-br-[23px] rounded-tr-md rounded-bl-md bg-brand/15"
      />
      <div className="relative grid gap-7 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-surface/75 text-brand-dark shadow-sm">
              Central intelligence engine
            </Badge>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-dark">
              <span className="size-1.5 rounded-full bg-brand" /> Synced{' '}
              {snapshot.refreshedAt.toLowerCase()}
            </span>
          </div>
          <h1 className="mt-5 text-balance text-3xl font-extrabold tracking-[-0.055em] text-ink sm:text-4xl">
            AI Intelligence Hub
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
            A single, calm view of your garden’s location, weather, health
            signals, care rhythm, and the changes worth acting on next.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-xl border border-brand/12 bg-surface/70 px-3 py-2 text-xs font-semibold text-brand-dark shadow-sm">
              <Waves size={15} className="text-brand" />{' '}
              {snapshot.weather.condition} · {snapshot.location.city}
            </span>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={isLoading}
              onClick={onRefresh}
              leftIcon={
                <RefreshCw
                  size={15}
                  className={isLoading ? 'animate-spin' : ''}
                />
              }
            >
              {isLoading ? 'Refreshing' : 'Refresh signals'}
            </Button>
          </div>
        </div>
        <div className="health-dashboard relative overflow-hidden rounded-[22px] border p-5 backdrop-blur">
          <div className="absolute -right-9 -top-10 size-32 rounded-full bg-brand-soft/65 blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="health-dashboard-label text-[10px] font-bold uppercase tracking-[0.13em]">
                Garden health signal
              </p>
              <Sparkles size={17} className="health-dashboard-accent" />
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div
                className="relative grid size-[86px] shrink-0 place-items-center rounded-full p-[7px]"
                style={{
                  background: `conic-gradient(rgb(var(--health-accent)) ${snapshot.gardenHealth.score * 3.6}deg, rgb(var(--progress-track)) 0deg)`,
                }}
              >
                <div className="health-dashboard-panel grid size-full place-items-center rounded-full border">
                  <span className="health-dashboard-accent text-2xl font-extrabold tracking-[-0.07em]">
                    {snapshot.gardenHealth.score}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-base font-extrabold tracking-[-0.035em]">
                  {snapshot.gardenHealth.level}
                </p>
                <p className="health-dashboard-label mt-1 text-xs leading-5">
                  {snapshot.gardenHealth.change > 0
                    ? `+${snapshot.gardenHealth.change}% from last week`
                    : 'Stable from last week'}
                </p>
              </div>
            </div>
            <p className="health-dashboard-label mt-4 text-[11px] leading-5">
              {snapshot.gardenHealth.detail}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
