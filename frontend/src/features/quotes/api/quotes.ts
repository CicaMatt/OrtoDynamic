import { apiGet, apiPatch, apiPost } from '../../../shared/api/http';
import type { Quote, QuoteItem } from '../types';

export type QuoteUpdate = Record<string, string | number | null>;

export function fetchQuotes(): Promise<Quote[]> {
  return apiGet<Quote[]>('/quotes/');
}

export function fetchQuote(id: string): Promise<Quote> {
  return apiGet<Quote>(`/quotes/${id}/`);
}

export function fetchQuoteItems(quoteId: string): Promise<QuoteItem[]> {
  return apiGet<QuoteItem[]>(`/quotes/${quoteId}/items/`);
}

export function updateQuote(id: string, changes: QuoteUpdate): Promise<unknown> {
  return apiPatch(`/quotes/${id}/`, changes);
}

/** Create a new quote; the API returns the created record (with its new id). */
export function createQuote(values: QuoteUpdate): Promise<Quote> {
  return apiPost<Quote>('/quotes/', values);
}
