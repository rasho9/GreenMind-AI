import { motion } from 'framer-motion';
import {
  Calculator,
  CloudSun,
  Leaf,
  MapPinned,
  ScanSearch,
  SearchCheck,
} from 'lucide-react';
import { Card } from '@/components/ui';
import type { AssistantTool, SmartContext } from '../types';

const tools: AssistantTool[] = [
  {
    id: 'recommend',
    title: 'Plant Recommender',
    description: 'Find a fit for your space and season.',
    icon: Leaf,
    context: 'Plant Recommendations',
    prompt: 'Recommend plants for my current space',
  },
  {
    id: 'disease',
    title: 'Disease Explainer',
    description: 'Translate a plant-health signal.',
    icon: ScanSearch,
    context: 'Plant Doctor',
    prompt: 'Explain my latest disease scan',
  },
  {
    id: 'weather',
    title: 'Weather Advisor',
    description: 'Turn conditions into daily care.',
    icon: CloudSun,
    context: 'Weather',
    prompt: 'How should weather change my watering plan?',
  },
  {
    id: 'planner',
    title: 'Garden Planner',
    description: 'Shape a simple care plan.',
    icon: MapPinned,
    context: 'Garden Diary',
    prompt: 'Create a garden care plan for this week',
  },
  {
    id: 'harvest',
    title: 'Harvest Calculator',
    description: 'Plan for the next growing stage.',
    icon: Calculator,
    context: 'Tasks',
    prompt: 'Help me estimate my next harvest',
  },
  {
    id: 'library',
    title: 'Plant Library Search',
    description: 'Find detailed growing guidance.',
    icon: SearchCheck,
    context: 'Plant Library',
    prompt: 'Find care guidance in the Plant Library',
  },
];

type AssistantToolRailProps = {
  context: SmartContext[];
  onPrompt: (prompt: string) => void;
};

export function AssistantToolRail({
  context,
  onPrompt,
}: AssistantToolRailProps) {
  return (
    <aside className="hidden w-[240px] shrink-0 border-l border-line bg-surface/45 p-4 xl:block">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
        Special tools
      </p>
      <div className="mt-3 space-y-2">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <motion.button
              key={tool.id}
              type="button"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => onPrompt(tool.prompt)}
              className="focus-ring group w-full rounded-[16px] border border-line bg-surface p-3 text-left shadow-card transition-all hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-elevated"
            >
              <span className="grid size-8 place-items-center rounded-xl bg-brand-soft text-brand transition-transform group-hover:scale-110">
                <Icon size={15} />
              </span>
              <p className="mt-2.5 text-xs font-extrabold">{tool.title}</p>
              <p className="mt-1 text-[11px] leading-4 text-muted">
                {tool.description}
              </p>
            </motion.button>
          );
        })}
      </div>
      <Card className="mt-4 border-brand/15 bg-brand-soft/35 p-3.5">
        <p className="text-[11px] font-extrabold text-brand-dark">
          Connected context
        </p>
        <div className="mt-3 space-y-2.5">
          {context
            .filter((item) => item.active)
            .map((item) => (
              <div key={item.module}>
                <p className="text-[10px] font-bold text-ink">{item.module}</p>
                <p className="mt-0.5 text-[10px] leading-4 text-muted">
                  {item.detail}
                </p>
              </div>
            ))}
        </div>
      </Card>
    </aside>
  );
}
