import { ArrowRight, Scale, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Plant } from '../types';
import { Button, Card } from '@/components/ui';

const rows: Array<{ label: string; value: (plant: Plant) => string }> = [
  { label: 'Water', value: (plant) => plant.water },
  { label: 'Sunlight', value: (plant) => plant.sunlight },
  {
    label: 'Growth time',
    value: (plant) => plant.growthStages.at(-1)?.days ?? '—',
  },
  { label: 'Harvest', value: (plant) => plant.harvest },
  { label: 'Difficulty', value: (plant) => plant.difficulty },
  { label: 'Temperature', value: (plant) => plant.temperature },
  { label: 'Soil', value: (plant) => plant.soil },
  { label: 'Yield', value: (plant) => plant.yield },
];

export function PlantComparison({
  plants,
  onClear,
}: {
  plants: Plant[];
  onClear: () => void;
}) {
  if (!plants.length) return null;
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8"
    >
      <Card className="overflow-hidden border-[#cbe3d3]">
        <div className="flex flex-col gap-4 border-b border-line bg-brand-soft/35 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-brand text-white">
              <Scale size={19} />
            </span>
            <div>
              <h2 className="text-base font-extrabold tracking-[-0.03em]">
                Compare plants
              </h2>
              <p className="mt-1 text-[11px] text-muted">
                Choose up to two plants for a clear, side-by-side view.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="focus-ring inline-flex w-fit items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-bold text-brand hover:text-brand-dark"
          >
            <X size={14} />
            Clear
          </button>
        </div>
        {plants.length === 1 ? (
          <div className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-muted">
              Select one more plant from the library to unlock the detailed
              comparison.
            </p>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<ArrowRight size={14} />}
            >
              Choose another plant
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table w-full min-w-[610px] text-left">
              <thead>
                <tr className="border-b border-line bg-canvas/45">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
                    Care signal
                  </th>
                  {plants.map((plant) => (
                    <th
                      key={plant.id}
                      className="px-5 py-3 text-xs font-extrabold text-ink"
                    >
                      {plant.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ label, value }) => (
                  <tr
                    key={label}
                    className="border-b border-line last:border-0"
                  >
                    <td className="px-5 py-3 text-[11px] font-semibold text-muted">
                      {label}
                    </td>
                    {plants.map((plant) => (
                      <td
                        key={plant.id}
                        className="px-5 py-3 text-xs font-medium text-ink"
                      >
                        {value(plant)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </motion.section>
  );
}
