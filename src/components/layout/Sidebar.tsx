import { motion } from 'framer-motion';
import {
  BookOpen,
  BotMessageSquare,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  House,
  LineChart,
  Radar,
  Settings,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  X,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { BrandMark } from './BrandMark';
import { cn } from '@/lib/cn';
import { useUIStore } from '@/store/uiStore';

const navItems = [
  { label: 'Dashboard', icon: House, to: '/' },
  { label: 'AI Weather Hub', icon: Radar, to: '/intelligence-hub' },
  { label: 'GreenMind AI Chat', icon: BotMessageSquare, to: '/assistant' },
  { label: 'AI Recommendations', icon: Sparkles, to: '/recommendations' },
  { label: 'AI Plant Doctor', icon: Stethoscope, to: '/plant-doctor' },
  { label: 'Plant Library', icon: BookOpen, to: '/plant-library' },
  { label: 'AI Marketplace', icon: ShoppingBag, to: '/marketplace' },
  { label: 'Garden Diary', icon: CalendarDays, to: '/garden-diary' },
  { label: 'Tasks', icon: ClipboardCheck, to: '/tasks' },
  { label: 'Analytics', icon: LineChart, to: '/analytics' },
  { label: 'Settings', icon: Settings, to: '/settings' },
  { label: 'Help Center', icon: CircleHelp, to: '/help' },
];

type NavigationProps = { compact?: boolean; onNavigate?: () => void };

function Navigation({ compact = false, onNavigate }: NavigationProps) {
  const location = useLocation();
  return (
    <nav className="space-y-1.5">
      <p
        className={cn(
          'mb-3 px-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-muted transition-opacity',
          compact && 'pointer-events-none h-0 overflow-hidden opacity-0',
        )}
      >
        Workspace
      </p>
      {navItems.map(({ label, icon: Icon, to }) => {
        const sharedClassName =
          'focus-ring group relative flex h-12 w-full items-center overflow-hidden rounded-[var(--radius-control)] text-[16px] font-medium transition-all duration-200';
        return (
          <NavLink
            key={label}
            to={to}
            onClick={onNavigate}
            aria-label={label}
            title={compact ? label : undefined}
            className={({ isActive }) =>
              cn(
                sharedClassName,
                compact ? 'justify-center px-0' : 'gap-3 px-3',
                isActive || (to === '/' && location.pathname === '/dashboard')
                  ? 'bg-brand text-white shadow-[0_8px_18px_rgb(34_121_81_/_0.2)] before:absolute before:bottom-3 before:left-0 before:top-3 before:w-1 before:rounded-r-full before:bg-white/85'
                  : 'text-muted hover:translate-x-0.5 hover:bg-brand-soft/60 hover:text-brand-dark',
              )
            }
          >
            <Icon size={18} strokeWidth={1.8} />
            <span
              className={cn(
                'whitespace-nowrap transition-all',
                compact && 'w-0 overflow-hidden opacity-0',
              )}
            >
              {label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}

type SidebarContentProps = { compact?: boolean; mobile?: boolean };

function SidebarContent({
  compact = false,
  mobile = false,
}: SidebarContentProps) {
  const { setSidebarOpen, toggleSidebarCompact } = useUIStore();
  return (
    <>
      <div
        className={cn(
          'flex h-[86px] items-center',
          compact ? 'justify-center px-2' : 'justify-between px-3',
        )}
      >
        <BrandMark compact={compact} />
        {mobile ? (
          <button
            className="focus-ring rounded-xl p-2 text-muted hover:bg-brand-soft"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        ) : (
          <button
            className={cn(
              'focus-ring grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-brand-soft hover:text-brand-dark',
              compact &&
                'absolute -right-4 top-7 z-10 border border-line bg-surface shadow-sm',
            )}
            onClick={toggleSidebarCompact}
            aria-label={compact ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {compact ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>
      <Navigation
        compact={compact}
        onNavigate={mobile ? () => setSidebarOpen(false) : undefined}
      />
    </>
  );
}

export function Sidebar() {
  const { isSidebarOpen, isSidebarCompact, setSidebarOpen } = useUIStore();
  return (
    <>
      <motion.aside
        animate={{ width: isSidebarCompact ? 88 : 264 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        className="app-sidebar relative hidden h-screen shrink-0 flex-col overflow-y-auto border-r border-line bg-surface px-4 lg:sticky lg:top-0 lg:flex"
      >
        <SidebarContent compact={isSidebarCompact} />
      </motion.aside>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-ink/25 backdrop-blur-[2px] transition-opacity lg:hidden',
          isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setSidebarOpen(false)}
      />
      <motion.aside
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 360, damping: 32 }}
        className="app-sidebar fixed inset-y-0 left-0 z-50 flex w-[290px] flex-col overflow-y-auto bg-surface px-4 shadow-elevated lg:hidden"
      >
        <SidebarContent mobile />
      </motion.aside>
    </>
  );
}
