import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useQuoteItemDraft } from '../../../../src/features/quotes/components/useQuoteItemDraft';

describe('useQuoteItemDraft', () => {
  it('owns field changes and synchronized product selection', () => {
    const { result } = renderHook(useQuoteItemDraft);

    act(() => result.current.begin());
    act(() => result.current.setField('quantity', '3'));
    act(() =>
      result.current.selectProduct({
        idProduct: '7',
        code: 'T-7',
        description: 'Tutore',
        price: '25',
        year: '2026',
      }),
    );

    expect(result.current.draft).toMatchObject({
      productId: '7',
      code: 'T-7',
      description: 'Tutore',
      price: '25',
      quantity: '3',
    });

    act(() => result.current.clear());
    expect(result.current.draft).toBeNull();
  });
});
