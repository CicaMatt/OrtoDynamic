import { useNavigation } from '../../../app/navigation/NavigationContext';
import { useEntityEditor } from '../../../app/editing/EntityEditContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityCreatePageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/EntityFields';
import { healthCompanyCreateFields } from '../components/healthCompanyFields';

export function HealthCompanyCreateView() {
  const { navigate } = useNavigation();
  const { draft, invalidFields, change } = useEntityEditor('healthCompany');
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
