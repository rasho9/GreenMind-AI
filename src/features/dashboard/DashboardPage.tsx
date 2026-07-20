import { motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Bot,
  CalendarHeart,
  CloudSun,
  Leaf,
  MessageCircleMore,
  ScanLine,
  Sparkles,
  Sprout,
  Sunrise,
  Trees,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge, Card } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

const gardenTrend = [
  { day: 'Mon', value: 58 },
  { day: 'Tue', value: 64 },
  { day: 'Wed', value: 60 },
  { day: 'Thu', value: 72 },
  { day: 'Fri', value: 69 },
  { day: 'Sat', value: 80 },
  { day: 'Sun', value: 84 },
];

const careActivity = [
  { day: 'M', value: 4 },
  { day: 'T', value: 6 },
  { day: 'W', value: 3 },
  { day: 'T', value: 8 },
  { day: 'F', value: 5 },
  { day: 'S', value: 7 },
  { day: 'S', value: 4 },
];

const statistics = [
  {
    label: 'Plants',
    value: '24',
    note: '4 added this month',
    icon: Sprout,
    gradient: 'from-[#d8f0df] to-[#eff8f1]',
    iconColor: 'text-[#27794e]',
    to: '/garden-diary',
  },
  {
    label: 'AI conversations',
    value: '18',
    note: 'This growing season',
    icon: MessageCircleMore,
    gradient: 'from-[#e0eee7] to-[#f3f8f4]',
    iconColor: 'text-[#417052]',
    to: '/assistant',
  },
  {
    label: 'Active tasks',
    value: '07',
    note: '2 due today',
    icon: CalendarHeart,
    gradient: 'from-[#f0eedc] to-[#faf9f0]',
    iconColor: 'text-[#807133]',
    to: '/tasks',
  },
  {
    label: 'Garden health',
    value: '92%',
    note: 'Up 6% this week',
    icon: Leaf,
    gradient: 'from-[#dcefe5] to-[#f1f8f3]',
    iconColor: 'text-[#1b6942]',
    to: '/intelligence-hub',
  },
];

