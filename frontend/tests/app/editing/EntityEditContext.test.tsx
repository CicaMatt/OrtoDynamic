import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WorkOrderItemsCard } from '../../../src/features/workOrders/views/WorkOrderItemsCard';
import type { WorkOrder, WorkOrderItem } from '../../../src/features/workOrders/types';
import { NavigationProvider } from '../../../src/app/navigation/NavigationContext';
import { EntityEditProvider, useEntityEdit } from '../../../src/app/editing/EntityEditContext';

const quoteApi = vi.hoisted(() => ({
  createQuote: vi.fn(),
  updateQuote: vi.fn(),
}));
const workOrderApi = vi.hoisted(() => ({
  fetchWorkOrderItems: vi.fn(),
  updateWorkOrderItem: vi.fn(),
  updateWorkOrder: vi.fn(),
}));

vi.mock('../../../src/features/quotes/api/quotes', () => quoteApi);
vi.mock('../../../src/features/workOrders/api/workOrders', () => workOrderApi);

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
  maxExpiry: '',
  clientTrial: '',
  clientTrialOutcome: '',
  clientTrialDate: '',
  clientCheck: '',
  clientCheckOutcome: '',
  clientCheckDate: '',
  doctorSignature: '',
  technicalService: '',
  serviceStatus: '',
  complaintReason: '',
  device: '',
  warranty: '',
  serviceDeliveryDate: '',
  testOutcome: '',
  testOutcomeDate: '',
  serviceDoctorSignature: '',
  technicianSignature: '',
  interventionDescription: '',
  technicalNotes: '',
};

const workOrderItem: WorkOrderItem = {
  id: 'I-1',
  productId: 'P-9',
  productCode: 'ART-9',
  productDescription: 'Tutore caviglia',
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

function QuoteHarness() {
  const edit = useEntityEdit();
  return (
    <>
      <output data-testid="dirty">{String(edit.isDirty)}</output>
      <output data-testid="editing">{String(edit.editing)}</output>
      <output data-testid="save-error">{edit.saveError ?? ''}</output>
      <button onClick={() => edit.startQuoteCreate(['clientId'])}>start quote create</button>
      <button
        onClick={() =>
          edit.addQuoteItemDraft({
            productId: '7',
            code: 'T-7',
            description: 'Tutore',
            price: '30',
            quantity: '2',
            discount: '10',
          })
        }
      >
        add quote item
      </button>
      <button onClick={() => edit.setQuoteField('clientId', '21')}>fill quote</button>
      <button onClick={() => void edit.save()}>save quote</button>
    </>
  );
}

function WorkOrderHarness() {
  const edit = useEntityEdit();
  return (
    <>
      <output data-testid="dirty">{String(edit.isDirty)}</output>
      <output data-testid="editing">{String(edit.editing)}</output>
      <output data-testid="save-error">{edit.saveError ?? ''}</output>
      <button onClick={() => edit.startWorkOrderEdit('W-1')}>start work order edit</button>
      <button onClick={() => edit.seedWorkOrder(workOrder)}>seed work order</button>
      <button onClick={() => void edit.save()}>save work order</button>
      <WorkOrderItemsCard workOrderId="W-1" />
    </>
  );
}

function click(name: string) {
  fireEvent.click(screen.getByRole('button', { name }));
}

function output(testId: string) {
  return screen.getByTestId(testId).textContent;
}

describe('EntityEditProvider sub-flows', () => {
  beforeEach(() => {
    quoteApi.createQuote.mockResolvedValue({ idQuote: 'Q-9' });
    quoteApi.updateQuote.mockResolvedValue({});
    workOrderApi.fetchWorkOrderItems.mockResolvedValue([workOrderItem]);
    workOrderApi.updateWorkOrderItem.mockResolvedValue({});
    workOrderApi.updateWorkOrder.mockResolvedValue({});
  });

  it('counts pending quote items as dirty and includes them in the create payload', async () => {
    render(
      <EntityEditProvider>
        <QuoteHarness />
      </EntityEditProvider>,
    );

    click('start quote create');
    expect(output('dirty')).toBe('false');
    click('add quote item');
    expect(output('dirty')).toBe('true');
    click('fill quote');
    click('save quote');

    await waitFor(() => expect(output('editing')).toBe('false'));
    expect(quoteApi.createQuote).toHaveBeenCalledOnce();
    const payload = quoteApi.createQuote.mock.calls[0][0];
    expect(payload).toMatchObject({
      clientId: 21,
      doctorId: null,
      acceptanceDate: null,
      authorizationReceiptDate: null,
      items: [{ productId: 7, quantity: 2, discount: 10 }],
    });
    expect(payload).not.toHaveProperty('status');
    expect(payload).not.toHaveProperty('total');
  });

  it('defers work-order item writes to global save and surfaces conditional-date validation', async () => {
    const { container } = render(
      <EntityEditProvider>
        <NavigationProvider>
          <WorkOrderHarness />
        </NavigationProvider>
      </EntityEditProvider>,
    );

    click('start work order edit');
    click('seed work order');

    const statusSelect = await screen.findByDisplayValue('IN LAVORAZIONE');
    fireEvent.change(statusSelect, { target: { value: 'ANNULLATO' } });
    await waitFor(() => expect(output('dirty')).toBe('true'));
    expect(workOrderApi.updateWorkOrderItem).not.toHaveBeenCalled();

    click('save work order');
    await waitFor(() =>
      expect(output('save-error')).toBe('Articolo P-9: indicare la Data Annullamento.'),
    );
    expect(output('editing')).toBe('true');
    expect(workOrderApi.updateWorkOrderItem).not.toHaveBeenCalled();

    const itemRow = container.querySelector('tbody tr');
    const cancellationInput = itemRow?.children[10]?.querySelector('input[type="date"]');
    expect(cancellationInput).not.toBeNull();
    fireEvent.change(cancellationInput!, { target: { value: '2026-07-21' } });
    click('save work order');

    await waitFor(() => expect(output('editing')).toBe('false'));
    expect(workOrderApi.updateWorkOrderItem).toHaveBeenCalledWith('W-1', 'I-1', {
      status: 'ANNULLATO',
      deliveryDate: null,
      cancellationDate: '2026-07-21',
    });
    expect(workOrderApi.updateWorkOrder).not.toHaveBeenCalled();
  });
});
