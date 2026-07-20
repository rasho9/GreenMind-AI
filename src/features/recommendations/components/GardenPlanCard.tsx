import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui';

export function GardenPlanCard({
  icon: Icon,
  title,
  description,
  children,
  tone = 'text-brand bg-brand-soft',
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
  tone?: string;
}) {
  return (
    <Card className="h-full p-5">
      <div className="flex items-start gap-3">
        <div
          className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}
        >
          <Icon size={19} strokeWidth={1.8} />
        </div>
        <div>
          <h3 className="text-sm font-extrabold tracking-[-0.025em]">
            {title}
          </h3>
          <p className="mt-1 text-[11px] leading-4 text-muted">{description}</p>
        </div>
      </div>
      <div className="mt-5 border-t border-line pt-4">{children}</div>
    </Card>
  );
}
