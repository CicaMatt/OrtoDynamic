import { useEffect } from 'react';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityPageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import { useApiData } from '../../../shared/hooks/useApiData';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { fetchHealthCompany } from '../api/healthCompanies';
import { healthCompanyFields } from '../components/healthCompanyFields';

const healthCompanyActions = [
  { id: 'edit', icon: 'edit', label: 'Modifica Dati Azienda' },
];

export function HealthCompanyDetailView() {
  const { selectedHealthCompanyId, navigate } = useNavigation();
  const {
    editing,
    editTarget,
    healthCompanyDraft,
    dataVersion,
    startHealthCompanyEdit,
    seedHealthCompany,
    setHealthCompanyField,
  } = useEntityEdit();

  const isEditingHealthCompany =
    editing && editTarget?.type === 'healthCompany' && editTarget.id === selectedHealthCompanyId;

  const { data: company, loading, error } = useApiData(
    () =>
      selectedHealthCompanyId
        ? fetchHealthCompany(selectedHealthCompanyId)
        : Promise.reject(new Error('Nessuna azienda sanitaria selezionata.')),
    [selectedHealthCompanyId, dataVersion],
  );

  useEffect(() => {
    if (isEditingHealthCompany && company) seedHealthCompany(company);
  }, [isEditingHealthCompany, company, seedHealthCompany]);

  if (loading) {
    return (
      <StatusMessage onBack={() => navigate('health-companies')} backLabel="Torna alle aziende sanitarie">
        Caricamento azienda sanitaria...
      </StatusMessage>
    );
  }
  if (error || !company) {
    return (
      <StatusMessage
        onBack={() => navigate('health-companies')}
        backLabel="Torna alle aziende sanitarie"
        tone="error"
      >
        {error ?? 'Nessuna azienda sanitaria selezionata.'}
      </StatusMessage>
    );
  }

  const data = isEditingHealthCompany && healthCompanyDraft ? healthCompanyDraft : company;
  const title = data.companyName || data.municipality || `Azienda sanitaria ${data.id}`;
  const actions = healthCompanyActions.map((action) => ({
    ...action,
    active: isEditingHealthCompany,
    onClick: !isEditingHealthCompany ? () => startHealthCompanyEdit(data.id) : undefined,
  }));

  return (
    <EntityDetailLayout
      header={
        <EntityPageHeader
          back={{ label: 'Torna indietro', onClick: () => navigate('health-companies') }}
          crumbs={[
            { label: 'Aziende Sanitarie', onClick: () => navigate('health-companies') },
            { label: 'Dettaglio' },
          ]}
          title={title}
          subtitle={
            <>
              ID: <span className="font-semibold text-on-surface">{data.id}</span>
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
        editing={isEditingHealthCompany}
        onChange={setHealthCompanyField}
      />
    </EntityDetailLayout>
  );
}
