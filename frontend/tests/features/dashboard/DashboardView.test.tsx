import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EntityEditProvider } from '../../../src/app/editing/EntityEditContext';
import { NavigationProvider, useNavigation } from '../../../src/app/navigation/NavigationContext';
import { DashboardView } from '../../../src/features/dashboard/views/DashboardView';
import { QuotesView } from '../../../src/features/quotes/views/QuotesView';
import type { Quote } from '../../../src/features/quotes/types';

const quoteApi = vi.hoisted(() => ({
  fetchQuoteDashboardMetrics: vi.fn(),
  fetchQuotes: vi.fn(),
}));

vi.mock('../../../src/features/quotes/api/quotes', () => quoteApi);

const quote: Quote = {
  idQuote: 'Q-1',
  clientId: 'C-1',
  doctorId: 'D-1',
  clientName: 'Ada Rossi',
  clientCity: 'Roma',
  doctorName: 'Luca Bianchi',
  workOrderId: '',
  quoteNumber: 'PR-1',
  quoteType: 'ASL',
  status: 'INVIATO',
  creationDate: '2026-07-01',
  quoteDate: '2026-07-02',
  total: '100',
  entryBy: 'mario',
  diagnosis: 'Diagnosi',
  therapeuticProgram: '',
  detailedPrescription: 'Prescrizione',
  authorizationNumber: '',
  acceptanceDate: '2026-07-03',
  authorizationReceiptDate: '',
  expiryDays: '',
  maxExpiry: '',
  measurementsOk: '',
  commissionsPaid: '',
  orderNumber: 'ORD-1',
  model: '',
  measurements: '',
  invoiceNumber: '',
  quote: '',
  note: '',
  privateNote: '',
  finalNote: '',
};

function DashboardHarness() {
  const { route, navigate } = useNavigation();

  return (
    <>
      <output data-testid="route">{route.name}</output>
      <output data-testid="status">{route.name === 'quotes' ? (route.status ?? '') : ''}</output>
      <output data-testid="quote-id">{route.name === 'quote-detail' ? route.quoteId : ''}</output>
      {route.name === 'dashboard' && <DashboardView />}
      {route.name === 'quotes' && <QuotesView />}
      <button type="button" onClick={() => navigate({ name: 'quotes', status: 'INVIATO' })}>
        Apri inviati
      </button>
    </>
  );
}

function renderDashboard() {
  return render(
    <EntityEditProvider>
      <NavigationProvider>
        <DashboardHarness />
      </NavigationProvider>
    </EntityEditProvider>,
  );
}

beforeEach(() => {
  vi.resetAllMocks();
  quoteApi.fetchQuoteDashboardMetrics.mockResolvedValue({
    INSERITO: 12,
    INVIATO: 5,
    'IN LAVORAZIONE': 3,
  });
  quoteApi.fetchQuotes.mockResolvedValue([
    quote,
    { ...quote, idQuote: 'Q-2', status: 'INSERITO', clientName: 'Mario Verdi' },
  ]);
});

describe('Dashboard quote metrics', () => {
  it('shows all three counts and opens the normal quote list with the status filter set', async () => {
    renderDashboard();

    expect(await screen.findByText('12')).not.toBeNull();
    expect(screen.getByText('5')).not.toBeNull();
    expect(screen.getByText('3')).not.toBeNull();
    expect(screen.getByRole('heading', { name: 'Preventivi' })).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Preventivi Inviati: 5/ }));

    expect(screen.getByTestId('route').textContent).toBe('quotes');
    expect(screen.getByTestId('status').textContent).toBe('INVIATO');
    expect(await screen.findByText('Q-1')).not.toBeNull();
    expect(screen.queryByText('Q-2')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Filtra/ }));
    expect((screen.getByLabelText('Stato') as HTMLSelectElement).value).toBe('INVIATO');
    fireEvent.click(screen.getByRole('button', { name: 'Rimuovi' }));
    expect(await screen.findByText('Q-2')).not.toBeNull();
    expect(quoteApi.fetchQuotes).toHaveBeenCalledOnce();
  });

  it('uses the complete normal quote view and opens a quote detail', async () => {
    renderDashboard();
    fireEvent.click(screen.getByRole('button', { name: 'Apri inviati' }));

    expect(await screen.findByText('Q-1')).not.toBeNull();
    expect(screen.getByRole('heading', { name: 'Preventivi' })).not.toBeNull();
    expect(screen.getByRole('columnheader', { name: 'Data Accettazione' })).not.toBeNull();

    fireEvent.click(screen.getByText('Q-1').closest('tr')!);
    expect(screen.getByTestId('route').textContent).toBe('quote-detail');
    expect(screen.getByTestId('quote-id').textContent).toBe('Q-1');
  });

  it('surfaces a metrics error without blocking status navigation', async () => {
    quoteApi.fetchQuoteDashboardMetrics.mockRejectedValue(new Error('Metriche non disponibili.'));
    renderDashboard();

    expect((await screen.findByRole('alert')).textContent).toBe('Metriche non disponibili.');
    fireEvent.click(screen.getByRole('button', { name: /Preventivi Inseriti/ }));
    expect(screen.getByTestId('status').textContent).toBe('INSERITO');
  });
});
