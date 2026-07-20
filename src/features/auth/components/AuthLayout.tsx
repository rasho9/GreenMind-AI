import { useEffect, type ReactNode } from 'react';
import { Moon, Sun } from 'lucide-react';
import { BrandMark } from '@/components/layout/BrandMark';
import { useUIStore } from '@/store/uiStore';
import { AuthVisual } from './AuthVisual';

export function AuthLayout({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useUIStore();
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  return (
    <main className="min-h-screen bg-canvas lg:grid lg:grid-cols-[minmax(460px,1.06fr)_minmax(460px,.94fr)]">
      <aside className="hidden lg:block">
        <AuthVisual />
      </aside>
      <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <button
          type="button"
          className="focus-ring absolute right-5 top-5 grid size-10 place-items-center rounded-xl text-muted transition-colors hover:bg-surface hover:text-brand-dark sm:right-8 sm:top-8"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <div className="absolute left-5 top-6 lg:hidden">
          <BrandMark />
        </div>
        <div className="w-full max-w-[420px] pt-14 lg:pt-0">{children}</div>
      </section>
    </main>
  );
}
