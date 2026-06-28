import { useEffect } from 'react';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityCreatePageHeader } from '../../../shared/entity/EntityPageHeader';
import { ClientDataSections } from '../components/ClientDataSections';
import { CLIENT_CREATE_REQUIRED } from '../components/clientFields';
import { useClientDoctorAutocomplete } from '../components/useClientDoctorAutocomplete';
import { useClientMunicipalityAutocomplete } from '../components/useClientMunicipalityAutocomplete';
import type { Client } from '../types';

export function ClientCreateView() {
  const { navigate } = useNavigation();
  const { editing, mode, editTarget, clientDraft, invalidFields, startClientCreate, setClientField } =
    useEntityEdit();

  const isCreatingClient = editing && mode === 'create' && editTarget?.type === 'client';

  useEffect(() => {
    if (!isCreatingClient) startClientCreate(CLIENT_CREATE_REQUIRED);
  }, [isCreatingClient, startClientCreate]);

  const municipalityFields = useClientMunicipalityAutocomplete(setClientField, true);
  const doctorFields = useClientDoctorAutocomplete(true);

  if (!isCreatingClient || !clientDraft) return null;

  const invalidKeys = invalidFields as Array<keyof Client>;

  return (
    <EntityDetailLayout
      header={
        <EntityCreatePageHeader
          backLabel="Torna ai clienti"
          listLabel="Clienti"
          title="Nuovo Cliente"
          onBack={() => navigate('clients')}
        />
      }
    >
      <ClientDataSections
        data={clientDraft}
        editing
        onChange={setClientField}
        invalidKeys={invalidKeys}
        autocompleteFields={{ ...municipalityFields, ...doctorFields }}
        create
      />
    </EntityDetailLayout>
  );
}
