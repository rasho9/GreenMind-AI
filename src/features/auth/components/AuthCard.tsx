import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[24px] border border-line bg-surface p-6 shadow-[0_16px_50px_rgb(20_57_36_/_0.08)] sm:p-8"
    >
      <h1 className="text-2xl font-extrabold tracking-[-0.05em] text-ink sm:text-[28px]">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      <div className="mt-7">{children}</div>
    </motion.div>
  );
}
