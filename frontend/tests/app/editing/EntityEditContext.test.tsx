import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { WorkOrderItemsCard } from '../../../src/features/workOrders/views/WorkOrderItemsCard';
import type { WorkOrder, WorkOrderItem } from '../../../src/features/workOrders/types';
import { NavigationProvider, useNavigation } from '../../../src/app/navigation/NavigationContext';
import { EntityEditProvider, useEntityEdit } from '../../../src/app/editing/EntityEditContext';
import { useQuoteEditor } from '../../../src/features/quotes/useQuoteEditor';
import { useWorkOrderEditor } from '../../../src/features/workOrders/useWorkOrderEditor';
import { useClientEditor } from '../../../src/features/clients/useClientEditor';
import type { Client, ClientOrthopedic } from '../../../src/features/clients/types';
import { useProductEditor } from '../../../src/features/products/useProductEditor';
import { ApiError } from '../../../src/shared/api/http';

const quoteApi = vi.hoisted(() => ({
  createQuote: vi.fn(),
  updateQuote: vi.fn(),
}));
const clientApi = vi.hoisted(() => ({
  updateClient: vi.fn(),
}));
const workOrderApi = vi.hoisted(() => ({
  fetchWorkOrderItems: vi.fn(),
  updateWorkOrderItem: vi.fn(),
  updateWorkOrder: vi.fn(),
}));
const productApi = vi.hoisted(() => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
}));

vi.mock('../../../src/features/quotes/api/quotes', () => quoteApi);
vi.mock('../../../src/features/clients/api/clients', () => clientApi);
vi.mock('../../../src/features/workOrders/api/workOrders', () => workOrderApi);
vi.mock('../../../src/features/products/api/products', () => productApi);

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

const client: Client = {
  idClient: 'C-1',
  name: 'Ada',
  surname: 'Rossi',
  fiscalCode: '',
  phone: '',
  mobile: '',
  email: '',
  birthDate: '',
  birthMunicipality: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  country: '',
  district: '',
  doctorId: '',
  gender: '',
  note: '',
};

