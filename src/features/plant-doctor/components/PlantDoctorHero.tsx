import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react';

export function PlantDoctorHero() {
  return (
    <section className="premium-hero relative overflow-hidden rounded-[28px] border border-[#cfe8d7] bg-[radial-gradient(circle_at_92%_5%,rgb(201_239_211_/_0.9),transparent_25%),linear-gradient(125deg,#f8fffa,#e5f6e9)] px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -10, 0], rotate: [-6, 2, -6] }}
        transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-6 top-5 grid size-36 place-items-center rounded-full border border-white/70 bg-white/40 text-brand/25 shadow-[0_18px_50px_rgb(24_83_50_/_0.08)] backdrop-blur"
      >
        <Activity size={72} strokeWidth={1.2} />
      </motion.div>
      <motion.span
        aria-hidden="true"
        animate={{ y: [0, 8, 0], rotate: [16, 5, 16] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-4 right-[19%] size-10 rounded-tl-[24px] rounded-br-[24px] rounded-tr-md rounded-bl-md bg-brand/15"
      />
      <div className="relative max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-surface/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-dark shadow-sm backdrop-blur">
          <span className="grid size-5 place-items-center rounded-full bg-brand text-white">
            <Stethoscope size={12} />
          </span>
          AI plant health intelligence
        </div>
        <h1 className="mt-5 max-w-xl text-balance text-3xl font-extrabold tracking-[-0.055em] text-ink sm:text-4xl">
          🌿 AI Plant Doctor
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-[15px]">
          Upload a photo of any plant and GreenMind AI will analyze its health,
          detect diseases, identify nutrient deficiencies, and provide treatment
          recommendations.
        </p>
        <div className="mt-6 flex flex-wrap gap-2.5 text-xs font-semibold text-brand-dark">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-brand/10 bg-surface/70 px-3 py-2 shadow-sm">
            <ShieldCheck size={15} className="text-brand" />
            Structured, reviewable screening
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-brand/10 bg-surface/70 px-3 py-2 shadow-sm">
            <Sparkles size={15} className="text-brand" />
            Ready for Gemini Vision
          </span>
        </div>
      </div>
    </section>
  );
}
