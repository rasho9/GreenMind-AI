export const marketplaceCategories = [
  'Plants',
  'Seeds',
  'Flowers',
  'Fruit Trees',
  'Vegetables',
  'Indoor Plants',
  'Outdoor Plants',
  'Medicinal Plants',
  'Fertilizers',
  'Organic Fertilizers',
  'Pesticides',
  'Fungicides',
  'Insecticides',
  'Plant Nutrients',
  'Soil',
  'Compost',
  'Pots',
  'Planters',
  'Gardening Tools',
  'Watering Equipment',
  'Drip Irrigation',
  'Garden Sensors',
  'Grow Lights',
  'Greenhouse Equipment',
  'Garden Decorations',
  'Books',
  'Starter Kits',
] as const;

export type MarketplaceCategory = (typeof marketplaceCategories)[number];

export type ProductVisual =
  | 'fertilizer'
  | 'fungicide'
  | 'neem'
  | 'mulch'
  | 'stakes'
  | 'soil'
  | 'rain-cover'
  | 'sensor'
  | 'drip'
  | 'starter-kit'
  | 'pruners'
  | 'grow-light'
  | 'planter'
  | 'compost';

export type MarketplaceProduct = {
  id: string;
  name: string;
  brand: string;
  category: MarketplaceCategory;
  price: number;
  rating: number;
  reviews: number;
  availability: 'In stock' | 'Low stock' | 'Pre-order';
  description: string;
  aiMatch: number;
  aiReason: string;
  visual: ProductVisual;
  tags: string[];
  suitablePlants: string[];
  specifications: Array<{ label: string; value: string }>;
  usage: string[];
  benefits: string[];
  organic?: boolean;
  environment: Array<'Indoor' | 'Outdoor'>;
  country: string[];
};

export type MarketplaceFilters = {
  category: MarketplaceCategory | 'All';
  plantType: string;
  disease: string;
  weather: string;
  season: string;
  maxPrice: number;
  organicOnly: boolean;
  environment: 'All' | 'Indoor' | 'Outdoor';
  country: string;
  minimumRating: number;
};

export type MarketplaceRecommendationContext = {
  source:
    | 'marketplace'
    | 'plant-doctor'
    | 'recommendations'
    | 'assistant'
    | 'weather';
  plants?: string[];
  disease?: string;
  weather?: string;
  season?: string;
  query?: string;
};

export type MarketplaceKit = {
  id: string;
  title: string;
  description: string;
  productIds: string[];
  cost: number;
  tone: 'beginner' | 'professional' | 'organic' | 'budget';
};

export type MarketplaceRecommendation = {
  products: MarketplaceProduct[];
  explanation: string;
  estimatedMonthlyCost: number;
  kits: MarketplaceKit[];
};

export type CartItem = {
  productId: string;
  quantity: number;
};
