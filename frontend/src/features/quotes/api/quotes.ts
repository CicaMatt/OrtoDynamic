import { apiGet, apiPatch } from '../../../shared/api/http';
import type { Quote } from '../types';

export type QuoteUpdate = Record<string, string | number | null>;

export function fetchQuotes(): Promise<Quote[]> {
  return apiGet<Quote[]>('/quotes/');
}

export function fetchQuote(id: string): Promise<Quote> {
  return apiGet<Quote>(`/quotes/${id}/`);
}

export function updateQuote(id: string, changes: QuoteUpdate): Promise<unknown> {
  return apiPatch(`/quotes/${id}/`, changes);
}
