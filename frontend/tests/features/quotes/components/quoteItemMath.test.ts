import { describe, expect, it } from 'vitest';

import {
  discountError,
  draftFromItem,
  draftItemsTotal,
  isAcceptableDiscountInput,
  isAcceptableQuantityInput,
  previewAmount,
  quantityError,
  toNullableNumber,
} from '../../../../src/features/quotes/components/quoteItemMath';

describe('quote item math', () => {
  const parityCases = [
    ['10', '3', '', '30'],
    ['50', '2', '25', '75'],
    ['40', '2', '100', '0'],
    ['9.99', '3', '10', '26.97'],
    ['1.005', '1', '', '1.01'],
    ['', '5', '20', ''],
    ['10', '', '20', ''],
  ] as const;

  it('parses optional numbers without leaking NaN', () => {
    expect(toNullableNumber('')).toBeNull();
    expect(toNullableNumber(' 12.5 ')).toBe(12.5);
    expect(toNullableNumber('not-a-number')).toBeNull();
  });

  it('previews line amounts and discounts with currency precision', () => {
    for (const [price, quantity, discount, expected] of parityCases) {
      expect(previewAmount(price, quantity, discount)).toBe(expected);
    }
    expect(previewAmount('invalid', '3', '')).toBe('');
  });

  it('sums pending items and keeps an empty quote blank', () => {
    expect(draftItemsTotal([])).toBe('');
    expect(
      draftItemsTotal([
        {
          productId: '1',
          code: 'A',
          description: 'One',
          price: '10',
          productYear: '2025',
          catalogPrice: '10',
          isHistorical: false,
          quantity: '2',
          discount: '',
        },
        {
          productId: '2',
          code: 'B',
          description: 'Two',
          price: '5',
          productYear: '2025',
          catalogPrice: '5',
          isHistorical: false,
          quantity: '3',
          discount: '10',
        },
      ]),
    ).toBe('33.5');
  });

  it('enforces quantity and discount boundaries', () => {
    expect(quantityError('')).not.toBeNull();
    expect(quantityError('0')).not.toBeNull();
    expect(quantityError('1')).toBeNull();
    expect(discountError('')).toBeNull();
    expect(discountError('0')).toBeNull();
    expect(discountError('100')).toBeNull();
    expect(discountError('101')).not.toBeNull();

    expect(isAcceptableQuantityInput('')).toBe(true);
    expect(isAcceptableQuantityInput('-1')).toBe(false);
    expect(isAcceptableQuantityInput('1')).toBe(true);
    expect(isAcceptableDiscountInput('')).toBe(true);
    expect(isAcceptableDiscountInput('-1')).toBe(false);
    expect(isAcceptableDiscountInput('100.1')).toBe(false);
  });

  it('repairs invalid stored quantities when making an edit draft', () => {
    expect(
      draftFromItem({
        productId: '7',
        productCode: 'T-7',
        productDescription: 'Tutore',
        price: '25',
        productYear: '2024',
        catalogPrice: '30',
        isHistorical: true,
        quantity: '0',
        discount: '',
      }),
    ).toEqual({
      productId: '7',
      code: 'T-7',
      description: 'Tutore',
      price: '25',
      productYear: '2024',
      catalogPrice: '30',
      isHistorical: true,
      quantity: '1',
      discount: '',
    });
  });
});
