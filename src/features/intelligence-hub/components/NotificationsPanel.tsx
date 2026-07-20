import {
  BellRing,
  ChevronRight,
  CloudRain,
  ScanSearch,
  Sprout,
} from 'lucide-react';
import { Card } from '@/components/ui';
import type { IntelligenceNotification } from '../types';

const indicator = {
  Low: 'bg-success',
  Moderate: 'bg-warning',
  High: 'bg-danger',
};
const icons = [CloudRain, ScanSearch, Sprout];

export function NotificationsPanel({
  notifications,
}: {
  notifications: IntelligenceNotification[];
}) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-muted">
            Intelligent notifications
          </p>
          <p className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
            Quietly important
          </p>
        </div>
        <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
          <BellRing size={18} />
        </span>
      </div>
      <div className="mt-5 space-y-2">
        {notifications.map((notification, index) => {
          const Icon = icons[index % icons.length];
          return (
            <button
              key={notification.id}
              type="button"
              className="focus-ring group flex w-full items-start gap-3 rounded-[16px] border border-line bg-canvas/42 p-3 text-left transition-all hover:border-brand/25 hover:bg-brand-soft/34"
            >
              <span className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-surface text-brand shadow-sm">
                <Icon size={16} />
                <i
                  className={`absolute -right-0.5 -top-0.5 size-2.5 rounded-full ring-2 ring-canvas ${indicator[notification.level]}`}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-extrabold">
                  {notification.title}
                </span>
                <span className="mt-1 block text-[11px] leading-5 text-muted">
                  {notification.detail}
                </span>
                <span className="mt-1.5 block text-[10px] font-semibold text-brand-dark">
                  {notification.time}
                </span>
              </span>
              <ChevronRight
                size={15}
                className="mt-1 shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
              />
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className="focus-ring mt-4 text-xs font-bold text-brand-dark hover:underline"
      >
        Manage notifications
      </button>
    </Card>
  );
}
