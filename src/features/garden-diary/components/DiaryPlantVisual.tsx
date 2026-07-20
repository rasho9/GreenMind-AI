import { Sparkles } from 'lucide-react';
import type { DiaryPlant } from '../types';

const tones = {
  tomato: 'from-[#e5f0dc] via-[#f8f8e9] to-[#d5e8d5] text-[#4e8a42]',
  basil: 'from-[#d7efde] via-[#eef8ef] to-[#cbe3d0] text-[#357f4b]',
  jasmine: 'from-[#f5efd9] via-[#fbf8ec] to-[#e2edd9] text-[#a37b30]',
  pepper: 'from-[#e0efdc] via-[#f5f8e9] to-[#d3e7d5] text-[#5e8942]',
};

export function DiaryPlantVisual({
  plant,
  large = false,
}: {
  plant: DiaryPlant;
  large?: boolean;
}) {
  const photo = plant.photoUrl;
  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden bg-gradient-to-br ${tones[plant.visual]} ${large ? 'min-h-[250px] rounded-[21px] sm:min-h-[330px]' : 'size-[76px] rounded-[17px]'}`}
    >
      {photo ? (
        <img
          src={photo}
          alt={plant.name}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <>
          <div
            className={`absolute rounded-full border border-current/10 ${large ? 'size-52' : 'size-14'}`}
          />
          <div
            className={`absolute rounded-full border border-current/10 ${large ? 'size-36' : 'size-10'}`}
          />
          <span
            className={`relative rounded-[28%_72%_70%_30%/30%_30%_70%_70%] border-2 border-current/60 bg-current/15 ${large ? 'size-20' : 'size-8'}`}
          />
        </>
      )}
      <span
        className={`absolute grid place-items-center rounded-full bg-white/65 text-current shadow-sm ${large ? 'right-5 top-5 size-10' : 'right-2 top-2 size-5'}`}
      >
        <Sparkles size={large ? 17 : 10} />
      </span>
      <span
        className={`absolute rounded-full bg-white/65 font-bold uppercase tracking-[0.08em] ${large ? 'bottom-5 left-5 px-3 py-1.5 text-[10px]' : 'bottom-2 left-2 px-1.5 py-0.5 text-[8px]'}`}
      >
        {plant.currentStage}
      </span>
    </div>
  );
}
