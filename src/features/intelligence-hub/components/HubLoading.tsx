import { LoaderCircle, Sparkles } from 'lucide-react';

export function HubLoading() {
  return (
    <div className="grid min-h-[520px] place-items-center rounded-[28px] border border-line bg-surface text-center shadow-card">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
          <LoaderCircle size={22} className="animate-spin" />
        </span>
        <p className="mt-4 text-sm font-extrabold">
          Reading your garden signals
        </p>
        <p className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-muted">
          <Sparkles size={14} className="text-brand" /> Combining weather, care,
          health, and location context.
        </p>
      </div>
    </div>
  );
}
