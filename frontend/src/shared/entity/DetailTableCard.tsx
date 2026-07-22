import { useRef, type ReactNode } from 'react';
import { DataCard } from './DataCard';
import { EditInput, optionsFromValues } from './EntityFields';
import { DataTable, tableColumnValue, type TableColumn } from './DataTable';
import { TableScrollSlider } from './TableScrollSlider';
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
  footer,
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
  footer?: ReactNode;
}) {
  const tableScrollRef = useRef<HTMLDivElement>(null);
  const tableColumns: ReadonlyArray<TableColumn<T>> = columns.map((column) => ({
    key: column.key,
    label: column.label,
    cellClassName: (item) => {
      const editable = isEditableCell(column, item, editing, onCellChange);
      return editable ? 'min-w-[200px]' : '';
    },
    cell: (item) => {
      const raw = tableColumnValue(column, item);
      const value = column.render ? column.render(raw) : raw;
      if (isEditableCell(column, item, editing, onCellChange)) {
        return (
          <EditInput
            type={column.editOptions ? 'select' : 'date'}
            value={raw}
            options={column.editOptions ? optionsFromValues(column.editOptions) : undefined}
            invalid={column.invalidWhen?.(item) ?? false}
            onChange={(nextValue) => onCellChange!(item, column.key, nextValue)}
          />
        );
      }
      return column.renderNode ? column.renderNode(value, item, raw) : <FieldValue value={value} />;
    },
  }));

  return (
    <DataCard icon={icon} title={title} action={<TableScrollSlider scrollRef={tableScrollRef} />}>
      <DataTable
        columns={tableColumns}
        rows={items}
        loading={loading}
        error={error}
        loadingLabel={loadingLabel}
        emptyLabel={emptyLabel}
        rowKey={rowKey}
        surfaceClassName="rounded-xl border border-outline-variant/50"
        scrollRef={tableScrollRef}
        rowClassName="border-b border-surface-variant last:border-0 hover:bg-surface-container-low transition-colors duration-300"
        bodyCellClassName="py-3 px-4 whitespace-nowrap"
      />
      {footer}
    </DataCard>
  );
}

function isEditableCell<T extends object>(
  column: DetailTableColumn<T>,
  item: T,
  editing: boolean,
  onCellChange: ((item: T, key: keyof T, value: string) => void) | undefined,
): boolean {
  return Boolean(
    editing &&
    (column.editOptions || column.editDate) &&
    onCellChange &&
    (column.editableWhen?.(item) ?? true),
  );
}
