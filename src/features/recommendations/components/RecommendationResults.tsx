import { motion } from 'framer-motion';
import {
  BotMessageSquare,
  CheckCircle2,
  MapPin,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Card, SectionHeader } from '@/components/ui';
import { MarketplaceRecommendationBundle } from '@/features/marketplace/components';
import { marketplaceService } from '@/features/marketplace/services/marketplaceService';
import type {
  PlantRecommendation,
  RecommendationResult,
  SmartRecommendationInput,
} from '../types';
import { FeaturedRecommendationCard } from './FeaturedRecommendationCard';
import { PlantRecommendationCard } from './PlantRecommendationCard';
import { RecommendationMap } from './RecommendationMap';

type RecommendationResultsProps = {
  result: RecommendationResult;
  input: SmartRecommendationInput;
  onRefine: () => void;
  onAction: (message: string) => void;
  onAddToGarden: (plant: PlantRecommendation) => void;
};

export function RecommendationResults({
  result,
  input,
  onRefine,
  onAction,
  onAddToGarden,
}: RecommendationResultsProps) {
  const navigate = useNavigate();
  const reasoning = `Based on ${input.city || 'your local'} conditions, ${input.sunlight.toLowerCase()} exposure, and your ${input.maintenance.toLowerCase()}-maintenance preference, ${result.featured.name.toLowerCase()} is an excellent first choice. ${input.purposes.length ? `The plan also supports ${input.purposes.slice(0, 2).join(' and ').toLowerCase()}.` : 'The plan keeps care clear and achievable.'}`;
  const marketplaceRecommendation = marketplaceService.recommend({
    source: 'recommendations',
    plants: result.plants.map((plant) => plant.name),
    season: result.plan.month,
  });
  return (
    <motion.section
      id="recommendation-results"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      className="mt-10"
    >
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand">
            GreenMind AI recommendation
          </p>
          <h2 className="mt-2">A thoughtful plant shortlist for your space</h2>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Every suggestion balances your environment with the level of care
            you want to give.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={onRefine}
          leftIcon={<RefreshCw size={17} />}
        >
          Refine AI context
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <div className="space-y-7">
          <FeaturedRecommendationCard plant={result.featured} />
          <section>
            <SectionHeader
              eyebrow="Best matches"
              title="Plants GreenMind would start with"
              description="A complete view of what each plant needs before you bring it into your garden."
            />
            <div className="mt-5 grid gap-5 2xl:grid-cols-2">
              {result.plants.map((plant) => (
                <PlantRecommendationCard
                  key={plant.name}
                  plant={plant}
                  onViewCareGuide={() => {
                    navigate('/plant-library');
                    onAction(
                      `Opening the Plant Library for ${plant.name} care guidance.`,
                    );
                  }}
                  onAddToGarden={() => onAddToGarden(plant)}
                />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-[98px]">
          <ReasoningPanel reasoning={reasoning} input={input} />
          {(input.city || input.latitude !== undefined) && (
            <RecommendationMap
              city={input.city}
              country={input.country}
              latitude={input.latitude}
              longitude={input.longitude}
            />
          )}
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <span className="grid size-10 place-items-center rounded-[14px] bg-brand-soft text-brand">
                <CheckCircle2 size={20} />
              </span>
              <div>
                <p className="text-[15px] font-bold text-ink">
                  AI confidence signal
                </p>
                <p className="mt-1 text-sm text-muted">
                  A realistic view of fit before you commit time and space.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-end justify-between">
              <p className="text-3xl font-extrabold tracking-[-0.06em] text-brand-dark">
                {result.plan.successRate}%
              </p>
              <Badge>Strong fit</Badge>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-brand-soft">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${result.plan.successRate}%` }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="h-full rounded-full bg-brand"
              />
            </div>
            <p className="mt-4 text-sm text-muted">
              Best planting window:{' '}
              <span className="font-bold text-ink">{result.plan.month}</span>
            </p>
          </Card>
        </aside>
      </div>

      <MarketplaceRecommendationBundle
        recommendation={marketplaceRecommendation}
        title="A practical product layer for your garden plan"
        description="Compare beginner, professional, organic, and budget routes before you commit to a care routine."
      />
    </motion.section>
  );
}

function ReasoningPanel({
  reasoning,
  input,
}: {
  reasoning: string;
  input: SmartRecommendationInput;
}) {
  return (
    <Card className="relative overflow-hidden border-[#cce4d4] bg-[radial-gradient(circle_at_90%_8%,rgb(190_232_201_/_0.58),transparent_29%),linear-gradient(135deg,#fbfefb,#edf8ef)] p-5">
      <div className="absolute -right-6 -top-7 size-28 rounded-full bg-white/55 blur-xl" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-[14px] bg-[#173d2a] text-white">
            <BotMessageSquare size={19} />
          </span>
          <div>
            <p className="text-[15px] font-bold text-ink">
              Why GreenMind AI chose these plants
            </p>
            <p className="mt-1 text-sm text-muted">
              A clear, chat-style explanation
            </p>
          </div>
        </div>
        <div className="mt-5 rounded-[16px] border border-white/85 bg-white/72 p-4 shadow-[0_8px_20px_rgb(23_77_43_/_0.05)]">
          <div className="flex items-center gap-2 text-[13px] font-bold text-brand-dark">
            <Sparkles size={15} />
            GPT-ready reasoning
          </div>
          <p className="mt-3 text-sm leading-7 text-[#3b684d]">{reasoning}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <ContextChip label={input.sunlight} />
          <ContextChip label={input.space} />
          <ContextChip label={`${input.maintenance} maintenance`} />
          <ContextChip label={`${input.budget} budget`} />
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted">
          <MapPin size={16} className="text-brand" />
          {input.city || 'Location'}
          {input.country ? `, ${input.country}` : ''}
        </p>
      </div>
    </Card>
  );
}

function ContextChip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-brand-soft px-2.5 py-1.5 text-[13px] font-bold text-brand-dark">
      {label}
    </span>
  );
}
