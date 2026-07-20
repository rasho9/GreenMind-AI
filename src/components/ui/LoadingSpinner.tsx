import { LoaderCircle } from 'lucide-react';

export function LoadingSpinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-muted">
      <LoaderCircle className="animate-spin text-brand" size={18} />
      <span>{label}</span>
    </div>
  );
}
