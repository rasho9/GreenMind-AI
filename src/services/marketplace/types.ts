export type ProductSearchInput = {
  query?: string;
  plant?: string;
  disease?: string;
  weather?: string;
  category?: string;
};

export type ExternalMarketplaceProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  url?: string;
  imageUrl?: string;
};
