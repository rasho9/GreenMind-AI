import {
  ArrowUpRight,
  Droplets,
  Leaf,
  Lightbulb,
  Ruler,
  Sun,
  ThermometerSun,
  Timer,
  Waves,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge, Button, Card } from '@/components/ui';
import type { PlantRecommendation } from '../types';
import { PlantVisual } from './PlantVisual';

const difficultyStyle = {
  Easy: 'bg-[#e3f3e8] text-[#237245]',
  Moderate: 'bg-[#f6efd8] text-[#93712e]',
  Advanced: 'bg-[#f7e4df] text-[#a64e42]',
};

export function PlantRecommendationCard({
  plant,
  onViewCareGuide,
  onAddToGarden,
}: {
  plant: PlantRecommendation;
  onViewCareGuide: () => void;
  onAddToGarden: () => void;
}) {
  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ duration: 0.22 }}
      className="h-full"
    >
      <Card className="group h-full overflow-hidden p-5 sm:p-6">
        <div className="flex gap-4">
          <PlantVisual plant={plant} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="truncate">{plant.name}</h3>
                <p className="mt-1 italic text-muted">{plant.botanicalName}</p>
              </div>
              <Badge className="shrink-0 bg-brand text-white">
                {plant.confidence}% Match
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className={`rounded-lg px-2.5 py-1.5 text-[13px] font-bold ${difficultyStyle[plant.difficulty]}`}
              >
                {plant.difficulty}
              </span>
              <span className="rounded-lg bg-canvas px-2.5 py-1.5 text-[13px] font-semibold text-muted">
                {plant.type}
              </span>
              <span className="rounded-lg bg-canvas px-2.5 py-1.5 text-[13px] font-semibold text-muted">
                {plant.growthSpeed} growth
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 border-y border-line py-4">
          <Metric icon={Droplets} label="Water" value={plant.water} />
          <Metric
            icon={Sun}
            label="Sunlight"
            value={plant.sunlight}
            tone="text-[#b78932]"
          />
          <Metric icon={Timer} label="Harvest" value={plant.harvestTime} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Datum icon={Ruler} label="Height" value={plant.expectedHeight} />
          <Datum
            icon={ThermometerSun}
            label="Temperature"
            value={plant.temperature}
          />
          <Datum icon={Waves} label="Humidity" value={plant.humidity} />
          <Datum icon={Leaf} label="Best season" value={plant.bestSeason} />
        </div>
        <p className="mt-3 rounded-xl bg-canvas/70 p-3 text-sm text-muted">
          <span className="font-bold text-ink">Soil: </span>
          {plant.soil} <span className="mx-1 text-line">|</span>
          <span className="font-bold text-ink">Growth: </span>
          {plant.growthTime}
        </p>
        <div className="mt-4">
          <p className="text-[15px] font-bold text-ink">Benefits</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {plant.benefits.map((benefit) => (
              <span
                key={benefit}
                className="rounded-full bg-brand-soft px-2.5 py-1.5 text-[13px] font-bold text-brand-dark"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-4 rounded-[16px] border border-brand/12 bg-brand-soft/38 p-3.5">
          <p className="flex items-center gap-2 text-[15px] font-bold text-brand-dark">
            <Lightbulb size={17} />
            Why AI recommended this
          </p>
          <p className="mt-2 text-sm leading-6 text-[#3b684d]">{plant.why}</p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <SignalList
            title="Pros"
            items={plant.pros}
            tone="bg-[#eff8f1] text-[#34764d]"
          />
          <SignalList
            title="Possible challenges"
            items={plant.challenges}
            tone="bg-[#fbf6e7] text-[#876c2d]"
          />
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onViewCareGuide}
            className="flex-1"
          >
            <ArrowUpRight size={16} />
            View Complete Care Guide
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onAddToGarden}
            className="flex-1"
          >
            <Leaf size={16} />
            Add to Garden Diary
          </Button>
        </div>
      </Card>
    </motion.article>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tone = 'text-brand',
}: {
  icon: typeof Droplets;
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="text-center">
      <Icon size={17} className={`mx-auto ${tone}`} />
      <p className="mt-2 text-[13px] font-semibold text-muted">{label}</p>
      <p className="mt-1 text-[13px] font-bold leading-5 text-ink">{value}</p>
    </div>
  );
}

function Datum({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Droplets;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-canvas/65 p-2.5">
      <Icon size={15} className="text-brand" />
      <p className="mt-2 text-[13px] font-semibold text-muted">{label}</p>
      <p className="mt-1 text-[13px] font-bold leading-5 text-ink">{value}</p>
    </div>
  );
}

function SignalList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: string;
}) {
  return (
    <div className={`rounded-[15px] p-3 ${tone}`}>
      <p className="text-[15px] font-bold">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-[13px] leading-5">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-current" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
