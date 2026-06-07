import { useMemo, useState } from 'react';
import { ViewToolbar, type ToolbarFilters } from '../components/common/ViewToolbar';
import { useNavigation } from '../contexts/NavigationContext';
import { clients } from '../data/clients';
import type { Client } from '../types';

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

  const filterOptions = useMemo(
    () =>
      clientFilterColumns.map((column) => ({
        ...column,
        options: getUniqueValues(clients.map((client) => String(client[column.key]))),
      })),
    [],
  );

  const filteredClients = useMemo(
    () => filterClients(clients, searchValue, activeFilters),
    [searchValue, activeFilters],
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
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => <ClientRow key={client.code} client={client} />)
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-on-surface-variant">
                  Nessun cliente trovato.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ClientRow({ client }: { client: Client }) {
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

function filterClients(clientList: Client[], searchValue: string, activeFilters: ToolbarFilters) {
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
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, 'it'));
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}
