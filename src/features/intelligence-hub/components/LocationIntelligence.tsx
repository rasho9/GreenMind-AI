import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Crosshair, MapPin, Minus, Plus, Search } from 'lucide-react';
import { Button, Card } from '@/components/ui';
import {
  browserLocationService,
  geocodingService,
  type GeocodedPlace,
} from '@/services/platform/locationService';
import { toHubLocation } from '../services/intelligenceHubService';
import type { HubLocation } from '../types';

type SearchValues = { city: string };
type LocationIntelligenceProps = {
  location: HubLocation;
  onLocationChange: (location: HubLocation) => void;
  onNotice: (notice: string) => void;
};

export function LocationIntelligence({
  location,
  onLocationChange,
  onNotice,
}: LocationIntelligenceProps) {
  const { register, handleSubmit } = useForm<SearchValues>();
  const [results, setResults] = useState<GeocodedPlace[]>([]);
  const [zoom, setZoom] = useState(1);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const findCity = async ({ city }: SearchValues) => {
    setIsSearching(true);
    try {
      const matches = await geocodingService.search(city);
      setResults(matches);
      if (!matches.length)
        onNotice('No matching city was found. Try a broader search.');
    } catch {
      onNotice('City search is unavailable right now. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };
  const requestCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const coordinates = await browserLocationService.getCurrentPosition();
      onLocationChange(
        toHubLocation(await geocodingService.reverse(coordinates)),
      );
      onNotice('Location updated from browser coordinates.');
    } catch {
      onNotice(
        'Location permission was unavailable. Search a city to continue.',
      );
    } finally {
      setIsLocating(false);
    }
  };
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-4 border-b border-line px-5 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-muted">
            Location intelligence
          </p>
          <p className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
            {location.city}, {location.country}
          </p>
          <p className="mt-1 text-xs text-muted">
            {location.climateZone} · {location.growingSeason}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={isLocating}
          onClick={() => void requestCurrentLocation()}
          leftIcon={<Crosshair size={15} />}
        >
          {isLocating ? 'Locating' : 'Use current GPS'}
        </Button>
      </div>
      <div className="p-5 sm:p-6">
        <form onSubmit={handleSubmit(findCity)} className="flex gap-2">
          <label className="focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-canvas/50 px-3 text-muted">
            <Search size={15} />
            <input
              {...register('city', { required: true })}
              aria-label="Search city"
              placeholder="Search a city"
              className="min-w-0 flex-1 bg-transparent text-xs text-ink outline-none placeholder:text-muted/70"
            />
          </label>
          <Button type="submit" size="sm" disabled={isSearching}>
            {isSearching ? 'Searching' : 'Search'}
          </Button>
        </form>
        {results.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {results.map((place) => (
              <button
                type="button"
                key={`${place.city}-${place.country}`}
                onClick={() => {
                  onLocationChange(toHubLocation(place));
                  setResults([]);
                }}
                className="focus-ring rounded-lg border border-line bg-surface px-2.5 py-1.5 text-[11px] font-semibold text-muted hover:border-brand/30 hover:bg-brand-soft hover:text-brand-dark"
              >
                {place.city}, {place.country}
              </button>
            ))}
          </div>
        )}
        <div className="relative mt-5 min-h-[220px] overflow-hidden rounded-[19px] border border-brand/15 bg-[linear-gradient(135deg,#e8f3eb,#d7ebe0)]">
          <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgb(53_123_80_/_0.16)_1px,transparent_1px),linear-gradient(90deg,rgb(53_123_80_/_0.16)_1px,transparent_1px)] [background-size:28px_28px]" />
          <div className="absolute left-[16%] top-[17%] size-24 rounded-full border border-brand/12 bg-brand/8 blur-sm" />
          <div className="absolute bottom-[16%] right-[14%] size-20 rounded-full border border-brand/12 bg-brand/8 blur-sm" />
          <div className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-brand text-white shadow-[0_10px_24px_rgb(27_108_67_/_0.25)]">
            <MapPin size={19} fill="currentColor" />
          </div>
          <span className="absolute left-1/2 top-[calc(50%+32px)] -translate-x-1/2 rounded-lg bg-[#163d29] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
            {location.city}
          </span>
          <div className="absolute right-3 top-3 grid gap-1 rounded-xl border border-white/70 bg-surface/75 p-1 shadow-sm">
            <button
              type="button"
              className="focus-ring grid size-7 place-items-center rounded-lg text-muted hover:bg-brand-soft hover:text-brand"
              onClick={() => setZoom((value) => Math.min(3, value + 0.2))}
              aria-label="Zoom map in"
            >
              <Plus size={14} />
            </button>
            <button
              type="button"
              className="focus-ring grid size-7 place-items-center rounded-lg text-muted hover:bg-brand-soft hover:text-brand"
              onClick={() => setZoom((value) => Math.max(0.6, value - 0.2))}
              aria-label="Zoom map out"
            >
              <Minus size={14} />
            </button>
          </div>
          <p className="absolute bottom-3 left-3 rounded-lg bg-surface/75 px-2 py-1 text-[10px] font-bold text-brand-dark shadow-sm">
            Map zoom {Math.round(zoom * 100)}%
          </p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
          <div className="rounded-xl bg-canvas/55 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
              Coordinates
            </p>
            <p className="mt-1.5 font-extrabold text-ink">
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </p>
          </div>
          <div className="rounded-xl bg-canvas/55 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
              Soil
            </p>
            <p className="mt-1.5 font-extrabold text-ink">
              {location.soilType}
            </p>
          </div>
          <div className="rounded-xl bg-canvas/55 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
              Elevation
            </p>
            <p className="mt-1.5 font-extrabold text-ink">
              {location.elevation}
            </p>
          </div>
          <div className="rounded-xl bg-canvas/55 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
              Map source
            </p>
            <p className="mt-1.5 font-extrabold text-ink">OSM / Mapbox ready</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
