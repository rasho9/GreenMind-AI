import {
  Bot,
  Flower2,
  Leaf,
  Lightbulb,
  PackageOpen,
  Scissors,
  ShieldCheck,
  Shovel,
  Sprout,
  TreePine,
  Umbrella,
  Waves,
} from 'lucide-react';
import type { ProductVisual } from '../types';

const visualMap = {
  fertilizer: {
    icon: Sprout,
    tone: 'from-success-soft via-card to-[#dbeee1]',
    accent: 'text-success',
  },
  fungicide: {
    icon: ShieldCheck,
    tone: 'from-warning-soft via-card to-[#f8ead0]',
    accent: 'text-warning',
  },
  neem: {
    icon: Leaf,
    tone: 'from-success-soft via-card to-[#d9ecdf]',
    accent: 'text-success',
  },
  mulch: {
    icon: TreePine,
    tone: 'from-[#efe8dc] via-card to-[#e3f0e3]',
    accent: 'text-[#6e6040]',
  },
  stakes: {
    icon: TreePine,
    tone: 'from-[#edf2e8] via-card to-success-soft',
    accent: 'text-success',
  },
  soil: {
    icon: Shovel,
    tone: 'from-[#eee9df] via-card to-[#dcece0]',
    accent: 'text-[#6c5a39]',
  },
  'rain-cover': {
    icon: Umbrella,
    tone: 'from-[#e0edf1] via-card to-[#e8f2e9]',
    accent: 'text-[#30728a]',
  },
  sensor: {
    icon: Bot,
    tone: 'from-[#e5edf1] via-card to-success-soft',
    accent: 'text-[#39748a]',
  },
  drip: {
    icon: Waves,
    tone: 'from-[#e1eef2] via-card to-[#e8f5e8]',
    accent: 'text-[#367f94]',
  },
  'starter-kit': {
    icon: PackageOpen,
    tone: 'from-[#f1eadb] via-card to-success-soft',
    accent: 'text-[#8a6a2d]',
  },
  pruners: {
    icon: Scissors,
    tone: 'from-[#e8eeee] via-card to-[#ddebe0]',
    accent: 'text-[#4b6a58]',
  },
  'grow-light': {
    icon: Lightbulb,
    tone: 'from-[#f6efd9] via-card to-[#e6f1de]',
    accent: 'text-[#a27624]',
  },
  planter: {
    icon: Flower2,
    tone: 'from-[#f0e6df] via-card to-[#e4efe3]',
    accent: 'text-[#8b624a]',
  },
  compost: {
    icon: Sprout,
    tone: 'from-[#e7efe3] via-card to-[#f3eee2]',
    accent: 'text-success',
  },
} satisfies Record<
  ProductVisual,
  { icon: typeof Leaf; tone: string; accent: string }
>;

export function MarketplaceProductVisual({
  visual,
  size = 'md',
}: {
  visual: ProductVisual;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { icon: Icon, tone, accent } = visualMap[visual];
  const dimensions =
    size === 'lg' ? 'h-[280px] sm:h-[340px]' : size === 'sm' ? 'h-20' : 'h-40';
  return (
    <div
      className={`relative grid ${dimensions} overflow-hidden place-items-center bg-gradient-to-br ${tone}`}
      aria-hidden="true"
    >
      <span className="absolute -right-8 -top-8 size-28 rounded-full bg-white/65 blur-2xl" />
      <span className="absolute -bottom-9 -left-8 size-28 rounded-full bg-success/10 blur-2xl" />
      <span
        className={`relative grid size-16 place-items-center rounded-[22px] bg-card/80 shadow-card ${accent}`}
      >
        <Icon size={30} strokeWidth={1.5} />
      </span>
    </div>
  );
}
