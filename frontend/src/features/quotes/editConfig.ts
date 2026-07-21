import {
  blankDatesToNull,
  buildCreatePayload,
  type EditPayloadContext,
  type EntityEditConfig,
} from '../../app/editing/types';
import { addDaysIso, todayIso } from '../../shared/format/format';
import { createQuote, updateQuote, type QuoteCreatePayload, type QuoteUpdate } from './api/quotes';
import { toNullableNumber } from './components/quoteItemMath';
import type { Quote } from './types';

const quoteDateKeys = ['creationDate', 'quoteDate', 'acceptanceDate', 'authorizationReceiptDate'];

export const quoteCreateRequiredKeys = [
  'clientId',
  'quoteType',
  'diagnosis',
  'detailedPrescription',
] as const satisfies readonly (keyof Quote)[];

// `status`, `total`, and `quote` are intentionally excluded: status changes via
// its guarded endpoint, total is server-derived, and quote has no form field.
export const quoteEditableKeys = [
  'clientId',
  'doctorId',
  'quoteNumber',
  'quoteType',
  'creationDate',
  'quoteDate',
  'entryBy',
  'diagnosis',
  'therapeuticProgram',
  'detailedPrescription',
  'authorizationNumber',
  'acceptanceDate',
  'authorizationReceiptDate',
  'expiryDays',
  'maxExpiry',
  'measurementsOk',
  'commissionsPaid',
  'orderNumber',
  'model',
  'measurements',
  'invoiceNumber',
  'note',
  'privateNote',
  'finalNote',
] as const satisfies readonly (keyof Quote)[];

function makeEmptyQuote(): Quote {
  return {
    idQuote: '',
    clientId: '',
    doctorId: '',
    clientName: '',
    clientCity: '',
    doctorName: '',
    workOrderId: '',
    quoteNumber: '',
    quoteType: '',
    status: '',
    creationDate: todayIso(),
    quoteDate: '',
    total: '',
    entryBy: '',
    diagnosis: '',
    therapeuticProgram: '',
    detailedPrescription: '',
    authorizationNumber: '',
    acceptanceDate: '',
    authorizationReceiptDate: '',
    expiryDays: '',
    maxExpiry: '',
    measurementsOk: '',
    commissionsPaid: '',
    orderNumber: '',
    model: '',
    measurements: '',
    invoiceNumber: '',
    quote: '',
    note: '',
    privateNote: '',
    finalNote: '',
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
  const payload: QuoteCreatePayload = buildQuotePayload(
    buildCreatePayload(draft, quoteEditableKeys),
  );
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
  editableKeys: quoteEditableKeys,
  requiredKeys: quoteCreateRequiredKeys,
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
