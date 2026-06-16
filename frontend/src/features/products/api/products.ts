import { apiGet, apiPatch, apiPost } from '../../../shared/api/http';
import type { Product } from '../types';

export type ProductUpdate = Record<string, string | number | null>;

export function fetchProducts(): Promise<Product[]> {
  return apiGet<Product[]>('/products/');
}

/** Type-ahead lookup: products whose id (or code) matches `query`, capped by the API. */
export function searchProducts(query: string): Promise<Product[]> {
  return apiGet<Product[]>(`/products/search/?q=${encodeURIComponent(query)}`);
}

export function fetchProduct(id: string): Promise<Product> {
  return apiGet<Product>(`/products/${id}/`);
}

export function updateProduct(id: string, changes: ProductUpdate): Promise<unknown> {
  return apiPatch(`/products/${id}/`, changes);
}

/** Create a new product; the API returns the created record (with its new id). */
export function createProduct(values: ProductUpdate): Promise<Product> {
  return apiPost<Product>('/products/', values);
}
