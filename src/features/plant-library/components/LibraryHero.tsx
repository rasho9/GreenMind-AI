import { motion } from 'framer-motion';
import { BookOpen, Leaf, Sparkles, Sprout } from 'lucide-react';
import { Badge } from '@/components/ui';

export function LibraryHero() {
  return (
    <section className="relative overflow-hidden rounded-[24px] border border-[#d6e9dc] bg-[radial-gradient(circle_at_84%_28%,rgba(158,221,178,.5),transparent_21%),radial-gradient(circle_at_9%_115%,rgba(215,241,222,.9),transparent_36%),linear-gradient(120deg,#fbfefb,#edf7ef)] px-6 py-8 sm:px-8 sm:py-10 lg:px-10">
      <div className="absolute -right-12 -top-16 size-72 rounded-full border border-brand/10" />
      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
        <div>
          <Badge>Living plant intelligence</Badge>
          <h1 className="mt-5 max-w-2xl text-balance text-3xl font-extrabold tracking-[-0.065em] text-ink sm:text-[42px]">
            Plant Library
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-[15px]">
            A calmer, smarter way to understand every plant—from first leaf to a
            thriving harvest.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#43745a]">
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand" />
              AI-guided growing context
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand" />
              Care knowledge that stays practical
            </span>
          </div>
        </div>
        <div className="relative mx-auto grid size-[210px] place-items-center sm:size-[240px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border border-brand/15 border-dashed"
          />
          <div className="absolute inset-7 rounded-full border border-brand/15 bg-white/35" />
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4.3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative grid size-24 place-items-center rounded-[29px] border border-white/85 bg-white/70 text-brand shadow-[0_18px_32px_rgb(34_117_70_/_0.14)]"
          >
            <BookOpen size={43} strokeWidth={1.35} />
            <span className="absolute -right-3 -top-3 grid size-9 place-items-center rounded-xl bg-[#f3cb74] text-[#725623] shadow-sm">
              <Sparkles size={16} />
            </span>
          </motion.div>
          <motion.div
            animate={{ rotate: [-12, 5, -12], y: [0, 5, 0] }}
            transition={{ duration: 5.1, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-2 top-[32%] text-[#65a57a]"
          >
            <Leaf size={25} fill="currentColor" />
          </motion.div>
          <div className="absolute bottom-[17%] right-4 grid size-10 place-items-center rounded-2xl border border-white/70 bg-white/65 text-brand shadow-sm">
            <Sprout size={20} />
          </div>
        </div>
      </div>
    </section>
  );
}