const orthopedic = Object.fromEntries(
  [
    'idClient',
    'name',
    'surname',
    'shoeSize',
    'shoeModel',
    'width',
    'collar',
    'ankle',
    'spur',
    'lift',
    'inclinedPlane',
    'insoleType',
    'collarPassage',
    'anklePassage',
    'braceType',
    'shoulderStraps',
    'upToArmpit',
    'frontFabricHeight',
    'totalFrameHeight',
    'axillaryDistance',
    'waist',
    'pelvisSize',
    'measure24',
    'neck',
    'humerus',
    'arm',
    'wrist',
    'pelvis',
    'thigh',
    'leg',
    'clientNote',
    'other',
  ].map((key) => [key, key === 'idClient' ? 'C-1' : '']),
) as ClientOrthopedic;

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
  const quote = useQuoteEditor();
  const { navigate } = useNavigation();
  return (
    <>
      <output data-testid="dirty">{String(edit.isDirty)}</output>
      <output data-testid="editing">{String(Boolean(edit.session))}</output>
      <output data-testid="save-error">{edit.error ?? ''}</output>
      <button onClick={() => navigate({ name: 'quote-create' })}>start quote create</button>
      <button
        onClick={() =>
          quote.addItem({
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
      <button
        onClick={() => {
          quote.change('clientId', '21');
          quote.change('quoteType', 'Asl');
          quote.change('diagnosis', 'Diagnosi');
          quote.change('detailedPrescription', 'Prescrizione');
        }}
      >
        fill quote
      </button>
      <button onClick={() => void edit.save()}>save quote</button>
    </>
  );
}

function ClientHarness() {
  const edit = useEntityEdit();
  const editor = useClientEditor();
  return (
    <>
      <output data-testid="dirty">{String(edit.isDirty)}</output>
      <output data-testid="editing">{String(Boolean(edit.session))}</output>
      <button onClick={() => editor.startEdit('C-1')}>start client edit</button>
      <button
        onClick={() => {
          editor.seed(client);
          editor.seedOrthopedic(orthopedic);
        }}
      >
        seed client
      </button>
      <button
        onClick={() => {
          editor.change('phone', '0811234567');
          editor.changeOrthopedic('shoeSize', '42');
        }}
      >
        edit client tabs
      </button>
      <button onClick={() => void edit.save()}>save client</button>
    </>
  );
}

function WorkOrderHarness() {
  const edit = useEntityEdit();
  const editor = useWorkOrderEditor();
  return (
    <>
      <output data-testid="dirty">{String(edit.isDirty)}</output>
      <output data-testid="editing">{String(Boolean(edit.session))}</output>
      <output data-testid="save-error">{edit.error ?? ''}</output>
      <button onClick={() => editor.startEdit('W-1')}>start work order edit</button>
      <button onClick={() => editor.seed(workOrder)}>seed work order</button>
      <button onClick={() => editor.change('technicalNotes', 'Controllare chiusura')}>
        edit work order
      </button>
      <button onClick={() => void edit.save()}>save work order</button>
      <WorkOrderItemsCard workOrderId="W-1" />
    </>
  );
}

function ProductHarness() {
  const edit = useEntityEdit();
  const editor = useProductEditor();
  return (
    <>
      <output data-testid="save-error">{edit.error ?? ''}</output>
      <output data-testid="invalid-fields">{editor.invalidFields.join(',')}</output>
      <button onClick={() => edit.start({ type: 'product', id: '' }, 'create')}>
        start product create
      </button>
      <button
        onClick={() => {
          editor.change('code', 'T-7');
          editor.change('description', 'Tutore');
          editor.change('price', 'invalid');
        }}
      >
        fill product
      </button>
      <button onClick={() => void edit.save()}>save product</button>
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
    clientApi.updateClient.mockResolvedValue({});
    productApi.createProduct.mockResolvedValue({ idProduct: 'P-1' });
    productApi.updateProduct.mockResolvedValue({});
  });

  it('saves client general and orthopedic changes as one session', async () => {
    render(
      <EntityEditProvider>
        <ClientHarness />
      </EntityEditProvider>,
    );

    click('start client edit');
    click('seed client');
    expect(output('dirty')).toBe('false');
    click('edit client tabs');
    expect(output('dirty')).toBe('true');
    click('save client');

    await waitFor(() => expect(output('editing')).toBe('false'));
    expect(clientApi.updateClient).toHaveBeenCalledWith('C-1', {
      phone: '0811234567',
      shoeSize: '42',
    });
  });

  it('counts pending quote items as dirty and includes them in the create payload', async () => {
    render(
      <EntityEditProvider>
        <NavigationProvider>
          <QuoteHarness />
        </NavigationProvider>
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
    expect(payload).not.toHaveProperty('maxExpiry');
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
    click('edit work order');
    click('save work order');

    await waitFor(() => expect(output('editing')).toBe('false'));
    expect(workOrderApi.updateWorkOrder).toHaveBeenCalledWith('W-1', {
      technicalNotes: 'Controllare chiusura',
    });
    expect(workOrderApi.updateWorkOrderItem).toHaveBeenCalledWith('W-1', 'I-1', {
      status: 'ANNULLATO',
      deliveryDate: null,
      cancellationDate: '2026-07-21',
    });
    expect(workOrderApi.updateWorkOrder.mock.invocationCallOrder[0]).toBeLessThan(
      workOrderApi.updateWorkOrderItem.mock.invocationCallOrder[0],
    );
  });

  it('maps backend field errors onto matching fields in the active session', async () => {
    productApi.createProduct.mockRejectedValue(
      new ApiError('Controlla i campi evidenziati.', {
        price: ['Inserisci un numero valido.'],
        serverOnly: ['Errore non associato al form.'],
      }),
    );
    render(
      <EntityEditProvider>
        <ProductHarness />
      </EntityEditProvider>,
    );

    click('start product create');
    click('fill product');
    click('save product');

    await waitFor(() => expect(output('save-error')).toBe('Controlla i campi evidenziati.'));
    expect(output('invalid-fields')).toBe('price');
  });
});
