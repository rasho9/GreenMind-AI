import type { ExternalMarketplaceProduct, ProductSearchInput } from './types';

/**
 * Future commerce adapter contract. Current product cards keep using the mock
 * catalogue; a supplier integration can implement this boundary later.
 */
export interface ProductCatalogProvider {
  search(input: ProductSearchInput): Promise<ExternalMarketplaceProduct[]>;
}

export const marketplaceApi = {
  provider: null as ProductCatalogProvider | null,
  async search(input: ProductSearchInput) {
    return this.provider?.search(input) ?? [];
  },
};
