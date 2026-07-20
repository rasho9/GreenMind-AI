import type { ReactNode } from 'react';

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-success-text">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl font-bold tracking-[-0.03em] text-text-primary">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
