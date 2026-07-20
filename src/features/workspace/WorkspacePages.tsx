import { useMemo, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BellRing,
  BookOpen,
  CalendarCheck2,
  Check,
  Cloud,
  ChevronDown,
  CircleHelp,
  Database,
  Download,
  Leaf,
  LockKeyhole,
  LocateFixed,
  MapPin,
  MessageCircleMore,
  Palette,
  Save,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sprout,
  ThermometerSun,
  Trash2,
  UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card } from '@/components/ui';
import { useGardenDiaryStore } from '@/features/garden-diary/store/useGardenDiaryStore';
import { usePlantDoctorStore } from '@/features/plant-doctor/store/usePlantDoctorStore';
import { useRecommendationStore } from '@/features/recommendations/store/useRecommendationStore';
import { useMarketplaceStore } from '@/features/marketplace/store/useMarketplaceStore';
import { useAppStore } from '@/store/appStore';
import { useUIStore } from '@/store/uiStore';
import { browserLocationService } from '@/services/platform/locationService';
import { clientEnvironment } from '@/services/platform/environment';

function WorkspaceHero({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <section className="premium-hero relative overflow-hidden rounded-[26px] border border-[#d3e9da] bg-[radial-gradient(circle_at_88%_15%,rgb(190_232_201_/_0.72),transparent_25%),linear-gradient(125deg,#f8fdf9,#eaf7ed)] px-6 py-7 sm:px-8 sm:py-9">
      <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/35 blur-2xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <span className="grid size-11 place-items-center rounded-[15px] bg-brand text-white shadow-[0_9px_20px_rgb(34_121_81_/_0.2)]">
            <Icon size={20} />
          </span>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-brand">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-[-0.055em] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </section>
  );
}

