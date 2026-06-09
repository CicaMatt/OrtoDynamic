import { useEffect } from 'react';
import { fetchClient } from '../api/clients';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { ClientPageHeader } from '../components/ClientPageHeader';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import { NoteCard } from '../../../shared/entity/NoteCard';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { useApiData } from '../../../shared/hooks/useApiData';
import type { Client } from '../types';
import { formatBirthDate, formatGender } from '../../../shared/format/format';
import type { FieldConfig } from '../../../shared/entity/DataCard';

type ClientField = FieldConfig<Client>;

const personalFields: ClientField[] = [
  { label: 'Nome', key: 'name' },
  { label: 'Cognome', key: 'surname' },
  { label: 'Codice fiscale', key: 'fiscalCode' },
  { label: 'Sesso', key: 'gender', type: 'gender' },
  { label: 'Comune Nascita', key: 'birthMunicipality' },
  { label: 'Data nascita', key: 'birthDate', type: 'date' },
];

const addressFields: ClientField[] = [
  { label: 'Indirizzo', key: 'address' },
  { label: 'Citta', key: 'city' },
  { label: 'CAP', key: 'postalCode' },
  { label: 'Nazione', key: 'country' },
];

const contactFields: ClientField[] = [
  { label: 'Numero telefono', key: 'phone' },
  { label: 'Numero cellulare', key: 'mobile' },
  { label: 'Email', key: 'email' },
  { label: 'Distretto appartenenza', key: 'district' },
  { label: 'ID Medico', key: 'doctorId', type: 'number' },
];

const clientActions = [
  { id: 'edit', icon: 'edit', label: 'Modifica Dati Cliente' },
  { id: 'quote', icon: 'request_quote', label: 'Inserisci Preventivo' },
  { id: 'privacy', icon: 'privacy_tip', label: 'Genera Modulo Privacy' },
];

function displayClientValue(field: ClientField, raw: string): string {
  if (field.type === 'gender') return formatGender(raw);
  if (field.type === 'date') return formatBirthDate(raw);
  return raw;
}

export function ClientDetailView() {
  const { selectedClientCode, navigate } = useNavigation();
  const {
    editing,
    editTarget,
    clientDraft,
    dataVersion,
    startClientEdit,
    seedClient,
    setClientField,
  } = useEntityEdit();
  const isEditingClient = editing && editTarget?.type === 'client' && editTarget.id === selectedClientCode;

  const { data: client, loading, error } = useApiData(
    () =>
      selectedClientCode
        ? fetchClient(selectedClientCode)
        : Promise.reject(new Error('Nessun cliente selezionato.')),
    [selectedClientCode, dataVersion],
  );

  useEffect(() => {
    if (isEditingClient && client) seedClient(client);
  }, [isEditingClient, client, seedClient]);

  if (loading) {
    return (
      <StatusMessage onBack={() => navigate('clients')} backLabel="Torna ai clienti">
        Caricamento cliente...
      </StatusMessage>
    );
  }
  if (error || !client) {
    return (
      <StatusMessage onBack={() => navigate('clients')} backLabel="Torna ai clienti" tone="error">
        {error ?? 'Nessun cliente selezionato.'}
      </StatusMessage>
    );
  }

  const data = isEditingClient && clientDraft ? clientDraft : client;
  const actions = clientActions.map((action) => ({
    ...action,
    active: isEditingClient && action.id === 'edit',
    onClick: action.id === 'edit' && !isEditingClient ? () => startClientEdit(data.code) : undefined,
  }));

  return (
    <EntityDetailLayout
      header={
        <ClientPageHeader
          back={{ label: 'Torna indietro', onClick: () => navigate('clients') }}
          crumbs={[
            { label: 'Clienti', onClick: () => navigate('clients') },
            { label: 'Dettaglio' },
          ]}
          name={data.name}
          surname={data.surname}
          code={data.code}
        />
      }
      actionsTitle="Azioni cliente"
      actions={actions}
    >
      <FieldSectionCard
        icon="person"
        title="Dati Anagrafici"
        data={data}
        fields={personalFields}
        editing={isEditingClient}
        onChange={setClientField}
        format={displayClientValue}
      />

      <div className="grid grid-cols-2 gap-[28px] mt-[28px]">
        <FieldSectionCard
          icon="home_pin"
          title="Residenza"
          data={data}
          fields={addressFields}
          columns={2}
          editing={isEditingClient}
          onChange={setClientField}
          className="min-h-[300px]"
        />
        <FieldSectionCard
          icon="contact_phone"
          title="Contatti e Distretto"
          data={data}
          fields={contactFields}
          columns={2}
          editing={isEditingClient}
          onChange={setClientField}
          className="min-h-[300px]"
        />
      </div>

      <div className="mt-[28px]">
        <NoteCard
          value={data.note}
          editing={isEditingClient}
          onChange={(value) => setClientField('note', value)}
        />
      </div>
    </EntityDetailLayout>
  );
}
