import { useEffect, useRef, useState } from 'react';
import { Minus, Navigation, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Map as MapTilerMap } from '@maptiler/sdk';
import { Card } from '@/components/ui';
import { mapTilerClient } from '@/services/maps';

export function RecommendationMap({
  city,
  country,
  latitude,
  longitude,
}: {
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}) {
  const [zoom, setZoom] = useState(12);
  const [isCentered, setIsCentered] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapTilerMap | null>(null);
  const hasInteractiveMap =
    mapTilerClient.isConfigured() &&
    latitude !== undefined &&
    longitude !== undefined;

  useEffect(() => {
    if (!hasInteractiveMap || !mapContainerRef.current) return;
    const { apiKey, style } = mapTilerClient.getConfig();
    if (!apiKey) return;
    let isDisposed = false;
    void Promise.all([
      import('@maptiler/sdk'),
      import('@maptiler/sdk/dist/maptiler-sdk.css'),
    ]).then(([maptilersdk]) => {
      if (isDisposed || !mapContainerRef.current) return;
      maptilersdk.config.apiKey = apiKey;
      const map = new maptilersdk.Map({
        container: mapContainerRef.current,
        style,
        center: [longitude, latitude],
        zoom: 12,
        navigationControl: false,
      });
      map.addControl(
        new maptilersdk.NavigationControl({ showCompass: false }),
        'top-right',
      );
      new maptilersdk.Marker({ color: '#15803d' })
        .setLngLat([longitude, latitude])
        .setPopup(
          new maptilersdk.Popup({ offset: 20 }).setText(
            `${city || 'Garden location'}, ${country || ''}`,
          ),
        )
        .addTo(map);
      map.on('zoomend', () => setZoom(Math.round(map.getZoom())));
      mapRef.current = map;
    });
    return () => {
      isDisposed = true;
      const map = mapRef.current;
      mapRef.current = null;
      map?.remove();
    };
  }, [city, country, hasInteractiveMap, latitude, longitude]);

  const updateZoom = (nextZoom: number) => {
    const safeZoom = Math.max(6, Math.min(nextZoom, 18));
    setZoom(safeZoom);
    mapRef.current?.zoomTo(safeZoom);
  };
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-4">
        <div>
          <p className="text-[15px] font-bold text-ink">Environment map</p>
          <p className="mt-1 text-sm text-muted">
            Location context for this recommendation
          </p>
        </div>
        <span className="rounded-lg bg-brand-soft px-2.5 py-1.5 text-[13px] font-bold text-brand-dark">
          Zoom {zoom}
        </span>
      </div>
      <div className="relative h-[235px] overflow-hidden bg-[linear-gradient(135deg,#eaf5ed,#d6e9d9)]">
        {hasInteractiveMap && (
          <div
            ref={mapContainerRef}
            className="absolute inset-0"
            aria-label={`Interactive map centered on ${city || 'your growing space'}`}
          />
        )}
        {!hasInteractiveMap && (
          <>
            <div className="absolute inset-0 opacity-65 [background-image:linear-gradient(rgb(80_135_95_/_0.12)_1px,transparent_1px),linear-gradient(90deg,rgb(80_135_95_/_0.12)_1px,transparent_1px)] [background-size:34px_34px]" />
            <div className="absolute -left-8 top-12 h-28 w-[125%] rotate-[-13deg] rounded-full border-[16px] border-white/70" />
            <div className="absolute left-[14%] top-[10%] h-24 w-[78%] rotate-[20deg] rounded-full border-[12px] border-[#c9dfcf]/75" />
            <motion.div
              animate={{ y: isCentered ? [0, -5, 0] : [8, 0, 8] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            >
              <span className="grid size-12 place-items-center rounded-full border-4 border-white bg-brand text-white shadow-[0_10px_24px_rgb(21_95_52_/_0.28)]">
                <Navigation size={20} fill="currentColor" />
              </span>
              <span className="mx-auto block h-3 w-3 -translate-y-1 rotate-45 bg-brand" />
            </motion.div>
          </>
        )}
        <div className="absolute bottom-3 left-3 rounded-xl border border-white/70 bg-white/80 px-3 py-2 shadow-sm backdrop-blur">
          <p className="text-[13px] font-bold text-ink">
            {city || 'Your growing space'}, {country || 'Location pending'}
          </p>
          <p className="mt-1 text-[13px] text-muted">
            {latitude !== undefined
              ? `${latitude.toFixed(4)}, ${longitude?.toFixed(4)}`
              : 'Add a location to center the map'}
          </p>
        </div>
        <div className="absolute right-3 top-3 grid overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
          <button
            type="button"
            onClick={() => updateZoom(zoom + 1)}
            className="focus-ring grid size-9 place-items-center border-b border-line text-ink hover:bg-brand-soft"
            aria-label="Zoom map in"
          >
            <Plus size={17} />
          </button>
          <button
            type="button"
            onClick={() => updateZoom(zoom - 1)}
            className="focus-ring grid size-9 place-items-center text-ink hover:bg-brand-soft"
            aria-label="Zoom map out"
          >
            <Minus size={17} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsCentered((value) => !value);
            if (latitude !== undefined && longitude !== undefined) {
              mapRef.current?.flyTo({ center: [longitude, latitude], zoom });
            }
          }}
          className="focus-ring absolute bottom-3 right-3 rounded-xl border border-white/70 bg-white/80 px-3 py-2 text-[13px] font-bold text-brand-dark shadow-sm backdrop-blur hover:bg-white"
        >
          {isCentered ? 'Recenter' : 'Center pin'}
        </button>
      </div>
    </Card>
  );
}
