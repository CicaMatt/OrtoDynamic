import type { ReactNode, RefObject } from 'react';
import { FieldValue } from '../ui/FieldValue';
import { ScrollableTable } from './ScrollableTable';
import { TableMessageRow } from './TableMessageRow';

/** One declarative column shared by table rendering, search, and filtering. */
export type TableColumn<T extends object> = {
  key: keyof T;
  label: string;
  /** Override the field value used for display, search, and filtering. */
  value?: (row: T) => string;
  /** Format the plain value for display without changing search/filter behavior. */
  render?: (value: string, row: T) => string;
  /** Custom cell content replacing the formatted text value. */
  cell?: (row: T) => ReactNode;
  cellClassName?: string | ((row: T) => string);
  primary?: boolean;
  muted?: boolean;
  searchable?: boolean;
  filterable?: boolean;
};

export function tableColumnValue<T extends object>(column: TableColumn<T>, row: T): string {
  return column.value ? column.value(row) : String(row[column.key] ?? '');
}

type DataTableProps<T extends object> = {
  columns: ReadonlyArray<TableColumn<T>>;
  rows: ReadonlyArray<T>;
  loading: boolean;
  error: string | null;
  loadingLabel: string;
  emptyLabel: string;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  scrollRef?: RefObject<HTMLDivElement>;
  surfaceClassName?: string;
  tableClassName?: string;
  rowClassName?: string;
  bodyCellClassName?: string;
};

/** The single renderer for ordinary read-table surfaces, rows, and status states. */
export function DataTable<T extends object>({
  columns,
  rows,
  loading,
  error,
  loadingLabel,
  emptyLabel,
  rowKey,
  onRowClick,
  scrollRef,
  surfaceClassName,
  tableClassName = 'w-full text-left font-body-md text-body-md',
  rowClassName = 'border-b border-surface-variant h-row-height hover:bg-surface-container-low transition-colors duration-300',
  bodyCellClassName = 'px-4 whitespace-nowrap',
}: DataTableProps<T>) {
  const interactive = Boolean(onRowClick);

  return (
    <ScrollableTable scrollRef={scrollRef} surfaceClassName={surfaceClassName}>
      <table className={tableClassName}>
        <thead className="bg-secondary font-label-caps text-label-caps text-on-secondary border-b border-outline-variant/50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="py-3 px-4 uppercase font-bold tracking-wider whitespace-nowrap"
              >
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
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (event) => {
                        if (event.key !== 'Enter' && event.key !== ' ') return;
                        event.preventDefault();
                        onRowClick(row);
                      }
                    : undefined
                }
                tabIndex={interactive ? 0 : undefined}
                className={`${rowClassName}${interactive ? ' cursor-pointer' : ''}`}
              >
                {columns.map((column) => {
                  const value = tableColumnValue(column, row);
                  return (
                    <td
                      key={String(column.key)}
                      className={cellClassName(column, row, bodyCellClassName)}
                    >
                      {column.cell ? (
                        column.cell(row)
                      ) : (
                        <FieldValue value={column.render ? column.render(value, row) : value} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </ScrollableTable>
  );
}

function cellClassName<T extends object>(column: TableColumn<T>, row: T, base: string): string {
  const tone = column.primary
    ? 'text-primary font-medium hover:underline'
    : column.muted
      ? 'text-on-surface-variant'
      : '';
  const custom =
    typeof column.cellClassName === 'function'
      ? column.cellClassName(row)
      : (column.cellClassName ?? '');
  return [base, tone, custom].filter(Boolean).join(' ');
}
