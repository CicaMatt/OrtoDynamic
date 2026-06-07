import { useMemo, useState } from 'react';
import { Icon } from '../components/common/Icon';
import { ViewToolbar, type ToolbarFilters } from '../components/common/ViewToolbar';
import { employees } from '../data/employees';
import type { Employee } from '../types';

const columns = ['Username', 'Tipo Utente', 'Assegnazione', 'Nome', 'Cognome', 'Email'] as const;
const employeeFilterColumns = [
  { key: 'username', label: 'Username' },
  { key: 'userType', label: 'Tipo Utente' },
  { key: 'assignment', label: 'Assegnazione' },
  { key: 'name', label: 'Nome' },
  { key: 'surname', label: 'Cognome' },
  { key: 'email', label: 'Email' },
] as const;

const quickFilterGroups = [
  {
    title: 'TIPO UTENTE',
    options: [
      { key: 'userType', value: 'Amministratore', label: 'Amministratori', icon: 'admin_panel_settings' },
      { key: 'userType', value: 'Tecnico', label: 'Tecnici', icon: 'engineering' },
      { key: 'userType', value: 'Medico', label: 'Medici', icon: 'medical_services' },
      { key: 'userType', value: 'Segreteria', label: 'Segreteria', icon: 'support_agent' },
    ],
  },
];

export function EmployeesView() {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<ToolbarFilters>({});

  const filterOptions = useMemo(
    () =>
      employeeFilterColumns.map((column) => ({
        ...column,
        options: getUniqueValues(employees.map((employee) => String(employee[column.key]))),
      })),
    [],
  );

  const filteredEmployees = useMemo(
    () => filterEmployees(employees, searchValue, activeFilters),
    [searchValue, activeFilters],
  );

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="font-headline-lg text-headline-lg font-bold text-primary">Gestione Dipendenti</h2>
        <ViewToolbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filterOptions}
          activeFilters={activeFilters}
          onFilterChange={(key, value) => setActiveFilters((current) => ({ ...current, [key]: value }))}
          onClearFilters={() => setActiveFilters({})}
          quickFilterGroups={quickFilterGroups}
        />
      </header>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50 overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap font-body-md text-body-md">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/50">
              {columns.map((col) => (
                <th
                  key={col}
                  className="font-label-caps text-label-caps text-on-surface-variant uppercase p-4"
                >
                  {col}
                </th>
              ))}
              <th className="p-4 w-10" />
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee, idx) => (
                <EmployeeRow
                  key={employee.username}
                  employee={employee}
                  isLast={idx === filteredEmployees.length - 1}
                />
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="p-6 text-center text-on-surface-variant">
                  Nessun dipendente trovato.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmployeeRow({ employee, isLast }: { employee: Employee; isLast: boolean }) {
  const borderClass = isLast ? '' : 'border-b border-outline-variant/30';

  return (
    <tr className={`${borderClass} hover:bg-surface-container-low/50 transition-colors h-row-height`}>
      <td className="p-4 font-medium text-primary">{employee.username}</td>
      <td className="p-4">{employee.userType}</td>
      <td className="p-4">{employee.assignment}</td>
      <td className="p-4">{employee.name}</td>
      <td className="p-4">{employee.surname}</td>
      <td className="p-4 text-on-surface-variant">{employee.email}</td>
      <td className="p-4 text-center">
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <Icon name="more_vert" />
        </button>
      </td>
    </tr>
  );
}

function filterEmployees(employeeList: Employee[], searchValue: string, activeFilters: ToolbarFilters) {
  const searchTerm = normalize(searchValue);

  return employeeList.filter((employee) => {
    const searchableValues = [
      employee.username,
      employee.userType,
      employee.assignment,
      employee.name,
      employee.surname,
      employee.email,
    ];
    const matchesSearch =
      searchTerm.length === 0 || searchableValues.some((value) => normalize(value).includes(searchTerm));
    const matchesFilters = employeeFilterColumns.every((column) => {
      const activeValue = activeFilters[column.key];
      return !activeValue || String(employee[column.key]) === activeValue;
    });

    return matchesSearch && matchesFilters;
  });
}

function getUniqueValues(values: string[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, 'it'));
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
