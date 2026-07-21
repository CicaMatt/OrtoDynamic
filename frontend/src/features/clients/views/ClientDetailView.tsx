import { useState } from 'react';
import { deleteClient, fetchClient, fetchClientPrivacyForm } from '../api/clients';
import { fetchDoctor } from '../../doctors/api/doctors';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { DeleteConfirmationDialog } from '../../../shared/entity/DeleteConfirmationDialog';
import { ClientPageHeader } from '../components/ClientPageHeader';
import { ClientDataSections } from '../components/ClientDataSections';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { DocumentErrorAlert, documentActionState } from '../../../shared/files/DocumentActions';
import { useInlineDocument } from '../../../shared/files/useInlineDocument';
import { useApiData } from '../../../shared/hooks/useApiData';
import { useEntityDetail } from '../../../app/editing/useEntityDetail';
import { useNavigation, useRoute } from '../../../app/navigation/NavigationContext';
import { useClientDoctorAutocomplete } from '../components/useClientDoctorAutocomplete';
import { useClientMunicipalityAutocomplete } from '../components/useClientMunicipalityAutocomplete';
import { useClientEditor } from '../useClientEditor';

const clientActions = [
  { id: 'edit', icon: 'edit', label: 'Modifica Dati Cliente' },
  { id: 'quote', icon: 'request_quote', label: 'Inserisci Preventivo' },
  { id: 'privacy', icon: 'privacy_tip', label: 'Genera Modulo Privacy' },
  { id: 'delete', icon: 'delete', label: 'Elimina Cliente', tone: 'danger' as const },
];

export function ClientDetailView() {
  const { clientId } = useRoute('client-detail');
  const { navigate, back } = useNavigation();
  const { draft, startEdit, seed, change } = useClientEditor();

  const { data, loading, error, isEditing } = useEntityDetail({
    type: 'client',
    selectedId: clientId,
    fetcher: fetchClient,
    missingMessage: 'Nessun cliente selezionato.',
    draft,
    seed,
  });

  const municipalityFields = useClientMunicipalityAutocomplete(change, isEditing);
  const doctorFields = useClientDoctorAutocomplete(isEditing);
  const {
    generating,
    error: docError,
    clearError,
    open: openDocument,
  } = useInlineDocument<'privacy'>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const doctorId = data?.doctorId?.trim() ?? '';
  const { data: doctor } = useApiData(
    () => (doctorId ? fetchDoctor(doctorId) : Promise.resolve(null)),
    [doctorId],
  );
  const doctorName = doctor ? `${doctor.name} ${doctor.surname}`.trim() : '';

  if (loading) {
    return (
      <StatusMessage onBack={() => back({ name: 'clients' })} backLabel="Torna ai clienti">
        Caricamento cliente...
      </StatusMessage>
    );
  }
  if (error || !data) {
    return (
      <StatusMessage
        onBack={() => back({ name: 'clients' })}
        backLabel="Torna ai clienti"
        tone="error"
      >
        {error ?? 'Nessun cliente selezionato.'}
      </StatusMessage>
    );
  }

  const actions = clientActions.map((action) => {
    if (action.id === 'edit') {
      return {
        ...action,
        active: isEditing,
        onClick: !isEditing ? () => startEdit(data.idClient) : undefined,
      };
    }
    if (action.id === 'privacy') {
      const documentState = documentActionState({
        generating,
        kind: 'privacy',
        idleLabel: action.label,
        busyLabel: 'Generazione modulo…',
        disabled: isEditing,
      });
      return {
        ...action,
        label: documentState.label,
        onClick: !documentState.disabled
          ? () => openDocument('privacy', () => fetchClientPrivacyForm(data.idClient))
          : undefined,
      };
    }
    if (action.id === 'delete') {
      return {
        ...action,
        onClick: !isEditing && !generating ? () => setDeleteDialogOpen(true) : undefined,
      };
    }
    return action;
  });

  return (
    <>
      <EntityDetailLayout
        header={
          <ClientPageHeader
            back={{ label: 'Torna indietro', onClick: () => back({ name: 'clients' }) }}
            crumbs={[
              { label: 'Clienti', onClick: () => navigate({ name: 'clients' }) },
              { label: 'Dettaglio' },
            ]}
            client={data}
          />
        }
        actionsTitle="Azioni cliente"
        actions={actions}
      >
        {docError && (
          <DocumentErrorAlert error={docError} onClose={clearError} className="mb-[28px]" />
        )}
        <ClientDataSections
          data={data}
          editing={isEditing}
          onChange={change}
          doctorName={doctorName}
          autocompleteFields={{ ...municipalityFields, ...doctorFields }}
        />
      </EntityDetailLayout>

      {deleteDialogOpen && (
        <DeleteConfirmationDialog
          title="Elimina Cliente"
          message={`Confermi l'eliminazione del cliente ${data.surname} ${data.name}?`}
          confirmLabel="Elimina Cliente"
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={async () => {
            await deleteClient(data.idClient);
            navigate({ name: 'clients' });
          }}
        />
      )}
    </>
  );
}
