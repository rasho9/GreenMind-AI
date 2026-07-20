import { useMemo, useState } from 'react';
import { CalendarDays, Droplets, Scissors, Sprout, Wheat } from 'lucide-react';
import { Card } from '@/components/ui';
import type { DiaryEntry, DiaryReminder } from '../types';

const eventStyle = {
  Watering: 'bg-success',
  Fertilizer: 'bg-warning',
  Pruning: 'bg-success',
  Harvest: 'bg-warning',
  'Disease Inspection': 'bg-danger',
  Repotting: 'bg-success',
};
const iconFor = {
  Watering: Droplets,
  Fertilizer: Sprout,
  Pruning: Scissors,
  Harvest: Wheat,
  'Disease Inspection': CalendarDays,
  Repotting: Sprout,
};

export function DiaryCalendar({
  reminders,
  entries,
}: {
  reminders: DiaryReminder[];
  entries: DiaryEntry[];
}) {
  const [selectedDay, setSelectedDay] = useState('2026-07-16');
  const days = useMemo(
    () =>
      Array.from(
        { length: 31 },
        (_, index) => `2026-07-${String(index + 1).padStart(2, '0')}`,
      ),
    [],
  );
  const selectedReminders = reminders.filter(
    (reminder) => reminder.date === selectedDay,
  );
  const selectedEntries = entries.filter((entry) => entry.date === selectedDay);
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between p-5 sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Care calendar
          </p>
          <h2 className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
            July 2026
          </h2>
        </div>
        <span className="rounded-lg bg-brand-soft px-2.5 py-1.5 text-[11px] font-bold text-brand-dark">
          {reminders.filter((reminder) => !reminder.completed).length} care
          moments
        </span>
      </div>
      <div className="border-y border-line px-3 py-3 sm:px-5">
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <span key={day} className="py-1">
              {day}
            </span>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: 2 }).map((_, index) => (
            <span key={index} />
          ))}
          {days.map((day) => {
            const date = new Date(`${day}T12:00:00`);
            const dayNumber = date.getDate();
            const dayReminders = reminders.filter(
              (reminder) => reminder.date === day,
            );
            const hasEntry = entries.some((entry) => entry.date === day);
            return (
              <button
                type="button"
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`focus-ring relative min-h-10 rounded-lg p-1 text-center text-[11px] font-semibold transition-colors sm:min-h-12 ${selectedDay === day ? 'bg-brand text-white' : dayNumber === 16 ? 'bg-brand-soft text-brand-dark' : 'text-muted hover:bg-brand-soft/50'}`}
              >
                <span>{dayNumber}</span>
                <span className="mt-1 flex justify-center gap-0.5">
                  {dayReminders.slice(0, 3).map((reminder) => (
                    <i
                      key={reminder.id}
                      className={`size-1.5 rounded-full ${selectedDay === day ? 'bg-white' : eventStyle[reminder.type]}`}
                    />
                  ))}
                  {hasEntry && (
                    <i
                      className={`size-1.5 rounded-full ${selectedDay === day ? 'bg-warning-soft' : 'bg-warning'}`}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <p className="text-[11px] font-bold text-ink">
          {new Date(`${selectedDay}T12:00:00`).toLocaleDateString('en', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
        {selectedReminders.length || selectedEntries.length ? (
          <div className="mt-3 space-y-2">
            {selectedReminders.map((reminder) => {
              const Icon = iconFor[reminder.type];
              return (
                <div
                  key={reminder.id}
                  className="flex items-center gap-2 rounded-xl bg-canvas/55 p-2.5 text-[11px] text-muted"
                >
                  <span
                    className={`grid size-7 place-items-center rounded-lg text-white ${eventStyle[reminder.type]}`}
                  >
                    <Icon size={13} />
                  </span>
                  <span>
                    <b className="text-ink">{reminder.title}</b> ·{' '}
                    {reminder.time}
                  </span>
                </div>
              );
            })}
            {selectedEntries.map((entry) => (
              <div
                key={entry.id}
                className="status-success rounded-xl p-2.5 text-[11px]"
              >
                Diary entry recorded · {entry.stage} · {entry.healthRating}/5
                health
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs leading-5 text-muted">
            No care tasks or diary entries on this day. Use it for a quiet
            garden check-in.
          </p>
        )}
      </div>
    </Card>
  );
}
