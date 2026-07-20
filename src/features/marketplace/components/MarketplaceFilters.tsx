import { SlidersHorizontal, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button, Card } from '@/components/ui';
import { marketplaceCategoryOptions } from '../services/marketplaceService';
import {
  marketplaceCategories,
  type MarketplaceFilters as MarketplaceFiltersState,
} from '../types';

export function MarketplaceFilters({
  filters,
  onChange,
  onReset,
}: {
  filters: MarketplaceFiltersState;
  onChange: (next: MarketplaceFiltersState) => void;
  onReset: () => void;
}) {
  const update = <K extends keyof MarketplaceFiltersState>(
    key: K,
    value: MarketplaceFiltersState[K],
  ) => onChange({ ...filters, [key]: value });
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-extrabold text-text-primary">
          <SlidersHorizontal size={17} className="text-success" /> Smart filters
        </div>
        <button
          type="button"
          onClick={onReset}
          className="focus-ring inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] font-bold text-text-secondary hover:bg-success-soft hover:text-success-text"
        >
          <X size={14} /> Reset
        </button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <FilterSelect
          label="Category"
          value={filters.category}
          onChange={(value) =>
            update('category', value as MarketplaceFiltersState['category'])
          }
        >
          {marketplaceCategoryOptions.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </FilterSelect>
        <FilterSelect
          label="Plant type"
          value={filters.plantType}
          onChange={(value) => update('plantType', value)}
        >
          <option value="">Any plant</option>
          <option>Tomato</option>
          <option>Rose</option>
          <option>Indoor plants</option>
          <option>Vegetables</option>
        </FilterSelect>
        <FilterSelect
          label="Disease / problem"
          value={filters.disease}
          onChange={(value) => update('disease', value)}
        >
          <option value="">Any problem</option>
          <option>Early blight</option>
          <option>Aphids</option>
          <option>Root rot</option>
          <option>Fungal</option>
        </FilterSelect>
        <FilterSelect
          label="Weather"
          value={filters.weather}
          onChange={(value) => update('weather', value)}
        >
          <option value="">Any condition</option>
          <option>Rain</option>
          <option>Heat</option>
          <option>Dry soil</option>
        </FilterSelect>
        <FilterSelect
          label="Season"
          value={filters.season}
          onChange={(value) => update('season', value)}
        >
          <option value="">Any season</option>
          <option>Summer</option>
          <option>Winter</option>
        </FilterSelect>
        <FilterSelect
          label="Price"
          value={String(filters.maxPrice)}
          onChange={(value) => update('maxPrice', Number(value))}
        >
          <option value="100">Any price</option>
          <option value="20">Up to $20</option>
          <option value="40">Up to $40</option>
        </FilterSelect>
        <FilterSelect
          label="Country"
          value={filters.country}
          onChange={(value) => update('country', value)}
        >
          <option value="">Any country</option>
          <option>Pakistan</option>
          <option>United Kingdom</option>
          <option>United States</option>
          <option>India</option>
        </FilterSelect>
        <FilterSelect
          label="Rating"
          value={String(filters.minimumRating)}
          onChange={(value) => update('minimumRating', Number(value))}
        >
          <option value="0">Any rating</option>
          <option value="4.5">4.5+ stars</option>
          <option value="4.8">4.8+ stars</option>
        </FilterSelect>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {marketplaceCategories.slice(0, 10).map((category) => (
          <button
            key={category}
            type="button"
            onClick={() =>
              update(
                'category',
                filters.category === category ? 'All' : category,
              )
            }
            className={`focus-ring rounded-full px-3 py-2 text-[12px] font-bold transition-colors ${filters.category === category ? 'bg-success text-white' : 'bg-background text-text-secondary hover:bg-success-soft hover:text-success-text'}`}
          >
            {category}
          </button>
        ))}
        <label className="ml-auto inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-2 text-[12px] font-bold text-success-text">
          <input
            type="checkbox"
            checked={filters.organicOnly}
            onChange={(event) => update('organicOnly', event.target.checked)}
            className="size-4 accent-[rgb(var(--success))]"
          />{' '}
          Organic only
        </label>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() =>
            update(
              'environment',
              filters.environment === 'Indoor' ? 'All' : 'Indoor',
            )
          }
        >
          Indoor
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() =>
            update(
              'environment',
              filters.environment === 'Outdoor' ? 'All' : 'Outdoor',
            )
          }
        >
          Outdoor
        </Button>
      </div>
    </Card>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="text-[12px] font-bold text-text-secondary">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring mt-1.5 h-11 w-full rounded-xl border border-border bg-card px-3 text-text-primary outline-none focus:border-success/50"
      >
        {children}
      </select>
    </label>
  );
}
