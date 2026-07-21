import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityCreatePageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import { NoteCard } from '../../../shared/entity/NoteCard';
import { doctorCreateFields } from '../components/doctorFields';
import { useDoctorEditor } from '../useDoctorEditor';

export function DoctorCreateView() {
  const { navigate } = useNavigation();
  const { draft, invalidFields, change } = useDoctorEditor();
  if (!draft) throw new Error('Doctor create route requires an active create session.');

  return (
    <EntityDetailLayout
      header={
        <EntityCreatePageHeader
          backLabel="Torna ai medici"
          listLabel="Medici"
          title="Nuovo Medico"
          onBack={() => navigate({ name: 'doctors' })}
        />
      }
    >
      <FieldSectionCard
        icon="medical_services"
        title="Dati Medico"
        data={draft}
        fields={doctorCreateFields}
        editing
        onChange={change}
        invalidKeys={invalidFields}
      />

      <NoteCard
        value={draft.note}
        editing
        onChange={(value) => change('note', value)}
        className="mt-[28px]"
      />
    </EntityDetailLayout>
  );
}
