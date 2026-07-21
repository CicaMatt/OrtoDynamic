import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { searchProducts } from '../../../../src/features/products/api/products';
import { ProductSearchField } from '../../../../src/features/quotes/components/ProductSearchField';

vi.mock('../../../../src/features/products/api/products', () => ({
  searchProducts: vi.fn(),
}));

const products = [
  { idProduct: '1', code: 'A-1', description: 'Plantare', price: '10', year: '2026' },
  { idProduct: '2', code: 'B-2', description: 'Tutore', price: '20', year: '2026' },
];

afterEach(() => {
  vi.useRealTimers();
});

describe('ProductSearchField', () => {
  it('selects a search result with arrow keys and Enter', async () => {
    vi.useFakeTimers();
    vi.mocked(searchProducts).mockResolvedValue(products);
    const onSelect = vi.fn();
    render(
      <ProductSearchField
        value=""
        onSelect={onSelect}
        inputValueOf={(product) => product.description}
      />,
    );
    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'tu' } });
    await act(async () => {
      vi.advanceTimersByTime(250);
      await Promise.resolve();
    });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(searchProducts).toHaveBeenCalledWith('tu');
    expect(onSelect).toHaveBeenCalledWith(products[1]);
    expect((input as HTMLInputElement).value).toBe('Tutore');
  });
});
