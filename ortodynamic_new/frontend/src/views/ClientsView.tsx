import { useMemo, useState, type ReactNode } from 'react';
import { fetchClients } from '../api/clients';
import { ViewToolbar, type ToolbarFilters } from '../components/common/ViewToolbar';
import { useNavigation } from '../contexts/NavigationContext';
import { useApiData } from '../hooks/useApiData';
import type { ClientListItem } from '../types';

const columns = ['Codice', 'Nome', 'Cognome', 'Codice Fiscale', 'Numero Telefono', 'Email'] as const;
const clientFilterColumns = [
  { key: 'code', label: 'Codice' },
  { key: 'name', label: 'Nome' },
  { key: 'surname', label: 'Cognome' },
  { key: 'fiscalCode', label: 'Codice Fiscale' },
  { key: 'phone', label: 'Numero Telefono' },
  { key: 'email', label: 'Email' },
] as const;

export function ClientsView() {
  const [searchValue, setSearchValue] = useState('');
  const [activeFilters, setActiveFilters] = useState<ToolbarFilters>({});
  const { data, loading, error } = useApiData(() => fetchClients(), []);

  const clients = useMemo(() => data ?? [], [data]);

  const filterOptions = useMemo(
    () =>
      clientFilterColumns.map((column) => ({
        ...column,
        options: getUniqueValues(clients.map((client) => String(client[column.key]))),
      })),
    [clients],
  );

  const filteredClients = useMemo(
    () => filterClients(clients, searchValue, activeFilters),
    [clients, searchValue, activeFilters],
  );

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

      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left font-body-md text-body-md">
          <thead className="bg-surface-container-low font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  className="py-3 px-6 uppercase font-bold tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <ClientsTableBody
              clients={filteredClients}
              loading={loading}
              error={error}
              columnCount={columns.length}
            />
          </tbody>
        </table>
      </div>
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
      <td className="px-6 text-primary font-medium hover:underline">{client.code}</td>
      <td className="px-6">{client.name}</td>
      <td className="px-6">{client.surname}</td>
      <td className="px-6 text-on-surface-variant">{client.fiscalCode}</td>
      <td className="px-6 text-on-surface-variant">{client.phone}</td>
      <td className="px-6 text-on-surface-variant">{client.email}</td>
    </tr>
  );
}

function filterClients(clientList: ClientListItem[], searchValue: string, activeFilters: ToolbarFilters) {
  const searchTerm = normalize(searchValue);

  return clientList.filter((client) => {
    const searchableValues = [
      client.code,
      client.name,
      client.surname,
      client.fiscalCode,
      client.phone,
      client.email,
    ];
    const matchesSearch =
      searchTerm.length === 0 || searchableValues.some((value) => normalize(value).includes(searchTerm));
    const matchesFilters = clientFilterColumns.every((column) => {
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
