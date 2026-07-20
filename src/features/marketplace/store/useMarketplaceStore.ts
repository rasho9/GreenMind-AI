import { create } from 'zustand';
import type { CartItem } from '../types';

type MarketplaceState = {
  cart: CartItem[];
  wishlistIds: string[];
  recentlyViewedIds: string[];
  discountCode?: string;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  recordViewed: (productId: string) => void;
  applyDiscount: (code: string) => boolean;
  clearCart: () => void;
};

/** Session-level commerce interaction state. Connect this boundary to a secure cart API later. */
export const useMarketplaceStore = create<MarketplaceState>((set) => ({
  cart: [],
  wishlistIds: [],
  recentlyViewedIds: [
    'soil-sense-mini',
    'pure-neem-care',
    'terracotta-air-planter',
  ],
  addToCart: (productId) =>
    set((state) => {
      const item = state.cart.find((entry) => entry.productId === productId);
      return {
        cart: item
          ? state.cart.map((entry) =>
              entry.productId === productId
                ? { ...entry, quantity: entry.quantity + 1 }
                : entry,
            )
          : [...state.cart, { productId, quantity: 1 }],
      };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((entry) => entry.productId !== productId),
    })),
  setQuantity: (productId, quantity) =>
    set((state) => ({
      cart:
        quantity <= 0
          ? state.cart.filter((entry) => entry.productId !== productId)
          : state.cart.map((entry) =>
              entry.productId === productId ? { ...entry, quantity } : entry,
            ),
    })),
  toggleWishlist: (productId) =>
    set((state) => ({
      wishlistIds: state.wishlistIds.includes(productId)
        ? state.wishlistIds.filter((id) => id !== productId)
        : [...state.wishlistIds, productId],
    })),
  recordViewed: (productId) =>
    set((state) => ({
      recentlyViewedIds: [
        productId,
        ...state.recentlyViewedIds.filter((id) => id !== productId),
      ].slice(0, 8),
    })),
  applyDiscount: (code) => {
    const normalized = code.trim().toUpperCase();
    if (normalized !== 'GROW10') return false;
    set({ discountCode: normalized });
    return true;
  },
  clearCart: () => set({ cart: [], discountCode: undefined }),
}));
