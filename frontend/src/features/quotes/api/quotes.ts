import { apiDelete, apiGet, apiPatch, apiPost } from '../../../shared/api/http';
import type { Quote, QuoteItem, QuoteItemCreate, QuoteStatusTransitions } from '../types';

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

/** Create a line item under a quote; the API attaches it via the quote in the URL. */
export function createQuoteItem(quoteId: string, values: QuoteItemCreate): Promise<QuoteItem> {
  return apiPost<QuoteItem>(`/quotes/${quoteId}/items/`, values);
}

/** Delete one of a quote's line items, removing its `item_preventivi` row. */
export function deleteQuoteItem(quoteId: string, itemId: string): Promise<void> {
  return apiDelete(`/quotes/${quoteId}/items/${itemId}/`);
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
