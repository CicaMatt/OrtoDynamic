import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityCreatePageHeader } from '../../../shared/entity/EntityPageHeader';
import { ClientDataSections } from '../components/ClientDataSections';
import { useClientDoctorAutocomplete } from '../components/useClientDoctorAutocomplete';
import { useClientMunicipalityAutocomplete } from '../components/useClientMunicipalityAutocomplete';
import { useClientEditor } from '../useClientEditor';

export function ClientCreateView() {
  const { navigate } = useNavigation();
  const { draft, invalidFields, change } = useClientEditor();
  const municipalityFields = useClientMunicipalityAutocomplete(change, true);
  const doctorFields = useClientDoctorAutocomplete(true);

  if (!draft) throw new Error('Client create route requires an active create session.');

  return (
    <EntityDetailLayout
      header={
        <EntityCreatePageHeader
          backLabel="Torna ai clienti"
          listLabel="Clienti"
          title="Nuovo Cliente"
          onBack={() => navigate({ name: 'clients' })}
        />
      }
    >
      <ClientDataSections
        data={draft}
        editing
        onChange={change}
        invalidKeys={invalidFields}
        autocompleteFields={{ ...municipalityFields, ...doctorFields }}
        create
      />
    </EntityDetailLayout>
  );
}
