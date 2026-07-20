import { SlidersHorizontal } from 'lucide-react';
import type { PlantFilters } from '../types';

const categories = [
  'Vegetables',
  'Fruits',
  'Flowers',
  'Trees',
  'Indoor Plants',
  'Outdoor Plants',
  'Herbs',
  'Medicinal Plants',
  'Succulents',
  'Organic Farming',
  'Low Maintenance',
  'Pet Friendly',
  'Fast Growing',
  'Beginner Friendly',
];

export function LibraryFilters({
  filters,
  onChange,
}: {
  filters: PlantFilters;
  onChange: (filters: PlantFilters) => void;
}) {
  const toggle = (category: string) =>
    onChange({
      ...filters,
      categories: filters.categories.includes(category)
        ? filters.categories.filter((item) => item !== category)
        : [...filters.categories, category],
    });
  return (
    <div className="rounded-[20px] border border-line bg-surface p-4 shadow-card sm:p-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-xs font-extrabold text-ink">
          <SlidersHorizontal size={16} className="text-brand" />
          Explore by preference
        </span>
        <button
          type="button"
          onClick={() =>
            onChange({
              categories: [],
              season: '',
              country: '',
              climate: '',
              difficulty: '',
            })
          }
          className="focus-ring rounded-md text-[11px] font-bold text-brand hover:text-brand-dark"
        >
          Clear all
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => toggle(category)}
            className={`focus-ring rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold transition-all ${filters.categories.includes(category) ? 'border-brand bg-brand text-white' : 'border-line bg-surface text-muted hover:border-brand/35 hover:text-brand-dark'}`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-2 border-t border-line pt-4 sm:grid-cols-2 xl:grid-cols-4">
        <Select
          label="Season"
          value={filters.season}
          onChange={(season) => onChange({ ...filters, season })}
          options={['Spring', 'Summer', 'Autumn', 'Winter', 'Year-round']}
        />
        <Select
          label="Country"
          value={filters.country}
          onChange={(country) => onChange({ ...filters, country })}
          options={[
            'Pakistan',
            'United States',
            'United Kingdom',
            'Japan',
            'United Arab Emirates',
            'India',
          ]}
        />
        <Select
          label="Climate"
          value={filters.climate}
          onChange={(climate) => onChange({ ...filters, climate })}
          options={['Warm', 'Subtropical', 'Temperate', 'Arid', 'Tropical']}
        />
        <Select
          label="Difficulty"
          value={filters.difficulty}
          onChange={(difficulty) => onChange({ ...filters, difficulty })}
          options={['Easy', 'Moderate', 'Advanced']}
        />
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring mt-1.5 h-9 w-full rounded-lg border border-line bg-canvas/50 px-2.5 text-xs font-semibold normal-case tracking-normal text-ink outline-none focus:border-brand/60"
      >
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
