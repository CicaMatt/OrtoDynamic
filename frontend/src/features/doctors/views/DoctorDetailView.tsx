import { fetchDoctor } from '../api/doctors';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityPageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import { NoteCard } from '../../../shared/entity/NoteCard';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useEntityDetail } from '../../../app/editing/useEntityDetail';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { doctorFields } from '../components/doctorFields';

const doctorActions = [
  { id: 'edit', icon: 'edit', label: 'Modifica Dati Medico' },
];

export function DoctorDetailView() {
  const { selectedDoctorId, navigate } = useNavigation();
  const { doctorDraft, startDoctorEdit, seedDoctor, setDoctorField } = useEntityEdit();

  const { data, loading, error, isEditing } = useEntityDetail({
    type: 'doctor',
    selectedId: selectedDoctorId,
    fetcher: fetchDoctor,
    missingMessage: 'Nessun medico selezionato.',
    draft: doctorDraft,
    seed: seedDoctor,
  });

  if (loading) {
    return (
      <StatusMessage onBack={() => navigate('doctors')} backLabel="Torna ai medici">
        Caricamento medico...
      </StatusMessage>
    );
  }
  if (error || !data) {
    return (
      <StatusMessage onBack={() => navigate('doctors')} backLabel="Torna ai medici" tone="error">
        {error ?? 'Nessun medico selezionato.'}
      </StatusMessage>
    );
  }

  const title = `${data.name} ${data.surname}`.trim() || `Medico ${data.id}`;
  const actions = doctorActions.map((action) => ({
    ...action,
    active: isEditing,
    onClick: !isEditing ? () => startDoctorEdit(data.id) : undefined,
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
              ID Medico: <span className="font-semibold text-on-surface">{data.id}</span>
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
        editing={isEditing}
        onChange={setDoctorField}
      />

      <NoteCard
        value={data.note}
        editing={isEditing}
        onChange={(value) => setDoctorField('note', value)}
        className="mt-[28px]"
      />
    </EntityDetailLayout>
  );
}
