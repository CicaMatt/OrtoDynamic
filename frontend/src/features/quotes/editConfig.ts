import {
  blankDatesToNull,
  buildCreatePayload,
  type EditPayloadContext,
  type EntityEditConfig,
} from '../../app/editing/types';
import { addDaysIso, todayIso } from '../../shared/format/format';
import { createQuote, updateQuote, type QuoteCreatePayload, type QuoteUpdate } from './api/quotes';
import { QUOTE_EDITABLE_KEYS } from './components/quoteFields';
import { toNullableNumber } from './components/quoteItemMath';
import type { Quote } from './types';

const quoteDateKeys = ['creationDate', 'quoteDate', 'acceptanceDate', 'authorizationReceiptDate'];

function makeEmptyQuote(): Quote {
  return {
    idQuote: '', clientId: '', doctorId: '', clientName: '', clientCity: '', doctorName: '',
    workOrderId: '', quoteNumber: '', quoteType: '', status: '', creationDate: todayIso(),
    quoteDate: '', total: '', entryBy: '', diagnosis: '', therapeuticProgram: '',
    detailedPrescription: '', authorizationNumber: '', acceptanceDate: '',
    authorizationReceiptDate: '', expiryDays: '', maxExpiry: '', measurementsOk: '',
    commissionsPaid: '', orderNumber: '', model: '', measurements: '', invoiceNumber: '',
    quote: '', note: '', privateNote: '', finalNote: '',
  };
}

/**
 * Quote's "Data Massima Scadenza" derived from "Giorni Massima Scadenza": today
 * plus that many days, as an ISO date. Blank when the days are missing or invalid.
 */
function maxExpiryFromDays(days: string): string {
  const count = Number(days);
  if (days.trim() === '' || !Number.isInteger(count) || count < 0) return '';
  return addDaysIso(todayIso(), count);
}

function buildQuotePayload(changes: Record<string, unknown>): QuoteUpdate {
  const payload = { ...changes } as QuoteUpdate;
  blankDatesToNull(payload, quoteDateKeys);
  if ('clientId' in payload) {
    payload.clientId = payload.clientId === '' ? null : Number(payload.clientId);
  }
  if ('doctorId' in payload) {
    payload.doctorId = payload.doctorId === '' ? null : Number(payload.doctorId);
  }
  return payload;
}

function buildQuoteCreatePayload(draft: Quote, context: EditPayloadContext): QuoteCreatePayload {
  const payload: QuoteCreatePayload = buildQuotePayload(buildCreatePayload(draft, QUOTE_EDITABLE_KEYS));
  const items = context.quoteItemDrafts
    .filter((item) => item.productId.trim() !== '')
    .map((item) => ({
      productId: Number(item.productId),
      quantity: toNullableNumber(item.quantity),
      discount: toNullableNumber(item.discount),
    }));
  if (items.length > 0) payload.items = items;
  return payload;
}

export const quoteEditConfig: EntityEditConfig<'quote'> = {
  editableKeys: QUOTE_EDITABLE_KEYS,
  makeEmptyDraft: makeEmptyQuote,
  create: (payload) => createQuote(payload as QuoteCreatePayload),
  update: (id, payload) => updateQuote(id, payload as QuoteUpdate),
  getCreatedId: (created) => created.idQuote,
  buildCreatePayload: buildQuoteCreatePayload,
  buildUpdatePayload: buildQuotePayload,
  applyFieldChange: (draft, key, value) => {
    if (key === 'expiryDays' && !/^\d*$/.test(value)) return null;
    const next = { ...draft, [key]: value };
    if (key === 'expiryDays') next.maxExpiry = maxExpiryFromDays(value);
    return next;
  },
};
