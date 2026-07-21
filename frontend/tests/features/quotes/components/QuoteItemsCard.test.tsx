import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { Product } from '../../../../src/features/products/types';
import {
  createQuoteItem,
  deleteQuoteItem,
  fetchQuoteItems,
  updateQuoteItem,
} from '../../../../src/features/quotes/api/quotes';
import { QuoteItemsCard } from '../../../../src/features/quotes/views/QuoteItemsCard';

vi.mock('../../../../src/features/quotes/api/quotes', () => ({
  createQuoteItem: vi.fn(),
  deleteQuoteItem: vi.fn(),
  fetchQuoteItems: vi.fn(),
  updateQuoteItem: vi.fn(),
}));

vi.mock('../../../../src/features/quotes/components/ProductSearchField', () => ({
  ProductSearchField: ({ onSelect }: { onSelect: (product: Product) => void }) => (
    <button
      type="button"
      onClick={() =>
        onSelect({
          idProduct: '7',
          code: 'T-7',
          description: 'Tutore',
          price: '25',
          year: '2026',
        })
      }
    >
      Seleziona prodotto
    </button>
  ),
}));

vi.mock('../../../../src/app/navigation/EntityReference', () => ({
  EntityReference: ({ name }: { name: string }) => <>{name}</>,
}));

const item = {
  id: '11',
  productId: '7',
  productCode: 'T-7',
  productDescription: 'Tutore',
  quantity: '2',
  price: '25',
  amount: '50',
  discount: '',
};

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(fetchQuoteItems).mockResolvedValue([]);
  vi.mocked(createQuoteItem).mockResolvedValue(item);
  vi.mocked(updateQuoteItem).mockResolvedValue(item);
  vi.mocked(deleteQuoteItem).mockResolvedValue(undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('QuoteItemsCard', () => {
  it('creates a selected item with the existing API payload and reloads totals', async () => {
    const onChanged = vi.fn();
    render(<QuoteItemsCard quoteId="5" total="0" onChanged={onChanged} />);
    await screen.findByText('Nessun articolo per questo preventivo.');

    fireEvent.click(screen.getByText('Aggiungi'));
    fireEvent.click(screen.getAllByText('Seleziona prodotto')[0]);
    fireEvent.click(screen.getByLabelText('Conferma'));

    await waitFor(() =>
      expect(createQuoteItem).toHaveBeenCalledWith('5', {
        productId: 7,
        quantity: 1,
        discount: null,
      }),
    );
    expect(fetchQuoteItems).toHaveBeenCalledTimes(2);
    expect(onChanged).toHaveBeenCalledOnce();
  });

  it('updates and deletes existing rows through the controller', async () => {
    vi.mocked(fetchQuoteItems).mockResolvedValue([item]);
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const onChanged = vi.fn();
    render(<QuoteItemsCard quoteId="5" total="50" onChanged={onChanged} />);
    await screen.findByText('Tutore');

    fireEvent.click(screen.getByLabelText('Modifica articolo'));
    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '3' } });
    fireEvent.click(screen.getByLabelText('Conferma'));
    await waitFor(() =>
      expect(updateQuoteItem).toHaveBeenCalledWith('5', '11', {
        quantity: 3,
        discount: null,
      }),
    );

    await screen.findByLabelText('Elimina articolo');
    fireEvent.click(screen.getByLabelText('Elimina articolo'));
    await waitFor(() => expect(deleteQuoteItem).toHaveBeenCalledWith('5', '11'));
    expect(onChanged).toHaveBeenCalledTimes(2);
  });
});
