import { CheckCircle2 } from 'lucide-react';
import type { PlantRecommendation } from '../types';

const difficultyTone = {
  Easy: 'text-[#277348] bg-[#e4f4e8]',
  Moderate: 'text-[#8d702e] bg-[#f7efd9]',
  Advanced: 'text-[#a84d42] bg-[#f8e4df]',
};

export function ComparisonTable({ plants }: { plants: PlantRecommendation[] }) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-card">
      <div className="overflow-x-auto">
        <table className="data-table w-full min-w-[760px] text-left">
          <thead className="border-b border-line bg-canvas/65">
            <tr>
              {[
                'Plant',
                'Difficulty',
                'Water',
                'Sunlight',
                'Growth time',
                'Yield',
                'Suitability',
              ].map((heading) => (
                <th
                  key={heading}
                  className="whitespace-nowrap px-5 py-4 text-[10px] font-bold uppercase tracking-[0.1em] text-muted"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plants.map((plant) => (
              <tr
                key={plant.name}
                className="border-b border-line last:border-0 hover:bg-brand-soft/25"
              >
                <td className="px-5 py-4">
                  <p className="text-xs font-extrabold text-ink">
                    {plant.name}
                  </p>
                  <p className="mt-1 text-[10px] text-muted">{plant.type}</p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-lg px-2 py-1 text-[10px] font-bold ${difficultyTone[plant.difficulty]}`}
                  >
                    {plant.difficulty}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs font-medium text-muted">
                  {plant.water}
                </td>
                <td className="px-5 py-4 text-xs font-medium text-muted">
                  {plant.sunlight}
                </td>
                <td className="px-5 py-4 text-xs font-medium text-muted">
                  {plant.growthTime}
                </td>
                <td className="px-5 py-4 text-xs font-medium text-muted">
                  {plant.yield}
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-dark">
                    <CheckCircle2 size={15} className="text-brand" />
                    {plant.confidence}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
