import { motion } from 'framer-motion';
import { Leaf, Sparkles, Sprout } from 'lucide-react';

const floatingLeaves = [
  { left: '11%', top: '18%', rotate: -18, delay: 0.1, size: 21 },
  { left: '78%', top: '14%', rotate: 35, delay: 0.7, size: 17 },
  { left: '76%', top: '67%', rotate: -35, delay: 1.1, size: 26 },
  { left: '15%', top: '72%', rotate: 22, delay: 0.45, size: 16 },
];

export function AuthVisual() {
  return (
    <div className="auth-visual relative flex h-full min-h-[720px] flex-col overflow-hidden bg-[radial-gradient(circle_at_80%_12%,rgba(150,222,177,.33),transparent_26%),radial-gradient(circle_at_16%_88%,rgba(123,202,149,.28),transparent_34%),linear-gradient(135deg,#123d29_0%,#1f6240_53%,#2f8855_100%)] p-10 text-white xl:p-14">
      <div className="absolute -right-24 top-[24%] size-72 rounded-full border border-white/10" />
      <div className="absolute -left-40 bottom-[-90px] size-96 rounded-full border border-white/10" />
      {floatingLeaves.map((leaf) => (
        <motion.div
          key={leaf.delay}
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: 0.58,
            y: [0, -12, 0],
            rotate: [leaf.rotate, leaf.rotate + 8, leaf.rotate],
          }}
          transition={{
            opacity: { duration: 0.8, delay: leaf.delay },
            y: {
              duration: 5.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: leaf.delay,
            },
            rotate: {
              duration: 6.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: leaf.delay,
            },
          }}
          className="absolute text-[#b8e7c8]"
          style={{ left: leaf.left, top: leaf.top }}
        >
          <Leaf size={leaf.size} fill="currentColor" />
        </motion.div>
      ))}
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-[14px] bg-white text-sm font-extrabold text-[#236a43] shadow-[0_10px_24px_rgb(4_29_16_/_0.22)]">
            G
          </div>
          <div>
            <p className="text-[15px] font-extrabold tracking-[-0.055em]">
              GreenMind AI
            </p>
            <p className="mt-0.5 text-[10px] font-semibold tracking-[0.04em] text-white/60">
              Intelligent growing
            </p>
          </div>
        </div>
      </div>
      <div className="relative my-auto max-w-[470px] py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto grid aspect-square max-w-[355px] place-items-center"
        >
          <div className="absolute inset-6 rounded-full border border-white/10 bg-white/[0.035]" />
          <div className="absolute inset-14 rounded-full border border-white/10" />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative grid size-32 place-items-center rounded-[38px] border border-white/20 bg-white/10 shadow-[0_25px_50px_rgb(3_30_16_/_0.2)] backdrop-blur-md"
          >
            <Sprout size={56} strokeWidth={1.35} className="text-[#b8e7c8]" />
            <span className="absolute -right-5 -top-5 grid size-11 place-items-center rounded-2xl bg-[#f5cb77] text-[#195638] shadow-lg">
              <Sparkles size={19} />
            </span>
          </motion.div>
          <span className="absolute left-[19%] top-[24%] size-2 rounded-full bg-[#c8f2d4] shadow-[0_0_0_8px_rgba(200,242,212,.08)]" />
          <span className="absolute bottom-[22%] right-[20%] size-2.5 rounded-full bg-[#f5cb77] shadow-[0_0_0_8px_rgba(245,203,119,.08)]" />
        </motion.div>
        <p className="mt-4 text-[28px] font-extrabold leading-[1.13] tracking-[-0.055em] xl:text-[34px]">
          Grow with a little more intelligence.
        </p>
        <p className="mt-4 max-w-md text-sm leading-6 text-white/67">
          Thoughtful tools for understanding every leaf, season, and decision in
          your garden.
        </p>
      </div>
      <div className="relative flex items-center gap-3 text-xs text-white/55">
        <div className="flex -space-x-2">
          <span className="grid size-7 place-items-center rounded-full border-2 border-[#236a43] bg-[#d1ecd9] text-[9px] font-bold text-[#236a43]">
            A
          </span>
          <span className="grid size-7 place-items-center rounded-full border-2 border-[#236a43] bg-[#f0d9b5] text-[9px] font-bold text-[#765a2b]">
            M
          </span>
          <span className="grid size-7 place-items-center rounded-full border-2 border-[#236a43] bg-[#d7e1f2] text-[9px] font-bold text-[#3e5c89]">
            S
          </span>
        </div>
        <span>Loved by mindful growers everywhere.</span>
      </div>
    </div>
  );
}
