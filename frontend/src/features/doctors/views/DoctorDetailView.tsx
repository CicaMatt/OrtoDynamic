import { useEffect } from 'react';
import { fetchDoctor } from '../api/doctors';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityPageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import { NoteCard } from '../../../shared/entity/NoteCard';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { useApiData } from '../../../shared/hooks/useApiData';
import { doctorFields } from '../components/doctorFields';

const doctorActions = [
  { id: 'edit', icon: 'edit', label: 'Modifica Dati Medico' },
];

export function DoctorDetailView() {
  const { selectedDoctorId, navigate } = useNavigation();
  const {
    editing,
    editTarget,
    doctorDraft,
    dataVersion,
    startDoctorEdit,
    seedDoctor,
    setDoctorField,
  } = useEntityEdit();

  const isEditingDoctor = editing && editTarget?.type === 'doctor' && editTarget.id === selectedDoctorId;

  const { data: doctor, loading, error } = useApiData(
    () =>
      selectedDoctorId
        ? fetchDoctor(selectedDoctorId)
        : Promise.reject(new Error('Nessun medico selezionato.')),
    [selectedDoctorId, dataVersion],
  );

  useEffect(() => {
    if (isEditingDoctor && doctor) seedDoctor(doctor);
  }, [isEditingDoctor, doctor, seedDoctor]);

  if (loading) {
    return (
      <StatusMessage onBack={() => navigate('doctors')} backLabel="Torna ai medici">
        Caricamento medico...
      </StatusMessage>
    );
  }
  if (error || !doctor) {
    return (
      <StatusMessage onBack={() => navigate('doctors')} backLabel="Torna ai medici" tone="error">
        {error ?? 'Nessun medico selezionato.'}
      </StatusMessage>
    );
  }

  const data = isEditingDoctor && doctorDraft ? doctorDraft : doctor;
  const title = `${data.name} ${data.surname}`.trim() || `Medico ${data.id}`;
  const actions = doctorActions.map((action) => ({
    ...action,
    active: isEditingDoctor,
    onClick: !isEditingDoctor ? () => startDoctorEdit(data.id) : undefined,
  }));

  return (
    <EntityDetailLayout
      header={
        <EntityPageHeader
          back={{ label: 'Torna indietro', onClick: () => navigate('doctors') }}
          crumbs={[
            { label: 'Medici', onClick: () => navigate('doctors') },
            { label: 'Dettaglio' },
          ]}
          title={title}
          subtitle={
            <>
              ID Medico: <span className="font-semibold text-[#343942]">{data.id}</span>
            </>
          }
        />
      }
      actionsTitle="Azioni medico"
      actions={actions}
    >
      <FieldSectionCard
        icon="medical_services"
        title="Dati Medico"
        data={data}
        fields={doctorFields}
        editing={isEditingDoctor}
        onChange={setDoctorField}
      />

      <div className="mt-[28px]">
        <NoteCard
          value={data.note}
          editing={isEditingDoctor}
          onChange={(value) => setDoctorField('note', value)}
        />
      </div>
    </EntityDetailLayout>
  );
}
