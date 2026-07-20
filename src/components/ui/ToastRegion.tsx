import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

const toneIcon = { success: CheckCircle2, info: Info, warning: TriangleAlert };
const toneClass = {
  success: 'status-success',
  info: 'border-success/25 bg-success-soft text-success-text',
  warning: 'status-warning',
};

export function ToastRegion() {
  const { toasts, dismissToast } = useAppStore();
  return (
    <div
      aria-live="polite"
      aria-relevant="additions"
      className="pointer-events-none fixed bottom-5 right-5 z-[80] flex w-[min(92vw,380px)] flex-col gap-2"
    >
      {' '}
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = toneIcon[toast.tone];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className={`pointer-events-auto flex items-start gap-3 rounded-[16px] p-3.5 text-xs font-semibold leading-5 shadow-elevated ${toneClass[toast.tone]}`}
            >
              <Icon size={17} className="mt-0.5 shrink-0" />
              <p className="min-w-0 flex-1">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="focus-ring rounded-md p-1 text-muted hover:bg-canvas"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
