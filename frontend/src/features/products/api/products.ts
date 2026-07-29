import { apiDelete, apiGet, apiPatch, apiPost } from '../../../shared/api/http';
import type { Product } from '../types';

export type ProductFieldsPayload = {
  code: string;
  description: string;
  price: number | null;
  year: string | null;
};

export type ProductCreatePayload = ProductFieldsPayload;
export type ProductUpdatePayload = Partial<ProductFieldsPayload>;

export function fetchProducts(): Promise<Product[]> {
  return apiGet<Product[]>('/products/');
}

export type QuoteItemSearchContext = { quoteId: string; itemId: string };

/** Quote-line type-ahead, active-only unless scoped to an existing historical line. */
export function searchProducts(
  query: string,
  context?: QuoteItemSearchContext,
): Promise<Product[]> {
  const path = context
    ? `/quotes/${context.quoteId}/items/${context.itemId}/products/search/`
    : '/products/search/';
  return apiGet<Product[]>(`${path}?q=${encodeURIComponent(query)}`);
}

export function fetchProduct(id: string): Promise<Product> {
  return apiGet<Product>(`/products/${id}/`);
}

export function updateProduct(id: string, changes: ProductUpdatePayload): Promise<unknown> {
  return apiPatch(`/products/${id}/`, changes);
}

export function deleteProduct(id: string): Promise<void> {
  return apiDelete(`/products/${id}/`);
}

/** Create a new product; the API returns the created record (with its new id). */
export function createProduct(values: ProductCreatePayload): Promise<Product> {
  return apiPost<Product>('/products/', values);
}
