import { useEffect, useState } from 'react';
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
import {
  ArrowLeft,
  Bookmark,
  BrainCircuit,
  Bug,
  CalendarDays,
  CheckCircle2,
  CloudSun,
  Droplets,
  Flower2,
  Heart,
  Leaf,
  Scissors,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
  ThermometerSun,
  Wheat,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AsyncState, Badge, Button, Card, SectionHeader, Skeleton } from '@/components/ui';
import { clientEnvironment } from '@/services/platform';
import { plantClient } from '@/services/plants';
import { PlantComparison, PlantVisual } from './components';
import {
  plantCatalog,
  plantLibraryService,
  providerPlantToLibraryPlant,
} from './services/plantLibraryService';
import { usePlantLibraryStore } from './store/usePlantLibraryStore';
import type { Plant } from './types';

const detailFields: Array<{
  label: string;
  key: keyof Pick<
    Plant,
    | 'family'
    | 'origin'
    | 'climate'
    | 'season'
    | 'harvest'
    | 'water'
    | 'sunlight'
    | 'soil'
    | 'temperature'
    | 'humidity'
    | 'yield'
  >;
  icon: LucideIcon;
}> = [
  { label: 'Family', key: 'family', icon: Leaf },
  { label: 'Origin', key: 'origin', icon: Flower2 },
  { label: 'Climate', key: 'climate', icon: CloudSun },
  { label: 'Growing season', key: 'season', icon: CalendarDays },
  { label: 'Harvest time', key: 'harvest', icon: Wheat },
  { label: 'Water requirement', key: 'water', icon: Droplets },
  { label: 'Sunlight', key: 'sunlight', icon: Sun },
  { label: 'Soil type', key: 'soil', icon: Sprout },
  { label: 'Temperature', key: 'temperature', icon: ThermometerSun },
  { label: 'Humidity', key: 'humidity', icon: Droplets },
  { label: 'Expected yield', key: 'yield', icon: Wheat },
];

