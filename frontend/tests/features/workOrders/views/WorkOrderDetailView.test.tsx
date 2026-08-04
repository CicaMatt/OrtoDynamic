import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EntityEditProvider } from '../../../../src/app/editing/EntityEditContext';
import { EditActionBar } from '../../../../src/app/layout/EditActionBar';
import {
  NavigationProvider,
  useNavigation,
} from '../../../../src/app/navigation/NavigationContext';
import type { WorkOrder, WorkOrderItem } from '../../../../src/features/workOrders/types';
import { WorkOrderDetailView } from '../../../../src/features/workOrders/views/WorkOrderDetailView';

const workOrderApi = vi.hoisted(() => ({
  changeWorkOrderStatus: vi.fn(),
  deleteWorkOrder: vi.fn(),
  fetchWorkOrder: vi.fn(),
  fetchWorkOrderCollaudi: vi.fn(),
  fetchWorkOrderItems: vi.fn(),
  updateWorkOrder: vi.fn(),
  updateWorkOrderItem: vi.fn(),
}));

vi.mock('../../../../src/features/workOrders/api/workOrders', () => workOrderApi);

const workOrder: WorkOrder = {
  idWorkOrder: 'W-1',
  quoteId: 'Q-1',
  clientId: 'C-1',
  clientName: 'Ada Rossi',
  status: 'IN LAVORAZIONE',
  quoteStatus: 'ACCETTATO',
  creationDate: '2026-07-01',
  completionDate: '',
  deliveryDate: '',
  cancellationDate: '',
  maxExpiry: '2026-08-01',
  clientTrial: 'TECNICO',
  clientTrialOutcome: 'POSITIVO',
  clientTrialDate: '2026-07-05',
  clientCheck: 'FUNZIONALE',
  clientCheckOutcome: 'POSITIVO',
  clientCheckDate: '2026-07-06',
  doctorSignature: 'Dr. Bianchi',
  technicalService: 'SI',
  serviceStatus: 'Aperta',
  complaintReason: 'MANUTENZIONE',
  device: 'INTERNO',
  warranty: '12 mesi',
  serviceDeliveryDate: '',
  testOutcome: 'Conforme',
  testOutcomeDate: '2026-07-07',
  serviceDoctorSignature: 'Dr. Bianchi',
  technicianSignature: 'Tecnico Uno',
  interventionDescription: 'Intervento iniziale',
  technicalNotes: 'Vecchia nota tecnica',
};

const item: WorkOrderItem = {
  id: 'I-1',
  productId: 'P-1',
  productCode: 'T-1',
  productDescription: 'Tutore',
  quantity: '1',
  price: '50',
  amount: '50',
  discount: '',
  status: 'IN LAVORAZIONE',
  production: 'INTERNA',
  cancellationDate: '',
  orderDate: '',
  partialDeliveryDate: '',
  deliveryDate: '',
};

function WorkOrderRouteHarness() {
  const navigation = useNavigation();
  return (
    <>
      <button type="button" onClick={() => navigation.navigate({ name: 'work-orders' })}>
        Vai alle lavorazioni
      </button>
      <button
        type="button"
        onClick={() =>
          navigation.navigate({ name: 'work-order-detail', workOrderId: workOrder.idWorkOrder })
        }
      >
        Apri lavorazione
      </button>
      <output data-testid="route">{navigation.route.name}</output>
      {navigation.route.name === 'work-order-detail' && <WorkOrderDetailView />}
      <EditActionBar />
    </>
  );
}

