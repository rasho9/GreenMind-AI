import { create } from 'zustand';

type UIState = {
  isSidebarOpen: boolean;
  isSidebarCompact: boolean;
  theme: 'light' | 'dark';
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebarCompact: () => void;
  toggleTheme: () => void;
};

/** Global UI state only; product data remains feature-owned as the app grows. */
export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isSidebarCompact: false,
  theme: 'light',
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  toggleSidebarCompact: () =>
    set((state) => ({ isSidebarCompact: !state.isSidebarCompact })),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
