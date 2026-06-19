import { apiDelete, apiGet, apiGetBlob, apiPatch, apiPost } from '../../../shared/api/http';
import type { Quote, QuoteItem, QuoteItemCreate, QuoteStatusTransitions } from '../types';

export type QuoteUpdate = Record<string, string | number | null>;

/** Create payload: the quote fields plus any initial line items, sent in one request. */
export type QuoteCreatePayload = QuoteUpdate & { items?: QuoteItemCreate[] };

/** The editable money inputs of a line item; `null` clears the value. */
export type QuoteItemUpdate = { quantity: number | null; discount: number | null };

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

/** Update a line item's quantity/discount; the API recomputes its amount. */
export function updateQuoteItem(
  quoteId: string,
  itemId: string,
  changes: QuoteItemUpdate,
): Promise<QuoteItem> {
  return apiPatch<QuoteItem>(`/quotes/${quoteId}/items/${itemId}/`, changes);
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

/** Create a new quote (optionally with its initial line items); the API returns the record. */
export function createQuote(values: QuoteCreatePayload): Promise<Quote> {
  return apiPost<Quote>('/quotes/', values);
}

/** Fetch the quote's "Modulo di consegna" delivery form as an inline PDF blob. */
export function fetchQuoteDeliveryForm(id: string): Promise<{ blob: Blob; filename: string | null }> {
  return apiGetBlob(`/quotes/${id}/delivery-form/`);
}

/** Fetch the quote's DDT (delivery note) as an inline PDF blob. */
export function fetchQuoteDdt(id: string): Promise<{ blob: Blob; filename: string | null }> {
  return apiGetBlob(`/quotes/${id}/ddt/`);
}

/** Fetch the quote's "Scheda Progetto" project sheet as an inline PDF blob. */
export function fetchQuoteScheda(id: string): Promise<{ blob: Blob; filename: string | null }> {
  return apiGetBlob(`/quotes/${id}/scheda/`);
}
