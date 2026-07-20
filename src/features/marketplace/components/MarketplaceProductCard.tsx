import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@/components/ui';
import { useAppStore } from '@/store/appStore';
import { useMarketplaceStore } from '../store/useMarketplaceStore';
import type { MarketplaceProduct } from '../types';
import { formatMarketplacePrice } from '../services/marketplaceService';
import { MarketplaceProductVisual } from './MarketplaceProductVisual';

export function MarketplaceProductCard({
  product,
  compact = false,
}: {
  product: MarketplaceProduct;
  compact?: boolean;
}) {
  const navigate = useNavigate();
  const showToast = useAppStore((state) => state.showToast);
  const addToCart = useMarketplaceStore((state) => state.addToCart);
  const toggleWishlist = useMarketplaceStore((state) => state.toggleWishlist);
  const recordViewed = useMarketplaceStore((state) => state.recordViewed);
  const isWishlisted = useMarketplaceStore((state) =>
    state.wishlistIds.includes(product.id),
  );
  const openProduct = () => {
    recordViewed(product.id);
    navigate(`/marketplace/product/${product.id}`);
  };
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="group h-full overflow-hidden p-0">
        <div className="relative">
          <MarketplaceProductVisual
            visual={product.visual}
            size={compact ? 'sm' : 'md'}
          />
          <button
            type="button"
            onClick={() => {
              toggleWishlist(product.id);
              showToast(
                isWishlisted
                  ? `${product.name} removed from saved products.`
                  : `${product.name} saved for later.`,
                'success',
              );
            }}
            aria-label={`${isWishlisted ? 'Remove' : 'Save'} ${product.name}`}
            className={`focus-ring absolute right-3 top-3 grid size-9 place-items-center rounded-xl border bg-card/90 shadow-sm transition-colors ${isWishlisted ? 'border-danger/30 text-danger' : 'border-border text-text-secondary hover:border-success/35 hover:text-success'}`}
          >
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-card/92 px-2.5 py-1.5 text-[11px] font-bold text-success-text shadow-sm">
            <Sparkles size={12} /> {product.aiMatch}% AI match
          </span>
        </div>
        <div className={compact ? 'p-4' : 'p-5'}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted">
                {product.brand} · {product.category}
              </p>
              <h3 className="mt-2 line-clamp-2 text-[17px] font-extrabold tracking-[-0.03em] text-text-primary">
                {product.name}
              </h3>
            </div>
            <p className="shrink-0 text-[17px] font-extrabold tracking-[-0.04em] text-text-primary">
              {formatMarketplacePrice(product.price)}
            </p>
          </div>
          {!compact && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-text-secondary">
              {product.description}
            </p>
          )}
          <p className="mt-3 line-clamp-2 rounded-xl bg-success-soft/60 px-3 py-2 text-[12px] leading-5 text-success-text">
            <b>Why AI:</b> {product.aiReason}
          </p>
          <div className="mt-4 flex items-center justify-between gap-2 text-[12px] font-semibold text-text-secondary">
            <span className="inline-flex items-center gap-1 text-warning-text">
              <Star size={14} fill="currentColor" /> {product.rating} (
              {product.reviews})
            </span>
            <span
              className={
                product.availability === 'In stock'
                  ? 'text-success-text'
                  : 'text-warning-text'
              }
            >
              {product.availability}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={openProduct}
            >
              View details
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                addToCart(product.id);
                showToast(
                  `${product.name} added to your mock cart.`,
                  'success',
                );
              }}
              leftIcon={<ShoppingBag size={15} />}
            >
              Add to cart
            </Button>
          </div>
          <button
            type="button"
            onClick={() => {
              toggleWishlist(product.id);
              showToast(
                isWishlisted
                  ? `${product.name} removed from saved products.`
                  : `${product.name} saved for later.`,
                'success',
              );
            }}
            className="focus-ring mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-[12px] font-bold text-text-secondary transition-colors hover:bg-success-soft hover:text-success-text"
          >
            <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
            {isWishlisted ? 'Saved' : 'Save for later'}
          </button>
        </div>
      </Card>
    </motion.div>
  );
}
