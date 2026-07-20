import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  ChevronDown,
  Globe2,
  Leaf,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  UserRound,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/ui';
import {
  searchGreenMind,
  type SearchResult,
} from '@/services/globalSearchService';
import { useAppStore } from '@/store/appStore';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

const notificationPath = {
  weather: '/intelligence-hub',
  health: '/plant-doctor',
  harvest: '/garden-diary',
  task: '/tasks',
  recommendation: '/recommendations',
  system: '/intelligence-hub',
};
const languages = ['English', 'Urdu', 'Spanish'];

function SearchResultList({
  query,
  results,
  activeResult,
  onActiveResultChange,
  onSelect,
}: {
  query: string;
  results: SearchResult[];
  activeResult: number;
  onActiveResultChange: (index: number) => void;
  onSelect: (index: number) => void;
}) {
  return (
    <>
      <p className="px-2.5 py-2 text-[10px] font-bold uppercase tracking-[0.11em] text-muted">
        {query ? 'Search results' : 'Suggested navigation'}
      </p>
      {results.length ? (
        <div>
          {results.map((result, index) => (
            <button
              key={result.id}
              type="button"
              onMouseEnter={() => onActiveResultChange(index)}
              onClick={() => onSelect(index)}
              className={`focus-ring flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors ${activeResult === index ? 'bg-brand-soft text-brand-dark' : 'text-ink hover:bg-canvas'}`}
            >
              <span className="grid size-8 place-items-center rounded-lg bg-surface text-brand shadow-sm">
                <Leaf size={15} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-bold">
                  {result.title}
                </span>
                <span className="mt-0.5 block truncate text-[10px] text-muted">
                  {result.detail}
                </span>
              </span>
              <span className="rounded-full bg-surface px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-muted">
                {result.type}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Search size={20} />}
          title="No garden matches"
          description="Try a plant, climate, category, diary note, or disease name."
        />
      )}
    </>
  );
}

export function TopNavigation() {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const { setSidebarOpen, theme, toggleTheme } = useUIStore();
  const signOut = useAuthStore((state) => state.signOut);
  const {
    notifications,
    markAllNotificationsRead,
    markNotificationRead,
    removeNotification,
    language,
    setLanguage,
    showToast,
  } = useAppStore();
  const [query, setQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const results = useMemo(() => searchGreenMind(query), [query]);
  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (window.matchMedia('(min-width: 768px)').matches) {
          setIsSearchOpen(true);
          window.setTimeout(() => searchInputRef.current?.focus(), 0);
        } else {
          setIsMobileSearchOpen(true);
          window.setTimeout(() => mobileSearchInputRef.current?.focus(), 0);
        }
      }
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        controlsRef.current &&
        !controlsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const selectResult = (index: number) => {
    const result = results[index];
    if (!result) return;
    navigate(result.path);
    setQuery('');
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
    showToast(`Opening ${result.title}.`, 'info');
  };
  const handleSearchKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveResult((index) => Math.min(index + 1, results.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveResult((index) => Math.max(index - 1, 0));
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      selectResult(activeResult);
    }
  };
  const openMobileSearch = () => {
    setIsMobileSearchOpen(true);
    window.setTimeout(() => mobileSearchInputRef.current?.focus(), 0);
  };
  const cycleLanguage = () => {
    const next =
      languages[(languages.indexOf(language) + 1) % languages.length];
    setLanguage(next);
    showToast(`Language set to ${next}.`, 'success');
  };

  return (
    <>
      <header className="premium-topbar sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-line bg-canvas/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
        <div className="relative flex items-center gap-3">
          <button
            className="focus-ring rounded-xl p-2 text-muted transition-colors hover:bg-surface hover:text-brand-dark lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <button
            type="button"
            onClick={openMobileSearch}
            className="focus-ring grid size-10 place-items-center rounded-xl text-muted transition-colors hover:bg-surface hover:text-brand-dark md:hidden"
            aria-label="Search your garden"
          >
            <Search size={18} />
          </button>
          <label className="hidden h-11 w-[min(34vw,390px)] items-center gap-3 rounded-xl border border-line bg-surface px-3.5 text-muted shadow-[0_2px_8px_rgb(20_50_34_/_0.025)] transition-all focus-within:border-brand/35 focus-within:shadow-[0_0_0_3px_rgb(34_121_81_/_0.08)] md:flex">
            <Search size={17} strokeWidth={1.9} />
            <input
              ref={searchInputRef}
              value={query}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveResult(0);
                setIsSearchOpen(true);
              }}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search plants, diary, chats, disease scans, and recommendations"
              placeholder="Search your garden..."
              className="w-full bg-transparent text-sm font-medium text-ink outline-none placeholder:text-muted/75"
            />
            <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">
              Ctrl K
            </kbd>
          </label>
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute left-0 top-[52px] hidden w-[min(90vw,510px)] overflow-hidden rounded-[18px] border border-line bg-surface p-2 shadow-elevated md:block"
              >
                <SearchResultList
                  query={query}
                  results={results}
                  activeResult={activeResult}
                  onActiveResultChange={setActiveResult}
                  onSelect={selectResult}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div
          ref={controlsRef}
          className="relative flex items-center gap-1.5 sm:gap-2"
        >
          <button
            className="focus-ring grid size-10 place-items-center rounded-xl text-muted transition-colors hover:bg-surface hover:text-brand-dark"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon size={18} strokeWidth={1.8} />
            ) : (
              <Sun size={18} strokeWidth={1.8} />
            )}
          </button>
          <button
            className="focus-ring relative grid size-10 place-items-center rounded-xl text-muted transition-colors hover:bg-surface hover:text-brand-dark"
            onClick={() => {
              setIsNotificationsOpen((open) => !open);
              setIsProfileOpen(false);
            }}
            aria-label="Open notifications"
            aria-expanded={isNotificationsOpen}
          >
            <Bell size={18} strokeWidth={1.8} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-brand px-1 text-[9px] font-extrabold leading-4 text-white ring-2 ring-canvas">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            className="focus-ring ml-1 flex items-center gap-2 rounded-xl p-1 pr-1.5 transition-colors hover:bg-surface"
            onClick={() => {
              setIsProfileOpen((open) => !open);
              setIsNotificationsOpen(false);
            }}
            aria-label="Open user profile menu"
            aria-expanded={isProfileOpen}
          >
            <span className="grid size-8 place-items-center rounded-[10px] bg-[#dceee2] text-xs font-extrabold text-[#216c45]">
              AM
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-bold leading-4 text-ink">
                Alex Morgan
              </span>
              <span className="block text-[10px] font-medium leading-3 text-muted">
                Personal garden
              </span>
            </span>
            <ChevronDown size={14} className="hidden text-muted sm:block" />
          </button>
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                className="absolute right-[58px] top-[52px] w-[min(92vw,370px)] overflow-hidden rounded-[18px] border border-line bg-surface shadow-elevated"
              >
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <div>
                    <p className="text-sm font-extrabold">Notifications</p>
                    <p className="mt-0.5 text-[10px] text-muted">
                      {unreadCount ? `${unreadCount} unread` : 'All caught up'}
                    </p>
                  </div>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="focus-ring inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-brand hover:bg-brand-soft"
                    >
                      <CheckCheck size={14} /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-[360px] overflow-y-auto p-2">
                  {notifications.length ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`group flex gap-3 rounded-xl p-2.5 transition-colors ${notification.read ? 'hover:bg-canvas' : 'bg-brand-soft/38 hover:bg-brand-soft/60'}`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            markNotificationRead(notification.id);
                            navigate(notificationPath[notification.type]);
                            setIsNotificationsOpen(false);
                          }}
                          className="min-w-0 flex-1 text-left"
                        >
                          <p className="text-xs font-bold text-ink">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-[11px] leading-5 text-muted">
                            {notification.detail}
                          </p>
                          <p className="mt-1 text-[10px] font-semibold text-brand-dark">
                            {notification.time}
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeNotification(notification.id)}
                          className="focus-ring h-fit rounded-md p-1 text-muted opacity-0 transition-opacity hover:bg-surface hover:text-[#bd5548] group-hover:opacity-100 focus-visible:opacity-100"
                          aria-label={`Delete ${notification.title}`}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      icon={<Bell size={20} />}
                      title="No notifications"
                      description="New garden signals will appear here."
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                className="absolute right-0 top-[52px] w-[250px] overflow-hidden rounded-[18px] border border-line bg-surface p-2 shadow-elevated"
              >
                <div className="border-b border-line px-3 py-3">
                  <p className="text-xs font-extrabold">Alex Morgan</p>
                  <p className="mt-1 text-[10px] text-muted">
                    alex@gardenmail.example
                  </p>
                </div>
                <div className="py-1">
                  {[
                    {
                      label: 'Profile',
                      icon: UserRound,
                      action: () => navigate('/profile'),
                    },
                    {
                      label: 'Settings',
                      icon: Settings,
                      action: () => navigate('/settings'),
                    },
                    {
                      label: 'Security Center',
                      icon: ShieldCheck,
                      action: () => navigate('/settings/security'),
                    },
                    {
                      label: `Theme: ${theme === 'light' ? 'Light' : 'Dark'}`,
                      icon: theme === 'light' ? Moon : Sun,
                      action: toggleTheme,
                    },
                    {
                      label: `Language: ${language}`,
                      icon: Globe2,
                      action: cycleLanguage,
                    },
                  ].map(({ label, icon: Icon, action }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        action();
                        setIsProfileOpen(false);
                      }}
                      className="focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-muted transition-colors hover:bg-brand-soft hover:text-brand-dark"
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    void signOut().finally(() => {
                      navigate('/sign-in');
                      showToast('You have been signed out securely.', 'info');
                    });
                  }}
                  className="focus-ring flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-[#b85649] transition-colors hover:bg-[#fff4f1]"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/30 p-3 backdrop-blur-sm md:hidden"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget)
                setIsMobileSearchOpen(false);
            }}
          >
            <motion.section
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              role="dialog"
              aria-modal="true"
              aria-label="Search GreenMind AI"
              className="mx-auto mt-4 max-h-[calc(100dvh-2rem)] max-w-xl overflow-hidden rounded-[22px] border border-line bg-surface shadow-elevated"
            >
              <div className="flex items-center gap-3 border-b border-line p-3">
                <Search size={18} className="shrink-0 text-muted" />
                <input
                  ref={mobileSearchInputRef}
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveResult(0);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search your garden..."
                  aria-label="Search plants, diary, chats, disease scans, and recommendations"
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-muted/75"
                />
                <button
                  type="button"
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="focus-ring grid size-9 place-items-center rounded-lg text-muted hover:bg-canvas hover:text-ink"
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto p-2">
                <SearchResultList
                  query={query}
                  results={results}
                  activeResult={activeResult}
                  onActiveResultChange={setActiveResult}
                  onSelect={selectResult}
                />
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
