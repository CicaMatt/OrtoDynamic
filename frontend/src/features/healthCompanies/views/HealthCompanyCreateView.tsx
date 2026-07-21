import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityCreatePageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import { healthCompanyCreateFields } from '../components/healthCompanyFields';
import { useHealthCompanyEditor } from '../useHealthCompanyEditor';

export function HealthCompanyCreateView() {
  const { navigate } = useNavigation();
  const { draft, invalidFields, change } = useHealthCompanyEditor();
  if (!draft) throw new Error('Health-company create route requires an active create session.');

  return (
    <EntityDetailLayout
      header={
        <EntityCreatePageHeader
          backLabel="Torna alle aziende sanitarie"
          listLabel="Aziende Sanitarie"
          title="Nuova Azienda Sanitaria"
          onBack={() => navigate({ name: 'health-companies' })}
        />
      }
    >
      <FieldSectionCard
        icon="local_hospital"
        title="Dati Azienda Sanitaria"
        data={draft}
        fields={healthCompanyCreateFields}
        editing
        onChange={change}
        invalidKeys={invalidFields}
      />
    </EntityDetailLayout>
  );
}
