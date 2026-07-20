import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Heart,
  ShoppingBag,
  Sparkles,
  Star,
} from 'lucide-react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Modal, SectionHeader } from '@/components/ui';
import { useAppStore } from '@/store/appStore';
import {
  formatMarketplacePrice,
  marketplaceService,
} from './services/marketplaceService';
import { useMarketplaceStore } from './store/useMarketplaceStore';
import {
  MarketplaceCart,
  MarketplaceProductCard,
  MarketplaceProductVisual,
} from './components';

export function MarketplaceProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = marketplaceService.getById(id ?? '');
  const [isCartOpen, setCartOpen] = useState(false);
  const recordViewed = useMarketplaceStore((state) => state.recordViewed);
  const addToCart = useMarketplaceStore((state) => state.addToCart);
  const toggleWishlist = useMarketplaceStore((state) => state.toggleWishlist);
  const isWishlisted = useMarketplaceStore((state) =>
    product ? state.wishlistIds.includes(product.id) : false,
  );
  const showToast = useAppStore((state) => state.showToast);
  useEffect(() => {
    if (product) recordViewed(product.id);
  }, [product, recordViewed]);
  const related = useMemo(
    () => (product ? marketplaceService.getRelated(product) : []),
    [product],
  );
  if (!product) return <Navigate to="/marketplace" replace />;
  return (
    <div className="pb-5">
      <Link
        to="/marketplace"
        className="focus-ring inline-flex items-center gap-2 rounded-lg text-[13px] font-bold text-text-secondary transition-colors hover:text-success-text"
      >
        <ArrowLeft size={16} /> Back to AI Marketplace
      </Link>
      <section className="mt-5 overflow-hidden rounded-[28px] border border-border bg-card shadow-card">
        <div className="grid lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,.98fr)]">
          <div className="border-b border-border lg:border-b-0 lg:border-r">
            <MarketplaceProductVisual visual={product.visual} size="lg" />
            <div className="grid grid-cols-3 gap-2 bg-background/55 p-3">
              {['Product view', 'Use detail', 'Care context'].map((label) => (
                <div
                  key={label}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  <MarketplaceProductVisual visual={product.visual} size="sm" />
                  <p className="truncate px-2 py-1.5 text-center text-[11px] font-bold text-text-secondary">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-success-soft px-3 py-1.5 text-[12px] font-bold text-success-text">
                {product.category}
              </span>
              <span className="rounded-full bg-background px-3 py-1.5 text-[12px] font-bold text-text-secondary">
                {product.brand}
              </span>
              {product.organic && (
                <span className="rounded-full bg-background px-3 py-1.5 text-[12px] font-bold text-text-secondary">
                  Organic option
                </span>
              )}
            </div>
            <h1 className="mt-5 text-text-primary">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[13px] font-semibold">
              <span className="inline-flex items-center gap-1 text-warning-text">
                <Star size={16} fill="currentColor" /> {product.rating} (
                {product.reviews} mock ratings)
              </span>
              <span className="text-success-text">{product.availability}</span>
            </div>
            <p className="mt-5 text-base leading-7 text-text-secondary">
              {product.description}
            </p>
            <p className="mt-5 rounded-2xl bg-success-soft/65 p-4 text-sm leading-6 text-success-text">
              <b className="inline-flex items-center gap-1">
                <Sparkles size={16} /> Why GreenMind AI recommends this:
              </b>
              <br />
              {product.aiReason}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[32px] font-extrabold tracking-[-0.06em] text-text-primary">
                {formatMarketplacePrice(product.price)}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    toggleWishlist(product.id);
                    showToast(
                      isWishlisted
                        ? `${product.name} removed from saved products.`
                        : `${product.name} saved for later.`,
                      'success',
                    );
                  }}
                  leftIcon={
                    <Heart
                      size={16}
                      fill={isWishlisted ? 'currentColor' : 'none'}
                    />
                  }
                >
                  {isWishlisted ? 'Saved' : 'Save'}
                </Button>
                <Button
                  onClick={() => {
                    addToCart(product.id);
                    setCartOpen(true);
                  }}
                  leftIcon={<ShoppingBag size={17} />}
                >
                  Add to cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mt-9 grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
        <Card className="p-5 sm:p-6">
          <SectionHeader
            eyebrow="Product guide"
            title="Use with care and intention"
            description="Mock product information only. Always follow the real product label and local guidance."
          />
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-text-muted">
                Specifications
              </p>
              <dl className="mt-3 space-y-2">
                {product.specifications.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex justify-between gap-3 rounded-xl bg-background p-3 text-[13px]"
                  >
                    <dt className="font-bold text-text-secondary">
                      {spec.label}
                    </dt>
                    <dd className="text-right font-semibold text-text-primary">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-text-muted">
                Usage instructions
              </p>
              <ol className="mt-3 space-y-3">
                {product.usage.map((step, index) => (
                  <li
                    key={step}
                    className="flex gap-3 text-sm leading-6 text-text-secondary"
                  >
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-success text-[12px] font-bold text-white">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-text-muted">
            Good fit for
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.suitablePlants.map((plant) => (
              <span
                key={plant}
                className="rounded-full bg-success-soft px-3 py-2 text-[12px] font-bold text-success-text"
              >
                {plant}
              </span>
            ))}
          </div>
          <p className="mt-7 text-[12px] font-bold uppercase tracking-[0.1em] text-text-muted">
            Benefits
          </p>
          <ul className="mt-4 space-y-3">
            {product.benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex gap-2 text-sm text-text-secondary"
              >
                <Check size={17} className="mt-0.5 shrink-0 text-success" />
                {benefit}
              </li>
            ))}
          </ul>
          <div className="mt-7 rounded-2xl border border-border bg-background p-4">
            <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-text-muted">
              Frequently bought together
            </p>
            <div className="mt-3 space-y-2">
              {related.slice(0, 2).map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => navigate(`/marketplace/product/${item.id}`)}
                  className="focus-ring flex w-full items-center justify-between rounded-xl bg-card px-3 py-2 text-left text-[13px] font-bold text-text-secondary hover:text-success-text"
                >
                  <span>{item.name}</span>
                  <span className="text-success-text">
                    {formatMarketplacePrice(item.price)}
                  </span>
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              className="mt-3 px-0"
              onClick={() => navigate('/marketplace')}
            >
              View AI-matched products
            </Button>
          </div>
        </Card>
      </section>
      <section className="mt-10">
        <SectionHeader
          eyebrow="Keep exploring"
          title="Related products"
          description="Products with similar plant fit, care goals, or seasonal relevance."
        />
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {related.map((item) => (
            <MarketplaceProductCard key={item.id} product={item} compact />
          ))}
        </div>
      </section>
      <Modal
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        title="Your garden cart"
      >
        <MarketplaceCart />
      </Modal>
    </div>
  );
}
