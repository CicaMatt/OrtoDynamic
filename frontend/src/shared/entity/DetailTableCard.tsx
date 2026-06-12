import type { ReactNode } from 'react';
import { DataCard } from './DataCard';
import { FieldValue } from '../ui/FieldValue';

/** A column in a {@link DetailTableCard}: which key to read and its header label. */
export type DetailTableColumn<T> = { key: keyof T; label: string };

/**
 * Read-only table embedded in a detail view as a {@link DataCard}. Presentational
 * only: the caller fetches the rows and passes loading/error state, so each
 * feature owns its own data dependencies. Mirrors the look of the page-level
 * `EntityListView` table at card scale.
 */
export function DetailTableCard<T extends object>({
  icon,
  title,
  columns,
  items,
  loading,
  error,
  rowKey,
  loadingLabel,
  emptyLabel,
}: {
  icon: string;
  title: string;
  columns: ReadonlyArray<DetailTableColumn<T>>;
  items: T[];
  loading: boolean;
  error: string | null;
  rowKey: (item: T) => string;
  loadingLabel: string;
  emptyLabel: string;
}) {
  return (
    <DataCard icon={icon} title={title}>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-body-md text-body-md">
          <thead className="font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant/50">
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
            <DetailTableBody
              items={items}
              columns={columns}
              rowKey={rowKey}
              loading={loading}
              error={error}
              loadingLabel={loadingLabel}
              emptyLabel={emptyLabel}
            />
          </tbody>
        </table>
      </div>
    </DataCard>
  );
}

function DetailTableBody<T extends object>({
  items,
  columns,
  rowKey,
  loading,
  error,
  loadingLabel,
  emptyLabel,
}: {
  items: T[];
  columns: ReadonlyArray<DetailTableColumn<T>>;
  rowKey: (item: T) => string;
  loading: boolean;
  error: string | null;
  loadingLabel: string;
  emptyLabel: string;
}) {
  if (loading) return <MessageRow columnCount={columns.length}>{loadingLabel}</MessageRow>;
  if (error) {
    return (
      <MessageRow columnCount={columns.length} tone="error">
        {error}
      </MessageRow>
    );
  }
  if (items.length === 0) return <MessageRow columnCount={columns.length}>{emptyLabel}</MessageRow>;

  return (
    <>
      {items.map((item) => (
        <tr key={rowKey(item)} className="border-b border-surface-variant last:border-0">
          {columns.map((column) => (
            <td key={String(column.key)} className="py-3 px-4 whitespace-nowrap">
              <FieldValue value={String(item[column.key] ?? '')} />
            </td>
          ))}
        </tr>
      ))}
    </>
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
      <td colSpan={columnCount} className={`py-6 px-4 text-center ${toneClass}`}>
        {children}
      </td>
    </tr>
  );
}
