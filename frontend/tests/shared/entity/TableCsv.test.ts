import { afterEach, describe, expect, it, vi } from 'vitest';

import { downloadTableCsv } from '../../../src/shared/entity/TableCsv';
import type { TableColumn } from '../../../src/shared/entity/DataTable';
import { downloadCsv } from '../../../src/shared/files/downloadCsv';

vi.mock('../../../src/shared/files/downloadCsv', () => ({
  downloadCsv: vi.fn(),
}));

type Row = {
  id: string;
  note: string;
};

const columns: ReadonlyArray<TableColumn<Row>> = [
  { key: 'id', label: 'ID' },
  {
    key: 'note',
    label: 'Note',
    render: (value) => `${value.slice(0, 3)}…`,
  },
];

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('downloadTableCsv', () => {
  it('exports visible columns with complete canonical values and a dated filename', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 24, 12));
    const rows: Row[] = [{ id: '001', note: 'Testo completo' }];

    downloadTableCsv('Aziende Sanitarie', columns, rows);

    expect(downloadCsv).toHaveBeenCalledWith({
      filename: 'aziende-sanitarie-2026-07-24.csv',
      headers: ['ID', 'Note'],
      rows: [['001', 'Testo completo']],
    });
  });
});