export function TasksPage() {
  const reminders = useGardenDiaryStore((state) => state.reminders);
  const plants = useGardenDiaryStore((state) => state.plants);
  const addReminder = useGardenDiaryStore((state) => state.addReminder);
  const toggleReminder = useGardenDiaryStore((state) => state.toggleReminder);
  const showToast = useAppStore((state) => state.showToast);
  const [filter, setFilter] = useState<'All' | 'Open' | 'Completed'>('Open');
  const visible = reminders.filter((reminder) =>
    filter === 'All'
      ? true
      : filter === 'Completed'
        ? reminder.completed
        : !reminder.completed,
  );
  return (
    <div>
      <WorkspaceHero
        eyebrow="Care management"
        title="Tasks"
        description="Turn care signals into calm, focused actions. Keep every watering, prune, and inspection visible in one place."
        icon={CalendarCheck2}
        action={
          <Button
            onClick={() => {
              const firstPlant = plants[0];
              if (!firstPlant) {
                showToast('Add a plant before creating a care task.', 'info');
                return;
              }
              const dueDate = new Date();
              dueDate.setDate(dueDate.getDate() + 1);
              addReminder({
                plantId: firstPlant.id,
                title: `Check ${firstPlant.name} moisture`,
                type: 'Watering',
                date: dueDate.toISOString().slice(0, 10),
                time: '07:30',
              });
              showToast(
                `A moisture check for ${firstPlant.name} was added to your tasks.`,
                'success',
              );
            }}
            leftIcon={<Sparkles size={16} />}
          >
            Create task
          </Button>
        }
      />
      <section className="mt-7 flex flex-wrap gap-2">
        {(['All', 'Open', 'Completed'] as const).map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setFilter(item)}
            className={`focus-ring rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${filter === item ? 'border-brand bg-brand text-white shadow-sm' : 'border-line bg-surface text-muted hover:border-brand/30 hover:bg-brand-soft'}`}
          >
            {item}
          </button>
        ))}
      </section>
      <section className="mt-5 grid gap-3">
        {visible.length ? (
          visible.map((reminder) => {
            const plant = plants.find((item) => item.id === reminder.plantId);
            return (
              <Card
                key={reminder.id}
                className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
              >
                <button
                  type="button"
                  onClick={() => {
                    toggleReminder(reminder.id);
                    showToast(
                      reminder.completed
                        ? 'Task reopened for follow-up.'
                        : 'Task marked complete. Great care rhythm!',
                      'success',
                    );
                  }}
                  className={`focus-ring grid size-9 shrink-0 place-items-center rounded-xl border ${reminder.completed ? 'border-brand bg-brand text-white' : 'border-line text-muted hover:border-brand hover:text-brand'}`}
                  aria-label={`${reminder.completed ? 'Reopen' : 'Complete'} ${reminder.title}`}
                >
                  {reminder.completed ? (
                    <Check size={17} strokeWidth={3} />
                  ) : (
                    <CalendarCheck2 size={16} />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-extrabold ${reminder.completed ? 'text-muted line-through' : 'text-ink'}`}
                  >
                    {reminder.title}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {plant?.name ?? 'Garden'} · {reminder.type} ·{' '}
                    {reminder.date} at {reminder.time}
                  </p>
                </div>
                <Badge className="w-fit bg-canvas text-muted">
                  {reminder.type}
                </Badge>
              </Card>
            );
          })
        ) : (
          <Card className="grid min-h-[220px] place-items-center border-dashed p-8 text-center">
            <div>
              <span className="mx-auto grid size-11 place-items-center rounded-[14px] bg-brand-soft text-brand">
                <CalendarCheck2 size={20} />
              </span>
              <p className="mt-4 text-sm font-extrabold">
                No tasks in this view
              </p>
              <p className="mt-1 text-xs text-muted">
                Choose another filter or create your next care reminder.
              </p>
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}

const healthTrend = [
  { day: 'Mon', health: 78, tasks: 3 },
  { day: 'Tue', health: 80, tasks: 4 },
  { day: 'Wed', health: 79, tasks: 3 },
  { day: 'Thu', health: 83, tasks: 6 },
  { day: 'Fri', health: 85, tasks: 5 },
  { day: 'Sat', health: 87, tasks: 7 },
  { day: 'Sun', health: 88, tasks: 4 },
];
function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
}) {
  return active && payload?.length ? (
    <div className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-bold text-ink shadow-card">
      {payload[0].value}
    </div>
  ) : null;
}

export function AnalyticsPage() {
  const plants = useGardenDiaryStore((state) => state.plants);
  const entries = useGardenDiaryStore((state) => state.entries);
  const reminders = useGardenDiaryStore((state) => state.reminders);
  const scans = usePlantDoctorStore((state) => state.scans);
  const recommendation = useRecommendationStore((state) => state.latestResult);
  const addedRecommendationCount = useRecommendationStore(
    (state) => state.addedPlantIds.length,
  );
  const marketplaceSaved = useMarketplaceStore(
    (state) => state.wishlistIds.length,
  );
  const marketplaceCartQuantity = useMarketplaceStore((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0),
  );
  const [range, setRange] = useState('7 days');
  const average = Math.round(
    plants.reduce((sum, plant) => sum + plant.healthScore, 0) /
      Math.max(plants.length, 1),
  );
  const waterUsed = entries.reduce(
    (total, entry) => total + entry.waterGiven,
    0,
  );
  const completedTasks = reminders.filter(
    (reminder) => reminder.completed,
  ).length;
  const taskCompletion = Math.round(
    (completedTasks / Math.max(reminders.length, 1)) * 100,
  );
  const recommendationSuccess = recommendation
    ? `${Math.round((addedRecommendationCount / Math.max(recommendation.plants.length, 1)) * 100)}%`
    : '—';
  return (
    <div>
      <WorkspaceHero
        eyebrow="Garden analytics"
        title="Signals worth learning from"
        description="Track health, care consistency, and plant progress through a readable layer of garden intelligence."
        icon={BarChart3}
        action={
          <Button
            variant="secondary"
            onClick={() => setRange(range === '7 days' ? '30 days' : '7 days')}
            leftIcon={<SlidersHorizontal size={16} />}
          >
            {range}
          </Button>
        }
      />
      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          {
            label: 'Garden health',
            value: `${average}%`,
            note: '+4% over the last week',
            icon: ShieldCheck,
          },
          {
            label: 'Diary consistency',
            value: `${entries.length}`,
            note: 'Entries informing predictions',
            icon: BookOpen,
          },
          {
            label: 'Care completion',
            value: `${taskCompletion}%`,
            note: `${completedTasks} completed care tasks`,
            icon: CalendarCheck2,
          },
          {
            label: 'Water usage',
            value: `${(waterUsed / 1000).toFixed(1)} L`,
            note: 'Logged across diary entries',
            icon: Cloud,
          },
          {
            label: 'Disease history',
            value: `${scans.length}`,
            note: 'Visual health screenings',
            icon: ShieldCheck,
          },
          {
            label: 'Recommendation success',
            value: recommendationSuccess,
            note: recommendation
              ? `${addedRecommendationCount} plan plants added to Garden Diary`
              : 'Run an AI recommendation to track this',
            icon: Sparkles,
          },
          {
            label: 'Products recommended',
            value: `${scans.length ? 4 : 0}`,
            note: scans.length
              ? 'Treatment-aware products for the latest screening'
              : 'Run Plant Doctor to unlock treatment products',
            icon: Sparkles,
          },
          {
            label: 'Products saved',
            value: `${marketplaceSaved}`,
            note: 'Saved from AI Marketplace',
            icon: BookOpen,
          },
          {
            label: 'Products purchased (mock)',
            value: `${marketplaceCartQuantity}`,
            note: 'Cart items only — no checkout or payment',
            icon: BarChart3,
          },
          {
            label: 'Disease kits suggested',
            value: `${scans.length ? 4 : 0}`,
            note: scans.length
              ? 'Based on health screening context'
              : 'No screening context yet',
            icon: ShieldCheck,
          },
          {
            label: 'Marketplace accuracy',
            value: '92%',
            note: 'Structured mock recommendation confidence',
            icon: Sparkles,
          },
        ].map(({ label, value, note, icon: Icon }) => (
          <Card key={label} className="p-5">
            <Icon size={20} className="text-brand" />
            <p className="mt-5 text-3xl font-extrabold tracking-[-0.06em]">
              {value}
            </p>
            <p className="mt-1 text-sm font-bold">{label}</p>
            <p className="mt-1 text-xs text-muted">{note}</p>
          </Card>
        ))}
      </section>
      <section className="mt-9 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Card className="p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
            Garden health trend
          </p>
          <p className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
            A stronger care rhythm this week
          </p>
          <div className="mt-5 h-[270px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={healthTrend}
                margin={{ top: 8, right: 0, left: -24, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="analytics-health"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0"
                      stopColor="rgb(var(--chart-primary))"
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="1"
                      stopColor="rgb(var(--chart-primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  stroke="rgb(var(--chart-grid))"
                  strokeDasharray="4 4"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgb(var(--chart-label))', fontSize: 11 }}
                  dy={10}
                />
                <YAxis hide domain={[60, 100]} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="health"
                  stroke="rgb(var(--chart-primary))"
                  strokeWidth={2.5}
                  fill="url(#analytics-health)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
            Care actions
          </p>
          <p className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
            Consistency creates momentum
          </p>
          <div className="mt-5 h-[270px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={healthTrend}
                margin={{ top: 8, right: 0, left: -24, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="rgb(var(--chart-grid))"
                  strokeDasharray="4 4"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgb(var(--chart-label))', fontSize: 11 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip content={<ChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="rgb(var(--warning))"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: 'rgb(var(--warning))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </section>
    </div>
  );
}

export function SettingsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useUIStore();
  const { language, setLanguage, showToast } = useAppStore();
  const [preferences, setPreferences] = useState({
    alerts: true,
    weekly: true,
    analytics: false,
    privateGarden: true,
    contextMemory: true,
    aiConcise: false,
  });
  const toggle = (key: keyof typeof preferences) =>
    setPreferences((value) => ({ ...value, [key]: !value[key] }));
  return (
    <div>
      <WorkspaceHero
        eyebrow="Workspace preferences"
        title="Settings"
        description="Tune the experience, signals, and accessibility preferences around how you like to grow."
        icon={Settings2}
        action={
          <Button
            onClick={() =>
              showToast('Preferences saved for this demo session.', 'success')
            }
            leftIcon={<Save size={16} />}
          >
            Save preferences
          </Button>
        }
      />
      <section className="mt-7 grid gap-5 xl:grid-cols-[.92fr_1.08fr]">
        <Card className="p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
            Appearance
          </p>
          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="focus-ring flex w-full items-center justify-between rounded-[16px] border border-line bg-canvas/45 p-4 text-left hover:border-brand/30"
            >
              <span className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Palette size={17} />
                </span>
                <span>
                  <span className="block text-xs font-extrabold">Theme</span>
                  <span className="mt-1 block text-[11px] text-muted">
                    {theme === 'light'
                      ? 'Light mode is active'
                      : 'Dark mode is active'}
                  </span>
                </span>
              </span>
              <span className="rounded-lg bg-surface px-2.5 py-1 text-[11px] font-bold text-brand-dark">
                Switch
              </span>
            </button>
            <label className="flex items-center justify-between rounded-[16px] border border-line bg-canvas/45 p-4">
              <span className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-brand-soft text-brand">
                  <GlobeIcon />
                </span>
                <span>
                  <span className="block text-xs font-extrabold">Language</span>
                  <span className="mt-1 block text-[11px] text-muted">
                    Choose your workspace language
                  </span>
                </span>
              </span>
              <select
                aria-label="Language"
                value={language}
                onChange={(event) => {
                  setLanguage(event.target.value);
                  showToast(
                    `Language set to ${event.target.value}.`,
                    'success',
                  );
                }}
                className="focus-ring rounded-lg border border-line bg-surface px-2 py-1.5 text-xs font-bold text-ink"
              >
                <option>English</option>
                <option>Urdu</option>
                <option>Spanish</option>
              </select>
            </label>
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
            Garden notifications
          </p>
          <div className="mt-5 space-y-3">
            {[
              {
                key: 'alerts',
                title: 'Intelligent alerts',
                detail: 'Weather, disease, and plant health signals.',
              },
              {
                key: 'weekly',
                title: 'Weekly intelligence brief',
                detail: 'A calm summary of the week ahead.',
              },
              {
                key: 'analytics',
                title: 'Analytics milestones',
                detail: 'Progress moments and achievement updates.',
              },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => toggle(item.key as keyof typeof preferences)}
                className="focus-ring flex w-full items-center justify-between rounded-[16px] border border-line bg-canvas/45 p-4 text-left hover:border-brand/30"
              >
                <span>
                  <span className="block text-xs font-extrabold">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-[11px] text-muted">
                    {item.detail}
                  </span>
                </span>
                <span
                  className={`relative h-6 w-11 rounded-full transition-colors ${preferences[item.key as keyof typeof preferences] ? 'bg-brand' : 'bg-line'}`}
                >
                  <span
                    className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-transform ${preferences[item.key as keyof typeof preferences] ? 'left-6' : 'left-1'}`}
                  />
                </span>
              </button>
            ))}
          </div>
        </Card>
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-[14px] bg-brand-soft text-brand">
              <LockKeyhole size={19} />
            </span>
            <div>
              <p className="text-[15px] font-bold text-ink">
                Privacy and AI preferences
              </p>
              <p className="mt-1 text-sm text-muted">
                Control what becomes part of your garden intelligence context.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <PreferenceToggle
              enabled={preferences.privateGarden}
              onClick={() => toggle('privateGarden')}
              title="Private garden context"
              detail="Keep your local garden details private by default."
            />
            <PreferenceToggle
              enabled={preferences.contextMemory}
              onClick={() => toggle('contextMemory')}
              title="AI workspace memory"
              detail="Allow the assistant to use connected module summaries."
            />
            <PreferenceToggle
              enabled={preferences.aiConcise}
              onClick={() => toggle('aiConcise')}
              title="Concise AI replies"
              detail="Prefer shorter, action-focused recommendations."
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            className="mt-4 w-full"
            leftIcon={<ShieldCheck size={16} />}
            onClick={() => navigate('/settings/security')}
          >
            Open Security Center
          </Button>
        </Card>
        <Card className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-[14px] bg-brand-soft text-brand">
              <ThermometerSun size={19} />
            </span>
            <div>
              <p className="text-[15px] font-bold text-ink">
                Units and location
              </p>
              <p className="mt-1 text-sm text-muted">
                Set the units and permissions that make plans feel local.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="rounded-[16px] border border-line bg-canvas/45 p-4">
              <span className="block text-[15px] font-bold text-ink">
                Units
              </span>
              <select
                aria-label="Measurement units"
                className="focus-ring mt-3 w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink"
              >
                <option>Metric (cm, L, C)</option>
                <option>Imperial (in, gal, F)</option>
              </select>
            </label>
            <label className="rounded-[16px] border border-line bg-canvas/45 p-4">
              <span className="block text-[15px] font-bold text-ink">
                Temperature
              </span>
              <select
                aria-label="Temperature unit"
                className="focus-ring mt-3 w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink"
              >
                <option>Celsius</option>
                <option>Fahrenheit</option>
              </select>
            </label>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="mt-4 w-full"
            onClick={() =>
              void browserLocationService
                .getCurrentPosition()
                .then((location) =>
                  showToast(
                    `Location permission granted: ${location.latitude}, ${location.longitude}.`,
                    'success',
                  ),
                )
                .catch((error: Error) => showToast(error.message, 'warning'))
            }
            leftIcon={<MapPin size={17} />}
          >
            Check location permission
          </Button>
        </Card>
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-[14px] bg-brand-soft text-brand">
              <Cloud size={19} />
            </span>
            <div>
              <p className="text-[15px] font-bold text-ink">Connected APIs</p>
              <p className="mt-1 text-sm text-muted">
                Provider settings remain server-safe and can be connected
                without changing the UI.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {[
              {
                name: 'OpenWeather weather',
                status: clientEnvironment.liveServicesEnabled
                  ? 'Connected via server'
                  : 'Demo mode',
                detail: clientEnvironment.liveServicesEnabled
                  ? 'Uses the secure /api/weather/forecast route.'
                  : 'Add OPENWEATHER_API_KEY server-side, then enable live services.',
              },
              {
                name: 'Nominatim location',
                status: 'Ready',
                detail: clientEnvironment.nominatimBaseUrl,
              },
              {
                name: 'OpenAI Responses API',
                status: clientEnvironment.liveServicesEnabled
                  ? 'Connected via server'
                  : 'Demo mode',
                detail: clientEnvironment.liveServicesEnabled
                  ? 'Streams through the secure /api/ai/respond route.'
                  : 'Add OPENAI_API_KEY server-side, then enable live services.',
              },
              {
                name: 'MapTiler interactive map',
                status: clientEnvironment.mapTilerApiKey
                  ? 'Configured'
                  : 'Awaiting browser token',
                detail: clientEnvironment.mapTilerApiKey
                  ? 'Domain-restricted MapTiler token is available.'
                  : 'Set VITE_MAPTILER_API_KEY with an allowed-domain restriction.',
              },
            ].map((api) => (
              <div
                key={api.name}
                className="flex items-center justify-between gap-3 rounded-[15px] border border-line bg-canvas/42 p-3"
              >
                <span className="min-w-0">
                  <span className="block text-[15px] font-bold text-ink">
                    {api.name}
                  </span>
                  <span className="mt-1 block truncate text-[13px] text-muted">
                    {api.detail}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1.5 text-[13px] font-bold ${api.status === 'Awaiting server URL' ? 'bg-[#fff6df] text-[#9b6c20]' : 'bg-brand-soft text-brand-dark'}`}
                >
                  {api.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-[14px] bg-brand-soft text-brand">
              <Database size={19} />
            </span>
            <div>
              <p className="text-[15px] font-bold text-ink">Data controls</p>
              <p className="mt-1 text-sm text-muted">
                Export your session data or preview destructive account actions
                safely.
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <Button
              type="button"
              variant="secondary"
              className="w-full justify-start"
              onClick={() => {
                const diary = useGardenDiaryStore.getState();
                const blob = new Blob(
                  [
                    JSON.stringify(
                      {
                        plants: diary.plants,
                        entries: diary.entries,
                        reminders: diary.reminders,
                      },
                      null,
                      2,
                    ),
                  ],
                  { type: 'application/json' },
                );
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'greenmind-garden-export.json';
                link.click();
                URL.revokeObjectURL(url);
                showToast('Your garden data export is ready.', 'success');
              }}
              leftIcon={<Download size={17} />}
            >
              Export garden data
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start text-[#b85649] hover:bg-[#fff3f0]"
              onClick={() => {
                if (
                  window.confirm(
                    'This is a mock account-deletion flow. Continue?',
                  )
                )
                  showToast(
                    'Mock deletion request recorded. No local data was removed.',
                    'warning',
                  );
              }}
              leftIcon={<Trash2 size={17} />}
            >
              Delete account (mock)
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}

function PreferenceToggle({
  enabled,
  onClick,
  title,
  detail,
}: {
  enabled: boolean;
  onClick: () => void;
  title: string;
  detail: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="focus-ring flex w-full items-center justify-between rounded-[16px] border border-line bg-canvas/45 p-4 text-left hover:border-brand/30"
    >
      <span>
        <span className="block text-[15px] font-bold text-ink">{title}</span>
        <span className="mt-1 block text-sm text-muted">{detail}</span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${enabled ? 'bg-brand' : 'bg-line'}`}
      >
        <span
          className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'left-6' : 'left-1'}`}
        />
      </span>
    </button>
  );
}

function GlobeIcon() {
  return <LocateFixed size={17} />;
}

const faqItems = [
  {
    question: 'How does GreenMind AI use your garden context?',
    answer:
      'The workspace combines the data you add in modules such as Garden Diary, Plant Doctor, location, and weather. Future GPT integration will receive a typed, server-side context rather than direct client credentials.',
  },
  {
    question: 'How do I improve a plant health score?',
    answer:
      'Log recent care, review Plant Doctor results, complete relevant tasks, and use the weather-aware watering plan as a starting point.',
  },
  {
    question: 'Can I export Garden Diary records?',
    answer:
      'Garden Diary includes browser-native Print and Save as PDF options. More durable report exports can be added behind the existing service boundary.',
  },
];

export function HelpCenterPage() {
  const navigate = useNavigate();
  const showToast = useAppStore((state) => state.showToast);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(faqItems[0].question);
  const faqs = useMemo(
    () =>
      faqItems.filter((item) =>
        `${item.question} ${item.answer}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );
  return (
    <div>
      <WorkspaceHero
        eyebrow="Support and guidance"
        title="Help Center"
        description="Find an answer, return to the right tool, or start a fresh garden conversation when you need a hand."
        icon={CircleHelp}
        action={
          <Button
            onClick={() => navigate('/assistant')}
            leftIcon={<MessageCircleMore size={16} />}
          >
            Ask GreenMind AI
          </Button>
        }
      />
      <section className="mt-7 grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <Card className="p-5 sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
            Quick routes
          </p>
          <div className="mt-5 space-y-2">
            {[
              {
                title: 'Plant Library',
                detail: 'Find plant-specific care guidance.',
                path: '/plant-library',
                icon: BookOpen,
              },
              {
                title: 'AI Plant Doctor',
                detail: 'Review a symptom or screening result.',
                path: '/plant-doctor',
                icon: ShieldCheck,
              },
              {
                title: 'Garden Diary',
                detail: 'Log care, growth, and reminders.',
                path: '/garden-diary',
                icon: CalendarCheck2,
              },
              {
                title: 'Intelligence Hub',
                detail: 'See proactive garden signals.',
                path: '/intelligence-hub',
                icon: Sparkles,
              },
            ].map(({ title, detail, path, icon: Icon }) => (
              <button
                type="button"
                key={title}
                onClick={() => navigate(path)}
                className="focus-ring group flex w-full items-center gap-3 rounded-[15px] border border-line bg-canvas/42 p-3 text-left hover:border-brand/30 hover:bg-brand-soft/34"
              >
                <span className="grid size-9 place-items-center rounded-xl bg-surface text-brand shadow-sm">
                  <Icon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-extrabold">{title}</span>
                  <span className="mt-1 block text-[11px] text-muted">
                    {detail}
                  </span>
                </span>
                <ArrowRight
                  size={15}
                  className="text-muted transition-transform group-hover:translate-x-0.5"
                />
              </button>
            ))}
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <label className="focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 flex h-11 items-center gap-3 rounded-xl border border-line bg-canvas/45 px-3 text-muted">
            <CircleHelp size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search help topics"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-muted/70"
              aria-label="Search help topics"
            />
          </label>
          <div className="mt-5 space-y-2">
            {faqs.map((item) => (
              <div
                key={item.question}
                className="rounded-[16px] border border-line bg-surface"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpen((value) =>
                      value === item.question ? null : item.question,
                    )
                  }
                  className="focus-ring flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                >
                  <span className="text-xs font-extrabold">
                    {item.question}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-muted transition-transform ${open === item.question ? 'rotate-180' : ''}`}
                  />
                </button>
                {open === item.question && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-line px-4 py-3 text-xs leading-6 text-muted"
                  >
                    {item.answer}
                  </motion.p>
                )}
              </div>
            ))}
            {!faqs.length && (
              <p className="rounded-xl border border-dashed border-line p-5 text-center text-xs text-muted">
                No help topic matched that search. Try “health”, “export”, or
                “context”.
              </p>
            )}
          </div>
        </Card>
      </section>
      <section className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="p-5">
          <span className="grid size-10 place-items-center rounded-[14px] bg-brand-soft text-brand">
            <Sprout size={19} />
          </span>
          <p className="mt-4 text-[15px] font-extrabold">Quick start guide</p>
          <ol className="mt-3 space-y-2 text-sm leading-6 text-muted">
            <li>1. Create a recommendation for your space.</li>
            <li>2. Add the best match to Garden Diary.</li>
            <li>3. Keep its diary and care tasks current.</li>
          </ol>
          <Button
            variant="ghost"
            className="mt-4 px-0 text-brand-dark hover:bg-transparent"
            onClick={() => navigate('/recommendations')}
            rightIcon={<ArrowRight size={16} />}
          >
            Start with recommendations
          </Button>
        </Card>
        <Card className="p-5">
          <span className="grid size-10 place-items-center rounded-[14px] bg-brand-soft text-brand">
            <Sparkles size={19} />
          </span>
          <p className="mt-4 text-[15px] font-extrabold">
            AI tips & documentation
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Add your city, sunlight, and recent observations for more useful
            recommendations. Always verify chemical treatment with a local
            agricultural expert.
          </p>
          <Button
            variant="ghost"
            className="mt-4 px-0 text-brand-dark hover:bg-transparent"
            onClick={() => navigate('/assistant')}
            rightIcon={<ArrowRight size={16} />}
          >
            Open AI guide
          </Button>
        </Card>
        <Card className="p-5">
          <span className="grid size-10 place-items-center rounded-[14px] bg-brand-soft text-brand">
            <MessageCircleMore size={19} />
          </span>
          <p className="mt-4 text-[15px] font-extrabold">Contact support</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Tell the team where you got stuck. This demo safely records the
            request without sending any personal data.
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() =>
              showToast(
                'Support request noted. Connect your help desk provider when the backend is enabled.',
                'success',
              )
            }
          >
            Contact GreenMind
          </Button>
        </Card>
      </section>
    </div>
  );
}

type ProfileForm = {
  name: string;
  location: string;
  garden: string;
  bio: string;
};
export function ProfilePage() {
  const { register, handleSubmit } = useForm<ProfileForm>({
    defaultValues: {
      name: 'Alex Morgan',
      location: 'Lahore, Pakistan',
      garden: 'Personal balcony garden',
      bio: 'Growing food, herbs, and a calmer daily rhythm.',
    },
  });
  const showToast = useAppStore((state) => state.showToast);
  return (
    <div>
      <WorkspaceHero
        eyebrow="Personal workspace"
        title="Your Profile"
        description="Keep the garden context behind GreenMind AI clear, useful, and ready for better recommendations."
        icon={UserRound}
        action={
          <Button
            form="profile-form"
            type="submit"
            leftIcon={<Save size={16} />}
          >
            Save profile
          </Button>
        }
      />
      <section className="mt-7 grid gap-5 xl:grid-cols-[.72fr_1.28fr]">
        <Card className="p-6">
          <span className="grid size-16 place-items-center rounded-[20px] bg-brand-soft text-xl font-extrabold text-brand">
            AM
          </span>
          <h2 className="mt-5 text-xl font-extrabold tracking-[-0.04em]">
            Alex Morgan
          </h2>
          <p className="mt-1 text-sm text-muted">Personal garden</p>
          <div className="mt-6 space-y-3 border-t border-line pt-5 text-xs">
            <p className="flex items-center gap-2 text-muted">
              <LocateFixed size={15} className="text-brand" /> Lahore, Pakistan
            </p>
            <p className="flex items-center gap-2 text-muted">
              <Leaf size={15} className="text-brand" /> Balcony and container
              garden
            </p>
            <p className="flex items-center gap-2 text-muted">
              <BellRing size={15} className="text-brand" /> Intelligent alerts
              enabled
            </p>
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <form
            id="profile-form"
            onSubmit={handleSubmit(() =>
              showToast(
                'Profile details saved for this demo session.',
                'success',
              ),
            )}
            className="grid gap-4 sm:grid-cols-2"
          >
            <label className="text-xs font-bold text-ink">
              Name
              <input
                {...register('name')}
                className="focus-ring mt-2 h-11 w-full rounded-xl border border-line bg-canvas/45 px-3 text-sm font-medium text-ink outline-none focus:border-brand/40"
              />
            </label>
            <label className="text-xs font-bold text-ink">
              Location
              <input
                {...register('location')}
                className="focus-ring mt-2 h-11 w-full rounded-xl border border-line bg-canvas/45 px-3 text-sm font-medium text-ink outline-none focus:border-brand/40"
              />
            </label>
            <label className="text-xs font-bold text-ink">
              Garden type
              <input
                {...register('garden')}
                className="focus-ring mt-2 h-11 w-full rounded-xl border border-line bg-canvas/45 px-3 text-sm font-medium text-ink outline-none focus:border-brand/40"
              />
            </label>
            <label className="text-xs font-bold text-ink">
              About
              <textarea
                {...register('bio')}
                rows={3}
                className="focus-ring mt-2 w-full resize-none rounded-xl border border-line bg-canvas/45 p-3 text-sm font-medium text-ink outline-none focus:border-brand/40"
              />
            </label>
          </form>
        </Card>
      </section>
    </div>
  );
}
