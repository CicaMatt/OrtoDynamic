import { useEffect } from 'react';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityCreatePageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import { NoteCard } from '../../../shared/entity/NoteCard';
import { DOCTOR_CREATE_REQUIRED, doctorCreateFields } from '../components/doctorFields';
import type { Doctor } from '../types';

export function DoctorCreateView() {
  const { navigate } = useNavigation();
  const { editing, mode, editTarget, doctorDraft, invalidFields, startDoctorCreate, setDoctorField } =
    useEntityEdit();

  const isCreating = editing && mode === 'create' && editTarget?.type === 'doctor';

  useEffect(() => {
    if (!isCreating) startDoctorCreate(DOCTOR_CREATE_REQUIRED);
  }, [isCreating, startDoctorCreate]);

  if (!isCreating || !doctorDraft) return null;

  const invalidKeys = invalidFields as Array<keyof Doctor>;

  return (
    <EntityDetailLayout
      header={
        <EntityCreatePageHeader
          backLabel="Torna ai medici"
          listLabel="Medici"
          title="Nuovo Medico"
          onBack={() => navigate('doctors')}
        />
      }
    >
      <FieldSectionCard
        icon="medical_services"
        title="Dati Medico"
        data={doctorDraft}
        fields={doctorCreateFields}
        editing
        onChange={setDoctorField}
        invalidKeys={invalidKeys}
      />

      <NoteCard
        value={doctorDraft.note}
        editing
        onChange={(value) => setDoctorField('note', value)}
        className="mt-[28px]"
      />
    </EntityDetailLayout>
  );
}
