import type { QuoteItemDraft } from '../types';

/** A blank line-item draft for the inline "Aggiungi" row. */
export const EMPTY_ITEM_DRAFT: QuoteItemDraft = {
  productId: '',
  code: '',
  description: '',
  price: '',
  quantity: '',
  discount: '',
};

/** Column headers shared by both line-item cards, in display order. */
export const ITEM_COLUMN_LABELS = [
  'Codice Nomenclatore',
  'Prodotto',
  'Quantità',
  'Prezzo',
  'Importo',
  'Sconto',
] as const;

/** One column per header plus the trailing actions column. */
export const ITEM_COLUMN_COUNT = ITEM_COLUMN_LABELS.length + 1;

/** Parse an amount input into the number the API expects, or `null` when blank. */
export function toNullableNumber(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

/**
 * Live preview of importo: `prezzo × quantità`, reduced by the discount percent
 * when one is set (mirroring the backend's `line_amount`). Blank until both price
 * and quantity are known.
 */
export function previewAmount(price: string, quantity: string, discount: string): string {
  const unitPrice = Number(price);
  const count = Number(quantity);
  if (
    price.trim() === '' ||
    quantity.trim() === '' ||
    !Number.isFinite(unitPrice) ||
    !Number.isFinite(count)
  ) {
    return '';
  }
  let amount = unitPrice * count;
  const percent = Number(discount);
  if (discount.trim() !== '' && Number.isFinite(percent)) {
    amount *= 1 - percent / 100;
  }
  return String(Math.round(amount * 100) / 100);
}

/**
 * Validate a discount input. A discount is optional; when given it must be a
 * percentage between 1 and 100. Returns an error message, or `null` when valid —
 * the backend enforces the same bound as the source of truth.
 */
export function discountError(raw: string): string | null {
  if (raw.trim() === '') return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 1 || value > 100) {
    return 'Lo sconto deve essere un valore percentuale tra 1 e 100.';
  }
  return null;
}

/** Reject obviously out-of-range discount keystrokes (negative or above 100). */
export function isAcceptableDiscountInput(value: string): boolean {
  if (value.trim() === '') return true;
  if (value.startsWith('-')) return false;
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric <= 100;
}

/** Build a line-item draft from an existing item, for the inline edit row. */
export function draftFromItem(item: {
  productId: string;
  productCode: string;
  productDescription: string;
  price: string;
  quantity: string;
  discount: string;
}): QuoteItemDraft {
  return {
    productId: item.productId,
    code: item.productCode,
    description: item.productDescription,
    price: item.price,
    quantity: item.quantity,
    discount: item.discount,
  };
}
