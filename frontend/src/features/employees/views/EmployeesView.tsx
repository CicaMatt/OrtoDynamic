import { useMemo, useRef } from 'react';
import { DataTable } from '../../../shared/entity/DataTable';
import { TableScrollSlider } from '../../../shared/entity/TableScrollSlider';
import { downloadTableCsv } from '../../../shared/entity/TableCsv';
import { useApiData } from '../../../shared/hooks/useApiData';
import {
  useTableSearchFilter,
  type SearchFilterColumn,
} from '../../../shared/hooks/useTableSearchFilter';
import { ViewToolbar } from '../../../shared/ui/ViewToolbar';
import { fetchEmployees } from '../api/employees';
import type { Employee } from '../types';

const EMPLOYEE_COLUMNS: ReadonlyArray<SearchFilterColumn<Employee>> = [
  { key: 'username', label: 'Nome Utente' },
  { key: 'email', label: 'Email' },
  { key: 'firstName', label: 'Nome' },
  { key: 'lastName', label: 'Cognome' },
];

/** Read-only list of employee accounts from `tb_users` (no creation or editing yet). */
export function EmployeesView() {
  const { data, loading, error } = useApiData(fetchEmployees, []);
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
  } = useTableSearchFilter(items, EMPLOYEE_COLUMNS);

  return (
    <div>
      <header className="flex flex-col items-start gap-4 mb-8 lg:flex-row lg:items-center lg:justify-between lg:gap-0">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="font-headline-lg text-headline-lg font-bold text-primary">
            Gestione Dipendenti
          </h2>
          <TableScrollSlider scrollRef={tableScrollRef} />
        </div>
        <ViewToolbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onDownload={() =>
            downloadTableCsv('Gestione Dipendenti', EMPLOYEE_COLUMNS, filteredItems)
          }
          downloadDisabled={loading || Boolean(error)}
          filters={filterOptions}
          activeFilters={activeFilters}
          onFilterChange={setFilter}
          onClearFilters={clearFilters}
        />
      </header>

      <DataTable
        columns={EMPLOYEE_COLUMNS}
        rows={filteredItems}
        loading={loading}
        error={error}
        loadingLabel="Caricamento dipendenti..."
        emptyLabel="Nessun dipendente trovato."
        rowKey={(employee) => employee.idEmployee}
        scrollRef={tableScrollRef}
      />
    </div>
  );
}
