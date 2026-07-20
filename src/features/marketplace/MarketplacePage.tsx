import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BrainCircuit,
  Heart,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  Card,
  EmptyState,
  Modal,
  SectionHeader,
} from '@/components/ui';
import { useGardenDiaryStore } from '@/features/garden-diary/store/useGardenDiaryStore';
import { usePlantDoctorStore } from '@/features/plant-doctor/store/usePlantDoctorStore';
import { useRecommendationStore } from '@/features/recommendations/store/useRecommendationStore';
import {
  defaultMarketplaceFilters,
  marketplaceCatalog,
  marketplaceService,
} from './services/marketplaceService';
import { useMarketplaceStore } from './store/useMarketplaceStore';
import {
  marketplaceCategories,
  type MarketplaceFilters as MarketplaceFiltersState,
} from './types';
import {
  MarketplaceCart,
  MarketplaceFilters,
  MarketplaceProductCard,
  MarketplaceRecommendationBundle,
} from './components';

const assistantPrompts = [
  'What should I buy for my tomato garden?',
  'I have aphids.',
  'My soil is dry.',
  'My leaves are turning yellow.',
];

export function MarketplacePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [filters, setFilters] = useState<MarketplaceFiltersState>(
    defaultMarketplaceFilters,
  );
  const [isCartOpen, setCartOpen] = useState(false);
  const plants = useGardenDiaryStore((state) => state.plants);
  const latestScan = usePlantDoctorStore((state) => state.scans[0]);
  const latestPlan = useRecommendationStore((state) => state.latestResult);
  const recentlyViewedIds = useMarketplaceStore(
    (state) => state.recentlyViewedIds,
  );
  const wishlistIds = useMarketplaceStore((state) => state.wishlistIds);
  const cartQuantity = useMarketplaceStore((state) =>
    state.cart.reduce((total, item) => total + item.quantity, 0),
  );
  const recommendation = useMemo(
    () =>
      marketplaceService.recommend({
        source: latestScan ? 'plant-doctor' : 'marketplace',
        plants:
          plants.map((plant) => plant.name).length > 0
            ? plants.map((plant) => plant.name)
            : (latestPlan?.plants.map((plant) => plant.name) ?? ['Tomato']),
        disease: latestScan?.analysis.diseaseName,
        weather: 'Heavy rain expected this week',
        season: 'Summer',
      }),
    [latestPlan?.plants, latestScan, plants],
  );
  const products = useMemo(
    () => marketplaceService.search(query, filters),
    [filters, query],
  );
  const recentProducts = recentlyViewedIds.flatMap((id) => {
    const product = marketplaceService.getById(id);
    return product ? [product] : [];
  });
  const shelves = [
    {
      title: 'Trending Products',
      description:
        'High-signal tools and treatments gardeners are saving this week.',
      products: marketplaceCatalog.slice(0, 4),
    },
    {
      title: 'Recently Viewed',
      description: 'Return to the products you were considering.',
      products: recentProducts,
    },
    {
      title: 'Seasonal Essentials',
      description: 'Practical support for a warm, high-growth garden season.',
      products: marketplaceCatalog
        .filter((product) =>
          product.tags.some((tag) => ['summer', 'heat', 'water'].includes(tag)),
        )
        .slice(0, 4),
    },
    {
      title: 'Disease Treatment Kits',
      description:
        'Useful tools for targeted treatment, prevention, and cleaner follow-up checks.',
      products: marketplaceCatalog
        .filter((product) =>
          product.tags.some((tag) =>
            ['disease', 'fungal', 'early blight', 'root rot'].includes(tag),
          ),
        )
        .slice(0, 4),
    },
    {
      title: 'Smart Garden Devices',
      description:
        'Give future AI recommendations better soil and watering signals.',
      products: marketplaceCatalog
        .filter((product) => product.tags.includes('smart garden'))
        .slice(0, 4),
    },
    {
      title: 'Best Sellers',
      description:
        'The most consistently loved garden essentials in this demo catalog.',
      products: marketplaceCatalog
        .filter((product) => product.rating >= 4.8)
        .slice(0, 4),
    },
    {
      title: 'Organic Collection',
      description: 'A gentler pathway for soil health and routine pest care.',
      products: marketplaceCatalog
        .filter((product) => product.organic)
        .slice(0, 4),
    },
    {
      title: 'New Arrivals',
      description:
        'Fresh additions for protected growing spaces and calmer routines.',
      products: marketplaceService.getByIds([
        'indoor-spectrum-light',
        'terracotta-air-planter',
        'rain-guard-cover',
        'soil-sense-mini',
      ]),
    },
  ];

  return (
    <div className="pb-5">
      <section className="premium-hero relative overflow-hidden rounded-[28px] border border-border bg-[radial-gradient(circle_at_88%_14%,rgb(var(--success-soft)/.95),transparent_25%),linear-gradient(130deg,rgb(var(--card)),rgb(var(--background)))] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="absolute -right-10 -top-10 size-52 rounded-full bg-success/10 blur-3xl" />
        <div className="relative grid gap-7 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-success/20 bg-card/85 px-3 py-2 text-[12px] font-bold text-success-text shadow-sm">
              <Sparkles size={15} /> Context-aware marketplace
            </span>
            <h1 className="mt-5 text-balance text-text-primary">
              Everything your garden needs — intelligently recommended.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary">
              GreenMind connects your plant diary, weather, recommendations, and
              health screenings to practical products with a clear reason behind
              every match.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/marketplace?view=saved')}
              className="focus-ring inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-3.5 text-[13px] font-bold text-text-secondary shadow-sm hover:border-success/35 hover:bg-success-soft"
            >
              <Heart size={16} className="text-danger" /> Saved{' '}
              {wishlistIds.length}
            </button>
            <Button
              type="button"
              onClick={() => setCartOpen(true)}
              leftIcon={<ShoppingBag size={17} />}
            >
              Cart {cartQuantity ? `(${cartQuantity})` : ''}
            </Button>
          </div>
        </div>
        <label className="relative mt-7 flex h-14 max-w-3xl items-center gap-3 rounded-2xl border border-border bg-card/90 px-4 text-text-muted shadow-card transition-all focus-within:border-success/50 focus-within:shadow-[0_0_0_4px_rgb(var(--success)/.1)]">
          <Search size={19} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by product, plant, disease, weather, problem, brand, or category"
            aria-label="Search marketplace products"
            className="min-w-0 flex-1 bg-transparent text-base text-text-primary outline-none placeholder:text-text-muted"
          />
          <span className="hidden rounded-lg bg-success-soft px-2 py-1 text-[11px] font-bold text-success-text sm:inline">
            AI search
          </span>
        </label>
      </section>

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Products recommended',
            value: recommendation.products.length,
            note: 'From live garden signals',
            icon: Sparkles,
          },
          {
            label: 'Products saved',
            value: wishlistIds.length,
            note: 'Your considered essentials',
            icon: Heart,
          },
          {
            label: 'Disease kits suggested',
            value: latestScan ? 4 : 0,
            note: latestScan
              ? latestScan.analysis.diseaseName
              : 'Run a health screening',
            icon: BrainCircuit,
          },
          {
            label: 'Recommendation accuracy',
            value: '92%',
            note: 'Structured mock confidence',
            icon: Star,
          },
        ].map(({ label, value, note, icon: Icon }) => (
          <Card key={label} className="p-5">
            <Icon size={20} className="text-success" />
            <p className="mt-4 text-[30px] font-extrabold tracking-[-0.06em] text-text-primary">
              {value}
            </p>
            <p className="mt-1 text-sm font-bold text-text-primary">{label}</p>
            <p className="mt-1 text-[12px] text-text-secondary">{note}</p>
          </Card>
        ))}
      </section>

      <MarketplaceRecommendationBundle
        recommendation={recommendation}
        title="Recommended For You"
        description="A focused product layer shaped by your plants, latest screening, weather signal, and care plan."
      />

      <section className="mt-9">
        <SectionHeader
          eyebrow="Explore the catalog"
          title="Find the right product with less guesswork"
          description="Filter by category, plant, disease, weather, season, price, organic preference, space, country, and rating."
        />
        <div className="mt-5">
          <MarketplaceFilters
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(defaultMarketplaceFilters)}
          />
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-text-secondary">
            <b className="text-text-primary">{products.length}</b> products
            matching your current search
          </p>
          <span className="text-[12px] font-bold text-success-text">
            AI recommendations explain the match
          </span>
        </div>
        {products.length ? (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
            {products.map((product) => (
              <MarketplaceProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState
              icon={<Search size={22} />}
              title="No product match yet"
              description="Try a plant, disease, weather condition, or reset the smart filters."
            />
          </div>
        )}
      </section>

      {shelves.map(
        (shelf) =>
          shelf.products.length > 0 && (
            <ProductShelf key={shelf.title} {...shelf} />
          ),
      )}

      <section className="mt-10 overflow-hidden rounded-[24px] border border-border bg-[linear-gradient(120deg,rgb(var(--card)),rgb(var(--success-soft)/.55))] p-5 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="grid size-11 place-items-center rounded-[15px] bg-success text-white shadow-sm">
              <BrainCircuit size={21} />
            </span>
            <h2 className="mt-4">Ask GreenMind before you buy</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Bring a real garden question to the AI workspace. It will retain
              your plant, disease, weather, diary, and marketplace context for a
              more useful recommendation.
            </p>
          </div>
          <Button
            onClick={() =>
              navigate(
                `/assistant?prompt=${encodeURIComponent(assistantPrompts[0])}`,
              )
            }
            rightIcon={<ArrowRight size={17} />}
          >
            Ask GreenMind AI
          </Button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {assistantPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() =>
                navigate(`/assistant?prompt=${encodeURIComponent(prompt)}`)
              }
              className="focus-ring rounded-xl border border-border bg-card/75 px-3 py-2.5 text-[13px] font-bold text-text-secondary transition-colors hover:border-success/35 hover:bg-card hover:text-success-text"
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <SectionHeader
          eyebrow="Browse every category"
          title="A calm catalog built around real garden decisions"
          description="The mock catalog is organized for AI matching today and a secure commerce provider tomorrow."
        />
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {marketplaceCategories.map((category) => (
            <button
              type="button"
              key={category}
              onClick={() => {
                setFilters({ ...filters, category });
                window.scrollTo({ top: 740, behavior: 'smooth' });
              }}
              className="focus-ring flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left text-[13px] font-bold text-text-secondary transition-colors hover:border-success/35 hover:bg-success-soft hover:text-success-text"
            >
              <span>{category}</span>
              <ArrowRight size={15} />
            </button>
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

function ProductShelf({
  title,
  description,
  products,
}: {
  title: string;
  description: string;
  products: typeof marketplaceCatalog;
}) {
  return (
    <section className="mt-10">
      <SectionHeader
        eyebrow="Marketplace collection"
        title={title}
        description={description}
      />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <MarketplaceProductCard key={product.id} product={product} compact />
        ))}
      </div>
    </section>
  );
}
