import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DataTable, type TableColumn } from '../../../src/shared/entity/DataTable';

type Row = { id: string; name: string; status: string };

const columns: TableColumn<Row>[] = [
  { key: 'name', label: 'Nome', primary: true },
  {
    key: 'status',
    label: 'Stato',
    cell: (row) => <strong>{row.status.toLowerCase()}</strong>,
  },
];

const rows: Row[] = [{ id: '1', name: 'Tutore', status: 'PRONTO' }];

type Overrides = Partial<{
  rows: Row[];
  loading: boolean;
  error: string | null;
  onRowClick: (row: Row) => void;
}>;

function renderTable(overrides: Overrides = {}) {
  return render(
    <DataTable
      columns={columns}
      rows={rows}
      loading={false}
      error={null}
      loadingLabel="Caricamento..."
      emptyLabel="Nessun risultato."
      rowKey={(row) => row.id}
      {...overrides}
    />,
  );
}

describe('DataTable', () => {
  it('renders declarative values and custom cells', () => {
    renderTable();

    expect(screen.getByText('Tutore')).toBeTruthy();
    expect(screen.getByText('pronto').tagName).toBe('STRONG');
  });

  it('activates interactive rows by click, Enter, and Space', () => {
    const onRowClick = vi.fn();
    renderTable({ onRowClick });
    const row = screen.getByText('Tutore').closest('tr')!;

    fireEvent.click(row);
    fireEvent.keyDown(row, { key: 'Enter' });
    fireEvent.keyDown(row, { key: ' ' });

    expect(onRowClick).toHaveBeenCalledTimes(3);
    expect(onRowClick).toHaveBeenLastCalledWith(rows[0]);
    expect(row.tabIndex).toBe(0);
  });

  it.each([
    { loading: true, error: null, rows, text: 'Caricamento...' },
    { loading: false, error: 'Errore API', rows, text: 'Errore API' },
    { loading: false, error: null, rows: [], text: 'Nessun risultato.' },
  ])('renders a full-width status row for $text', ({ loading, error, rows, text }) => {
    renderTable({ loading, error, rows });

    expect(screen.getByText(text).closest('td')?.colSpan).toBe(columns.length);
  });
});
