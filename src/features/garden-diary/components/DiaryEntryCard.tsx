import { Droplets, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui';
import type { DiaryEntry, DiaryPlant } from '../types';
import { DiaryPlantVisual } from './DiaryPlantVisual';

export function DiaryEntryCard({
  entry,
  plant,
}: {
  entry: DiaryEntry;
  plant: DiaryPlant;
}) {
  return (
    <motion.article whileHover={{ y: -3 }}>
      <Card className="p-4">
        <div className="flex gap-3">
          <DiaryPlantVisual plant={plant} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold text-ink">{plant.name}</p>
                <p className="mt-1 text-[10px] text-muted">
                  {new Date(`${entry.date}T12:00:00`).toLocaleDateString('en', {
                    day: 'numeric',
                    month: 'short',
                  })}{' '}
                  · {entry.stage}
                </p>
              </div>
              <span className="rounded-lg bg-brand-soft px-2 py-1 text-[10px] font-bold text-brand-dark">
                {entry.healthRating}/5 health
              </span>
            </div>
            <p className="mt-3 line-clamp-2 text-[11px] leading-5 text-muted">
              {entry.personalNotes}
            </p>
            {entry.aiAnalysis && (
              <p className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-[#3b7051]">
                <Sparkles size={12} />
                {entry.aiAnalysis}
              </p>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-[10px] text-muted">
          <Droplets size={13} className="text-brand" />
          {entry.waterGiven} ml given · Soil moisture {entry.soilMoisture}%
        </div>
      </Card>
    </motion.article>
  );
}
