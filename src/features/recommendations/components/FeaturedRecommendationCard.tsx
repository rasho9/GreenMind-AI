import {
  CalendarDays,
  CheckCircle2,
  Droplets,
  Sparkles,
  Sprout,
  Wheat,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge, Card } from '@/components/ui';
import type { PlantRecommendation } from '../types';
import { PlantVisual } from './PlantVisual';

export function FeaturedRecommendationCard({
  plant,
}: {
  plant: PlantRecommendation;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border-[#cce4d4] bg-[radial-gradient(circle_at_90%_5%,rgba(194,233,205,.52),transparent_26%),linear-gradient(120deg,#fbfefb,#f0f8f2)] p-5 shadow-[0_16px_36px_rgb(30_98_59_/_0.09)] sm:p-7">
        <div className="absolute -right-20 top-10 size-64 rounded-full border border-brand/10" />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(250px,.85fr)_minmax(0,1.15fr)] lg:items-center">
          <PlantVisual plant={plant} large />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-brand text-white">Top recommendation</Badge>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark">
                <Sparkles size={14} />
                {plant.confidence}% AI confidence
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.05em] sm:text-[28px]">
              {plant.name}
            </h2>
            <p className="mt-1 text-xs italic text-muted">
              {plant.botanicalName}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              {plant.why} GreenMind has prioritized it as the best place to
              begin this month.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric
                icon={CalendarDays}
                label="Plant in"
                value="July–August"
              />
              <Metric icon={Droplets} label="Water" value="Mon · Thu · Sat" />
              <Metric icon={Sprout} label="Feed" value="Every 3 weeks" />
              <Metric icon={Wheat} label="Harvest" value="8 September" />
            </div>
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-[#cce4d4] bg-white/65 p-3 text-xs leading-5 text-[#326747]">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand" />
              <span>
                <b>Personalized for you: </b>A strong fit for your sunny space,
                summer season, and beginner-friendly care rhythm. Expected
                yield: <b>{plant.yield}</b>.
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/85 bg-white/65 p-3">
      <Icon size={15} className="text-brand" />
      <p className="mt-2 text-[10px] font-medium text-muted">{label}</p>
      <p className="mt-0.5 text-[11px] font-bold leading-4 text-ink">{value}</p>
    </div>
  );
}
