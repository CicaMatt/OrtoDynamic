import { useEffect } from 'react';
import { fetchClient } from '../api/clients';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { ClientPageHeader } from '../components/ClientPageHeader';
import { ClientDataSections } from '../components/ClientDataSections';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { useApiData } from '../../../shared/hooks/useApiData';
import { useClientMunicipalityAutocomplete } from '../components/useClientMunicipalityAutocomplete';

const clientActions = [
  { id: 'edit', icon: 'edit', label: 'Modifica Dati Cliente' },
  { id: 'quote', icon: 'request_quote', label: 'Inserisci Preventivo' },
  { id: 'privacy', icon: 'privacy_tip', label: 'Genera Modulo Privacy' },
];

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

  const municipalityFields = useClientMunicipalityAutocomplete(setClientField, isEditingClient);

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
          client={data}
        />
      }
      actionsTitle="Azioni cliente"
      actions={actions}
    >
      <ClientDataSections
        data={data}
        editing={isEditingClient}
        onChange={setClientField}
        autocompleteFields={municipalityFields}
      />
    </EntityDetailLayout>
  );
}
