import { useState } from 'react';
import type { Product } from '../../products/types';
import type { QuoteItemDraft } from '../types';
import { EMPTY_ITEM_DRAFT } from './quoteItemMath';

/** Shared local state for the new-item row; persistence stays in each card controller. */
export function useQuoteItemDraft() {
  const [draft, setDraft] = useState<QuoteItemDraft | null>(null);

  const begin = () => setDraft({ ...EMPTY_ITEM_DRAFT });
  const clear = () => setDraft(null);
  const setField = (key: keyof QuoteItemDraft, value: string) =>
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  const selectProduct = (product: Product) =>
    setDraft((current) =>
      current
        ? {
            ...current,
            productId: product.idProduct,
            code: product.code,
            description: product.description,
            price: product.price,
            productYear: product.year,
            catalogPrice: product.price,
            isHistorical: false,
          }
        : current,
    );

  return { draft, begin, clear, setField, selectProduct };
}
