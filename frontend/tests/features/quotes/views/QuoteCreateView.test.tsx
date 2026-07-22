import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EntityEditProvider } from '../../../../src/app/editing/EntityEditContext';
import { EditActionBar } from '../../../../src/app/layout/EditActionBar';
import {
  NavigationProvider,
  useNavigation,
} from '../../../../src/app/navigation/NavigationContext';
import type { Product } from '../../../../src/features/products/types';
import { QuoteCreateView } from '../../../../src/features/quotes/views/QuoteCreateView';

const quoteApi = vi.hoisted(() => ({
  createQuote: vi.fn(),
  updateQuote: vi.fn(),
}));
const clientApi = vi.hoisted(() => ({ fetchClients: vi.fn() }));
const doctorApi = vi.hoisted(() => ({ fetchDoctors: vi.fn() }));

vi.mock('../../../../src/features/quotes/api/quotes', () => quoteApi);
vi.mock('../../../../src/features/clients/api/clients', () => clientApi);
vi.mock('../../../../src/features/doctors/api/doctors', () => doctorApi);
vi.mock('../../../../src/features/quotes/components/ProductSearchField', () => ({
  ProductSearchField: ({ onSelect }: { onSelect: (product: Product) => void }) => (
    <button
      type="button"
      onClick={() =>
        onSelect({
          idProduct: '7',
          code: 'T-7',
          description: 'Tutore lungo',
          price: '30',
          year: '2026',
        })
      }
    >
      Seleziona Tutore
    </button>
  ),
}));

function QuoteCreateHarness() {
  const navigation = useNavigation();
  return (
    <>
      <button type="button" onClick={() => navigation.navigate({ name: 'quote-create' })}>
        Nuovo preventivo
      </button>
      <button
        type="button"
        onClick={() => navigation.navigate({ name: 'quote-create', clientId: '21' })}
      >
        Nuovo preventivo cliente
      </button>
      <output data-testid="route">{navigation.route.name}</output>
      <output data-testid="quote-id">
        {navigation.route.name === 'quote-detail' ? navigation.route.quoteId : ''}
      </output>
      {navigation.route.name === 'quote-create' && <QuoteCreateView />}
      <EditActionBar />
    </>
  );
}

function renderCreate(prefillClient = false) {
  render(
    <EntityEditProvider>
      <NavigationProvider>
        <QuoteCreateHarness />
      </NavigationProvider>
    </EntityEditProvider>,
  );
  fireEvent.click(
    screen.getByRole('button', {
      name: prefillClient ? 'Nuovo preventivo cliente' : 'Nuovo preventivo',
    }),
  );
}

function fillRequiredFields() {
  const identitySection = screen
    .getByRole('heading', { name: 'Dati Preventivo' })
    .closest('section');
  const clinicalSection = screen.getByRole('heading', { name: 'Dati Clinici' }).closest('section');
  if (!identitySection || !clinicalSection) throw new Error('Sezioni preventivo non trovate.');

  fireEvent.change(within(identitySection).getByRole('combobox'), {
    target: { value: 'Asl' },
  });
  const clinicalFields = within(clinicalSection).getAllByRole('textbox');
  fireEvent.change(clinicalFields[0], { target: { value: 'Diagnosi completa' } });
  fireEvent.change(clinicalFields[1], { target: { value: 'Prescrizione completa' } });
}

function addProduct() {
  fireEvent.click(screen.getByRole('button', { name: /Aggiungi/ }));
  fireEvent.click(screen.getAllByRole('button', { name: 'Seleziona Tutore' })[0]);
  fireEvent.click(screen.getByLabelText('Conferma'));
}

beforeEach(() => {
  vi.resetAllMocks();
  clientApi.fetchClients.mockResolvedValue([
    {
      idClient: '21',
      name: 'Ada',
      surname: 'Rossi',
      fiscalCode: 'RSSDAA80A01H501Z',
      birthDate: '1980-01-01',
      birthMunicipality: 'Roma',
      address: 'Via Roma 1',
      city: 'Roma',
      province: 'RM',
      phone: '061234567',
    },
  ]);
  doctorApi.fetchDoctors.mockResolvedValue([]);
  quoteApi.createQuote.mockResolvedValue({ idQuote: 'Q-99' });
});

describe('QuoteCreateView', () => {
  it('keeps the routed client preselected and creates a quote with its initial item', async () => {
    renderCreate(true);

    expect(await screen.findByDisplayValue('Ada Rossi — 1 Gennaio 1980')).not.toBeNull();
    fillRequiredFields();
    addProduct();
    expect(screen.getByText('Tutore lungo')).not.toBeNull();
    expect(screen.getAllByText('€ 30.00')).toHaveLength(3);

    fireEvent.click(screen.getByRole('button', { name: 'Crea' }));

    await waitFor(() => expect(quoteApi.createQuote).toHaveBeenCalledOnce());
    expect(quoteApi.createQuote.mock.calls[0][0]).toMatchObject({
      clientId: 21,
      quoteType: 'Asl',
      diagnosis: 'Diagnosi completa',
      detailedPrescription: 'Prescrizione completa',
      items: [{ productId: 7, quantity: 1, discount: null }],
    });
    await waitFor(() => expect(screen.getByTestId('route').textContent).toBe('quote-detail'));
    expect(screen.getByTestId('quote-id').textContent).toBe('Q-99');
  });

  it('shows required-field validation without calling the API', async () => {
    renderCreate();

    await screen.findByText('Nuovo Preventivo');
    fireEvent.click(screen.getByRole('button', { name: 'Crea' }));

    expect(await screen.findByText('Compila i campi obbligatori evidenziati.')).not.toBeNull();
    expect(quoteApi.createQuote).not.toHaveBeenCalled();
    expect(screen.getByTestId('route').textContent).toBe('quote-create');
  });

  it('removes a pending item before creating the quote', async () => {
    renderCreate(true);

    await screen.findByDisplayValue('Ada Rossi — 1 Gennaio 1980');
    fillRequiredFields();
    addProduct();
    fireEvent.click(screen.getByLabelText('Rimuovi articolo'));
    expect(screen.queryByText('Tutore lungo')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Crea' }));
    await waitFor(() => expect(quoteApi.createQuote).toHaveBeenCalledOnce());
    expect(quoteApi.createQuote.mock.calls[0][0]).not.toHaveProperty('items');
  });

  it('preserves the form and reports an API failure so the user can retry', async () => {
    quoteApi.createQuote.mockRejectedValue(new Error('Creazione preventivo non riuscita.'));
    renderCreate(true);

    await screen.findByDisplayValue('Ada Rossi — 1 Gennaio 1980');
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: 'Crea' }));

    expect(await screen.findByText('Creazione preventivo non riuscita.')).not.toBeNull();
    expect(screen.getByTestId('route').textContent).toBe('quote-create');
    expect(screen.getByDisplayValue('Diagnosi completa')).not.toBeNull();
    expect((screen.getByRole('button', { name: 'Crea' }) as HTMLButtonElement).disabled).toBe(
      false,
    );
  });
});
