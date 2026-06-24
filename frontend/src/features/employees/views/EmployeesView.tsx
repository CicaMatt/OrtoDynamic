import { useMemo } from 'react';
import { DataTable } from '../../../shared/entity/DataTable';
import { useApiData } from '../../../shared/hooks/useApiData';
import { useTableSearchFilter, type SearchFilterColumn } from '../../../shared/hooks/useTableSearchFilter';
import { ViewToolbar } from '../../../shared/ui/ViewToolbar';
import { fetchEmployees } from '../api/employees';
import type { Employee } from '../types';

// Username and email are near-unique identifiers, so they are searchable but not
// offered as exact-value filters (which would just list every row).
const EMPLOYEE_COLUMNS: ReadonlyArray<SearchFilterColumn<Employee>> = [
  { key: 'username', label: 'Nome Utente', getValue: (employee) => employee.username, filterable: false },
  { key: 'email', label: 'Email', getValue: (employee) => employee.email, filterable: false },
  { key: 'firstName', label: 'Nome', getValue: (employee) => employee.firstName },
  { key: 'lastName', label: 'Cognome', getValue: (employee) => employee.lastName },
];

/** Read-only list of employee accounts from `tb_users` (no creation or editing yet). */
export function EmployeesView() {
  const { data, loading, error } = useApiData(fetchEmployees, []);
  const items = useMemo(() => data ?? [], [data]);
  const { searchValue, setSearchValue, activeFilters, setFilter, clearFilters, filterOptions, filteredItems } =
    useTableSearchFilter(items, EMPLOYEE_COLUMNS);

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="font-headline-lg text-headline-lg font-bold text-primary">Gestione Dipendenti</h2>
        <ViewToolbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
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
      />
    </div>
  );
}
