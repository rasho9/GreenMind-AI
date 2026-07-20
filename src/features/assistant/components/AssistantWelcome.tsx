import { motion } from 'framer-motion';
import {
  BookOpen,
  CloudSun,
  Leaf,
  ScanSearch,
  Sprout,
  Wheat,
} from 'lucide-react';

const suggestedPrompts = [
  {
    title: 'Recommend plants for my city',
    detail: 'Climate-aware ideas for your space',
    icon: Sprout,
  },
  {
    title: 'My tomato leaves are yellow',
    detail: 'Understand symptoms and next checks',
    icon: Leaf,
  },
  {
    title: 'Create a watering schedule',
    detail: 'A flexible rhythm for each plant',
    icon: CloudSun,
  },
  {
    title: 'Help me grow indoor plants',
    detail: 'Light, water, and low-maintenance care',
    icon: BookOpen,
  },
  {
    title: 'Suggest crops for my farm',
    detail: 'Seasonal direction for a larger space',
    icon: Wheat,
  },
  {
    title: 'Explain my disease scan',
    detail: 'Turn health signals into actions',
    icon: ScanSearch,
  },
];

type AssistantWelcomeProps = { onPrompt: (prompt: string) => void };

export function AssistantWelcome({ onPrompt }: AssistantWelcomeProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center py-8 sm:py-12">
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -10, 0], rotate: [-6, 3, -6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute right-[9%] top-[6%] size-28 rounded-full bg-brand-soft/70 blur-2xl"
      />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-[19px] bg-[linear-gradient(135deg,#266f4a,#50a66e)] text-white shadow-[0_14px_35px_rgb(26_94_58_/_0.25)]">
          <Sprout size={27} />
        </span>
        <p className="mt-6 text-sm font-semibold text-brand-dark">
          Good Morning 👋
        </p>
        <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-[-0.055em] sm:text-4xl">
          How can GreenMind AI help you today?
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
          Ask a garden question, unpack a plant signal, or turn your growing
          context into a calm next step.
        </p>
      </motion.div>

      <div className="relative mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {suggestedPrompts.map(({ title, detail, icon: Icon }, index) => (
          <motion.button
            key={title}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + index * 0.045 }}
            onClick={() => onPrompt(title)}
            className="focus-ring group rounded-[20px] border border-line bg-surface p-4 text-left shadow-card transition-all hover:-translate-y-1 hover:border-brand/30 hover:shadow-elevated"
          >
            <span className="grid size-10 place-items-center rounded-[14px] bg-brand-soft text-brand transition-transform duration-200 group-hover:scale-110">
              <Icon size={19} />
            </span>
            <p className="mt-4 text-sm font-extrabold tracking-[-0.02em]">
              {title}
            </p>
            <p className="mt-1.5 text-xs leading-5 text-muted">{detail}</p>
          </motion.button>
        ))}
      </div>
      <p className="relative mt-6 text-center text-[11px] leading-5 text-muted">
        GreenMind AI uses your connected workspace context when it is helpful.
        Always review garden advice against local conditions.
      </p>
    </div>
  );
}
