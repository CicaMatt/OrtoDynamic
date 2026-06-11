import { useEffect } from 'react';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityCreatePageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import {
  HEALTH_COMPANY_CREATE_REQUIRED,
  healthCompanyCreateFields,
} from '../components/healthCompanyFields';
import type { HealthCompany } from '../types';

export function HealthCompanyCreateView() {
  const {
    editing,
    mode,
    editTarget,
    healthCompanyDraft,
    invalidFields,
    startHealthCompanyCreate,
    setHealthCompanyField,
  } = useEntityEdit();
  const { navigate } = useNavigation();

  const isCreating = editing && mode === 'create' && editTarget?.type === 'healthCompany';

  useEffect(() => {
    if (!isCreating) startHealthCompanyCreate(HEALTH_COMPANY_CREATE_REQUIRED);
  }, [isCreating, startHealthCompanyCreate]);

  if (!isCreating || !healthCompanyDraft) return null;

  const invalidKeys = invalidFields as Array<keyof HealthCompany>;

  return (
    <EntityDetailLayout
      header={
        <EntityCreatePageHeader
          backLabel="Torna alle aziende sanitarie"
          listLabel="Aziende Sanitarie"
          title="Nuova Azienda Sanitaria"
          onBack={() => navigate('health-companies')}
        />
      }
    >
      <FieldSectionCard
        icon="local_hospital"
        title="Dati Azienda Sanitaria"
        data={healthCompanyDraft}
        fields={healthCompanyCreateFields}
        editing
        onChange={setHealthCompanyField}
        invalidKeys={invalidKeys}
      />
    </EntityDetailLayout>
  );
}
