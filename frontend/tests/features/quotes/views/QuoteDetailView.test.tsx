import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EntityEditProvider } from '../../../../src/app/editing/EntityEditContext';
import { EditActionBar } from '../../../../src/app/layout/EditActionBar';
import {
  NavigationProvider,
  useNavigation,
} from '../../../../src/app/navigation/NavigationContext';
import type { Quote } from '../../../../src/features/quotes/types';
import { QuoteDetailView } from '../../../../src/features/quotes/views/QuoteDetailView';

const quoteApi = vi.hoisted(() => ({
  changeQuoteStatus: vi.fn(),
  createQuote: vi.fn(),
  createQuoteItem: vi.fn(),
  deleteQuote: vi.fn(),
  deleteQuoteItem: vi.fn(),
  fetchQuote: vi.fn(),
  fetchQuoteDdt: vi.fn(),
  fetchQuoteDeliveryForm: vi.fn(),
  fetchQuoteItems: vi.fn(),
  fetchQuoteScheda: vi.fn(),
  fetchQuoteStatusTransitions: vi.fn(),
  updateQuote: vi.fn(),
  updateQuoteItem: vi.fn(),
}));
const clientApi = vi.hoisted(() => ({ fetchClients: vi.fn() }));
const doctorApi = vi.hoisted(() => ({ fetchDoctors: vi.fn() }));

vi.mock('../../../../src/features/quotes/api/quotes', () => quoteApi);
vi.mock('../../../../src/features/clients/api/clients', () => clientApi);
vi.mock('../../../../src/features/doctors/api/doctors', () => doctorApi);

const quote: Quote = {
  idQuote: 'Q-1',
  clientId: 'C-1',
  doctorId: 'D-1',
  clientName: 'Ada Rossi',
  clientCity: 'Roma',
  doctorName: 'Luca Bianchi',
  workOrderId: 'W-1',
  quoteNumber: 'PR-1',
  quoteType: 'Asl',
  status: 'ACCETTATO',
  creationDate: '2026-07-01',
  quoteDate: '2026-07-02',
  total: '100',
  entryBy: 'mario',
  diagnosis: 'Diagnosi iniziale',
  therapeuticProgram: '',
  detailedPrescription: 'Prescrizione iniziale',
  authorizationNumber: 'AUTH-1',
  acceptanceDate: '2026-07-03',
  authorizationReceiptDate: '2026-07-04',
  expiryDays: '10',
  maxExpiry: '2026-08-01',
  measurementsOk: 'Si',
  commissionsPaid: 'No',
  orderNumber: 'ORD-1',
  model: 'Modello A',
  measurements: 'Misure A',
  invoiceNumber: 'FAT-1',
  quote: '',
  note: 'Nota pubblica',
  privateNote: 'Nota privata',
  finalNote: 'Nota finale',
};

function QuoteRouteHarness() {
  const navigation = useNavigation();
  return (
    <>
      <button type="button" onClick={() => navigation.navigate({ name: 'quotes' })}>
        Vai ai preventivi
      </button>
      <button
        type="button"
        onClick={() => navigation.navigate({ name: 'quote-detail', quoteId: quote.idQuote })}
      >
        Apri preventivo
      </button>
      <output data-testid="route">{navigation.route.name}</output>
      {navigation.route.name === 'quote-detail' && <QuoteDetailView />}
      <EditActionBar />
    </>
  );
}

function renderQuoteDetail() {
  render(
    <EntityEditProvider>
      <NavigationProvider>
        <QuoteRouteHarness />
      </NavigationProvider>
    </EntityEditProvider>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Vai ai preventivi' }));
  fireEvent.click(screen.getByRole('button', { name: 'Apri preventivo' }));
}

beforeEach(() => {
  vi.resetAllMocks();
  quoteApi.fetchQuote.mockResolvedValue(quote);
  quoteApi.fetchQuoteItems.mockResolvedValue([]);
  quoteApi.updateQuote.mockResolvedValue({});
  quoteApi.deleteQuote.mockResolvedValue(undefined);
  quoteApi.fetchQuoteDdt.mockResolvedValue({
    blob: new Blob(['ddt'], { type: 'application/pdf' }),
    filename: 'ddt.pdf',
  });
  clientApi.fetchClients.mockResolvedValue([]);
  doctorApi.fetchDoctors.mockResolvedValue([]);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('QuoteDetailView', () => {
  it('loads the quote, edits an allowed field, and saves only that change', async () => {
    renderQuoteDetail();

    await screen.findByText('Preventivo Nº PR-1');
    expect(screen.getByRole('button', { name: /Ada Rossi/ })).not.toBeNull();
    expect(screen.getByRole('button', { name: /Luca Bianchi/ })).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Modifica Dati Preventivo/ }));
    const diagnosis = await screen.findByDisplayValue('Diagnosi iniziale');
    fireEvent.change(diagnosis, { target: { value: 'Diagnosi aggiornata' } });

    expect(
      (screen.getByRole('button', { name: /Cambia Stato/ }) as HTMLButtonElement).disabled,
    ).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Salva' }));

    await waitFor(() =>
      expect(quoteApi.updateQuote).toHaveBeenCalledWith('Q-1', {
        diagnosis: 'Diagnosi aggiornata',
      }),
    );
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Salva' })).toBeNull());
  });

  it('generates a DDT with the selected price option', async () => {
    const popup = { close: vi.fn(), location: { href: '' } };
    vi.spyOn(window, 'open').mockReturnValue(popup as unknown as Window);
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:ddt'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: vi.fn(),
    });
    renderQuoteDetail();

    await screen.findByText('Preventivo Nº PR-1');
    fireEvent.click(screen.getByRole('button', { name: /Genera DDT/ }));
    expect(screen.getByText(/Scegli se includere prezzo unitario/)).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Con prezzi/ }));

    await waitFor(() => expect(quoteApi.fetchQuoteDdt).toHaveBeenCalledWith('Q-1', true));
    await waitFor(() => expect(popup.location.href).toBe('blob:ddt'));
  });

  it('shows linked-record deletion consequences before deleting and returning to the list', async () => {
    renderQuoteDetail();

    await screen.findByText('Preventivo Nº PR-1');
    fireEvent.click(screen.getByRole('button', { name: /Elimina Preventivo/ }));

    expect(screen.getByText(/Saranno eliminati anche gli articoli associati/)).not.toBeNull();
    expect(screen.getByText(/Lavorazione associata W-1/)).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Elimina Preventivo' }));

    await waitFor(() => expect(quoteApi.deleteQuote).toHaveBeenCalledWith('Q-1'));
    await waitFor(() => expect(screen.getByTestId('route').textContent).toBe('quotes'));
  });

  it('renders a useful error and lets the user return when loading fails', async () => {
    quoteApi.fetchQuote.mockRejectedValue(new Error('Preventivo non disponibile.'));
    renderQuoteDetail();

    expect(await screen.findByText('Preventivo non disponibile.')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Torna ai preventivi/ }));
    expect(screen.getByTestId('route').textContent).toBe('quotes');
  });
});
