import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EntityEditProvider } from '../../../../src/app/editing/EntityEditContext';
import { EditActionBar } from '../../../../src/app/layout/EditActionBar';
import {
  NavigationProvider,
  useNavigation,
} from '../../../../src/app/navigation/NavigationContext';
import { ClientDetailView } from '../../../../src/features/clients/views/ClientDetailView';
import { ClientOrthopedicView } from '../../../../src/features/clients/views/ClientOrthopedicView';
import type { Client, ClientOrthopedic } from '../../../../src/features/clients/types';
import { useQuoteEditor } from '../../../../src/features/quotes/useQuoteEditor';
import { ApiError } from '../../../../src/shared/api/http';

const clientApi = vi.hoisted(() => ({
  createClient: vi.fn(),
  deleteClient: vi.fn(),
  fetchClient: vi.fn(),
  fetchClientOrthopedic: vi.fn(),
  fetchClientPrivacyForm: vi.fn(),
  fetchClients: vi.fn(),
  updateClient: vi.fn(),
}));
const doctorApi = vi.hoisted(() => ({
  fetchDoctor: vi.fn(),
  fetchDoctors: vi.fn(),
}));
const municipalityApi = vi.hoisted(() => ({ fetchMunicipalities: vi.fn() }));

vi.mock('../../../../src/features/clients/api/clients', () => clientApi);
vi.mock('../../../../src/features/doctors/api/doctors', () => doctorApi);
vi.mock('../../../../src/features/municipalities/api/municipalities', () => municipalityApi);

const client: Client = {
  idClient: 'C-1',
  name: 'Ada',
  surname: 'Rossi',
  fiscalCode: 'RSSDAA80A01H501Z',
  phone: '061234567',
  mobile: '3331234567',
  email: 'ada@example.test',
  birthDate: '1980-01-01',
  birthMunicipality: 'Roma',
  address: 'Via Roma 1',
  city: 'Roma',
  province: 'RM',
  postalCode: '00100',
  country: 'Italia',
  district: 'Distretto 1',
  doctorId: 'D-1',
  gender: 'F',
  note: 'Nota cliente iniziale',
};

const orthopedic: ClientOrthopedic = {
  idClient: 'C-1',
  name: 'Ada',
  surname: 'Rossi',
  shoeSize: '42',
  shoeModel: 'Modello A',
  width: '10',
  collar: '20',
  ankle: '22',
  spur: 'No',
  lift: '1',
  inclinedPlane: '0',
  insoleType: 'Rigido',
  collarPassage: '21',
  anklePassage: '23',
  braceType: 'Tutore A',
  shoulderStraps: 'Standard',
  upToArmpit: '40',
  frontFabricHeight: '30',
  totalFrameHeight: '50',
  axillaryDistance: '12',
  waist: '80',
  pelvisSize: '90',
  measure24: '45',
  neck: '35',
  humerus: '30',
  arm: '60',
  wrist: '16',
  pelvis: '92',
  thigh: '52',
  leg: '40',
  clientNote: 'Nota ortopedica',
  other: 'Nessun altro dato',
};

function ClientRouteHarness() {
  const navigation = useNavigation();
  const quoteEditor = useQuoteEditor();
  return (
    <>
      <button type="button" onClick={() => navigation.navigate({ name: 'clients' })}>
        Vai ai clienti
      </button>
      <button
        type="button"
        onClick={() =>
          navigation.navigate({
            name: 'client-detail',
            clientId: client.idClient,
            tab: 'general',
          })
        }
      >
        Apri cliente
      </button>
      <output data-testid="route">{navigation.route.name}</output>
      <output data-testid="tab">
        {navigation.route.name === 'client-detail' ? navigation.route.tab : ''}
      </output>
      <output data-testid="quote-client">{quoteEditor.draft?.clientId ?? ''}</output>
      {navigation.route.name === 'client-detail' &&
        (navigation.route.tab === 'general' ? <ClientDetailView /> : <ClientOrthopedicView />)}
      <EditActionBar />
    </>
  );
}

