import { useMemo, useState } from 'react';
import { Download, Heart, Search, Sprout, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, EmptyState } from '@/components/ui';
import type { PlantScan } from '../types';

type ScanHistoryProps = {
  scans: PlantScan[];
  onSelect: (scan: PlantScan) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDownload: (scan: PlantScan) => void;
};

const statusClass = {
  Healthy: 'status-success',
  Warning: 'status-warning',
  Critical: 'status-danger',
};

export function ScanHistory({
  scans,
  onSelect,
  onDelete,
  onToggleFavorite,
  onDownload,
}: ScanHistoryProps) {
  const [query, setQuery] = useState('');
  const visibleScans = useMemo(
    () =>
      scans.filter((scan) =>
        `${scan.analysis.plantName} ${scan.analysis.diseaseName}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, scans],
  );
  return (
    <section className="mt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand">
            Report history
          </p>
          <h2 className="mt-2">Recent plant screenings</h2>
          <p className="mt-2 text-sm text-muted">
            Every saved scan keeps the image, diagnosis, and follow-up status
            together.
          </p>
        </div>
        <label className="focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 flex h-12 w-full items-center gap-2 rounded-xl border border-line bg-surface px-3 text-muted transition-all sm:w-72">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search plant or disease"
            className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-muted/70"
            aria-label="Search scan history"
          />
        </label>
      </div>
      {visibleScans.length ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleScans.map((scan, index) => (
            <motion.article
              key={scan.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="group h-full overflow-hidden p-0 hover:-translate-y-0.5 hover:shadow-elevated">
                <div className="flex gap-3 p-4">
                  <button
                    type="button"
                    className="size-16 shrink-0 overflow-hidden rounded-[16px] bg-success-soft text-success"
                    onClick={() => onSelect(scan)}
                    aria-label={`Open ${scan.analysis.plantName} scan`}
                  >
                    {scan.imageUrl ? (
                      <img
                        src={scan.imageUrl}
                        alt={`${scan.analysis.plantName} scan`}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="grid size-full place-items-center">
                        <Sprout size={25} />
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => onSelect(scan)}
                  >
                    <p className="truncate text-lg font-extrabold">
                      {scan.analysis.plantName}
                    </p>
                    <p className="mt-1 truncate text-sm text-muted">
                      {scan.analysis.diseaseName}
                    </p>
                    <p className="mt-1 text-[13px] font-semibold text-muted">
                      {scan.date}
                    </p>
                  </button>
                  <button
                    type="button"
                    className={`focus-ring grid size-9 place-items-center rounded-lg ${scan.favorite ? 'text-danger' : 'text-muted hover:bg-brand-soft hover:text-brand'}`}
                    aria-label={
                      scan.favorite ? 'Remove from favorites' : 'Favorite scan'
                    }
                    onClick={() => onToggleFavorite(scan.id)}
                  >
                    <Heart
                      size={17}
                      fill={scan.favorite ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-line bg-canvas/35 px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1.5 text-[13px] font-bold ${statusClass[scan.analysis.status]}`}
                  >
                    {scan.analysis.status} - {scan.analysis.healthScore}% health
                  </span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => onSelect(scan)}
                  >
                    View Report
                  </Button>
                </div>
                <div className="flex justify-end gap-1 border-t border-line px-4 py-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="px-2"
                    aria-label="Download scan report"
                    onClick={() => onDownload(scan)}
                  >
                    <Download size={16} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="px-2 hover:text-danger"
                    aria-label="Delete scan"
                    onClick={() => onDelete(scan.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            icon={<Sprout size={22} />}
            title="No scans found"
            description="Try a different plant or disease name."
          />
        </div>
      )}
    </section>
  );
}
