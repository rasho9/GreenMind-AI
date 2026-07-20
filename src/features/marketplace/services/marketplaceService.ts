import {
  marketplaceCategories,
  type MarketplaceFilters,
  type MarketplaceKit,
  type MarketplaceProduct,
  type MarketplaceRecommendation,
  type MarketplaceRecommendationContext,
} from '../types';

/**
 * Stable mock catalog and recommendation adapter. A future commerce integration can replace
 * this boundary with a server-side catalog, availability, and affiliate provider.
 */
export const marketplaceCatalog: MarketplaceProduct[] = [
  {
    id: 'tomato-bloom-feed',
    name: 'Tomato Bloom Nutrition',
    brand: 'Verdant Labs',
    category: 'Plant Nutrients',
    price: 16,
    rating: 4.8,
    reviews: 241,
    availability: 'In stock',
    description:
      'A measured tomato feed for flowering plants and steady fruit set.',
    aiMatch: 98,
    aiReason:
      'Matches your tomato growth stage and supports recovery without heavy feeding.',
    visual: 'fertilizer',
    tags: ['tomato', 'vegetables', 'food', 'summer', 'nutrient'],
    suitablePlants: ['Cherry Tomato', 'Pepper', 'Eggplant'],
    specifications: [
      { label: 'Format', value: '500 ml liquid concentrate' },
      { label: 'Coverage', value: 'Up to 25 container feeds' },
      { label: 'NPK profile', value: '4-6-8' },
    ],
    usage: [
      'Dilute as directed.',
      'Apply to damp soil.',
      'Use every 14 days during active growth.',
    ],
    benefits: [
      'Supports fruiting',
      'Measured micronutrients',
      'Container-friendly',
    ],
    environment: ['Outdoor'],
    country: ['Pakistan', 'United Kingdom', 'United States'],
  },
  {
    id: 'copper-guard-fungicide',
    name: 'Copper Guard Fungicide',
    brand: 'Root & Leaf',
    category: 'Fungicides',
    price: 19,
    rating: 4.7,
    reviews: 184,
    availability: 'In stock',
    description:
      'A protective copper-based treatment for targeted fungal-risk care.',
    aiMatch: 97,
    aiReason:
      'Recommended because your tomato screening shows an early blight pattern.',
    visual: 'fungicide',
    tags: ['early blight', 'fungal', 'tomato', 'rose', 'rain', 'disease'],
    suitablePlants: ['Tomato', 'Rose', 'Pepper'],
    specifications: [
      { label: 'Format', value: '250 ml concentrate' },
      { label: 'Application', value: 'Foliar spray' },
      { label: 'Use window', value: 'Dry, low-wind mornings' },
    ],
    usage: [
      'Confirm local label approval.',
      'Remove affected leaves first.',
      'Apply only as directed.',
    ],
    benefits: [
      'Targeted protection',
      'Rain-risk support',
      'Clear application guidance',
    ],
    environment: ['Outdoor'],
    country: ['Pakistan', 'United Kingdom', 'United States'],
  },
  {
    id: 'pure-neem-care',
    name: 'Pure Neem Care Concentrate',
    brand: 'Sattva Garden',
    category: 'Pesticides',
    price: 13,
    rating: 4.9,
    reviews: 328,
    availability: 'In stock',
    description:
      'An organic-minded concentrate for soft-bodied pests and preventive leaf care.',
    aiMatch: 94,
    aiReason:
      'A lower-impact option for the fungal and pest pressure in your garden context.',
    visual: 'neem',
    tags: ['organic', 'aphids', 'pests', 'rose', 'tomato', 'indoor'],
    suitablePlants: ['Rose', 'Tomato', 'Basil', 'Indoor foliage'],
    specifications: [
      { label: 'Format', value: '250 ml concentrate' },
      { label: 'Origin', value: 'Cold-pressed neem' },
      { label: 'Coverage', value: '20–30 applications' },
    ],
    usage: [
      'Test one leaf first.',
      'Apply in low light.',
      'Repeat only as label guidance allows.',
    ],
    benefits: ['Organic option', 'Multi-plant use', 'Preventive support'],
    organic: true,
    environment: ['Indoor', 'Outdoor'],
    country: ['Pakistan', 'India', 'United Kingdom', 'United States'],
  },
  {
    id: 'cedar-mulch-layer',
    name: 'Cedar Mulch Layer',
    brand: 'EarthKeep',
    category: 'Compost',
    price: 11,
    rating: 4.6,
    reviews: 96,
    availability: 'In stock',
    description:
      'A clean top layer that steadies moisture and reduces soil splash on leaves.',
    aiMatch: 92,
    aiReason:
      'Helps reduce foliage splash and keep tomato roots steadier in warm weather.',
    visual: 'mulch',
    tags: ['tomato', 'water', 'heat', 'rain', 'organic', 'outdoor'],
    suitablePlants: ['Tomato', 'Pepper', 'Fruit trees'],
    specifications: [
      { label: 'Bag size', value: '12 L' },
      { label: 'Material', value: 'Untreated cedar blend' },
      { label: 'Use', value: 'Outdoor beds and containers' },
    ],
    usage: [
      'Keep 3 cm from stems.',
      'Apply a 2–4 cm layer.',
      'Refresh as it settles.',
    ],
    benefits: ['Less evaporation', 'Cleaner leaves', 'Temperature buffering'],
    organic: true,
    environment: ['Outdoor'],
    country: ['Pakistan', 'United Kingdom', 'United States'],
  },
  {
    id: 'garden-stake-set',
    name: 'Soft-Tie Garden Stake Set',
    brand: 'Canopy Works',
    category: 'Gardening Tools',
    price: 14,
    rating: 4.8,
    reviews: 156,
    availability: 'In stock',
    description:
      'Adjustable bamboo supports and soft ties for airflow-friendly training.',
    aiMatch: 90,
    aiReason: 'Supports tomato airflow and keeps foliage away from damp soil.',
    visual: 'stakes',
    tags: ['tomato', 'support', 'airflow', 'vegetables', 'outdoor'],
    suitablePlants: ['Tomato', 'Pepper', 'Climbing flowers'],
    specifications: [
      { label: 'Contents', value: '6 stakes + 18 soft ties' },
      { label: 'Height', value: '90 cm' },
      { label: 'Material', value: 'Bamboo and reusable fabric' },
    ],
    usage: ['Insert before stems lean.', 'Tie loosely.', 'Check ties weekly.'],
    benefits: ['Improves airflow', 'Protects stems', 'Reusable'],
    environment: ['Outdoor'],
    country: ['Pakistan', 'United Kingdom', 'United States'],
  },
  {
    id: 'drainage-soil-blend',
    name: 'Rain-Ready Drainage Soil',
    brand: 'Rootline',
    category: 'Soil',
    price: 18,
    rating: 4.7,
    reviews: 132,
    availability: 'Low stock',
    description:
      'A high-airflow soil blend designed for containers during wet spells.',
    aiMatch: 95,
    aiReason:
      'Recommended ahead of heavy rain to protect roots from standing moisture.',
    visual: 'soil',
    tags: ['rain', 'root rot', 'drainage', 'soil', 'indoor', 'outdoor'],
    suitablePlants: ['Tomato', 'Rose', 'Indoor plants'],
    specifications: [
      { label: 'Bag size', value: '18 L' },
      { label: 'Blend', value: 'Coco coir, bark, perlite' },
      { label: 'Best for', value: 'Raised beds and containers' },
    ],
    usage: [
      'Use for repotting or top-up.',
      'Pair with drainage holes.',
      'Water only when soil needs it.',
    ],
    benefits: [
      'Improves aeration',
      'Reduces saturation',
      'Supports root health',
    ],
    environment: ['Indoor', 'Outdoor'],
    country: ['Pakistan', 'United Kingdom', 'United States'],
  },
  {
    id: 'rain-guard-cover',
    name: 'Breathable Rain Guard Cover',
    brand: 'Shelter & Stem',
    category: 'Greenhouse Equipment',
    price: 27,
    rating: 4.5,
    reviews: 74,
    availability: 'In stock',
    description:
      'A ventilated cover that protects foliage without trapping heat.',
    aiMatch: 89,
    aiReason:
      'Useful for the heavy rain forecast while keeping leaf airflow available.',
    visual: 'rain-cover',
    tags: ['rain', 'fungal', 'cover', 'tomato', 'weather', 'outdoor'],
    suitablePlants: ['Tomato', 'Pepper', 'Rose'],
    specifications: [
      { label: 'Coverage', value: '1.2 × 1.8 m' },
      { label: 'Material', value: 'UV-stable breathable fabric' },
      { label: 'Fit', value: 'Raised-bed or container frame' },
    ],
    usage: [
      'Install before rainfall.',
      'Leave side vents open.',
      'Remove when conditions clear.',
    ],
    benefits: [
      'Limits leaf wetness',
      'Maintains airflow',
      'Reusable seasonally',
    ],
    environment: ['Outdoor'],
    country: ['Pakistan', 'United Kingdom', 'United States'],
  },
  {
    id: 'soil-sense-mini',
    name: 'SoilSense Mini Sensor',
    brand: 'Signal Garden',
    category: 'Garden Sensors',
    price: 34,
    rating: 4.6,
    reviews: 109,
    availability: 'Pre-order',
    description:
      'A compact moisture and temperature indicator for more confident watering checks.',
    aiMatch: 88,
    aiReason:
      'Adds a dependable soil signal to the care decisions GreenMind already tracks.',
    visual: 'sensor',
    tags: ['sensor', 'water', 'smart garden', 'indoor', 'outdoor'],
    suitablePlants: ['Indoor plants', 'Tomato', 'Basil'],
    specifications: [
      { label: 'Sensors', value: 'Moisture and temperature' },
      { label: 'Battery', value: 'Up to 6 months' },
      { label: 'Connection', value: 'Future API-ready placeholder' },
    ],
    usage: [
      'Place near the root zone.',
      'Check readings before watering.',
      'Keep probe clean.',
    ],
    benefits: ['More confident watering', 'Compact design', 'Context-ready'],
    environment: ['Indoor', 'Outdoor'],
    country: ['Pakistan', 'United Kingdom', 'United States'],
  },
  {
    id: 'smart-drip-starter',
    name: 'Smart Drip Starter',
    brand: 'Flowstead',
    category: 'Drip Irrigation',
    price: 42,
    rating: 4.8,
    reviews: 67,
    availability: 'In stock',
    description:
      'A small-space drip set with adjustable emitters for container gardens.',
    aiMatch: 91,
    aiReason:
      'Supports consistent root-level watering while avoiding wet foliage.',
    visual: 'drip',
    tags: ['water', 'tomato', 'balcony', 'smart garden', 'outdoor'],
    suitablePlants: ['Tomato', 'Basil', 'Pepper'],
    specifications: [
      { label: 'Coverage', value: 'Up to 12 containers' },
      { label: 'Control', value: 'Manual timer-ready' },
      { label: 'Includes', value: 'Tubing, emitters, fittings' },
    ],
    usage: [
      'Lay tubing at soil level.',
      'Test each emitter.',
      'Adjust after rainfall.',
    ],
    benefits: ['Water efficiency', 'Root-level delivery', 'Balcony-ready'],
    environment: ['Outdoor'],
    country: ['Pakistan', 'United Kingdom', 'United States'],
  },
  {
    id: 'tomato-beginner-kit',
    name: 'Tomato Care Starter Kit',
    brand: 'GreenMind Select',
    category: 'Starter Kits',
    price: 39,
    rating: 4.9,
    reviews: 218,
    availability: 'In stock',
    description:
      'A beginner collection of feed, supports, mulch, and a simple care guide.',
    aiMatch: 96,
    aiReason:
      'A low-complexity way to cover the most useful tomato care essentials.',
    visual: 'starter-kit',
    tags: ['tomato', 'beginner', 'kit', 'food', 'vegetables'],
    suitablePlants: ['Cherry Tomato', 'Roma Tomato'],
    specifications: [
      { label: 'Includes', value: 'Feed, ties, mulch, guide' },
      { label: 'Garden type', value: 'Balcony and small garden' },
      { label: 'Experience', value: 'Beginner friendly' },
    ],
    usage: [
      'Start with the included guide.',
      'Add one product at a time.',
      'Log care in Garden Diary.',
    ],
    benefits: ['Simple setup', 'Useful essentials', 'Care-guide included'],
    environment: ['Outdoor'],
    country: ['Pakistan', 'United Kingdom', 'United States'],
  },
  {
    id: 'precision-pruners',
    name: 'Precision Pruning Shears',
    brand: 'Canopy Works',
    category: 'Gardening Tools',
    price: 21,
    rating: 4.8,
    reviews: 191,
    availability: 'In stock',
    description:
      'Clean-cut pruners designed for affected foliage and delicate herb harvesting.',
    aiMatch: 93,
    aiReason:
      'Helps remove affected leaves cleanly as part of the suggested treatment sequence.',
    visual: 'pruners',
    tags: ['disease', 'rose', 'tomato', 'pruning', 'tools'],
    suitablePlants: ['Rose', 'Tomato', 'Basil'],
    specifications: [
      { label: 'Blade', value: 'Stainless steel bypass' },
      { label: 'Grip', value: 'Non-slip ergonomic handle' },
      { label: 'Care', value: 'Clean after each use' },
    ],
    usage: [
      'Clean before use.',
      'Remove only clearly affected foliage.',
      'Disinfect between plants.',
    ],
    benefits: ['Cleaner cuts', 'Disease-aware care', 'Comfortable grip'],
    environment: ['Indoor', 'Outdoor'],
    country: ['Pakistan', 'United Kingdom', 'United States'],
  },
  {
    id: 'indoor-spectrum-light',
    name: 'Calm Spectrum Grow Light',
    brand: 'Stilllight',
    category: 'Grow Lights',
    price: 48,
    rating: 4.7,
    reviews: 86,
    availability: 'In stock',
    description:
      'An adjustable, low-glare light for herbs and foliage in low-light rooms.',
    aiMatch: 87,
    aiReason:
      'Balances indoor light limits without forcing a harsh all-day setup.',
    visual: 'grow-light',
    tags: ['indoor', 'light', 'herbs', 'houseplants', 'winter'],
    suitablePlants: ['Basil', 'Snake Plant', 'Indoor herbs'],
    specifications: [
      { label: 'Output', value: 'Full-spectrum LED' },
      { label: 'Timer', value: '4 / 8 / 12 hours' },
      { label: 'Mount', value: 'Clamp stand' },
    ],
    usage: [
      'Begin 30 cm above foliage.',
      'Use a modest schedule.',
      'Watch leaves for stress.',
    ],
    benefits: ['Indoor support', 'Adjustable timer', 'Low-glare profile'],
    environment: ['Indoor'],
    country: ['Pakistan', 'United Kingdom', 'United States'],
  },
  {
    id: 'terracotta-air-planter',
    name: 'Terracotta Air Planter',
    brand: 'Clay & Root',
    category: 'Planters',
    price: 24,
    rating: 4.6,
    reviews: 143,
    availability: 'In stock',
    description:
      'A breathable pot with generous drainage for roots that need steady airflow.',
    aiMatch: 86,
    aiReason: 'Useful for better drainage in your rain-aware garden plan.',
    visual: 'planter',
    tags: ['planter', 'root rot', 'indoor', 'outdoor', 'soil'],
    suitablePlants: ['Tomato', 'Aloe Vera', 'Indoor plants'],
    specifications: [
      { label: 'Size', value: '26 cm diameter' },
      { label: 'Material', value: 'Unglazed terracotta' },
      { label: 'Drainage', value: 'Large base hole and saucer' },
    ],
    usage: [
      'Use with a draining mix.',
      'Lift from standing water.',
      'Check soil before watering.',
    ],
    benefits: ['Breathable roots', 'Better drainage', 'Timeless finish'],
    environment: ['Indoor', 'Outdoor'],
    country: ['Pakistan', 'United Kingdom', 'United States'],
  },
  {
    id: 'living-compost',
    name: 'Living Compost Blend',
    brand: 'EarthKeep',
    category: 'Organic Fertilizers',
    price: 15,
    rating: 4.9,
    reviews: 202,
    availability: 'In stock',
    description:
      'A refined compost blend for gradual soil support and resilient root zones.',
    aiMatch: 89,
    aiReason:
      'A gentle organic option for better soil structure and long-term plant resilience.',
    visual: 'compost',
    tags: ['organic', 'compost', 'soil', 'vegetables', 'flowers'],
    suitablePlants: ['Vegetables', 'Flowers', 'Fruit trees'],
    specifications: [
      { label: 'Bag size', value: '10 L' },
      { label: 'Format', value: 'Screened organic compost' },
      { label: 'Use', value: 'Top dress or blend in' },
    ],
    usage: [
      'Apply a thin top dress.',
      'Keep clear of stems.',
      'Water gently after use.',
    ],
    benefits: ['Organic soil support', 'Gradual nutrition', 'Improves texture'],
    organic: true,
    environment: ['Indoor', 'Outdoor'],
    country: ['Pakistan', 'United Kingdom', 'United States'],
  },
];