const quickActions = [
  {
    title: 'AI Plant Recommendation',
    description: 'Find the right plants for your conditions.',
    icon: Sparkles,
    accent: 'from-[#dff3e5] to-[#f4faf5]',
    iconTone: 'bg-[#27794e] text-white',
    to: '/recommendations',
  },
  {
    title: 'Plant Library',
    description: 'Explore care guides for every green thing.',
    icon: BookOpen,
    accent: 'from-[#ebf0e5] to-[#fbfcf9]',
    iconTone: 'bg-[#5f7d43] text-white',
    to: '/plant-library',
  },
  {
    title: 'Garden Diary',
    description: 'Capture small moments worth remembering.',
    icon: CalendarHeart,
    accent: 'from-[#f2eee0] to-[#fcfaf3]',
    iconTone: 'bg-[#9b7b3c] text-white',
    to: '/garden-diary',
  },
  {
    title: 'AI Assistant',
    description: 'Make better garden decisions, one question at a time.',
    icon: Bot,
    accent: 'from-[#e5f1ea] to-[#f7fbf8]',
    iconTone: 'bg-[#36725a] text-white',
    to: '/assistant',
  },
  {
    title: 'Disease Scanner',
    description: 'Understand what your plant may be telling you.',
    icon: ScanLine,
    accent: 'from-[#e4f1e6] to-[#f7faf7]',
    iconTone: 'bg-[#2e7a4c] text-white',
    to: '/plant-doctor',
  },
  {
    title: 'Weather Intelligence',
    description: 'Stay ahead of changes in your microclimate.',
    icon: CloudSun,
    accent: 'from-[#e8efea] to-[#f8faf8]',
    iconTone: 'bg-[#507564] text-white',
    to: '/intelligence-hub',
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] },
  },
};

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-bold text-ink shadow-card">
      {payload[0].value}
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="pb-2"
    >
      <motion.section
        variants={item}
        className="premium-hero relative overflow-hidden rounded-[24px] border border-[#dceae0] bg-[radial-gradient(circle_at_88%_18%,rgba(174,224,191,.6),transparent_24%),radial-gradient(circle_at_10%_115%,rgba(218,241,225,.9),transparent_36%),linear-gradient(122deg,#f9fcf9_0%,#edf6ef_100%)] px-6 py-7 sm:px-8 sm:py-9 lg:px-10"
      >
        <div className="absolute right-[23%] top-0 size-32 rounded-full bg-white/45 blur-2xl" />
        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(330px,390px)] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-[#4d725a]">
              Thursday, July 16
            </p>
            <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-[-0.055em] text-ink sm:text-[40px]">
              Good morning, Alex.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-[15px]">
              Your garden is in a beautiful rhythm today. Here’s the quiet
              signal beneath the surface.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge className="bg-white/70 text-[#226a43] shadow-sm">
                Garden overview
              </Badge>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#50715b]">
                <span className="size-1.5 rounded-full bg-[#319157]" />
                All systems are steady
              </span>
            </div>
          </div>
          <div className="health-dashboard rounded-[22px] border p-5 backdrop-blur-md sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="health-dashboard-label text-xs font-bold uppercase tracking-[0.12em]">
                  AI Garden Health Score
                </p>
                <p className="mt-2 text-xs text-muted">
                  A calm pulse on your garden’s wellbeing.
                </p>
              </div>
              <Sparkles size={18} className="health-dashboard-accent" />
            </div>
            <div className="mt-5 flex items-center gap-5">
              <div
                className="relative grid size-[92px] shrink-0 place-items-center rounded-full"
                style={{
                  background:
                    'conic-gradient(rgb(var(--health-accent)) 0deg 331deg, rgb(var(--progress-track)) 331deg 360deg)',
                }}
              >
                <div className="health-dashboard-panel grid size-[76px] place-items-center rounded-full border">
                  <span className="health-dashboard-accent text-2xl font-extrabold tracking-[-0.08em]">
                    92
                  </span>
                </div>
              </div>
              <div>
                <p className="text-base font-extrabold tracking-[-0.035em] text-ink">
                  Thriving
                </p>
                <p className="mt-1 text-xs leading-5 text-muted">
                  An excellent baseline to build on.
                </p>
                <p className="health-dashboard-accent mt-3 text-[11px] font-bold">
                  +6% from last week
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={item}
        className="mt-5 grid gap-5 xl:grid-cols-[1.08fr_.92fr]"
      >
        <Card className="relative overflow-hidden p-5 sm:p-6">
          <div className="absolute -right-10 -top-12 size-36 rounded-full bg-brand-soft/70 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
                Today’s weather
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Sunrise
                  size={31}
                  strokeWidth={1.55}
                  className="text-[#c69939]"
                />
                <div>
                  <p className="text-3xl font-extrabold tracking-[-0.06em]">
                    24°
                  </p>
                  <p className="mt-1 text-xs font-medium text-muted">
                    Soft sun, light breeze
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-ink">12° – 26°</p>
              <p className="mt-1 text-[11px] text-muted">Lahore, PK</p>
            </div>
          </div>
          <div className="relative mt-6 flex items-center justify-between border-t border-line pt-4 text-xs">
            <span className="text-muted">
              Humidity <b className="ml-1 text-ink">58%</b>
            </span>
            <span className="text-muted">
              Wind <b className="ml-1 text-ink">8 km/h</b>
            </span>
            <span className="text-muted">
              UV <b className="ml-1 text-ink">Moderate</b>
            </span>
          </div>
        </Card>
        <Card className="emphasis-card group relative overflow-hidden !bg-[rgb(var(--emphasis-surface))] p-5 sm:p-6">
          <div className="absolute -right-5 -top-7 size-32 rounded-full bg-success/15 blur-2xl" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="emphasis-card-muted inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
                <Sparkles size={15} />
                Quick AI insight
              </span>
              <span className="size-2 rounded-full bg-success shadow-[0_0_0_4px_rgb(var(--success)/.14)]" />
            </div>
            <p className="emphasis-card-muted mt-5 max-w-[420px] text-sm font-medium leading-6">
              Connect your garden to see personalized care signals and timely
              guidance here.
            </p>
            <button
              type="button"
              onClick={() => navigate('/intelligence-hub')}
              className="emphasis-card-accent focus-ring mt-5 inline-flex w-fit items-center gap-2 rounded-lg text-xs font-bold transition-transform group-hover:translate-x-1"
            >
              Explore garden intelligence <ArrowRight size={15} />
            </button>
          </div>
        </Card>
      </motion.section>

      <motion.section variants={item} className="mt-9">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand">
              At a glance
            </p>
            <h2 className="mt-2 text-xl font-extrabold tracking-[-0.045em] sm:text-2xl">
              Your garden space
            </h2>
          </div>
          <p className="hidden text-xs text-muted sm:block">
            A grounded view of the things you’re growing.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map(
            ({ label, value, note, icon: Icon, gradient, iconColor, to }) => (
              <motion.button
                type="button"
                onClick={() => navigate(to)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.22 }}
                key={label}
                className="focus-ring cursor-pointer rounded-[22px] text-left"
              >
                <Card className="group relative overflow-hidden p-5">
                  <div
                    className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${gradient} opacity-75`}
                  />
                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div
                        className={`grid size-11 place-items-center rounded-[14px] bg-white/65 shadow-[0_4px_12px_rgb(29_74_45_/_0.06)] ${iconColor}`}
                      >
                        <Icon size={20} strokeWidth={1.8} />
                      </div>
                      <span className="text-[11px] font-bold text-[#42805a]">
                        ↗
                      </span>
                    </div>
                    <p className="mt-8 text-[28px] font-extrabold tracking-[-0.065em] text-ink">
                      {value}
                    </p>
                    <p className="mt-1 text-sm font-bold text-ink">{label}</p>
                    <p className="mt-1.5 text-[11px] font-medium text-muted">
                      {note}
                    </p>
                  </div>
                </Card>
              </motion.button>
            ),
          )}
        </div>
      </motion.section>

      <motion.section variants={item} className="mt-9">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand">
            Your toolkit
          </p>
          <h2 className="mt-2 text-xl font-extrabold tracking-[-0.045em] sm:text-2xl">
            Quick actions
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickActions.map(
            ({ title, description, icon: Icon, accent, iconTone, to }) => (
              <motion.button
                type="button"
                onClick={() => navigate(to)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.22 }}
                key={title}
                className="focus-ring group relative cursor-pointer overflow-hidden rounded-[22px] border border-line bg-surface p-5 text-left shadow-card"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${accent}`}
                />
                <div className="relative flex items-start justify-between">
                  <div
                    className={`grid size-12 place-items-center rounded-[15px] shadow-[0_7px_16px_rgb(34_61_43_/_0.13)] ${iconTone}`}
                  >
                    <Icon size={21} strokeWidth={1.8} />
                  </div>
                  <span className="grid size-9 place-items-center rounded-full border border-line bg-white/70 text-muted transition-all duration-200 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    <ArrowRight size={16} />
                  </span>
                </div>
                <div className="relative mt-8">
                  <h3 className="text-[15px] font-extrabold tracking-[-0.025em] text-ink">
                    {title}
                  </h3>
                  <p className="mt-2 max-w-[270px] text-xs leading-5 text-muted">
                    {description}
                  </p>
                </div>
              </motion.button>
            ),
          )}
        </div>
      </motion.section>

      <motion.section
        variants={item}
        className="mt-9 grid gap-5 xl:grid-cols-[1.38fr_.82fr]"
      >
        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
                Garden vitality
              </p>
              <h2 className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
                Health trend
              </h2>
            </div>
            <span className="rounded-lg bg-brand-soft px-2.5 py-1.5 text-xs font-bold text-brand-dark">
              Last 7 days
            </span>
          </div>
          <div className="mt-5 h-[210px] sm:h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={gardenTrend}
                margin={{ top: 6, right: 0, left: -24, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="garden-growth"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="rgb(var(--chart-primary))"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="100%"
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
                  tick={{
                    fill: 'rgb(var(--chart-label))',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                  dy={10}
                />
                <YAxis hide domain={[40, 100]} />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ stroke: 'rgb(var(--border))', strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="rgb(var(--chart-primary))"
                  strokeWidth={2.5}
                  fill="url(#garden-growth)"
                  activeDot={{
                    r: 4,
                    fill: 'rgb(var(--chart-primary))',
                    stroke: 'rgb(var(--card))',
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
                Care rhythm
              </p>
              <h2 className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
                Weekly activity
              </h2>
            </div>
            <Trees size={20} className="text-brand" />
          </div>
          <div className="mt-5 h-[210px] sm:h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={careActivity}
                margin={{ top: 12, right: 0, left: -30, bottom: 0 }}
                barCategoryGap="34%"
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
                  tick={{
                    fill: 'rgb(var(--chart-label))',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: 'rgb(var(--success-soft))' }}
                />
                <Bar
                  dataKey="value"
                  fill="rgb(var(--chart-primary))"
                  radius={[6, 6, 6, 6]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.section>
    </motion.div>
  );
}
