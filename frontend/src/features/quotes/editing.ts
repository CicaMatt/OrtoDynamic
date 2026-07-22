import type { EntityEditOperations } from '../../app/editing/types';
import { pickDefinedFields, pickFields } from '../../app/editing/types';
import { addDaysIso, todayIso } from '../../shared/format/format';
import {
  createQuote,
  updateQuote,
  type QuoteCreatePayload,
  type QuoteUpdatePayload,
} from './api/quotes';
import { quoteCreateRequiredKeys } from './components/quoteFields';
import { toNullableNumber } from './components/quoteItemMath';
import type { Quote, QuoteItemDraft } from './types';

const quoteTextKeys = [
  'quoteNumber',
  'quoteType',
  'entryBy',
  'diagnosis',
  'therapeuticProgram',
  'detailedPrescription',
  'authorizationNumber',
  'expiryDays',
  'measurementsOk',
  'commissionsPaid',
  'orderNumber',
  'model',
  'measurements',
  'invoiceNumber',
  'note',
  'privateNote',
  'finalNote',
] as const;

const quoteReferenceKeys = ['clientId', 'doctorId'] as const;
const quoteDateKeys = [
  'creationDate',
  'quoteDate',
  'acceptanceDate',
  'authorizationReceiptDate',
] as const;

// `status`, `total`, `maxExpiry`, and `quote` are intentionally excluded:
// status changes through its guarded endpoint, totals/expiry are server-derived,
// and `quote` has no form field.
export const quoteEditableKeys = [
  ...quoteReferenceKeys,
  ...quoteTextKeys,
  ...quoteDateKeys,
] as const satisfies readonly (keyof Quote)[];

function emptyQuote(): Quote {
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

const nullableId = (value: string) => (value === '' ? null : Number(value));
const nullableDate = (value: string) => (value === '' ? null : value);

export function toQuoteUpdatePayload(changes: Partial<Quote>): QuoteUpdatePayload {
  const payload: QuoteUpdatePayload = pickDefinedFields(changes, quoteTextKeys);
  for (const key of quoteReferenceKeys) {
    const value = changes[key];
    if (value !== undefined) payload[key] = nullableId(value);
  }
  for (const key of quoteDateKeys) {
    const value = changes[key];
    if (value !== undefined) payload[key] = nullableDate(value);
  }
  return payload;
}

export function toQuoteCreatePayload(
  draft: Quote,
  itemDrafts: readonly QuoteItemDraft[],
): QuoteCreatePayload {
  const values = pickFields(draft, quoteEditableKeys);
  const payload: QuoteCreatePayload = {
    ...values,
    clientId: nullableId(values.clientId),
    doctorId: nullableId(values.doctorId),
    creationDate: nullableDate(values.creationDate),
    quoteDate: nullableDate(values.quoteDate),
    acceptanceDate: nullableDate(values.acceptanceDate),
    authorizationReceiptDate: nullableDate(values.authorizationReceiptDate),
  };
  const items = itemDrafts
    .filter((item) => item.productId.trim() !== '')
    .map((item) => ({
      productId: Number(item.productId),
      quantity: toNullableNumber(item.quantity),
      discount: toNullableNumber(item.discount),
    }));
  if (items.length > 0) payload.items = items;
  return payload;
}

/** Preview the server-derived maximum expiry while editing the day count. */
export function previewMaxExpiryFromDays(days: string, today = todayIso()): string {
  const count = Number(days);
  if (days.trim() === '' || !Number.isInteger(count) || count < 0) return '';
  return addDaysIso(today, count);
}

export function changeQuoteDraft(draft: Quote, key: keyof Quote, value: string): Quote | null {
  if (key === 'expiryDays' && !/^\d*$/.test(value)) return null;
  const next = { ...draft, [key]: value };
  if (key === 'expiryDays') next.maxExpiry = previewMaxExpiryFromDays(value);
  return next;
}

export const quoteEditOperations = {
  editableKeys: quoteEditableKeys,
  requiredKeys: quoteCreateRequiredKeys,
  emptyDraft: emptyQuote,
  create: async (draft: Quote, itemDrafts: readonly QuoteItemDraft[] = []) => {
    const created = await createQuote(toQuoteCreatePayload(draft, itemDrafts));
    return created.idQuote;
  },
  update: async (id, changes) => {
    await updateQuote(id, toQuoteUpdatePayload(changes));
  },
} satisfies EntityEditOperations<'quote'>;