const byId = (id: string) =>
  marketplaceCatalog.find((product) => product.id === id);
const fromIds = (ids: string[]) =>
  ids.map(byId).filter(Boolean) as MarketplaceProduct[];

export const formatMarketplacePrice = (price: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);

const kitDefinitions: MarketplaceKit[] = [
  {
    id: 'beginner-tomato-kit',
    title: 'Beginner kit',
    description: 'A low-complexity tomato care foundation.',
    productIds: ['tomato-beginner-kit', 'cedar-mulch-layer'],
    cost: 50,
    tone: 'beginner',
  },
  {
    id: 'professional-tomato-kit',
    title: 'Professional kit',
    description: 'More precise nutrition, support, and watering control.',
    productIds: ['tomato-bloom-feed', 'garden-stake-set', 'smart-drip-starter'],
    cost: 72,
    tone: 'professional',
  },
  {
    id: 'organic-care-kit',
    title: 'Organic alternative',
    description: 'A gentler soil and pest-care approach.',
    productIds: ['pure-neem-care', 'living-compost', 'cedar-mulch-layer'],
    cost: 39,
    tone: 'organic',
  },
  {
    id: 'budget-recovery-kit',
    title: 'Budget alternative',
    description: 'The essentials for a focused treatment start.',
    productIds: ['pure-neem-care', 'precision-pruners'],
    cost: 34,
    tone: 'budget',
  },
];

