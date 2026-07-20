import { Minus, Plus, ShoppingBag, Tag, Trash2 } from 'lucide-react';
import { Button, EmptyState } from '@/components/ui';
import { useAppStore } from '@/store/appStore';
import {
  formatMarketplacePrice,
  marketplaceService,
} from '../services/marketplaceService';
import { useMarketplaceStore } from '../store/useMarketplaceStore';

export function MarketplaceCart() {
  const cart = useMarketplaceStore((state) => state.cart);
  const discountCode = useMarketplaceStore((state) => state.discountCode);
  const setQuantity = useMarketplaceStore((state) => state.setQuantity);
  const removeFromCart = useMarketplaceStore((state) => state.removeFromCart);
  const applyDiscount = useMarketplaceStore((state) => state.applyDiscount);
  const clearCart = useMarketplaceStore((state) => state.clearCart);
  const showToast = useAppStore((state) => state.showToast);
  const items = cart.flatMap((item) => {
    const product = marketplaceService.getById(item.productId);
    return product ? [{ product, quantity: item.quantity }] : [];
  });
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const discount = discountCode ? subtotal * 0.1 : 0;
  return (
    <div className="max-h-[78vh] overflow-y-auto pr-1">
      {items.length ? (
        <>
          <div className="space-y-3">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-3 rounded-2xl border border-border bg-background/60 p-3"
              >
                <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-success-soft text-success">
                  <ShoppingBag size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-extrabold text-text-primary">
                    {product.name}
                  </p>
                  <p className="mt-1 text-[12px] text-text-secondary">
                    {formatMarketplacePrice(product.price)} each
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Reduce ${product.name} quantity`}
                      onClick={() => setQuantity(product.id, quantity - 1)}
                      className="focus-ring grid size-7 place-items-center rounded-lg border border-border text-text-secondary hover:bg-card"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-5 text-center text-[13px] font-bold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase ${product.name} quantity`}
                      onClick={() => setQuantity(product.id, quantity + 1)}
                      className="focus-ring grid size-7 place-items-center rounded-lg border border-border text-text-secondary hover:bg-card"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${product.name}`}
                  onClick={() => removeFromCart(product.id)}
                  className="focus-ring h-fit rounded-lg p-1.5 text-text-muted hover:bg-danger-soft hover:text-danger"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <label className="mt-5 flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-3 text-text-secondary">
            <Tag size={16} />
            <input
              aria-label="Discount code"
              placeholder="Use GROW10"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  if (!applyDiscount((event.target as HTMLInputElement).value))
                    (event.target as HTMLInputElement).setCustomValidity(
                      'Try GROW10',
                    );
                }
              }}
            />
            <span className="text-[11px] font-bold">10% demo</span>
          </label>
          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-text-secondary">
            <div className="flex justify-between">
              <span>Estimated total</span>
              <span>{formatMarketplacePrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success-text">
                <span>Mock discount</span>
                <span>-{formatMarketplacePrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 text-[17px] font-extrabold text-text-primary">
              <span>Estimated today</span>
              <span>{formatMarketplacePrice(subtotal - discount)}</span>
            </div>
          </div>
          <Button
            type="button"
            className="mt-5 w-full"
            onClick={() =>
              showToast(
                'Checkout is coming soon. No payment or order was created.',
                'info',
              )
            }
          >
            Checkout coming soon
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="mt-2 w-full"
            onClick={clearCart}
          >
            Clear mock cart
          </Button>
        </>
      ) : (
        <EmptyState
          icon={<ShoppingBag size={22} />}
          title="Your mock cart is ready"
          description="Add an AI-matched product to preview a thoughtful garden kit."
        />
      )}
    </div>
  );
}