function renderWorkOrderDetail() {
  render(
    <EntityEditProvider>
      <NavigationProvider>
        <WorkOrderRouteHarness />
      </NavigationProvider>
    </EntityEditProvider>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Vai alle lavorazioni' }));
  fireEvent.click(screen.getByRole('button', { name: 'Apri lavorazione' }));
}

beforeEach(() => {
  vi.resetAllMocks();
  workOrderApi.fetchWorkOrder.mockResolvedValue(workOrder);
  workOrderApi.fetchWorkOrderItems.mockResolvedValue([]);
  workOrderApi.updateWorkOrder.mockResolvedValue({});
  workOrderApi.updateWorkOrderItem.mockResolvedValue({});
  workOrderApi.changeWorkOrderStatus.mockResolvedValue({});
  workOrderApi.deleteWorkOrder.mockResolvedValue(undefined);
});

describe('WorkOrderDetailView', () => {
  it('keeps quote and client ownership fixed while saving an editable field', async () => {
    renderWorkOrderDetail();

    await screen.findByText('Lavorazione W-1');
    expect(screen.getByRole('button', { name: /Q-1/ })).not.toBeNull();
    expect(screen.getByRole('button', { name: /Ada Rossi/ })).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Modifica Dati Lavorazione/ }));
    await screen.findByDisplayValue('Vecchia nota tecnica');

    expect(screen.queryByDisplayValue('Q-1')).toBeNull();
    expect(screen.queryByDisplayValue('C-1')).toBeNull();
    const doctorSignatureField = screen.getByText('Firma Medico').closest('div');
    if (!doctorSignatureField) throw new Error('Campo Firma Medico non trovato.');
    expect(within(doctorSignatureField).queryByRole('textbox')).toBeNull();
    expect(within(doctorSignatureField).getByText('Dr. Bianchi')).not.toBeNull();
    fireEvent.change(screen.getByDisplayValue('Vecchia nota tecnica'), {
      target: { value: 'Nota tecnica aggiornata' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salva' }));

    await waitFor(() =>
      expect(workOrderApi.updateWorkOrder).toHaveBeenCalledWith('W-1', {
        technicalNotes: 'Nota tecnica aggiornata',
      }),
    );
  });

  it('validates a conditional item date, then saves the item through the shared action bar', async () => {
    workOrderApi.fetchWorkOrderItems.mockResolvedValue([item]);
    renderWorkOrderDetail();

    await screen.findByText('Tutore');
    fireEvent.click(screen.getByRole('button', { name: /Modifica Dati Lavorazione/ }));

    const row = screen.getByText('Tutore').closest('tr');
    if (!row) throw new Error('Riga articolo non trovata.');
    const rowQueries = within(row);
    fireEvent.change(rowQueries.getByDisplayValue('IN LAVORAZIONE'), {
      target: { value: 'ANNULLATO' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Salva' }));
    expect(await screen.findByText('Articolo P-1: indicare la Data Annullamento.')).not.toBeNull();
    expect(workOrderApi.updateWorkOrderItem).not.toHaveBeenCalled();

    const dateInputs = row.querySelectorAll<HTMLInputElement>('input[type="date"]');
    expect(dateInputs).toHaveLength(3);
    fireEvent.change(dateInputs[1], { target: { value: '2026-07-20' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salva' }));

    await waitFor(() =>
      expect(workOrderApi.updateWorkOrderItem).toHaveBeenCalledWith('W-1', 'I-1', {
        status: 'ANNULLATO',
        cancellationDate: '2026-07-20',
        deliveryDate: null,
      }),
    );
    expect(workOrderApi.updateWorkOrder).not.toHaveBeenCalled();
  });

  it('changes status and reloads the work order', async () => {
    renderWorkOrderDetail();

    await screen.findByText('Lavorazione W-1');
    fireEvent.click(screen.getByRole('button', { name: /Cambia Stato/ }));
    fireEvent.click(screen.getByRole('button', { name: /IN FINITURA/ }));

    await waitFor(() =>
      expect(workOrderApi.changeWorkOrderStatus).toHaveBeenCalledWith('W-1', 'IN FINITURA'),
    );
    await waitFor(() => expect(workOrderApi.fetchWorkOrder).toHaveBeenCalledTimes(2));
  });

  it('warns about the linked quote before deleting and returning to the list', async () => {
    renderWorkOrderDetail();

    await screen.findByText('Lavorazione W-1');
    fireEvent.click(screen.getByRole('button', { name: /Elimina Lavorazione/ }));

    expect(screen.getByText(/articoli associati alla lavorazione/)).not.toBeNull();
    expect(screen.getByText(/Preventivo associato Q-1/)).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Elimina Lavorazione' }));

    await waitFor(() => expect(workOrderApi.deleteWorkOrder).toHaveBeenCalledWith('W-1'));
    await waitFor(() => expect(screen.getByTestId('route').textContent).toBe('work-orders'));
  });
});