function uniqueProducts(ids: string[]) {
  return fromIds([...new Set(ids)]);
}

function recommendationIds(context: MarketplaceRecommendationContext) {
  const signal =
    `${context.plants?.join(' ') ?? ''} ${context.disease ?? ''} ${context.weather ?? ''} ${context.query ?? ''}`.toLowerCase();
  if (signal.includes('rose')) {
    return [
      'copper-guard-fungicide',
      'pure-neem-care',
      'living-compost',
      'precision-pruners',
    ];
  }
  if (
    signal.includes('rain') ||
    signal.includes('wet') ||
    signal.includes('root rot')
  ) {
    return [
      'drainage-soil-blend',
      'rain-guard-cover',
      'copper-guard-fungicide',
      'terracotta-air-planter',
    ];
  }
  if (signal.includes('aphid') || signal.includes('pest')) {
    return [
      'pure-neem-care',
      'precision-pruners',
      'living-compost',
      'soil-sense-mini',
    ];
  }
  if (signal.includes('indoor') || signal.includes('dry soil')) {
    return [
      'indoor-spectrum-light',
      'soil-sense-mini',
      'terracotta-air-planter',
      'living-compost',
    ];
  }
  return [
    'tomato-bloom-feed',
    'copper-guard-fungicide',
    'cedar-mulch-layer',
    'garden-stake-set',
  ];
}

