import { FieldValue } from '../ui/FieldValue';
import { TableMessageRow } from './TableMessageRow';

/** A read-only table column: its header label and a plain-text cell accessor. */
export type DataColumn<T> = {
  key: string;
  label: string;
  getValue: (row: T) => string;
};

type DataTableProps<T> = {
  columns: ReadonlyArray<DataColumn<T>>;
  rows: T[];
  loading: boolean;
  error: string | null;
  loadingLabel: string;
  emptyLabel: string;
  rowKey: (row: T) => string;
};

/**
 * A plain, non-interactive table sharing the list views' surface styling. Shows
 * a single centered message while loading, on error, or when there are no rows.
 */
export function DataTable<T>({
  columns,
  rows,
  loading,
  error,
  loadingLabel,
  emptyLabel,
  rowKey,
}: DataTableProps<T>) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm overflow-x-auto">
      <table className="w-full text-left font-body-md text-body-md">
        <thead className="bg-secondary font-label-caps text-label-caps text-on-secondary border-b border-outline-variant/50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="py-3 px-6 uppercase font-bold tracking-wider whitespace-nowrap">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <TableMessageRow columnCount={columns.length}>{loadingLabel}</TableMessageRow>
          ) : error ? (
            <TableMessageRow columnCount={columns.length} tone="error">
              {error}
            </TableMessageRow>
          ) : rows.length === 0 ? (
            <TableMessageRow columnCount={columns.length}>{emptyLabel}</TableMessageRow>
          ) : (
            rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="border-b border-surface-variant h-row-height hover:bg-surface-container-low transition-colors duration-300"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 whitespace-nowrap">
                    <FieldValue value={column.getValue(row)} />
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