function renderClient() {
  render(
    <EntityEditProvider>
      <NavigationProvider>
        <ClientRouteHarness />
      </NavigationProvider>
    </EntityEditProvider>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Vai ai clienti' }));
  fireEvent.click(screen.getByRole('button', { name: 'Apri cliente' }));
}

beforeEach(() => {
  vi.resetAllMocks();
  clientApi.fetchClient.mockResolvedValue(client);
  clientApi.fetchClientOrthopedic.mockResolvedValue(orthopedic);
  clientApi.updateClient.mockResolvedValue({});
  clientApi.deleteClient.mockResolvedValue(undefined);
  clientApi.fetchClients.mockResolvedValue([]);
  doctorApi.fetchDoctor.mockResolvedValue({
    idDoctor: 'D-1',
    name: 'Luca',
    surname: 'Bianchi',
    address: '',
    phone: '',
    email: '',
    note: '',
  });
  doctorApi.fetchDoctors.mockResolvedValue([]);
  municipalityApi.fetchMunicipalities.mockResolvedValue([
    { name: 'Roma', province: 'RM', cap: '00100' },
  ]);
});

describe('client general and orthopedic editing flow', () => {
  it('loads both tabs and saves their changes in one PATCH', async () => {
    renderClient();

    await screen.findByRole('heading', { name: 'Ada Rossi' });
    expect(screen.getByRole('button', { name: /Luca Bianchi/ })).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Modifica Dati Cliente/ }));
    fireEvent.change(await screen.findByDisplayValue('061234567'), {
      target: { value: '069999999' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Modifica Dati Ortopedici/ }));
    expect(screen.getByTestId('tab').textContent).toBe('orthopedic');
    fireEvent.change(await screen.findByDisplayValue('42'), { target: { value: '43' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salva' }));

    await waitFor(() =>
      expect(clientApi.updateClient).toHaveBeenCalledWith('C-1', {
        phone: '069999999',
        shoeSize: '43',
      }),
    );
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Salva' })).toBeNull());
    expect(screen.getByTestId('tab').textContent).toBe('orthopedic');
  });

  it('keeps invalid backend fields highlighted and allows a successful retry', async () => {
    clientApi.updateClient.mockRejectedValueOnce(
      new ApiError('Dati cliente non validi.', { phone: ['Numero non valido.'] }),
    );
    renderClient();

    await screen.findByRole('heading', { name: 'Ada Rossi' });
    fireEvent.click(screen.getByRole('button', { name: /Modifica Dati Cliente/ }));
    fireEvent.change(await screen.findByDisplayValue('061234567'), {
      target: { value: 'numero errato' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salva' }));

    expect(await screen.findByText('Dati cliente non validi.')).not.toBeNull();
    const invalidPhone = screen.getByDisplayValue('numero errato');
    expect(invalidPhone.className).toContain('border-error');
    expect(screen.getByTestId('route').textContent).toBe('client-detail');

    fireEvent.change(invalidPhone, { target: { value: '068888888' } });
    expect(invalidPhone.className).not.toContain('border-error');
    fireEvent.click(screen.getByRole('button', { name: 'Salva' }));
    await waitFor(() => expect(clientApi.updateClient).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Salva' })).toBeNull());
  });

  it('starts quote creation with the current client as the only prefilled reference', async () => {
    renderClient();

    await screen.findByRole('heading', { name: 'Ada Rossi' });
    fireEvent.click(screen.getByRole('button', { name: /Inserisci Preventivo/ }));

    expect(screen.getByTestId('route').textContent).toBe('quote-create');
    expect(screen.getByTestId('quote-client').textContent).toBe('C-1');
  });

  it('confirms deletion and returns to the client list', async () => {
    renderClient();

    await screen.findByRole('heading', { name: 'Ada Rossi' });
    fireEvent.click(screen.getByRole('button', { name: /Elimina Cliente/ }));
    expect(screen.getByText(/Confermi l'eliminazione del cliente Rossi Ada/)).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Elimina Cliente' }));

    await waitFor(() => expect(clientApi.deleteClient).toHaveBeenCalledWith('C-1'));
    await waitFor(() => expect(screen.getByTestId('route').textContent).toBe('clients'));
  });
});
