import { apiGet, apiPatch, apiPost } from '../../../shared/api/http';
import type { Quote, QuoteItem, QuoteStatusTransitions } from '../types';

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

/** The states the quote may transition to from its current state. */
export function fetchQuoteStatusTransitions(id: string): Promise<QuoteStatusTransitions> {
  return apiGet<QuoteStatusTransitions>(`/quotes/${id}/status-transitions/`);
}

/** Apply a guarded status transition; the API returns the updated quote. */
export function changeQuoteStatus(id: string, status: string): Promise<Quote> {
  return apiPatch<Quote>(`/quotes/${id}/status/`, { status });
}

export function updateQuote(id: string, changes: QuoteUpdate): Promise<unknown> {
  return apiPatch(`/quotes/${id}/`, changes);
}

/** Create a new quote; the API returns the created record (with its new id). */
export function createQuote(values: QuoteUpdate): Promise<Quote> {
  return apiPost<Quote>('/quotes/', values);
}
