import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { Plant } from '../types';

const tones = {
  tomato: 'from-[#e5f0dc] via-[#f8f8e9] to-[#d5e8d5] text-[#4e8a42]',
  basil: 'from-[#d7efde] via-[#eef8ef] to-[#cbe3d0] text-[#357f4b]',
  jasmine: 'from-[#f5efd9] via-[#fbf8ec] to-[#e2edd9] text-[#a37b30]',
  lemon: 'from-[#f2efd4] via-[#faf9e8] to-[#dcead7] text-[#9b8128]',
  aloe: 'from-[#deede0] via-[#f1f8f0] to-[#cfe3d3] text-[#3d824f]',
  snake: 'from-[#dbece0] via-[#f2f8f1] to-[#cde2d1] text-[#3c7a4b]',
};

export function PlantVisual({
  plant,
  large = false,
}: {
  plant: Plant;
  large?: boolean;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const Icon = plant.icon;
  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden bg-gradient-to-br ${tones[plant.visual]} ${large ? 'min-h-[270px] rounded-[21px] sm:min-h-[360px]' : 'h-[168px] rounded-[18px]'}`}
    >
      <div
        className={`absolute rounded-full border border-current/10 ${large ? 'size-[250px]' : 'size-40'}`}
      />
      <div
        className={`absolute rounded-full border border-current/10 ${large ? 'size-[165px]' : 'size-24'}`}
      />
      {plant.imageUrl && !imageFailed ? (
        <img
          src={plant.imageUrl}
          alt={`${plant.name} from the connected plant data provider`}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="relative h-full w-full object-cover"
        />
      ) : (
        <Icon className="relative" size={large ? 86 : 58} strokeWidth={1.25} />
      )}
      <span
        className={`absolute grid place-items-center rounded-full bg-white/65 text-current shadow-sm ${large ? 'right-5 top-5 size-10' : 'right-3 top-3 size-7'}`}
      >
        <Sparkles size={large ? 17 : 13} />
      </span>
      <span
        className={`absolute rounded-full bg-white/65 font-bold uppercase tracking-[0.08em] ${large ? 'bottom-5 left-5 px-3 py-1.5 text-[10px]' : 'bottom-3 left-3 px-2 py-1 text-[9px]'}`}
      >
        {plant.category}
      </span>
    </div>
  );
}
