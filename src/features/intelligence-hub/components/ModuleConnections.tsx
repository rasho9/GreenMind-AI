import {
  BotMessageSquare,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Leaf,
  ScanLine,
  ShoppingBag,
  UserRound,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, SectionHeader } from '@/components/ui';
import type { ModuleConnection } from '../types';

const iconByModule = {
  'AI Assistant': BotMessageSquare,
  'Garden Diary': CalendarDays,
  'Plant Doctor': ScanLine,
  'Plant Library': BookOpen,
  Recommendations: Leaf,
  'AI Marketplace': ShoppingBag,
  Profile: UserRound,
  Tasks: ClipboardCheck,
};

export function ModuleConnections({
  connections,
}: {
  connections: ModuleConnection[];
}) {
  return (
    <section>
      <SectionHeader
        eyebrow="Connected ecosystem"
        title="One intelligence layer, every garden signal"
        description="Modules contribute a clear slice of context. Changes made elsewhere are available here when the relevant stores update."
      />
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {connections.map((connection, index) => {
          const Icon = iconByModule[connection.module];
          return (
            <motion.div
              key={connection.module}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035 }}
            >
              <Card className="h-full p-4 transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <span className="grid size-10 place-items-center rounded-[14px] bg-brand-soft text-brand">
                    <Icon size={18} />
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${connection.status === 'Synced' ? 'status-success' : 'bg-canvas text-muted'}`}
                  >
                    {connection.status}
                  </span>
                </div>
                <p className="mt-4 text-sm font-extrabold tracking-[-0.02em]">
                  {connection.module}
                </p>
                <p className="mt-1.5 text-[11px] leading-5 text-muted">
                  {connection.detail}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
