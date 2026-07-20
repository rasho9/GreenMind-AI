import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Clock3, Flame, Sparkles, Star } from 'lucide-react';
import { AsyncState, Card, SectionHeader, Skeleton } from '@/components/ui';
import { aiClient } from '@/services/ai';
import { clientEnvironment } from '@/services/platform';
import { plantClient } from '@/services/plants';
import {
  LibraryFilters,
  LibraryHero,
  LibrarySearch,
  PlantCard,
  PlantComparison,
} from './components';
import {
  plantCatalog,
  plantLibraryService,
  providerPlantToLibraryPlant,
} from './services/plantLibraryService';
import { usePlantLibraryStore } from './store/usePlantLibraryStore';
import type { Plant, PlantFilters } from './types';

const emptyFilters: PlantFilters = {
  categories: [],
  season: '',
  country: '',
  climate: '',
  difficulty: '',
};

/**
 * Local catalogue content remains available when live services are explicitly
 * disabled. With live services on, every typed search uses /api/plants/search
 * and provider failures are presented instead of being replaced with catalogue data.
 */
export function PlantLibraryPage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<PlantFilters>(emptyFilters);
  const [aiNote, setAiNote] = useState('');
  const [aiError, setAiError] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [providerPlants, setProviderPlants] = useState<Plant[]>([]);
  const [providerError, setProviderError] = useState('');
  const [isProviderLoading, setIsProviderLoading] = useState(false);
  const liveServicesEnabled = clientEnvironment.liveServicesEnabled;

  const favorites = usePlantLibraryStore((state) => state.favorites);
  const bookmarks = usePlantLibraryStore((state) => state.bookmarks);
  const recentlyViewed = usePlantLibraryStore((state) => state.recentlyViewed);
  const compareIds = usePlantLibraryStore((state) => state.compareIds);
  const toggleFavorite = usePlantLibraryStore((state) => state.toggleFavorite);
  const toggleBookmark = usePlantLibraryStore((state) => state.toggleBookmark);
  const toggleCompare = usePlantLibraryStore((state) => state.toggleCompare);
  const clearCompare = usePlantLibraryStore((state) => state.clearCompare);

  useEffect(() => {
    if (!liveServicesEnabled) return;
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 2) {
      setProviderPlants([]);
      setProviderError('');
      setIsProviderLoading(false);
      return;
    }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      setIsProviderLoading(true);
      setProviderError('');
      void plantClient
        .search(
          {
            query: normalizedQuery,
            indoor: filters.categories.includes('Indoor Plants')
              ? true
              : undefined,
          },
          controller.signal,
        )
        .then((profiles) => {
          if (!controller.signal.aborted) {
            setProviderPlants(profiles.map(providerPlantToLibraryPlant));
          }
        })
        .catch((error: unknown) => {
          if (!controller.signal.aborted) {
            setProviderPlants([]);
            setProviderError(
              error instanceof Error
                ? error.message
                : 'Live plant data could not be retrieved. Please try again.',
            );
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsProviderLoading(false);
        });
    }, 280);
    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [filters.categories, liveServicesEnabled, query]);

  const plants = useMemo(
    () =>
      liveServicesEnabled
        ? providerPlants
        : plantLibraryService.search(query, filters),
    [filters, liveServicesEnabled, providerPlants, query],
  );
  const suggestions = useMemo(
    () =>
      liveServicesEnabled
        ? providerPlants.slice(0, 5)
        : plantLibraryService.getSuggestions(query),
    [liveServicesEnabled, providerPlants, query],
  );
  const comparePlants = (liveServicesEnabled ? plants : plantCatalog).filter(
    (plant) => compareIds.includes(plant.id),
  );

  const renderCard = (plant: Plant) => (
    <PlantCard
      key={plant.id}
      plant={plant}
      favorite={favorites.includes(plant.id)}
      bookmarked={bookmarks.includes(plant.id)}
      compared={compareIds.includes(plant.id)}
      compareDisabled={compareIds.length >= 2}
      onFavorite={() => toggleFavorite(plant.id)}
      onBookmark={() => toggleBookmark(plant.id)}
      onCompare={() => toggleCompare(plant.id)}
    />
  );

  const runAiSearch = async () => {
    const searchTerm = query.trim();
    if (!searchTerm) {
      setAiError('Enter a plant or growing need before asking GreenMind AI.');
      return;
    }
    setIsAiLoading(true);
    setAiError('');
    setAiNote('');
    try {
      const output = await aiClient.complete({
        task: 'assistant',
        input: `Help me interpret the Plant Library search for "${searchTerm}". Explain the most relevant choices in practical, concise Markdown. Do not invent plant records that are not in the supplied results.`,
        context: plants.slice(0, 8).map((plant) => ({
          module: 'Plant Library',
          label: plant.name,
          detail: `${plant.scientificName}; ${plant.description}`,
        })),
      });
      setAiNote(output);
    } catch (error) {
      setAiError(
        error instanceof Error
          ? error.message
          : 'GreenMind AI could not analyze this search. Please try again.',
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div>
      <LibraryHero />
      <section className="mt-8">
        <LibrarySearch
          query={query}
          onQueryChange={setQuery}
          suggestions={suggestions}
          onSelect={(plant) => setQuery(plant.name)}
          onAiSearch={runAiSearch}
          isAiLoading={isAiLoading}
        />
        <AnimatePresence>
          {(aiNote || aiError) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className={`mt-3 flex items-start gap-3 rounded-xl border p-4 text-xs leading-5 ${aiError ? 'border-[#efd0c9] bg-[#fff6f4] text-[#a64f44]' : 'border-[#c8e2d0] bg-[#eff8f1] text-[#346849]'}`}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand text-white">
                <Bot size={16} />
              </span>
              <span>
                <b>{aiError ? 'AI Search unavailable: ' : 'AI Search: '}</b>
                {aiError || aiNote}
              </span>
              <button
                type="button"
                onClick={() => {
                  setAiNote('');
                  setAiError('');
                }}
                className="ml-auto text-[11px] font-bold text-brand"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
      <section className="mt-4">
        <LibraryFilters filters={filters} onChange={setFilters} />
      </section>

      {!liveServicesEnabled && (
        <>
          <section className="mt-9">
            <SectionHeader
              eyebrow="Editors’ picks"
              title="Featured plants"
              description="A few thoughtful starting points for productive, beautiful growing."
            />
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {plantCatalog.slice(0, 3).map(renderCard)}
            </div>
          </section>
          <section className="mt-9 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
            <Card className="relative overflow-hidden bg-[#183f2b] p-5 text-white shadow-[0_14px_32px_rgb(18_62_42_/_0.18)] sm:p-6">
              <div className="absolute -right-7 -top-8 size-40 rounded-full bg-[#8dd0a5]/15 blur-2xl" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-[#b8e8c5]">
                    <Sparkles size={19} />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#b9ddc4]">
                    AI plant insight
                  </span>
                </div>
                <p className="mt-5 max-w-xl text-sm leading-6 text-white/85">
                  The right plant is more than a category match. GreenMind is
                  designed to layer your climate, space, and season on top of
                  plant knowledge.
                </p>
                <p className="mt-5 text-[11px] font-bold text-[#b9e5c5]">
                  Connect live services to use real provider records and AI
                  search.
                </p>
              </div>
            </Card>
            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-[#f4eed9] text-[#9d7c30]">
                  <Flame size={19} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">
                    Trending now
                  </p>
                  <h3 className="mt-1 text-lg font-extrabold tracking-[-0.04em]">
                    Fast-growing favorites
                  </h3>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {plantCatalog.slice(0, 3).map((plant, index) => (
                  <button
                    key={plant.id}
                    type="button"
                    onClick={() => setQuery(plant.name)}
                    className="focus-ring rounded-xl border border-line bg-canvas/45 p-3 text-left transition-colors hover:border-brand/30 hover:bg-brand-soft/30"
                  >
                    <span className="text-[10px] font-bold text-brand">
                      0{index + 1}
                    </span>
                    <p className="mt-3 text-xs font-extrabold leading-4 text-ink">
                      {plant.name}
                    </p>
                    <p className="mt-1 text-[10px] text-muted">
                      {plant.suitability}% match
                    </p>
                  </button>
                ))}
              </div>
            </Card>
          </section>
          <section className="mt-9">
            <SectionHeader
              eyebrow="Recently explored"
              title="Pick up where you left off"
              description="Your recently viewed plant knowledge, ready when you are."
              action={
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-muted">
                  <Clock3 size={15} />
                  Session history
                </span>
              }
            />
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {recentlyViewed
                .map((id) => plantLibraryService.getById(id))
                .filter((plant): plant is Plant => Boolean(plant))
                .map(renderCard)}
            </div>
          </section>
        </>
      )}

      <PlantComparison plants={comparePlants} onClear={clearCompare} />
      <section className="mt-10">
        <SectionHeader
          eyebrow={
            liveServicesEnabled ? 'Live provider search' : 'Complete catalog'
          }
          title={
            liveServicesEnabled
              ? 'Search live plant data'
              : 'Explore the plant library'
          }
          description={
            liveServicesEnabled
              ? query.trim().length < 2
                ? 'Enter at least two characters to search the connected plant data provider.'
                : `${plants.length} live plant records match your current search.`
              : query ||
                  filters.categories.length ||
                  filters.season ||
                  filters.country ||
                  filters.difficulty
                ? `${plants.length} plants match your current search.`
                : 'A growing reference for productive and beautiful spaces.'
          }
          action={
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-muted">
              <Star size={15} className="text-brand" />
              Favorites: {favorites.length}
            </span>
          }
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {liveServicesEnabled && isProviderLoading ? (
            [0, 1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-[350px]" />
            ))
          ) : liveServicesEnabled && providerError ? (
            <div className="col-span-full">
              <AsyncState
                title="Live plant data is unavailable"
                description={providerError}
                onRetry={() => setQuery((value) => `${value} `)}
              />
            </div>
          ) : plants.length ? (
            plants.map(renderCard)
          ) : (
            <div className="col-span-full rounded-[22px] border border-dashed border-line bg-surface px-6 py-12 text-center">
              <p className="text-sm font-extrabold">
                {liveServicesEnabled
                  ? 'Start a live plant search.'
                  : 'No plants match that combination yet.'}
              </p>
              <p className="mt-2 text-xs leading-5 text-muted">
                {liveServicesEnabled
                  ? 'Search by common name, scientific name, or plant type to query the connected provider.'
                  : 'Try clearing a filter or searching by a broader climate or category.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
