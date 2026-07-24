import { useMemo, useRef } from 'react';
import { Pagination } from '../ui/Pagination';
import { ViewToolbar } from '../ui/ViewToolbar';
import { useApiData } from '../hooks/useApiData';
import { usePagination } from '../hooks/usePagination';
import { useTableSearchFilter } from '../hooks/useTableSearchFilter';
import { DataTable, type TableColumn } from './DataTable';
import { TableScrollSlider } from './TableScrollSlider';
import { downloadTableCsv } from './TableCsv';

export type EntityColumn<T extends object> = TableColumn<T>;

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
  /** Surface the exact-pick (only-filterable) filters before the searchable ones. */
  categoricalFiltersFirst?: boolean;
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
  categoricalFiltersFirst = false,
}: EntityListViewProps<T>) {
  const { data, loading, error } = useApiData(fetchItems, []);
  const items = useMemo(() => data ?? [], [data]);
  const tableScrollRef = useRef<HTMLDivElement>(null);

  const {
    searchValue,
    setSearchValue,
    activeFilters,
    setFilter,
    clearFilters,
    filterOptions,
    filteredItems,
  } = useTableSearchFilter(items, columns, { categoricalFiltersFirst });

  const { pageItems, page, totalPages, totalItems, rangeStart, rangeEnd, setPage } =
    usePagination(filteredItems);

  return (
    <div>
      <header className="flex flex-col items-start gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="font-headline-lg text-headline-lg font-bold text-primary">{title}</h2>
          <TableScrollSlider scrollRef={tableScrollRef} />
        </div>
        <ViewToolbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onDownload={() => downloadTableCsv(title, columns, filteredItems)}
          downloadDisabled={loading || Boolean(error)}
          onCreate={onCreate}
          filters={filterOptions}
          activeFilters={activeFilters}
          onFilterChange={setFilter}
          onClearFilters={clearFilters}
        />
      </header>

      <DataTable
        columns={columns}
        rows={pageItems}
        loading={loading}
        error={error}
        loadingLabel={loadingLabel}
        emptyLabel={emptyLabel}
        rowKey={rowKey}
        onRowClick={onRowClick}
        scrollRef={tableScrollRef}
      />

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
