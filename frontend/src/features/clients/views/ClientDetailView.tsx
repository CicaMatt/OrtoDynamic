import { fetchClient, fetchClientPrivacyForm } from '../api/clients';
import { fetchDoctor } from '../../doctors/api/doctors';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { ClientPageHeader } from '../components/ClientPageHeader';
import { ClientDataSections } from '../components/ClientDataSections';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { Icon } from '../../../shared/ui/Icon';
import { useInlineDocument } from '../../../shared/files/useInlineDocument';
import { useApiData } from '../../../shared/hooks/useApiData';
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
  const { selectedClientCode, navigate, goBack } = useNavigation();
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
  const { generating, error: docError, clearError, open: openDocument } = useInlineDocument<'privacy'>();
  const doctorId = data?.doctorId?.trim() ?? '';
  const { data: doctor } = useApiData(
    () => (doctorId ? fetchDoctor(doctorId) : Promise.resolve(null)),
    [doctorId],
  );
  const doctorName = doctor ? `${doctor.name} ${doctor.surname}`.trim() : '';

  if (loading) {
    return (
      <StatusMessage onBack={() => goBack('clients')} backLabel="Torna ai clienti">
        Caricamento cliente...
      </StatusMessage>
    );
  }
  if (error || !data) {
    return (
      <StatusMessage onBack={() => goBack('clients')} backLabel="Torna ai clienti" tone="error">
        {error ?? 'Nessun cliente selezionato.'}
      </StatusMessage>
    );
  }

  const actions = clientActions.map((action) => {
    if (action.id === 'edit') {
      return {
        ...action,
        active: isEditing,
        onClick: !isEditing ? () => startClientEdit(data.code) : undefined,
      };
    }
    if (action.id === 'privacy') {
      return {
        ...action,
        label: generating === 'privacy' ? 'Generazione modulo…' : action.label,
        onClick:
          !isEditing && !generating
            ? () => openDocument('privacy', () => fetchClientPrivacyForm(data.code))
            : undefined,
      };
    }
    return action;
  });

  return (
    <EntityDetailLayout
      header={
        <ClientPageHeader
          back={{ label: 'Torna indietro', onClick: () => goBack('clients') }}
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
      {docError && (
        <div
          role="alert"
          className="mb-[28px] flex items-start justify-between gap-3 rounded-[10px] border border-error bg-error/10 px-[20px] py-[14px]"
        >
          <span className="font-body-sm text-body-sm text-error">{docError}</span>
          <button
            type="button"
            onClick={clearError}
            aria-label="Chiudi"
            className="text-error/70 hover:text-error"
          >
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
      )}
      <ClientDataSections
        data={data}
        editing={isEditing}
        onChange={setClientField}
        doctorName={doctorName}
        autocompleteFields={municipalityFields}
      />
    </EntityDetailLayout>
  );
}
