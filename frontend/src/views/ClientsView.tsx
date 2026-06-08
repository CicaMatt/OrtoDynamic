import { useMemo, useState, type ReactNode } from 'react';
import { fetchClients } from '../api/clients';
import { FieldValue } from '../components/common/FieldValue';
import { Pagination } from '../components/common/Pagination';
import { ViewToolbar, type ToolbarFilters } from '../components/common/ViewToolbar';
import { useNavigation } from '../contexts/NavigationContext';
import { useApiData } from '../hooks/useApiData';
import { usePagination } from '../hooks/usePagination';
import type { ClientListItem } from '../types';
import { formatBirthDate } from '../utils/format';

type ColumnKey = keyof ClientListItem;

const clientColumns: ReadonlyArray<{ key: ColumnKey; label: string }> = [
  { key: 'code', label: 'Codice Cliente' },
  { key: 'name', label: 'Nome' },
  { key: 'surname', label: 'Cognome' },
  { key: 'fiscalCode', label: 'Codice Fiscale' },
  { key: 'birthDate', label: 'Data Nascita' },
  { key: 'birthPlace', label: 'Comune Nascita' },
  { key: 'address', label: 'Indirizzo' },
  { key: 'city', label: 'Città' },
  { key: 'province', label: 'Provincia' },
  { key: 'phone', label: 'Telefono' },
];

// Columns offered as filters and included in free-text search. birthDate is
// excluded: an equality dropdown over dates is not useful, and its stored ISO
// value would not match the formatted text shown in the cell.
const filterColumns = clientColumns.filter((column) => column.key !== 'birthDate');

export function ClientsView() {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<ToolbarFilters>({});
  const { data, loading, error } = useApiData(() => fetchClients(), []);

  const clients = useMemo(() => data ?? [], [data]);

  const filterOptions = useMemo(
    () =>
      filterColumns.map((column) => ({
        key: column.key,
        label: column.label,
        options: getUniqueValues(clients.map((client) => String(client[column.key]))),
      })),
    [clients],
  );

  const filteredClients = useMemo(
    () => filterClients(clients, searchValue, activeFilters),
    [clients, searchValue, activeFilters],
  );

  const { pageItems, page, totalPages, totalItems, rangeStart, rangeEnd, setPage } =
    usePagination(filteredClients);

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="font-headline-lg text-headline-lg font-bold text-primary">Clienti</h2>
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
              {clientColumns.map((column) => (
                <th
                  key={column.key}
                  className="py-3 px-6 uppercase font-bold tracking-wider whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <ClientsTableBody
              clients={pageItems}
              loading={loading}
              error={error}
              columnCount={clientColumns.length}
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

function ClientsTableBody({
  clients,
  loading,
  error,
  columnCount,
}: {
  clients: ClientListItem[];
  loading: boolean;
  error: string | null;
  columnCount: number;
}) {
  if (loading) {
    return <MessageRow columnCount={columnCount}>Caricamento clienti...</MessageRow>;
  }
  if (error) {
    return (
      <MessageRow columnCount={columnCount} tone="error">
        {error}
      </MessageRow>
    );
  }
  if (clients.length === 0) {
    return <MessageRow columnCount={columnCount}>Nessun cliente trovato.</MessageRow>;
  }
  return (
    <>
      {clients.map((client) => (
        <ClientRow key={client.code} client={client} />
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

function ClientRow({ client }: { client: ClientListItem }) {
  const { openClientDetail } = useNavigation();

  return (
    <tr
      onClick={() => openClientDetail(client.code)}
      className="border-b border-surface-variant h-row-height hover:bg-surface-container-lowest/50 transition-colors cursor-pointer"
    >
      {clientColumns.map((column) => (
        <td key={column.key} className={cellClassName(column.key)}>
          <FieldValue value={renderCell(column.key, client[column.key])} />
        </td>
      ))}
    </tr>
  );
}

function renderCell(key: ColumnKey, value: string): string {
  return key === 'birthDate' ? formatBirthDate(value) : value;
}

function cellClassName(key: ColumnKey): string {
  const base = 'px-6 whitespace-nowrap';
  if (key === 'code') return `${base} text-primary font-medium hover:underline`;
  if (key === 'name' || key === 'surname') return base;
  return `${base} text-on-surface-variant`;
}

function filterClients(clientList: ClientListItem[], searchValue: string, activeFilters: ToolbarFilters) {
  const searchTerm = normalize(searchValue);

  return clientList.filter((client) => {
    const matchesSearch =
      searchTerm.length === 0 ||
      filterColumns.some((column) => normalize(String(client[column.key])).includes(searchTerm));
    const matchesFilters = filterColumns.every((column) => {
      const activeValue = activeFilters[column.key];
      return !activeValue || String(client[column.key]) === activeValue;
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
