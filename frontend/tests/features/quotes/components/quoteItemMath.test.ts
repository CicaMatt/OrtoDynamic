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
  it('parses optional numbers without leaking NaN', () => {
    expect(toNullableNumber('')).toBeNull();
    expect(toNullableNumber(' 12.5 ')).toBe(12.5);
    expect(toNullableNumber('not-a-number')).toBeNull();
  });

  it('previews line amounts and discounts with currency precision', () => {
    expect(previewAmount('12.50', '3', '')).toBe('37.5');
    expect(previewAmount('12.50', '3', '20')).toBe('30');
    expect(previewAmount('', '3', '20')).toBe('');
    expect(previewAmount('invalid', '3', '')).toBe('');
  });

  it('sums pending items and keeps an empty quote blank', () => {
    expect(draftItemsTotal([])).toBe('');
    expect(
      draftItemsTotal([
        { productId: '1', code: 'A', description: 'One', price: '10', quantity: '2', discount: '' },
        {
          productId: '2',
          code: 'B',
          description: 'Two',
          price: '5',
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
    expect(discountError('0')).not.toBeNull();
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
        quantity: '0',
        discount: '',
      }),
    ).toEqual({
      productId: '7',
      code: 'T-7',
      description: 'Tutore',
      price: '25',
      quantity: '1',
      discount: '',
    });
  });
});
