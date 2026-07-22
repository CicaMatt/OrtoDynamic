import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  EntityEditProvider,
  useEntityEdit,
  useEntityEditor,
} from '../../../src/app/editing/EntityEditContext';
import { UnsavedChangesDialog } from '../../../src/app/layout/UnsavedChangesDialog';
import { NavigationProvider, useNavigation } from '../../../src/app/navigation/NavigationContext';
import type { Product } from '../../../src/features/products/types';

const productApi = vi.hoisted(() => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
}));

vi.mock('../../../src/features/products/api/products', () => productApi);

const product: Product = {
  idProduct: 'P-1',
  code: 'T-1',
  description: 'Tutore',
  price: '25',
  year: '2026',
};

function DialogHarness() {
  const navigation = useNavigation();
  const edit = useEntityEdit();
  const editor = useEntityEditor('product');
  return (
    <>
      <output data-testid="route">{navigation.route.name}</output>
      <output data-testid="pending">{navigation.pendingRoute?.name ?? ''}</output>
      <output data-testid="editing">{String(Boolean(edit.session))}</output>
      <output data-testid="error">{edit.error ?? ''}</output>
      <button
        type="button"
        onClick={() =>
          navigation.navigate({ name: 'product-detail', productId: product.idProduct })
        }
      >
        Apri prodotto
      </button>
      <button type="button" onClick={() => editor.startEdit(product.idProduct)}>
        Modifica prodotto
      </button>
      <button type="button" onClick={() => editor.seed(product)}>
        Carica prodotto
      </button>
      <button type="button" onClick={() => editor.change('description', 'Tutore aggiornato')}>
        Cambia descrizione
      </button>
      <button type="button" onClick={() => navigation.navigate({ name: 'clients' })}>
        Vai ai clienti
      </button>
      <UnsavedChangesDialog />
    </>
  );
}

function renderDirtyNavigation() {
  render(
    <EntityEditProvider>
      <NavigationProvider>
        <DialogHarness />
      </NavigationProvider>
    </EntityEditProvider>,
  );
  for (const name of [
    'Apri prodotto',
    'Modifica prodotto',
    'Carica prodotto',
    'Cambia descrizione',
    'Vai ai clienti',
  ]) {
    fireEvent.click(screen.getByRole('button', { name }));
  }
}

beforeEach(() => {
  vi.resetAllMocks();
  productApi.updateProduct.mockResolvedValue({});
});

describe('UnsavedChangesDialog', () => {
  it('blocks navigation and dismisses without losing the current edit', () => {
    renderDirtyNavigation();

    const title = screen.getByRole('heading', { name: 'Modifiche non salvate' });
    expect(screen.getByTestId('route').textContent).toBe('product-detail');
    expect(screen.getByTestId('pending').textContent).toBe('clients');
    fireEvent.click(title.closest('div.fixed')!);

    expect(screen.queryByRole('heading', { name: 'Modifiche non salvate' })).toBeNull();
    expect(screen.getByTestId('route').textContent).toBe('product-detail');
    expect(screen.getByTestId('editing').textContent).toBe('true');
  });

  it('discards the edit and continues to the pending destination', () => {
    renderDirtyNavigation();

    fireEvent.click(screen.getByRole('button', { name: 'Scarta modifiche' }));

    expect(screen.getByTestId('route').textContent).toBe('clients');
    expect(screen.getByTestId('editing').textContent).toBe('false');
    expect(productApi.updateProduct).not.toHaveBeenCalled();
  });

  it('locks both decisions while saving, then continues after a successful save', async () => {
    let resolveSave: (value: unknown) => void = () => {};
    productApi.updateProduct.mockReturnValue(
      new Promise((resolve) => {
        resolveSave = resolve;
      }),
    );
    renderDirtyNavigation();

    fireEvent.click(screen.getByRole('button', { name: 'Mantieni modifiche' }));
    const savingButton = screen.getByRole('button', { name: 'Salvataggio…' });
    expect((savingButton as HTMLButtonElement).disabled).toBe(true);
    expect(
      (screen.getByRole('button', { name: 'Scarta modifiche' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(screen.getByTestId('route').textContent).toBe('product-detail');

    await act(async () => resolveSave({}));
    await waitFor(() => expect(screen.getByTestId('route').textContent).toBe('clients'));
    expect(productApi.updateProduct).toHaveBeenCalledWith('P-1', {
      description: 'Tutore aggiornato',
    });
  });

  it('keeps the current route and displays the save error when persistence fails', async () => {
    productApi.updateProduct.mockRejectedValue(new Error('Salvataggio prodotto non riuscito.'));
    renderDirtyNavigation();

    fireEvent.click(screen.getByRole('button', { name: 'Mantieni modifiche' }));

    await waitFor(() =>
      expect(screen.getByTestId('error').textContent).toBe('Salvataggio prodotto non riuscito.'),
    );
    expect(screen.getByTestId('route').textContent).toBe('product-detail');
    expect(screen.getByTestId('editing').textContent).toBe('true');
    expect(screen.queryByRole('heading', { name: 'Modifiche non salvate' })).toBeNull();
  });
});
