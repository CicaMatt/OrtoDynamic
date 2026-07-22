import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  EntityEditProvider,
  useEntityEdit,
  useEntityEditor,
} from '../../../src/app/editing/EntityEditContext';
import { EditActionBar } from '../../../src/app/layout/EditActionBar';
import { EntityReference } from '../../../src/app/navigation/EntityReference';
import { NavigationProvider, useNavigation } from '../../../src/app/navigation/NavigationContext';
import type { Client } from '../../../src/features/clients/types';
import { useClientEditor } from '../../../src/features/clients/useClientEditor';
import type { Product } from '../../../src/features/products/types';
import { useQuoteEditor } from '../../../src/features/quotes/useQuoteEditor';

const productApi = vi.hoisted(() => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
}));

vi.mock('../../../src/features/products/api/products', () => productApi);

const client: Client = {
  idClient: 'C-1',
  name: 'Ada',
  surname: 'Rossi',
  fiscalCode: 'RSSDAA80A01H501Z',
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

const product: Product = {
  idProduct: 'P-1',
  code: 'T-1',
  description: 'Tutore',
  price: '25',
  year: '2026',
};

function NavigationHarness() {
  const navigation = useNavigation();
  const edit = useEntityEdit();
  const clientEditor = useClientEditor();
  const productEditor = useEntityEditor('product');
  const quoteEditor = useQuoteEditor();

  return (
    <>
      <output data-testid="view">{navigation.route.name}</output>
      <output data-testid="tab">
        {navigation.route.name === 'client-detail' ? navigation.route.tab : ''}
      </output>
      <output data-testid="client-id">
        {navigation.route.name === 'client-detail' ? navigation.route.clientId : ''}
      </output>
      <output data-testid="product-id">
        {navigation.route.name === 'product-detail' ? navigation.route.productId : ''}
      </output>
      <output data-testid="quote-client-id">{quoteEditor.draft?.clientId ?? ''}</output>
      <output data-testid="pending">{navigation.pendingRoute?.name ?? ''}</output>
      <output data-testid="editing">{String(Boolean(edit.session))}</output>
      <output data-testid="dirty">{String(edit.isDirty)}</output>
      <output data-testid="edit-type">{edit.session?.type ?? ''}</output>
      <output data-testid="edit-mode">{edit.session?.mode ?? 'edit'}</output>
      <output data-testid="save-error">{edit.error ?? ''}</output>

      <button
        onClick={() =>
          navigation.navigate({ name: 'client-detail', clientId: 'C-1', tab: 'general' })
        }
      >
        open client
      </button>
      <button onClick={() => navigation.navigate({ name: 'product-detail', productId: 'P-1' })}>
        open product
      </button>
      <button onClick={() => navigation.navigate({ name: 'quote-create' })}>
        open quote create
      </button>
      <button onClick={() => navigation.navigate({ name: 'quote-create', clientId: 'C-1' })}>
        open client quote create
      </button>
      <button onClick={() => navigation.back({ name: 'dashboard' })}>go back</button>
      <button
        onClick={() =>
          navigation.navigate({ name: 'client-detail', clientId: 'C-1', tab: 'orthopedic' })
        }
      >
        open orthopedic
      </button>
      <button onClick={() => navigation.navigate({ name: 'clients' })}>go clients</button>
      <button onClick={() => navigation.dismissPending()}>dismiss pending</button>
      <button onClick={() => navigation.discardAndContinue()}>discard pending</button>
      <button onClick={() => void navigation.keepAndContinue()}>save pending</button>

      <button onClick={() => clientEditor.startEdit('C-1')}>start client edit</button>
      <button onClick={() => clientEditor.seed(client)}>seed client</button>
      <button onClick={() => clientEditor.change('note', 'changed')}>dirty client</button>
      <button onClick={() => productEditor.startEdit('P-1')}>start product edit</button>
      <button onClick={() => productEditor.seed(product)}>seed product</button>
      <button onClick={() => productEditor.change('description', 'Tutore lungo')}>
        dirty product
      </button>
      <button onClick={() => navigation.navigate({ name: 'product-create' })}>
        start product create
      </button>
      <button
        onClick={() => {
          productEditor.change('code', 'T-77');
          productEditor.change('description', 'Nuovo tutore');
          productEditor.change('price', '25');
        }}
      >
        fill product
      </button>
      <EntityReference name="Prodotto collegato" id="P-2" entity="product" />
    </>
  );
}

function renderProviders() {
  return render(
    <EntityEditProvider>
      <NavigationProvider>
        <NavigationHarness />
        <EditActionBar />
      </NavigationProvider>
    </EntityEditProvider>,
  );
}

function click(name: string) {
  fireEvent.click(screen.getByRole('button', { name }));
}

function output(testId: string) {
  return screen.getByTestId(testId).textContent;
}

describe('NavigationProvider with the real edit provider', () => {
  beforeEach(() => {
    productApi.updateProduct.mockResolvedValue({});
    productApi.createProduct.mockResolvedValue({ ...product, idProduct: 'P-77' });
  });

  it('opens detail/create targets and restores the prior detail from history', () => {
    renderProviders();

    click('open client');
    expect(output('view')).toBe('client-detail');
    expect(output('client-id')).toBe('C-1');

    click('open quote create');
    expect(output('view')).toBe('quote-create');
    click('go back');

    expect(output('view')).toBe('client-detail');
    expect(output('client-id')).toBe('C-1');
  });

  it('starts quote creation with only the routed client preselected', () => {
    renderProviders();

    click('open client quote create');

    expect(output('view')).toBe('quote-create');
    expect(output('quote-client-id')).toBe('C-1');
    expect(output('dirty')).toBe('false');
  });

  it('allows a dirty client to move between its normal and orthopedic views', () => {
    renderProviders();

    click('open client');
    click('start client edit');
    click('seed client');
    click('dirty client');
    click('open orthopedic');

    expect(output('view')).toBe('client-detail');
    expect(output('tab')).toBe('orthopedic');
    expect(output('client-id')).toBe('C-1');
    expect(output('editing')).toBe('true');
    expect(output('dirty')).toBe('true');
    expect(output('pending')).toBe('');
  });

  it('cancels a clean edit immediately when leaving its entity', () => {
    renderProviders();

    click('open product');
    click('start product edit');
    click('seed product');
    click('go clients');

    expect(output('view')).toBe('clients');
    expect(output('editing')).toBe('false');
    expect(output('pending')).toBe('');
  });

  it('supports dismissing and discarding a navigation blocked by dirty edits', () => {
    renderProviders();

    click('open product');
    click('start product edit');
    click('seed product');
    click('dirty product');
    click('go clients');

    expect(output('view')).toBe('product-detail');
    expect(output('pending')).toBe('clients');

    click('dismiss pending');
    expect(output('view')).toBe('product-detail');
    expect(output('pending')).toBe('');
    expect(output('editing')).toBe('true');

    click('go clients');
    click('discard pending');
    expect(output('view')).toBe('clients');
    expect(output('editing')).toBe('false');
  });

  it('starts a create session only after pending navigation is accepted', () => {
    renderProviders();

    click('open product');
    click('start product edit');
    click('seed product');
    click('dirty product');
    click('start product create');

    expect(output('view')).toBe('product-detail');
    expect(output('pending')).toBe('product-create');
    expect(output('edit-type')).toBe('product');
    expect(output('edit-mode')).toBe('edit');

    click('discard pending');
    expect(output('view')).toBe('product-create');
    expect(output('edit-type')).toBe('product');
    expect(output('edit-mode')).toBe('create');
    expect(output('dirty')).toBe('false');
  });

  it('keeps the current route and draft when save-and-continue fails', async () => {
    productApi.updateProduct.mockRejectedValueOnce(new Error('Salvataggio fallito.'));
    renderProviders();

    click('open product');
    click('start product edit');
    click('seed product');
    click('dirty product');
    click('go clients');
    click('save pending');

    await waitFor(() => expect(output('save-error')).toBe('Salvataggio fallito.'));
    expect(productApi.updateProduct).toHaveBeenCalledWith('P-1', {
      description: 'Tutore lungo',
    });
    expect(output('view')).toBe('product-detail');
    expect(output('editing')).toBe('true');
    expect(output('dirty')).toBe('true');
  });

  it('navigates a successful create to the returned detail id', async () => {
    renderProviders();

    click('start product create');
    click('fill product');
    click('Crea');

    await waitFor(() => expect(output('view')).toBe('product-detail'));
    expect(output('product-id')).toBe('P-77');
    expect(output('editing')).toBe('false');
    expect(productApi.createProduct).toHaveBeenCalledWith({
      code: 'T-77',
      description: 'Nuovo tutore',
      price: 25,
      year: null,
    });
  });

  it('returns a cancelled create to the entity list', () => {
    renderProviders();

    click('start product create');
    click('Annulla');

    expect(output('view')).toBe('products');
    expect(output('editing')).toBe('false');
    expect(productApi.createProduct).not.toHaveBeenCalled();
  });

  it('opens the entity and id represented by a reference link', () => {
    renderProviders();

    fireEvent.click(screen.getByText('Prodotto collegato').closest('button')!);

    expect(output('view')).toBe('product-detail');
    expect(output('product-id')).toBe('P-2');
  });
});
