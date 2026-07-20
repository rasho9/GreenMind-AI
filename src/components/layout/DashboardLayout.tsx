import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { TopNavigation } from './TopNavigation';
import { ToastRegion } from '@/components/ui';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

function AnimatedWorkspaceOutlet() {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <Outlet />
    </motion.div>
  );
}

export function DashboardLayout() {
  const isOnline = useOnlineStatus();
  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <TopNavigation />
        {!isOnline && (
          <div
            role="status"
            aria-live="polite"
            className="mx-5 mt-4 flex items-center gap-2 rounded-xl border border-warning/25 bg-warning/10 px-4 py-3 text-sm font-semibold text-warning sm:mx-8 lg:mx-10"
          >
            <WifiOff size={17} />
            You are offline. New AI requests and syncing will resume when your
            connection returns.
          </div>
        )}
        <main className="mx-auto w-full max-w-[1536px] px-5 py-7 sm:px-8 sm:py-8 lg:px-10 lg:py-12">
          <AnimatedWorkspaceOutlet />
          <Footer />
        </main>
      </div>
      <ToastRegion />
    </div>
  );
}
