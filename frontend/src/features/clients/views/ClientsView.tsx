import { fetchClients } from '../api/clients';
import { EntityListView, type EntityColumn } from '../../../shared/entity/EntityListView';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import type { ClientListItem } from '../types';
import { formatBirthDate } from '../../../shared/format/format';

const clientColumns: ReadonlyArray<EntityColumn<ClientListItem>> = [
  { key: 'idClient', label: 'ID Cliente', primary: true, filterable: false },
  { key: 'name', label: 'Nome' },
  { key: 'surname', label: 'Cognome' },
  { key: 'fiscalCode', label: 'Codice Fiscale', muted: true },
  {
    key: 'birthDate',
    label: 'Data Nascita',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  { key: 'birthMunicipality', label: 'Comune Nascita', muted: true },
  { key: 'address', label: 'Indirizzo', muted: true },
  { key: 'city', label: 'Citta', muted: true },
  { key: 'province', label: 'Provincia', muted: true },
  { key: 'phone', label: 'Telefono', muted: true },
];

export function ClientsView() {
  const { openClientDetail, openClientCreate } = useNavigation();

  return (
    <EntityListView
      title="Clienti"
      columns={clientColumns}
      fetchItems={fetchClients}
      rowKey={(client) => client.idClient}
      onRowClick={(client) => openClientDetail(client.idClient)}
      onCreate={openClientCreate}
      loadingLabel="Caricamento clienti..."
      emptyLabel="Nessun cliente trovato."
    />
  );
}
