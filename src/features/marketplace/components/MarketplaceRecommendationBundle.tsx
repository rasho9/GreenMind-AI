import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, SectionHeader } from '@/components/ui';
import { useAppStore } from '@/store/appStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import type { MarketplaceRecommendation } from '../types';
import { formatMarketplacePrice } from '../services/marketplaceService';
import { MarketplaceProductVisual } from './MarketplaceProductVisual';

export function MarketplaceRecommendationBundle({
  recommendation,
  title = 'Recommended products',
  description = 'A connected kit based on the signals already in your GreenMind workspace.',
  marketplaceLabel = 'Open marketplace',
}: {
  recommendation: MarketplaceRecommendation;
  title?: string;
  description?: string;
  marketplaceLabel?: string;
}) {
  const navigate = useNavigate();
  const addToCart = useMarketplaceStore((state) => state.addToCart);
  const showToast = useAppStore((state) => state.showToast);
  return (
    <section className="mt-9">
      <SectionHeader
        eyebrow="AI marketplace"
        title={title}
        description={description}
        action={
          <Button
            variant="secondary"
            onClick={() => navigate('/marketplace')}
            rightIcon={<ArrowRight size={16} />}
          >
            {marketplaceLabel}
          </Button>
        }
      />
      <Card className="mt-5 overflow-hidden p-0">
        <div className="border-b border-border bg-success-soft/45 p-5">
          <p className="flex items-start gap-2 text-sm leading-6 text-success-text">
            <Sparkles size={18} className="mt-0.5 shrink-0" />
            {recommendation.explanation}
          </p>
        </div>
        <div className="grid divide-y divide-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          {recommendation.products.slice(0, 3).map((product) => (
            <div key={product.id} className="p-5">
              <div className="flex gap-3">
                <div className="w-20 shrink-0 overflow-hidden rounded-xl">
                  <MarketplaceProductVisual visual={product.visual} size="sm" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted">
                    {product.category}
                  </p>
                  <p className="mt-1 text-[15px] font-extrabold text-text-primary">
                    {product.name}
                  </p>
                  <p className="mt-1 text-[13px] font-bold text-success-text">
                    {product.aiMatch}% AI match ·{' '}
                    {formatMarketplacePrice(product.price)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[12px] leading-5 text-text-secondary">
                {product.aiReason}
              </p>
              <Button
                size="sm"
                variant="secondary"
                className="mt-4 w-full"
                onClick={() => {
                  addToCart(product.id);
                  showToast(
                    `${product.name} added to your mock cart.`,
                    'success',
                  );
                }}
              >
                Add to cart
              </Button>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 border-t border-border bg-background/55 p-5 sm:flex-row sm:items-center sm:justify-between">
          <span>
            <span className="block text-[12px] font-bold uppercase tracking-[0.1em] text-text-muted">
              Estimated monthly cost
            </span>
            <span className="mt-1 block text-[22px] font-extrabold tracking-[-0.04em] text-text-primary">
              {formatMarketplacePrice(recommendation.estimatedMonthlyCost)}
            </span>
          </span>
          <div className="flex flex-wrap gap-2">
            {recommendation.kits.map((kit) => (
              <button
                key={kit.id}
                type="button"
                onClick={() => navigate(`/marketplace?kit=${kit.id}`)}
                className="focus-ring rounded-xl border border-border bg-card px-3 py-2 text-[12px] font-bold text-text-secondary hover:border-success/40 hover:bg-success-soft hover:text-success-text"
              >
                {kit.title}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}
