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

// `status`, `total`, `maxExpiry`, and `quote` are intentionally excluded:
// status changes through its guarded endpoint, totals/expiry are server-derived,
// and `quote` has no form field.
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
  if (changes.clientId !== undefined) payload.clientId = nullableId(changes.clientId);
  if (changes.doctorId !== undefined) payload.doctorId = nullableId(changes.doctorId);
  if (changes.creationDate !== undefined) {
    payload.creationDate = nullableDate(changes.creationDate);
  }
  if (changes.quoteDate !== undefined) payload.quoteDate = nullableDate(changes.quoteDate);
  if (changes.acceptanceDate !== undefined) {
    payload.acceptanceDate = nullableDate(changes.acceptanceDate);
  }
  if (changes.authorizationReceiptDate !== undefined) {
    payload.authorizationReceiptDate = nullableDate(changes.authorizationReceiptDate);
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

export const quoteEditOperations: EntityEditOperations<'quote'> = {
  editableKeys: quoteEditableKeys,
  requiredKeys: quoteCreateRequiredKeys,
  emptyDraft: emptyQuote,
  create: async (draft, context) => {
    const created = await createQuote(toQuoteCreatePayload(draft, context.quoteItemDrafts));
    return created.idQuote;
  },
  update: async (id, changes) => {
    await updateQuote(id, toQuoteUpdatePayload(changes));
  },
};
