import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import type { AutocompleteFieldConfig } from '../../../shared/entity/DataCard';
import { NoteCard } from '../../../shared/entity/NoteCard';
import type { Client } from '../types';
import {
  clientCreateFieldGroups,
  clientFieldGroups,
} from './clientFields';

type ClientDataSectionsProps = {
  data: Client;
  editing: boolean;
  create?: boolean;
  invalidKeys?: ReadonlyArray<keyof Client>;
  autocompleteFields?: Partial<Record<keyof Client, AutocompleteFieldConfig>>;
  onChange: (key: keyof Client, value: string) => void;
};

export function ClientDataSections({
  data,
  editing,
  create = false,
  invalidKeys,
  autocompleteFields,
  onChange,
}: ClientDataSectionsProps) {
  const fields = create ? clientCreateFieldGroups : clientFieldGroups;

  return (
    <>
      <FieldSectionCard
        icon="person"
        title="Dati Anagrafici"
        data={data}
        fields={fields.personal}
        editing={editing}
        onChange={onChange}
        invalidKeys={invalidKeys}
        autocompleteFields={autocompleteFields}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[28px] mt-[28px]">
        <FieldSectionCard
          icon="home_pin"
          title="Residenza"
          data={data}
          fields={fields.address}
          columns={2}
          editing={editing}
          onChange={onChange}
          invalidKeys={invalidKeys}
          autocompleteFields={autocompleteFields}
          className="min-h-[300px]"
        />
        <FieldSectionCard
          icon="contact_phone"
          title="Contatti e Distretto"
          data={data}
          fields={fields.contact}
          columns={2}
          editing={editing}
          onChange={onChange}
          invalidKeys={invalidKeys}
          className="min-h-[300px]"
        />
      </div>

      <NoteCard
        value={data.note}
        editing={editing}
        onChange={(value) => onChange('note', value)}
        className="mt-[28px]"
      />
    </>
  );
}
