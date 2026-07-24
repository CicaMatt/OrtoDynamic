import { downloadCsv } from '../files/downloadCsv';
import { tableColumnValue, type TableColumn } from './DataTable';

/**
 * Download every supplied row using the table's visible columns.
 *
 * Uses each column's canonical value rather than its display renderer so long
 * text is exported in full instead of as a shortened table preview.
 */
export function downloadTableCsv<T extends object>(
  title: string,
  columns: ReadonlyArray<TableColumn<T>>,
  rows: ReadonlyArray<T>,
): void {
  downloadCsv({
    filename: `${filenameStem(title)}-${localDateStamp(new Date())}.csv`,
    headers: columns.map((column) => column.label),
    rows: rows.map((row) => columns.map((column) => tableColumnValue(column, row))),
  });
}

function filenameStem(title: string): string {
  const stem = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return stem || 'esportazione';
}

function localDateStamp(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
