import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { EntityListView, type EntityColumn } from '../../../src/shared/entity/EntityListView';

type PersonRow = {
  id: string;
  name: string;
  city: string;
  status: string;
};

const columns: ReadonlyArray<EntityColumn<PersonRow>> = [
  { key: 'id', label: 'ID', searchable: false, filterable: false },
  { key: 'name', label: 'Nome', primary: true },
  { key: 'city', label: 'Città' },
  { key: 'status', label: 'Stato', searchable: false },
];

function makeRows(count: number): PersonRow[] {
  return Array.from({ length: count }, (_, index) => ({
    id: String(index + 1),
    name: `Cliente ${String(index + 1).padStart(2, '0')}`,
    city: index % 2 === 0 ? 'Roma' : 'Milano',
    status: index % 3 === 0 ? 'Attivo' : 'Inattivo',
  }));
}

function renderList({
  fetchItems,
  onRowClick = vi.fn(),
  onCreate = vi.fn(),
}: {
  fetchItems: () => Promise<PersonRow[]>;
  onRowClick?: (row: PersonRow) => void;
  onCreate?: () => void;
}) {
  render(
    <EntityListView
      title="Persone"
      columns={columns}
      fetchItems={fetchItems}
      rowKey={(row) => row.id}
      onRowClick={onRowClick}
      loadingLabel="Caricamento persone..."
      emptyLabel="Nessuna persona trovata."
      onCreate={onCreate}
      categoricalFiltersFirst
    />,
  );
  return { onRowClick, onCreate };
}

describe('EntityListView', () => {
  it('moves from loading to paginated rows and supports mouse, keyboard, and create actions', async () => {
    let resolveItems: (rows: PersonRow[]) => void = () => {};
    const rows = makeRows(35);
    const fetchItems = vi.fn(
      () =>
        new Promise<PersonRow[]>((resolve) => {
          resolveItems = resolve;
        }),
    );
    const { onRowClick, onCreate } = renderList({ fetchItems });

    expect(screen.getByText('Caricamento persone...')).not.toBeNull();
    await act(async () => resolveItems(rows));
    expect(await screen.findByText('Cliente 01')).not.toBeNull();
    expect(screen.getByText('1–30 di 35 risultati')).not.toBeNull();
    expect(fetchItems).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByText('Cliente 02').closest('tr')!);
    expect(onRowClick).toHaveBeenLastCalledWith(rows[1]);
    fireEvent.keyDown(screen.getByText('Cliente 03').closest('tr')!, { key: 'Enter' });
    expect(onRowClick).toHaveBeenLastCalledWith(rows[2]);

    fireEvent.click(screen.getByRole('button', { name: 'Pagina successiva' }));
    expect(screen.getByText('Cliente 31')).not.toBeNull();
    expect(screen.getByText('31–35 di 35 risultati')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Nuovo/ }));
    expect(onCreate).toHaveBeenCalledOnce();
  });

  it('combines global search and a categorical filter, then resets to the first page', async () => {
    const rows = makeRows(35);
    renderList({ fetchItems: vi.fn().mockResolvedValue(rows) });
    await screen.findByText('Cliente 01');

    fireEvent.click(screen.getByRole('button', { name: 'Pagina successiva' }));
    expect(screen.getByText('Pagina 2 di 2')).not.toBeNull();
    fireEvent.change(screen.getByPlaceholderText('Cerca...'), {
      target: { value: 'Cliente 04' },
    });

    expect(await screen.findByText('Cliente 04')).not.toBeNull();
    expect(screen.queryByText('Cliente 31')).toBeNull();
    expect(screen.getByText('Pagina 1 di 1')).not.toBeNull();

    fireEvent.change(screen.getByPlaceholderText('Cerca...'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /Filtra/ }));
    fireEvent.change(screen.getByLabelText('Stato'), { target: { value: 'Attivo' } });

    await waitFor(() => expect(screen.queryByText('Cliente 02')).toBeNull());
    expect(screen.getByText('Cliente 01')).not.toBeNull();
    expect(screen.getByText('1–12 di 12 risultati')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Rimuovi' }));
    expect(await screen.findByText('1–30 di 35 risultati')).not.toBeNull();
  });

  it('renders the supplied empty state without pagination', async () => {
    renderList({ fetchItems: vi.fn().mockResolvedValue([]) });

    expect(await screen.findByText('Nessuna persona trovata.')).not.toBeNull();
    expect(screen.queryByLabelText('Pagina successiva')).toBeNull();
  });

  it('renders a fetch error instead of an empty result', async () => {
    renderList({
      fetchItems: vi.fn().mockRejectedValue(new Error('Elenco persone non disponibile.')),
    });

    expect(await screen.findByText('Elenco persone non disponibile.')).not.toBeNull();
    expect(screen.queryByText('Nessuna persona trovata.')).toBeNull();
  });
});