export function PlantDetailsPage() {
  const { id } = useParams();
  const providerId = id?.match(/^provider-(\d+)$/)?.[1];
  const [providerPlant, setProviderPlant] = useState<Plant | null>(null);
  const [providerError, setProviderError] = useState('');
  const [isProviderLoading, setIsProviderLoading] = useState(Boolean(providerId));
  const favorites = usePlantLibraryStore((state) => state.favorites);
  const bookmarks = usePlantLibraryStore((state) => state.bookmarks);
  const compareIds = usePlantLibraryStore((state) => state.compareIds);
  const toggleFavorite = usePlantLibraryStore((state) => state.toggleFavorite);
  const toggleBookmark = usePlantLibraryStore((state) => state.toggleBookmark);
  const toggleCompare = usePlantLibraryStore((state) => state.toggleCompare);
  const markViewed = usePlantLibraryStore((state) => state.markViewed);
  const clearCompare = usePlantLibraryStore((state) => state.clearCompare);

  useEffect(() => {
    if (!providerId) return;
    if (!clientEnvironment.liveServicesEnabled) {
      setProviderError(
        'Live plant details are unavailable because live services are disabled.',
      );
      setIsProviderLoading(false);
      return;
    }
    const controller = new AbortController();
    setIsProviderLoading(true);
    setProviderError('');
    void plantClient
      .getById(providerId, controller.signal)
      .then((profile) => {
        if (!controller.signal.aborted) {
          setProviderPlant(providerPlantToLibraryPlant(profile));
        }
      })
      .catch((error: unknown) =>
        !controller.signal.aborted &&
        setProviderError(
          error instanceof Error
            ? error.message
            : 'Live plant details could not be retrieved. Please try again.',
        ),
      )
      .finally(() => {
        if (!controller.signal.aborted) setIsProviderLoading(false);
      });
    return () => controller.abort();
  }, [providerId]);

  const plant = providerId
    ? providerPlant ?? undefined
    : id
      ? plantLibraryService.getById(id)
      : undefined;
  useEffect(() => {
    if (plant) markViewed(plant.id);
  }, [markViewed, plant]);
  if (isProviderLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-[420px]" />
        <div className="grid gap-5 xl:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }
  if (providerError) {
    return (
      <AsyncState
        title="Live plant details are unavailable"
        description={providerError}
        onRetry={() => window.location.reload()}
      />
    );
  }
  if (!plant) return <Navigate to="/plant-library" replace />;
  const compared = compareIds.includes(plant.id);
  const comparePlants = [
    ...(plant.source === 'provider' ? [plant] : []),
    ...plantCatalog,
  ].filter((item) =>
    compareIds.includes(item.id),
  );
  return (
    <div>
      <Link
        to="/plant-library"
        className="focus-ring inline-flex items-center gap-2 rounded-lg text-xs font-bold text-muted transition-colors hover:text-brand-dark"
      >
        <ArrowLeft size={15} />
        Back to Plant Library
      </Link>
      <section className="mt-5 relative overflow-hidden rounded-[24px] border border-[#d0e6d6] bg-[radial-gradient(circle_at_90%_15%,rgba(181,226,193,.58),transparent_24%),linear-gradient(120deg,#fbfefb,#edf7ef)] p-5 sm:p-7">
        <div className="relative grid gap-6 lg:grid-cols-[minmax(250px,.82fr)_minmax(0,1.18fr)] lg:items-center">
          <PlantVisual plant={plant} large />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-brand text-white">
                {plant.source === 'provider' ? 'Live provider record' : 'Plant profile'}
              </Badge>
              {plant.source !== 'provider' && (
                <span className="rounded-lg bg-white/65 px-2.5 py-1.5 text-xs font-bold text-brand-dark">
                  {plant.suitability}% suitability
                </span>
              )}
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.06em] sm:text-[38px]">
              {plant.name}
            </h1>
            <p className="mt-2 text-sm italic text-muted">
              {plant.scientificName}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              {plant.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                size="sm"
                onClick={() => toggleFavorite(plant.id)}
                leftIcon={
                  <Heart
                    size={14}
                    fill={
                      favorites.includes(plant.id) ? 'currentColor' : 'none'
                    }
                  />
                }
              >
                {favorites.includes(plant.id) ? 'Favorited' : 'Favorite plant'}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toggleBookmark(plant.id)}
                leftIcon={
                  <Bookmark
                    size={14}
                    fill={
                      bookmarks.includes(plant.id) ? 'currentColor' : 'none'
                    }
                  />
                }
              >
                {bookmarks.includes(plant.id) ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled={compareIds.length >= 2 && !compared}
                onClick={() => toggleCompare(plant.id)}
              >
                {compared ? 'Remove from compare' : 'Compare plant'}
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-10 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
        <Card className="p-5 sm:p-6">
          <SectionHeader
            eyebrow="Plant overview"
            title="The essentials, made clear"
            description="A concise care profile for confident growing."
          />
          <div className="mt-5 grid gap-x-5 gap-y-4 sm:grid-cols-2">
            {detailFields.map(({ label, key, icon: Icon }) => (
              <div key={key} className="flex gap-3 border-b border-line pb-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                  <Icon size={15} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                    {label}
                  </p>
                  <p className="mt-1 text-xs font-bold leading-5 text-ink">
                    {plant[key]}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
              Suitable countries
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {plant.countries.map((country) => (
                <span
                  key={country}
                  className="rounded-lg bg-canvas px-2.5 py-1.5 text-[11px] font-semibold text-muted"
                >
                  {country}
                </span>
              ))}
            </div>
          </div>
        </Card>
        <Card className="relative overflow-hidden bg-[#183f2b] p-5 text-white shadow-[0_14px_32px_rgb(18_62_42_/_0.18)] sm:p-6">
          <div className="absolute -right-6 -top-8 size-40 rounded-full bg-[#8dd0a5]/15 blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#b9ddc4]">
                <BrainCircuit size={17} />
                {plant.source === 'provider' ? 'Live provider data' : 'GPT-5.6 Analysis'}
              </span>
              {plant.source !== 'provider' && (
                <span className="grid size-12 place-items-center rounded-full border-4 border-[#7ab68c] text-sm font-extrabold">
                  {plant.successRate}%
                </span>
              )}
            </div>
            <h2 className="mt-5 text-xl font-extrabold tracking-[-0.045em]">
              {plant.source === 'provider'
                ? 'A connected plant record, ready for your garden.'
                : 'A strong fit for warm, bright growing.'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/78">
              {plant.source === 'provider'
                ? 'Care fields below are supplied by the connected plant-data provider. GreenMind does not generate a suitability score for an unscored provider record.'
                : `This plant grows best in ${plant.climate.toLowerCase()} conditions and is recommended for ${plant.countries[0]}. Its current care profile stays approachable at an ${plant.difficulty.toLowerCase()} maintenance level.`}
            </p>
            <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-xs">
              <AiRow label="Best planting window" value={plant.season} />
              {plant.source !== 'provider' && (
                <AiRow label="Success rate" value={`${plant.successRate}%`} />
              )}
              <AiRow label="Maintenance" value={plant.difficulty} />
            </div>
          </div>
        </Card>
      </section>
      <section className="mt-10">
        <SectionHeader
          eyebrow="Growing rhythm"
          title="From first leaf to harvest"
          description="A simple timeline and care signals for the season ahead."
        />
        <div className="mt-5 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
          <Card className="p-5 sm:p-6">
            <div className="space-y-4">
              {plant.growthStages.map((stage, index) => (
                <div
                  key={stage.label}
                  className="relative flex gap-4 last:pb-0"
                >
                  <div className="flex flex-col items-center">
                    <span className="grid size-8 place-items-center rounded-full bg-brand text-[11px] font-extrabold text-white">
                      {index + 1}
                    </span>
                    {index < plant.growthStages.length - 1 && (
                      <span className="my-1 h-full w-px bg-brand/20" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-extrabold">
                      {stage.label}{' '}
                      <span className="ml-1 text-[11px] font-medium text-muted">
                        {stage.days}
                      </span>
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted">
                      {stage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
              Growth duration
            </p>
            <h3 className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
              Growth readiness chart
            </h3>
            <div className="mt-5 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={plant.growthTrend}
                  margin={{ top: 6, right: 0, left: -24, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="plant-growth"
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
                    dataKey="label"
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
                    dataKey="value"
                    stroke="rgb(var(--chart-primary))"
                    strokeWidth={2.5}
                    fill="url(#plant-growth)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </section>
      <section className="mt-10 grid gap-5 xl:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Water schedule
          </p>
          <h2 className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
            A week at a glance
          </h2>
          <div className="mt-5 h-[210px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={plant.waterSchedule}
                margin={{ top: 12, right: 0, left: -30, bottom: 0 }}
                barCategoryGap="35%"
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
                  contentStyle={{
                    borderRadius: 10,
                    borderColor: 'rgb(var(--border))',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
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
        <Card className="p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            AI growing tip
          </p>
          <div className="mt-4 flex gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <Sparkles size={20} />
            </span>
            <p className="text-sm leading-6 text-muted">{plant.aiTip}</p>
          </div>
          <div className="mt-6 rounded-xl border border-[#cbe4d3] bg-[#eff8f1] p-4 text-xs leading-5 text-[#326747]">
            <CheckCircle2 size={16} className="mr-2 inline text-brand" />
            <b>Success signal:</b> A {plant.successRate}% estimated success
            profile when light, watering, and soil drainage stay consistent.
          </div>
        </Card>
      </section>
      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Knowledge
          icon={Sprout}
          title="Fertilizer guide"
          content={plant.fertilizer}
        />
        <Knowledge
          icon={Bug}
          title="Common diseases"
          content={plant.diseases.join(', ')}
        />
        <Knowledge
          icon={ShieldCheck}
          title="Treatment"
          content={plant.treatment}
        />
        <Knowledge
          icon={Scissors}
          title="Pruning guide"
          content={plant.pruning}
        />
        <Knowledge
          icon={Leaf}
          title="Companion plants"
          content={plant.companions.join(', ')}
        />
        <Knowledge
          icon={Bug}
          title="Avoid nearby"
          content={plant.avoid.join(', ')}
        />
      </section>
      <section className="mt-10">
        <SectionHeader
          eyebrow="Little details"
          title="Interesting facts"
          description="A few reasons this plant continues to earn its place in gardens."
        />
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {plant.facts.map((fact, index) => (
            <motion.div whileHover={{ y: -4 }} key={fact}>
              <Card className="h-full p-5">
                <span className="grid size-8 place-items-center rounded-lg bg-brand-soft text-xs font-extrabold text-brand">
                  0{index + 1}
                </span>
                <p className="mt-4 text-sm font-semibold leading-6 text-ink">
                  {fact}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      <PlantComparison plants={comparePlants} onClear={clearCompare} />
    </div>
  );
}

function AiRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-white/60">{label}</span>
      <span className="text-right font-bold text-[#bce5c8]">{value}</span>
    </div>
  );
}
function Knowledge({
  icon: Icon,
  title,
  content,
}: {
  icon: LucideIcon;
  title: string;
  content: string;
}) {
  return (
    <Card className="p-5">
      <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
        <Icon size={19} />
      </span>
      <h3 className="mt-4 text-sm font-extrabold tracking-[-0.025em]">
        {title}
      </h3>
      <p className="mt-2 text-[11px] leading-5 text-muted">{content}</p>
    </Card>
  );
}
