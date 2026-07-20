import { Award, Flower2, Leaf, Sprout, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui';
import type { GardenAchievement } from '../types';

const icons = {
  sprout: Sprout,
  leaf: Leaf,
  tomato: Award,
  flower: Flower2,
  trophy: Trophy,
};

export function Achievements({
  achievements,
}: {
  achievements: GardenAchievement[];
}) {
  return (
    <Card className="p-5 sm:p-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
          Garden achievements
        </p>
        <h2 className="mt-2 text-lg font-extrabold tracking-[-0.04em]">
          Growing milestones
        </h2>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        {achievements.map((achievement) => {
          const Icon = icons[achievement.icon];
          return (
            <motion.div
              whileHover={{ y: -3 }}
              key={achievement.id}
              className={`rounded-xl border p-3 ${achievement.unlocked ? 'border-[#cce4d3] bg-[#eff8f1]' : 'border-line bg-canvas/35 opacity-60'}`}
            >
              <span
                className={`grid size-8 place-items-center rounded-lg ${achievement.unlocked ? 'bg-brand text-white' : 'bg-line text-muted'}`}
              >
                <Icon size={15} />
              </span>
              <p className="mt-3 text-[11px] font-extrabold text-ink">
                {achievement.title}
              </p>
              <p className="mt-1 text-[10px] leading-4 text-muted">
                {achievement.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
