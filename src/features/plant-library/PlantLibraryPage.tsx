import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Clock3, Flame, Sparkles, Star } from 'lucide-react';
import { Card, SectionHeader } from '@/components/ui';
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

export function PlantLibraryPage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<PlantFilters>(emptyFilters);
  const [aiNote, setAiNote] = useState('');
  const favorites = usePlantLibraryStore((state) => state.favorites);
  const bookmarks = usePlantLibraryStore((state) => state.bookmarks);
  const recentlyViewed = usePlantLibraryStore((state) => state.recentlyViewed);
  const compareIds = usePlantLibraryStore((state) => state.compareIds);
  const toggleFavorite = usePlantLibraryStore((state) => state.toggleFavorite);
  const toggleBookmark = usePlantLibraryStore((state) => state.toggleBookmark);
  const toggleCompare = usePlantLibraryStore((state) => state.toggleCompare);
  const clearCompare = usePlantLibraryStore((state) => state.clearCompare);
  const plants = useMemo(
    () => plantLibraryService.search(query, filters),
    [query, filters],
  );
  const suggestions = useMemo(
    () => plantLibraryService.getSuggestions(query),
    [query],
  );
  const comparePlants = plantCatalog.filter((plant) =>
    compareIds.includes(plant.id),
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
  const runAiSearch = () =>
    setAiNote(
      query
        ? `GPT-5.6-style search analysis found ${plants.length || 'a focused set of'} plant matches for “${query}”. Refine climate or difficulty to make the guidance even more specific.`
        : 'Ask in natural language—try “easy herbs for a warm balcony” or start with a plant name. The future AI service will turn this catalog context into a tailored answer.',
    );
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
        />
        <AnimatePresence>
          {aiNote && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-3 flex items-start gap-3 rounded-xl border border-[#c8e2d0] bg-[#eff8f1] p-4 text-xs leading-5 text-[#346849]"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand text-white">
                <Bot size={16} />
              </span>
              <span>
                <b>AI Search preview: </b>
                {aiNote}
              </span>
              <button
                type="button"
                onClick={() => setAiNote('')}
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
              designed to layer your climate, space, and season on top of plant
              knowledge.
            </p>
            <p className="mt-5 text-[11px] font-bold text-[#b9e5c5]">
              GPT-5.6 analysis surface · coming to the service layer
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
      <PlantComparison plants={comparePlants} onClear={clearCompare} />
      <section className="mt-10">
        <SectionHeader
          eyebrow="Complete catalog"
          title="Explore the plant library"
          description={
            query ||
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
          {plants.length ? (
            plants.map(renderCard)
          ) : (
            <div className="col-span-full rounded-[22px] border border-dashed border-line bg-surface px-6 py-12 text-center">
              <p className="text-sm font-extrabold">
                No plants match that combination yet.
              </p>
              <p className="mt-2 text-xs leading-5 text-muted">
                Try clearing a filter or searching by a broader climate or
                category.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
