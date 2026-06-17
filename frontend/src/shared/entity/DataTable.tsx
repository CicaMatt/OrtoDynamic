import type { ReactNode } from 'react';
import { FieldValue } from '../ui/FieldValue';

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
            <MessageRow columnCount={columns.length}>{loadingLabel}</MessageRow>
          ) : error ? (
            <MessageRow columnCount={columns.length} tone="error">
              {error}
            </MessageRow>
          ) : rows.length === 0 ? (
            <MessageRow columnCount={columns.length}>{emptyLabel}</MessageRow>
          ) : (
            rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-surface-variant h-row-height">
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

function MessageRow({
  columnCount,
  tone = 'muted',
  children,
}: {
  columnCount: number;
  tone?: 'muted' | 'error';
  children: ReactNode;
}) {
  const toneClass = tone === 'error' ? 'text-error' : 'text-on-surface-variant';
  return (
    <tr>
      <td colSpan={columnCount} className={`p-6 text-center ${toneClass}`}>
        {children}
      </td>
    </tr>
  );
}
