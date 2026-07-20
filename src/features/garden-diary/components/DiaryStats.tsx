import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Leaf,
  Sprout,
  Wheat,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui';
import type { DiaryPlant, DiaryReminder } from '../types';

export function DiaryStats({
  plants,
  reminders,
}: {
  plants: DiaryPlant[];
  reminders: DiaryReminder[];
}) {
  const values = [
    {
      label: 'Total plants',
      value: plants.length,
      detail: 'Across 3 growing areas',
      icon: Sprout,
      tone: 'from-[#d7f0df] to-[#f1f8f2]',
      color: 'text-[#28784b]',
    },
    {
      label: 'Healthy plants',
      value: plants.filter((plant) => plant.status === 'Healthy').length,
      detail: 'Strong overall baseline',
      icon: CheckCircle2,
      tone: 'from-[#e0efe6] to-[#f5f9f5]',
      color: 'text-[#477756]',
    },
    {
      label: 'Under observation',
      value: plants.filter((plant) => plant.status === 'Observation').length,
      detail: 'A closer look this week',
      icon: AlertTriangle,
      tone: 'from-[#f5efd9] to-[#faf8ef]',
      color: 'text-[#9a7830]',
    },
    {
      label: 'Harvested plants',
      value: plants.filter((plant) => plant.status === 'Harvested').length,
      detail: 'Your season’s rewards',
      icon: Wheat,
      tone: 'from-[#f2eedf] to-[#faf9f1]',
      color: 'text-[#896d36]',
    },
    {
      label: 'Pending care tasks',
      value: reminders.filter((reminder) => !reminder.completed).length,
      detail: 'Small moments ahead',
      icon: ClipboardCheck,
      tone: 'from-[#e8f0e7] to-[#f7faf7]',
      color: 'text-[#47755d]',
    },
    {
      label: 'AI health alerts',
      value: plants.filter((plant) => plant.healthScore < 80).length,
      detail: 'Worth a gentle check',
      icon: Leaf,
      tone: 'from-[#edf0df] to-[#f8faf1]',
      color: 'text-[#7d7841]',
    },
  ];
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {values.map(({ label, value, detail, icon: Icon, tone, color }) => (
        <motion.div
          key={label}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.22 }}
        >
          <Card className="relative overflow-hidden p-4">
            <div
              className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-br ${tone} opacity-80`}
            />
            <div className="relative flex items-start justify-between">
              <span
                className={`grid size-10 place-items-center rounded-[13px] bg-white/70 shadow-sm ${color}`}
              >
                <Icon size={19} strokeWidth={1.8} />
              </span>
              <span className="text-[10px] font-bold text-brand">↗</span>
            </div>
            <p className="relative mt-6 text-2xl font-extrabold tracking-[-0.06em] text-ink">
              {value.toString().padStart(2, '0')}
            </p>
            <p className="relative mt-1 text-xs font-extrabold text-ink">
              {label}
            </p>
            <p className="relative mt-1 text-[10px] text-muted">{detail}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
