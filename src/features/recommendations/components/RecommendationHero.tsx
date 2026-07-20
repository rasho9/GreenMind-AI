import { motion } from 'framer-motion';
import { CircleDotDashed, Leaf, Sparkles, Sprout } from 'lucide-react';
import { Badge } from '@/components/ui';

export function RecommendationHero() {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-[#d7e9dc] bg-[radial-gradient(circle_at_82%_30%,rgba(169,223,185,.58),transparent_20%),radial-gradient(circle_at_11%_110%,rgba(215,241,222,.9),transparent_36%),linear-gradient(125deg,#fbfefb,#edf7ef)] px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
      <div className="absolute -right-10 -top-16 size-64 rounded-full border border-brand/10" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-center">
        <div>
          <Badge>Personal AI growing partner</Badge>
          <h1 className="mt-5 max-w-2xl text-balance text-3xl font-extrabold tracking-[-0.06em] text-ink sm:text-[40px]">
            🌱 Smart Plant Recommendation
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-[15px]">
            Tell GreenMind AI about your environment and we'll recommend the
            best plants.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#42745a]">
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand" />
              Climate-aware suggestions
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand" />
              Care plans that feel doable
            </span>
          </div>
        </div>
        <div className="relative mx-auto grid size-[220px] place-items-center sm:size-[250px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-brand/15 border-dashed"
          />
          <div className="absolute inset-7 rounded-full border border-brand/15 bg-white/35" />
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative grid size-24 place-items-center rounded-[30px] border border-white/85 bg-white/70 text-brand shadow-[0_16px_30px_rgb(39_120_73_/_0.14)] backdrop-blur-sm"
          >
            <Sprout size={46} strokeWidth={1.35} />
            <span className="absolute -right-3 -top-3 grid size-9 place-items-center rounded-xl bg-[#f4cb74] text-[#725623] shadow-sm">
              <Sparkles size={16} />
            </span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 6, 0], rotate: [-8, 3, -8] }}
            transition={{ duration: 4.7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-3 top-[34%] text-[#68a77c]"
          >
            <Leaf size={25} fill="currentColor" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[20%] right-5 grid size-10 place-items-center rounded-2xl border border-white/70 bg-white/60 text-brand shadow-sm"
          >
            <CircleDotDashed size={19} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
