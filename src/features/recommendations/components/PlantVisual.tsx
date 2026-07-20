import { Sparkles } from 'lucide-react';
import type { PlantRecommendation } from '../types';

const visuals = {
  tomato: 'from-[#e4f1dd] via-[#f5f7e8] to-[#d7ead8] text-[#4d8a43]',
  basil: 'from-[#d8f0df] via-[#eff8ef] to-[#cde5d0] text-[#337e4a]',
  pepper: 'from-[#e2f0df] via-[#f4f7e9] to-[#d4e8d6] text-[#638c42]',
  marigold: 'from-[#f5edcf] via-[#f9f6e9] to-[#e7f0d7] text-[#b27c2f]',
  spinach: 'from-[#dceee0] via-[#f2f8f1] to-[#cde3d4] text-[#3d7e4d]',
};

export function PlantVisual({
  plant,
  large = false,
}: {
  plant: PlantRecommendation;
  large?: boolean;
}) {
  const Icon = plant.icon;
  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden bg-gradient-to-br ${visuals[plant.visual]} ${large ? 'min-h-[250px] rounded-[20px] sm:min-h-[320px]' : 'size-[86px] rounded-[18px]'}`}
    >
      <div
        className={`absolute rounded-full border border-current/10 ${large ? 'size-[220px]' : 'size-16'} opacity-70`}
      />
      <div
        className={`absolute rounded-full border border-current/10 ${large ? 'size-[150px]' : 'size-11'} opacity-70`}
      />
      <Icon className="relative" size={large ? 78 : 34} strokeWidth={1.35} />
      <span
        className={`absolute grid place-items-center rounded-full bg-white/60 text-current shadow-sm ${large ? 'right-5 top-5 size-9' : 'right-2 top-2 size-5'}`}
      >
        <Sparkles size={large ? 16 : 10} />
      </span>
      <span
        className={`absolute bottom-3 left-3 rounded-full bg-white/65 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${large ? 'bottom-5 left-5 px-3 py-1.5 text-[10px]' : ''}`}
      >
        {plant.type}
      </span>
    </div>
  );
}
