import { useMemo, type ReactNode } from 'react';
import { FieldValue } from '../ui/FieldValue';
import { Pagination } from '../ui/Pagination';
import { ViewToolbar } from '../ui/ViewToolbar';
import { useApiData } from '../hooks/useApiData';
import { usePagination } from '../hooks/usePagination';
import { useTableSearchFilter, type SearchFilterColumn } from '../hooks/useTableSearchFilter';
import { TableMessageRow } from './TableMessageRow';

export type EntityColumn<T> = {
  key: keyof T;
  label: string;
  primary?: boolean;
  muted?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  render?: (value: string, item: T) => string;
  /** Custom cell content, overriding the default value rendering when present. */
  renderCell?: (item: T) => ReactNode;
};

type EntityListViewProps<T extends object> = {
  title: string;
  columns: ReadonlyArray<EntityColumn<T>>;
  fetchItems: () => Promise<T[]>;
  rowKey: (item: T) => string;
  onRowClick: (item: T) => void;
  loadingLabel: string;
  emptyLabel: string;
  /** When provided, shows the toolbar's "Crea Nuovo" button. */
  onCreate?: () => void;
};

export function EntityListView<T extends object>({
  title,
  columns,
  fetchItems,
  rowKey,
  onRowClick,
  loadingLabel,
  emptyLabel,
  onCreate,
}: EntityListViewProps<T>) {
  const { data, loading, error } = useApiData(() => fetchItems(), []);
  const items = useMemo(() => data ?? [], [data]);

  // Adapt the list's column config to the search/filter hook's accessor shape,
  // so a single implementation drives search and filtering across every table.
  const searchFilterColumns = useMemo<SearchFilterColumn<T>[]>(
    () =>
      columns.map((column) => ({
        key: String(column.key),
        label: column.label,
        getValue: (item) => String(item[column.key] ?? ''),
        searchable: column.searchable,
        filterable: column.filterable,
      })),
    [columns],
  );

  const {
    searchValue,
    setSearchValue,
    activeFilters,
    setFilter,
    clearFilters,
    filterOptions,
    filteredItems,
  } = useTableSearchFilter(items, searchFilterColumns);

  const { pageItems, page, totalPages, totalItems, rangeStart, rangeEnd, setPage } =
    usePagination(filteredItems);

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="font-headline-lg text-headline-lg font-bold text-primary">{title}</h2>
        <ViewToolbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onCreate={onCreate}
          filters={filterOptions}
          activeFilters={activeFilters}
          onFilterChange={setFilter}
          onClearFilters={clearFilters}
        />
      </header>

      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left font-body-md text-body-md">
          <thead className="bg-secondary font-label-caps text-label-caps text-on-secondary border-b border-outline-variant/50">
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
  if (loading) return <TableMessageRow columnCount={columns.length}>{loadingLabel}</TableMessageRow>;
  if (error) {
    return (
      <TableMessageRow columnCount={columns.length} tone="error">
        {error}
      </TableMessageRow>
    );
  }
  if (items.length === 0)
    return <TableMessageRow columnCount={columns.length}>{emptyLabel}</TableMessageRow>;

  return (
    <>
      {items.map((item) => (
        <EntityRow key={rowKey(item)} item={item} columns={columns} onClick={() => onRowClick(item)} />
      ))}
    </>
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
            {column.renderCell ? (
              column.renderCell(item)
            ) : (
              <FieldValue value={column.render ? column.render(raw, item) : raw} />
            )}
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
