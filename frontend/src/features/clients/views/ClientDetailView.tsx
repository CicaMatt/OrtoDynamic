import { fetchClient } from '../api/clients';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { ClientPageHeader } from '../components/ClientPageHeader';
import { ClientDataSections } from '../components/ClientDataSections';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useEntityDetail } from '../../../app/editing/useEntityDetail';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { useClientMunicipalityAutocomplete } from '../components/useClientMunicipalityAutocomplete';

const clientActions = [
  { id: 'edit', icon: 'edit', label: 'Modifica Dati Cliente' },
  { id: 'quote', icon: 'request_quote', label: 'Inserisci Preventivo' },
  { id: 'privacy', icon: 'privacy_tip', label: 'Genera Modulo Privacy' },
];

export function ClientDetailView() {
  const { selectedClientCode, navigate } = useNavigation();
  const { clientDraft, startClientEdit, seedClient, setClientField } = useEntityEdit();

  const { data, loading, error, isEditing } = useEntityDetail({
    type: 'client',
    selectedId: selectedClientCode,
    fetcher: fetchClient,
    missingMessage: 'Nessun cliente selezionato.',
    draft: clientDraft,
    seed: seedClient,
  });

  const municipalityFields = useClientMunicipalityAutocomplete(setClientField, isEditing);

  if (loading) {
    return (
      <StatusMessage onBack={() => navigate('clients')} backLabel="Torna ai clienti">
        Caricamento cliente...
      </StatusMessage>
    );
  }
  if (error || !data) {
    return (
      <StatusMessage onBack={() => navigate('clients')} backLabel="Torna ai clienti" tone="error">
        {error ?? 'Nessun cliente selezionato.'}
      </StatusMessage>
    );
  }

  const actions = clientActions.map((action) => ({
    ...action,
    active: isEditing && action.id === 'edit',
    onClick: action.id === 'edit' && !isEditing ? () => startClientEdit(data.code) : undefined,
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
        editing={isEditing}
        onChange={setClientField}
        autocompleteFields={municipalityFields}
      />
    </EntityDetailLayout>
  );
}
