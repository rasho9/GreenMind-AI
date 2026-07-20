import { useForm } from 'react-hook-form';
import { Bot, Search, Sparkles } from 'lucide-react';
import type { Plant } from '../types';

type SearchValues = { query: string };

export function LibrarySearch({
  query,
  onQueryChange,
  suggestions,
  onSelect,
  onAiSearch,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  suggestions: Plant[];
  onSelect: (plant: Plant) => void;
  onAiSearch: () => void;
}) {
  const { register } = useForm<SearchValues>({ defaultValues: { query } });
  return (
    <div className="relative">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            aria-label="Search the plant library"
            placeholder="Search by plant, scientific name, climate, season, or country…"
            value={query}
            className="focus-ring h-12 w-full rounded-xl border border-line bg-surface py-0 pl-11 pr-4 text-sm text-ink shadow-[0_2px_8px_rgb(20_50_34_/_0.03)] outline-none transition-all placeholder:text-muted/65 focus:border-brand/60 focus:shadow-[0_0_0_3px_rgb(34_121_81_/_0.09)]"
            {...register('query', {
              onChange: (event) => onQueryChange(event.target.value),
            })}
          />
        </div>
        <button
          type="button"
          onClick={onAiSearch}
          className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#183f2b] px-4 text-xs font-bold text-white shadow-[0_8px_18px_rgb(18_62_42_/_0.14)] transition-all hover:-translate-y-0.5 hover:bg-[#123522]"
        >
          <Bot size={16} />
          AI Search <Sparkles size={13} className="text-[#b7e5c4]" />
        </button>
      </div>
      {query && suggestions.length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-elevated">
          <p className="px-2.5 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
            Suggested plants
          </p>
          {suggestions.map((plant) => (
            <button
              type="button"
              key={plant.id}
              onClick={() => onSelect(plant)}
              className="focus-ring flex w-full items-center justify-between rounded-lg px-2.5 py-2.5 text-left hover:bg-brand-soft/40"
            >
              <span>
                <span className="block text-xs font-bold text-ink">
                  {plant.name}
                </span>
                <span className="mt-0.5 block text-[10px] italic text-muted">
                  {plant.scientificName}
                </span>
              </span>
              <span className="text-[10px] font-bold text-brand">
                {plant.category}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
