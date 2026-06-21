import { apiClient } from "./client";
import type { Page, Product, StrainType } from "../types/api";

export interface CatalogQuery {
  strainType?: StrainType;
  page?: number;
  size?: number;
}

/** GET /api/catalog/products — public, paginated. */
export async function fetchProducts(query: CatalogQuery): Promise<Page<Product>> {
  const { data } = await apiClient.get<Page<Product>>("/catalog/products", {
    params: {
      strainType: query.strainType,
      page: query.page ?? 0,
      size: query.size ?? 12,
    },
  });
  return data;
}

/** GET /api/catalog/products/{slug} — public. */
export async function fetchProduct(slug: string): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/catalog/products/${slug}`);
  return data;
}
