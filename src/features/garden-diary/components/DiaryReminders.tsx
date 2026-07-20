import { BellRing, Check, Clock3 } from 'lucide-react';
import { Card } from '@/components/ui';
import type { DiaryPlant, DiaryReminder } from '../types';

const reminderTone = {
  Watering: 'bg-success-soft text-success-text',
  Fertilizer: 'bg-warning-soft text-warning-text',
  Pruning: 'bg-success-soft text-success-text',
  Harvest: 'bg-warning-soft text-warning-text',
  'Disease Inspection': 'bg-danger-soft text-danger-text',
  Repotting: 'bg-success-soft text-success-text',
};

export function DiaryReminders({
  reminders,
  plants,
  onToggle,
}: {
  reminders: DiaryReminder[];
  plants: DiaryPlant[];
  onToggle: (id: string) => void;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Upcoming reminders
          </p>
          <h2 className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
            Care, on time
          </h2>
        </div>
        <BellRing size={19} className="text-brand" />
      </div>
      <div className="mt-5 space-y-2.5">
        {reminders
          .filter((reminder) => !reminder.completed)
          .slice(0, 4)
          .map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center gap-3 rounded-xl border border-line bg-canvas/40 p-3"
            >
              <button
                type="button"
                onClick={() => onToggle(reminder.id)}
                className="focus-ring grid size-5 shrink-0 place-items-center rounded-md border border-line text-muted hover:border-brand hover:text-brand"
                aria-label={`Mark ${reminder.title} complete`}
              >
                <Check size={12} />
              </button>
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-lg ${reminderTone[reminder.type]}`}
              >
                <Clock3 size={14} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-ink">
                  {reminder.title}
                </p>
                <p className="mt-1 text-[10px] text-muted">
                  {plants.find((plant) => plant.id === reminder.plantId)
                    ?.name ?? 'Garden'}{' '}
                  · {reminder.date.slice(5)} · {reminder.time}
                </p>
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
}
