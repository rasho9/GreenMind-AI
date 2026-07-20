import { create } from 'zustand';

type PlantLibraryState = {
  favorites: string[];
  bookmarks: string[];
  recentlyViewed: string[];
  compareIds: string[];
  toggleFavorite: (id: string) => void;
  toggleBookmark: (id: string) => void;
  markViewed: (id: string) => void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
};

/** Session-level library state; replace with user-scoped persistence once authentication is connected. */
export const usePlantLibraryStore = create<PlantLibraryState>((set) => ({
  favorites: ['cherry-tomato'],
  bookmarks: ['genovese-basil'],
  recentlyViewed: ['snake-plant', 'aloe-vera', 'cherry-tomato'],
  compareIds: [],
  toggleFavorite: (id) =>
    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((item) => item !== id)
        : [...state.favorites, id],
    })),
  toggleBookmark: (id) =>
    set((state) => ({
      bookmarks: state.bookmarks.includes(id)
        ? state.bookmarks.filter((item) => item !== id)
        : [...state.bookmarks, id],
    })),
  markViewed: (id) =>
    set((state) => ({
      recentlyViewed: [
        id,
        ...state.recentlyViewed.filter((item) => item !== id),
      ].slice(0, 6),
    })),
  toggleCompare: (id) =>
    set((state) => ({
      compareIds: state.compareIds.includes(id)
        ? state.compareIds.filter((item) => item !== id)
        : state.compareIds.length < 2
          ? [...state.compareIds, id]
          : state.compareIds,
    })),
  clearCompare: () => set({ compareIds: [] }),
}));