export const marketplaceService = {
  getById: byId,
  getByIds: fromIds,
  getRelated(product: MarketplaceProduct) {
    return marketplaceCatalog
      .filter(
        (candidate) =>
          candidate.id !== product.id &&
          (candidate.category === product.category ||
            candidate.tags.some((tag) => product.tags.includes(tag))),
      )
      .slice(0, 4);
  },
  getShelf(tag: string) {
    return marketplaceCatalog.filter((product) => product.tags.includes(tag));
  },
  search(query: string, filters: MarketplaceFilters) {
    const normalized = query.trim().toLowerCase();
    return marketplaceCatalog.filter((product) => {
      const haystack = [
        product.name,
        product.brand,
        product.category,
        product.description,
        product.aiReason,
        ...product.tags,
        ...product.suitablePlants,
        ...product.country,
      ]
        .join(' ')
        .toLowerCase();
      return (
        (!normalized || haystack.includes(normalized)) &&
        (filters.category === 'All' || product.category === filters.category) &&
        (!filters.plantType ||
          haystack.includes(filters.plantType.toLowerCase())) &&
        (!filters.disease ||
          haystack.includes(filters.disease.toLowerCase())) &&
        (!filters.weather ||
          haystack.includes(filters.weather.toLowerCase())) &&
        (!filters.season || haystack.includes(filters.season.toLowerCase())) &&
        product.price <= filters.maxPrice &&
        (!filters.organicOnly || Boolean(product.organic)) &&
        (filters.environment === 'All' ||
          product.environment.includes(filters.environment)) &&
        (!filters.country || product.country.includes(filters.country)) &&
        product.rating >= filters.minimumRating
      );
    });
  },
  recommend(
    context: MarketplaceRecommendationContext,
  ): MarketplaceRecommendation {
    const products = uniqueProducts(recommendationIds(context));
    const isDisease = Boolean(context.disease);
    const isRain = context.weather?.toLowerCase().includes('rain');
    const plantLabel = context.plants?.[0] ?? 'garden';
    return {
      products,
      explanation: isDisease
        ? `Recommended because your ${plantLabel.toLowerCase()} screening indicates ${context.disease}. These products support the treatment and prevention steps already in your report.`
        : isRain
          ? 'Recommended because heavy rain can increase leaf wetness and root stress. These choices protect airflow, drainage, and fungal-risk prevention.'
          : `Recommended for your ${plantLabel.toLowerCase()} context, with a focus on consistent care, healthier roots, and the next growth stage.`,
      estimatedMonthlyCost: isDisease ? 42 : isRain ? 36 : 31,
      kits: kitDefinitions,
    };
  },
  getKitProducts(kit: MarketplaceKit) {
    return fromIds(kit.productIds);
  },
};

export const defaultMarketplaceFilters: MarketplaceFilters = {
  category: 'All',
  plantType: '',
  disease: '',
  weather: '',
  season: '',
  maxPrice: 100,
  organicOnly: false,
  environment: 'All',
  country: '',
  minimumRating: 0,
};

export const marketplaceCategoryOptions = [
  'All',
  ...marketplaceCategories,
] as const;
