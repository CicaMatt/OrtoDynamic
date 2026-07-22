import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { QuoteStatusDialog } from '../../../../src/features/quotes/views/QuoteStatusDialog';

const quoteApi = vi.hoisted(() => ({
  fetchQuoteStatusTransitions: vi.fn(),
  changeQuoteStatus: vi.fn(),
}));

vi.mock('../../../../src/features/quotes/api/quotes', () => quoteApi);

describe('QuoteStatusDialog', () => {
  it('uses backend side-effect metadata to request confirmation', async () => {
    quoteApi.fetchQuoteStatusTransitions.mockResolvedValue({
      current: 'ACCETTATO',
      available: ['PRODUZIONE SPECIALE'],
      options: [{ status: 'PRODUZIONE SPECIALE', createsWorkOrder: true }],
    });
    quoteApi.changeQuoteStatus.mockResolvedValue({});
    const onClose = vi.fn();
    const onChanged = vi.fn();

    render(
      <QuoteStatusDialog
        quoteId="500"
        currentStatus="ACCETTATO"
        onClose={onClose}
        onChanged={onChanged}
      />,
    );

    fireEvent.click(await screen.findByText('PRODUZIONE SPECIALE'));
    expect(screen.getByText(/verrà creata la relativa lavorazione/)).not.toBeNull();
    expect(quoteApi.changeQuoteStatus).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Conferma' }));
    await waitFor(() =>
      expect(quoteApi.changeQuoteStatus).toHaveBeenCalledWith('500', 'PRODUZIONE SPECIALE'),
    );
    expect(onChanged).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
