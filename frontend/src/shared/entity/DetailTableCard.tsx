import type { ReactNode } from 'react';
import { DataCard, EditInput, optionsFromValues } from './DataCard';
import { FieldValue } from '../ui/FieldValue';

/** A column in a {@link DetailTableCard}. */
export type DetailTableColumn<T> = {
  key: keyof T;
  label: string;
  /** Map the raw value to its display string (e.g. date formatting). */
  render?: (value: string) => string;
  /** Custom read-mode content replacing the formatted value. */
  renderNode?: (value: string, item: T, raw: string) => ReactNode;
  /** When set and the card is editing, the cell is a select over these values. */
  editOptions?: ReadonlyArray<string>;
  /** When true and the card is editing, the cell is a date input. */
  editDate?: boolean;
  /** Gate an editable cell per-row; when it returns false the cell is read-only. */
  editableWhen?: (item: T) => boolean;
  /** Highlight an editable cell as failing validation. */
  invalidWhen?: (item: T) => boolean;
};

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
  editing = false,
  onCellChange,
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
  /** When true, columns with `editOptions` render an editable select. */
  editing?: boolean;
  onCellChange?: (item: T, key: keyof T, value: string) => void;
}) {
  return (
    <DataCard icon={icon} title={title}>
      <div className="overflow-x-auto rounded-xl border border-outline-variant/50">
        <table className="w-full text-left font-body-md text-body-md">
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
            <DetailTableBody
              items={items}
              columns={columns}
              rowKey={rowKey}
              loading={loading}
              error={error}
              loadingLabel={loadingLabel}
              emptyLabel={emptyLabel}
              editing={editing}
              onCellChange={onCellChange}
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
  editing,
  onCellChange,
}: {
  items: T[];
  columns: ReadonlyArray<DetailTableColumn<T>>;
  rowKey: (item: T) => string;
  loading: boolean;
  error: string | null;
  loadingLabel: string;
  emptyLabel: string;
  editing: boolean;
  onCellChange?: (item: T, key: keyof T, value: string) => void;
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
          {columns.map((column) => {
            const raw = String(item[column.key] ?? '');
            const value = column.render ? column.render(raw) : raw;
            const cellEditable =
              editing &&
              (column.editOptions || column.editDate) &&
              onCellChange &&
              (column.editableWhen?.(item) ?? true);
            return (
              <td key={String(column.key)} className="py-3 px-4 whitespace-nowrap">
                {cellEditable ? (
                  <EditInput
                    type={column.editOptions ? 'select' : 'date'}
                    value={raw}
                    options={column.editOptions ? optionsFromValues(column.editOptions) : undefined}
                    invalid={column.invalidWhen?.(item) ?? false}
                    onChange={(value) => onCellChange!(item, column.key, value)}
                  />
                ) : (
                  column.renderNode ? column.renderNode(value, item, raw) : <FieldValue value={value} />
                )}
              </td>
            );
          })}
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
