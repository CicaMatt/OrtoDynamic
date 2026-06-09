import { useMemo, useState, type ReactNode } from 'react';
import { FieldValue } from '../ui/FieldValue';
import { Pagination } from '../ui/Pagination';
import { ViewToolbar, type ToolbarFilters } from '../ui/ViewToolbar';
import { useApiData } from '../hooks/useApiData';
import { usePagination } from '../hooks/usePagination';

export type EntityColumn<T> = {
  key: keyof T;
  label: string;
  primary?: boolean;
  muted?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  render?: (value: string, item: T) => string;
};

type EntityListViewProps<T extends object> = {
  title: string;
  columns: ReadonlyArray<EntityColumn<T>>;
  fetchItems: () => Promise<T[]>;
  rowKey: (item: T) => string;
  onRowClick: (item: T) => void;
  loadingLabel: string;
  emptyLabel: string;
};

export function EntityListView<T extends object>({
  title,
  columns,
  fetchItems,
  rowKey,
  onRowClick,
  loadingLabel,
  emptyLabel,
}: EntityListViewProps<T>) {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<ToolbarFilters>({});
  const { data, loading, error } = useApiData(() => fetchItems(), []);

  const items = useMemo(() => data ?? [], [data]);
  const searchableColumns = useMemo(
    () => columns.filter((column) => column.searchable !== false),
    [columns],
  );
  const filterableColumns = useMemo(
    () => columns.filter((column) => column.filterable !== false),
    [columns],
  );

  const filterOptions = useMemo(
    () =>
      filterableColumns.map((column) => ({
        key: String(column.key),
        label: column.label,
        options: getUniqueValues(items.map((item) => String(item[column.key] ?? ''))),
      })),
    [filterableColumns, items],
  );

  const filteredItems = useMemo(
    () => filterItems(items, searchableColumns, filterableColumns, searchValue, activeFilters),
    [items, searchableColumns, filterableColumns, searchValue, activeFilters],
  );

  const { pageItems, page, totalPages, totalItems, rangeStart, rangeEnd, setPage } =
    usePagination(filteredItems);

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="font-headline-lg text-headline-lg font-bold text-primary">{title}</h2>
        <ViewToolbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filterOptions}
          activeFilters={activeFilters}
          onFilterChange={(key, value) => setActiveFilters((current) => ({ ...current, [key]: value }))}
          onClearFilters={() => setActiveFilters({})}
        />
      </header>

      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left font-body-md text-body-md">
          <thead className="bg-surface-container-low font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="py-3 px-6 uppercase font-bold tracking-wider whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <EntityTableBody
              items={pageItems}
              columns={columns}
              rowKey={rowKey}
              onRowClick={onRowClick}
              loading={loading}
              error={error}
              loadingLabel={loadingLabel}
              emptyLabel={emptyLabel}
            />
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        onPageChange={setPage}
      />
    </div>
  );
}

function EntityTableBody<T extends object>({
  items,
  columns,
  rowKey,
  onRowClick,
  loading,
  error,
  loadingLabel,
  emptyLabel,
}: {
  items: T[];
  columns: ReadonlyArray<EntityColumn<T>>;
  rowKey: (item: T) => string;
  onRowClick: (item: T) => void;
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
        <EntityRow key={rowKey(item)} item={item} columns={columns} onClick={() => onRowClick(item)} />
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
      <td colSpan={columnCount} className={`p-6 text-center ${toneClass}`}>
        {children}
      </td>
    </tr>
  );
}

function EntityRow<T extends object>({
  item,
  columns,
  onClick,
}: {
  item: T;
  columns: ReadonlyArray<EntityColumn<T>>;
  onClick: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className="border-b border-surface-variant h-row-height hover:bg-surface-container-lowest/50 transition-colors cursor-pointer"
    >
      {columns.map((column) => {
        const raw = String(item[column.key] ?? '');
        return (
          <td key={String(column.key)} className={cellClassName(column)}>
            <FieldValue value={column.render ? column.render(raw, item) : raw} />
          </td>
        );
      })}
    </tr>
  );
}

function cellClassName<T>(column: EntityColumn<T>): string {
  const base = 'px-6 whitespace-nowrap';
  if (column.primary) return `${base} text-primary font-medium hover:underline`;
  if (column.muted) return `${base} text-on-surface-variant`;
  return base;
}

function filterItems<T extends object>(
  items: T[],
  searchableColumns: ReadonlyArray<EntityColumn<T>>,
  filterableColumns: ReadonlyArray<EntityColumn<T>>,
  searchValue: string,
  activeFilters: ToolbarFilters,
) {
  const searchTerm = normalize(searchValue);

  return items.filter((item) => {
    const matchesSearch =
      searchTerm.length === 0 ||
      searchableColumns.some((column) => normalize(String(item[column.key] ?? '')).includes(searchTerm));
    const matchesFilters = filterableColumns.every((column) => {
      const activeValue = activeFilters[String(column.key)];
      return !activeValue || String(item[column.key] ?? '') === activeValue;
    });

    return matchesSearch && matchesFilters;
  });
}

function getUniqueValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'it'));
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
