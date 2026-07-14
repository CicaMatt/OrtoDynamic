import { useState } from 'react';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useEntityDetail } from '../../../app/editing/useEntityDetail';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { DeleteConfirmationDialog } from '../../../shared/entity/DeleteConfirmationDialog';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityPageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { deleteHealthCompany, fetchHealthCompany } from '../api/healthCompanies';
import { healthCompanyFields } from '../components/healthCompanyFields';

const healthCompanyActions = [
  { id: 'edit', icon: 'edit', label: 'Modifica Dati Azienda' },
  { id: 'delete', icon: 'delete', label: 'Elimina Azienda', tone: 'danger' as const },
];

export function HealthCompanyDetailView() {
  const { selectedHealthCompanyId, navigate, goBack } = useNavigation();
  const { healthCompanyDraft, startHealthCompanyEdit, seedHealthCompany, setHealthCompanyField } =
    useEntityEdit();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, loading, error, isEditing } = useEntityDetail({
    type: 'healthCompany',
    selectedId: selectedHealthCompanyId,
    fetcher: fetchHealthCompany,
    missingMessage: 'Nessuna azienda sanitaria selezionata.',
    draft: healthCompanyDraft,
    seed: seedHealthCompany,
  });

  if (loading) {
    return (
      <StatusMessage onBack={() => goBack('health-companies')} backLabel="Torna alle aziende sanitarie">
        Caricamento azienda sanitaria...
      </StatusMessage>
    );
  }
  if (error || !data) {
    return (
      <StatusMessage
        onBack={() => goBack('health-companies')}
        backLabel="Torna alle aziende sanitarie"
        tone="error"
      >
        {error ?? 'Nessuna azienda sanitaria selezionata.'}
      </StatusMessage>
    );
  }

  const title =  data.municipality || data.companyName || `Azienda sanitaria ${data.idHealthCompany}`;
  const actions = healthCompanyActions.map((action) => {
    if (action.id === 'edit') {
      return {
        ...action,
        active: isEditing,
        onClick: !isEditing ? () => startHealthCompanyEdit(data.idHealthCompany) : undefined,
      };
    }
    return {
      ...action,
      onClick: !isEditing ? () => setDeleteDialogOpen(true) : undefined,
    };
  });

  return (
    <>
      <EntityDetailLayout
        header={
          <EntityPageHeader
            back={{ label: 'Torna indietro', onClick: () => goBack('health-companies') }}
            crumbs={[
              { label: 'Aziende Sanitarie', onClick: () => navigate('health-companies') },
              { label: 'Dettaglio' },
            ]}
            title={title}
            subtitle={
              <>
                ID: <span className="font-semibold text-on-surface">{data.idHealthCompany}</span>
              </>
            }
          />
        }
        actionsTitle="Azioni azienda"
        actions={actions}
      >
        <FieldSectionCard
          icon="local_hospital"
          title="Dati Azienda Sanitaria"
          data={data}
          fields={healthCompanyFields}
          editing={isEditing}
          onChange={setHealthCompanyField}
        />
      </EntityDetailLayout>

      {deleteDialogOpen && (
        <DeleteConfirmationDialog
          title="Elimina Azienda"
          message={`Confermi l'eliminazione dell'azienda sanitaria ${title}?`}
          confirmLabel="Elimina Azienda"
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={async () => {
            await deleteHealthCompany(data.idHealthCompany);
            navigate('health-companies');
          }}
        />
      )}
    </>
  );
}
