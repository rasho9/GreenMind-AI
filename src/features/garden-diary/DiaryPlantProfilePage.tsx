import { useMemo, useState, type ReactElement, type ReactNode } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowLeft,
  BrainCircuit,
  CalendarDays,
  Leaf,
  Sparkles,
  Sprout,
  Wheat,
} from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Button, Card, Modal, SectionHeader } from '@/components/ui';
import {
  DiaryEntryCard,
  DiaryEntryForm,
  DiaryPlantVisual,
  PhotoTimeline,
} from './components';
import { diaryAnalysisService } from './services/diaryAnalysisService';
import { useGardenDiaryStore } from './store/useGardenDiaryStore';
import type { DiaryEntryInput } from './types';

export function DiaryPlantProfilePage() {
  const { id } = useParams();
  const plants = useGardenDiaryStore((state) => state.plants);
  const allEntries = useGardenDiaryStore((state) => state.entries);
  const addEntry = useGardenDiaryStore((state) => state.addEntry);
  const [isLogOpen, setLogOpen] = useState(false);
  const plant = plants.find((item) => item.id === id);
  const entries = useMemo(
    () =>
      allEntries
        .filter((entry) => entry.plantId === plant?.id)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [allEntries, plant?.id],
  );
  if (!plant) return <Navigate to="/garden-diary" replace />;
  const chartData = entries.map((entry) => ({
    date: entry.date.slice(5),
    height: entry.height,
    health: entry.healthRating * 20,
    moisture: entry.soilMoisture,
    temperature: entry.weatherNotes.includes('Warm') ? 29 : 25,
    water: entry.waterGiven,
  }));
  const submitEntry = async (input: DiaryEntryInput) => {
    addEntry(input, await diaryAnalysisService.analyze(input));
  };
  return (
    <div>
      <Link
        to="/garden-diary"
        className="focus-ring inline-flex items-center gap-2 rounded-lg text-xs font-bold text-muted transition-colors hover:text-brand-dark"
      >
        <ArrowLeft size={15} />
        Back to Garden Diary
      </Link>
      <section className="relative mt-5 overflow-hidden rounded-[24px] border border-[#d0e6d6] bg-[radial-gradient(circle_at_91%_14%,rgba(182,226,193,.58),transparent_23%),linear-gradient(120deg,#fbfefb,#edf7ef)] p-5 sm:p-7">
        <div className="relative grid gap-6 lg:grid-cols-[minmax(250px,.82fr)_minmax(0,1.18fr)] lg:items-center">
          <DiaryPlantVisual plant={plant} large />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                {plant.currentStage}
              </span>
              <span className="rounded-lg bg-white/65 px-2.5 py-1.5 text-xs font-bold text-brand-dark">
                {plant.healthScore}% health
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.06em] sm:text-[38px]">
              {plant.name}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {plant.variety} · Planted {plant.plantingDate}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              {plant.notes ||
                'A living plant profile built from the care moments and observations you record.'}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric
                label="Current height"
                value={`${plant.height} cm`}
                icon={<Sprout size={15} />}
              />
              <Metric
                label="Harvest prediction"
                value={plant.expectedHarvest}
                icon={<Wheat size={15} />}
              />
              <Metric
                label="Growing area"
                value={plant.gardenArea}
                icon={<Leaf size={15} />}
              />
              <Metric
                label="Location"
                value={plant.location}
                icon={<CalendarDays size={15} />}
              />
            </div>
            <Button
              className="mt-5"
              size="sm"
              onClick={() => setLogOpen(true)}
              leftIcon={<Sparkles size={15} />}
            >
              Add growth observation
            </Button>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <SectionHeader
          eyebrow="Growth timeline"
          title="A record of real progress"
          description="Each observation makes the plant’s story more complete."
        />
        <div className="mt-5 grid gap-5 xl:grid-cols-[.85fr_1.15fr]">
          <PhotoTimeline entries={[...entries].reverse()} plants={[plant]} />
          <Card className="p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
              Growth height
            </p>
            <h2 className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
              Steady vertical growth
            </h2>
            <div className="mt-5 h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 6, right: 0, left: -24, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="diary-height"
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
                    dataKey="date"
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
                    contentStyle={{
                      borderRadius: 10,
                      borderColor: 'rgb(var(--border))',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="height"
                    stroke="rgb(var(--chart-primary))"
                    strokeWidth={2.5}
                    fill="url(#diary-height)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </section>
      <section className="mt-10 grid gap-5 xl:grid-cols-3">
        <ChartCard eyebrow="Health history" title="Plant vitality">
          <LineChart data={chartData}>
            <CartesianGrid
              vertical={false}
              stroke="rgb(var(--chart-grid))"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgb(var(--chart-label))', fontSize: 10 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                borderColor: 'rgb(var(--border))',
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="health"
              stroke="rgb(var(--chart-primary))"
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartCard>
        <ChartCard eyebrow="Watering history" title="Care rhythm">
          <BarChart data={chartData}>
            <CartesianGrid
              vertical={false}
              stroke="rgb(var(--chart-grid))"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgb(var(--chart-label))', fontSize: 10 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                borderColor: 'rgb(var(--border))',
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="water"
              fill="rgb(var(--chart-primary))"
              radius={[6, 6, 6, 6]}
            />
          </BarChart>
        </ChartCard>
        <ChartCard eyebrow="Moisture & temperature" title="Root conditions">
          <LineChart data={chartData}>
            <CartesianGrid
              vertical={false}
              stroke="rgb(var(--chart-grid))"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgb(var(--chart-label))', fontSize: 10 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                borderColor: 'rgb(var(--border))',
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="moisture"
              stroke="rgb(var(--chart-primary))"
              strokeWidth={2.2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="rgb(var(--warning))"
              strokeWidth={2.2}
              dot={false}
            />
          </LineChart>
        </ChartCard>
      </section>
      <section className="mt-10 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <div>
          <SectionHeader
            eyebrow="Diary entries"
            title="Every observation"
            description="A clear record of what you saw, did, and learned."
          />
          <div className="mt-5 space-y-3">
            {[...entries].reverse().map((entry) => (
              <DiaryEntryCard key={entry.id} entry={entry} plant={plant} />
            ))}
          </div>
        </div>
        <Card className="emphasis-card relative overflow-hidden !bg-[rgb(var(--emphasis-surface))] p-5 sm:p-6">
          <div className="absolute -right-6 -top-8 size-40 rounded-full bg-success/15 blur-2xl" />
          <div className="relative">
            <span className="emphasis-card-muted inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em]">
              <BrainCircuit size={17} />
              AI suggestions
            </span>
            <h2 className="mt-5 text-xl font-extrabold tracking-[-0.045em]">
              A confident next step.
            </h2>
            <p className="emphasis-card-muted mt-3 text-sm leading-6">
              {entries.at(-1)?.aiAnalysis ??
                'Add your first observation to unlock an AI growth signal.'}
            </p>
            <div className="mt-5 space-y-3 border-t border-border pt-4 text-xs leading-5">
              <p>
                <b className="emphasis-card-accent">Water schedule: </b>
                <span className="emphasis-card-muted">
                  Check the top 3 cm of soil every Monday, Thursday, and
                  Saturday.
                </span>
              </p>
              <p>
                <b className="emphasis-card-accent">Fertilizer history: </b>
                <span className="emphasis-card-muted">
                  {entries
                    .filter((entry) => entry.fertilizerApplied !== 'None')
                    .map((entry) => entry.fertilizerApplied)
                    .join(', ') || 'No fertilizer logged yet.'}
                </span>
              </p>
              <p>
                <b className="emphasis-card-accent">Harvest prediction: </b>
                <span className="emphasis-card-muted">
                  The current growth path points toward {plant.expectedHarvest}.
                </span>
              </p>
            </div>
            <p className="emphasis-card-accent mt-5 text-[10px] font-bold">
              Mock insight · GPT-5.6-ready service
            </p>
          </div>
        </Card>
      </section>
      <Modal
        isOpen={isLogOpen}
        onClose={() => setLogOpen(false)}
        title={`Add an observation for ${plant.name}`}
      >
        <DiaryEntryForm
          plants={[plant]}
          initialPlantId={plant.id}
          onSave={submitEntry}
          onClose={() => setLogOpen(false)}
        />
      </Modal>
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/85 bg-white/65 p-3">
      <span className="text-brand">{icon}</span>
      <p className="mt-2 text-[10px] font-medium text-muted">{label}</p>
      <p className="mt-1 text-[11px] font-bold leading-4 text-ink">{value}</p>
    </div>
  );
}
function ChartCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactElement;
}) {
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
        {title}
      </h2>
      <div className="mt-5 h-[210px]">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
