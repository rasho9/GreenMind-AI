import { CalendarDays, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui';
import type { DiaryEntry, DiaryPlant } from '../types';
import { DiaryPlantVisual } from './DiaryPlantVisual';

export function PhotoTimeline({
  entries,
  plants,
}: {
  entries: DiaryEntry[];
  plants: DiaryPlant[];
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-5 sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Photo timeline
          </p>
          <h2 className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
            Growth moments
          </h2>
        </div>
        <CalendarDays size={19} className="text-brand" />
      </div>
      <div className="divide-y divide-line">
        {entries.slice(0, 4).map((entry, index) => {
          const plant = plants.find((item) => item.id === entry.plantId);
          if (!plant) return null;
          return (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              key={entry.id}
              className="flex gap-4 p-5"
            >
              <div className="relative">
                {entry.photoUrl ? (
                  <img
                    src={entry.photoUrl}
                    alt={`${plant.name} on ${entry.date}`}
                    className="size-[76px] rounded-[17px] object-cover"
                  />
                ) : (
                  <DiaryPlantVisual plant={plant} />
                )}
                <span className="absolute -bottom-2 left-1/2 size-2 -translate-x-1/2 rounded-full bg-brand ring-4 ring-surface" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold text-ink">
                      {plant.name}
                    </p>
                    <p className="mt-1 text-[10px] text-muted">
                      {entry.date} · {entry.stage}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-brand-dark">
                    {entry.healthRating * 20}%
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-muted">
                  {entry.personalNotes}
                </p>
                <p className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-brand">
                  <Sparkles size={11} />
                  {entry.aiAnalysis}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
