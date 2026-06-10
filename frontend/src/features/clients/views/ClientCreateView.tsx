import { useEffect } from 'react';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityPageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import { NoteCard } from '../../../shared/entity/NoteCard';
import {
  CLIENT_CREATE_REQUIRED,
  addressFields,
  contactFields,
  displayClientValue,
  markRequired,
  personalFields,
} from '../components/clientFields';
import type { Client } from '../types';

const personalCreateFields = markRequired(personalFields, CLIENT_CREATE_REQUIRED);
const addressCreateFields = markRequired(addressFields, CLIENT_CREATE_REQUIRED);
const contactCreateFields = markRequired(contactFields, CLIENT_CREATE_REQUIRED);

export function ClientCreateView() {
  const { navigate } = useNavigation();
  const { editing, mode, editTarget, clientDraft, invalidFields, startClientCreate, setClientField } =
    useEntityEdit();

  const isCreatingClient = editing && mode === 'create' && editTarget?.type === 'client';

  useEffect(() => {
    if (!isCreatingClient) startClientCreate(CLIENT_CREATE_REQUIRED);
  }, [isCreatingClient, startClientCreate]);

  if (!isCreatingClient || !clientDraft) return null;

  const invalidKeys = invalidFields as Array<keyof Client>;

  return (
    <EntityDetailLayout
      header={
        <EntityPageHeader
          back={{ label: 'Torna ai clienti', onClick: () => navigate('clients') }}
          crumbs={[{ label: 'Clienti', onClick: () => navigate('clients') }, { label: 'Nuovo' }]}
          title="Nuovo Cliente"
          subtitle={<>I campi contrassegnati con * sono obbligatori.</>}
        />
      }
    >
      <FieldSectionCard
        icon="person"
        title="Dati Anagrafici"
        data={clientDraft}
        fields={personalCreateFields}
        editing
        onChange={setClientField}
        format={displayClientValue}
        invalidKeys={invalidKeys}
      />

      <div className="grid grid-cols-2 gap-[28px] mt-[28px]">
        <FieldSectionCard
          icon="home_pin"
          title="Residenza"
          data={clientDraft}
          fields={addressCreateFields}
          columns={2}
          editing
          onChange={setClientField}
          invalidKeys={invalidKeys}
          className="min-h-[300px]"
        />
        <FieldSectionCard
          icon="contact_phone"
          title="Contatti e Distretto"
          data={clientDraft}
          fields={contactCreateFields}
          columns={2}
          editing
          onChange={setClientField}
          invalidKeys={invalidKeys}
          className="min-h-[300px]"
        />
      </div>

      <div className="mt-[28px]">
        <NoteCard
          value={clientDraft.note}
          editing
          onChange={(value) => setClientField('note', value)}
        />
      </div>
    </EntityDetailLayout>
  );
}
