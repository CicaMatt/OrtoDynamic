import { useState } from 'react';
import { useEntityEditor } from '../../../app/editing/EntityEditContext';
import { deleteDoctor, fetchDoctor } from '../api/doctors';
import { DeleteConfirmationDialog } from '../../../shared/entity/DeleteConfirmationDialog';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityPageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/EntityFields';
import { NoteCard } from '../../../shared/entity/NoteCard';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { useEntityDetail } from '../../../app/editing/useEntityDetail';
import { useNavigation, useRoute } from '../../../app/navigation/NavigationContext';
import { doctorFields } from '../components/doctorFields';

const doctorActions = [
  { id: 'edit', icon: 'edit', label: 'Modifica Dati Medico' },
  { id: 'delete', icon: 'delete', label: 'Elimina Medico', tone: 'danger' as const },
];

export function DoctorDetailView() {
  const { doctorId } = useRoute('doctor-detail');
  const { navigate, back } = useNavigation();
  const { draft, startEdit, seed, change } = useEntityEditor('doctor');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, loading, error, isEditing } = useEntityDetail({
    type: 'doctor',
    selectedId: doctorId,
    fetcher: fetchDoctor,
    missingMessage: 'Nessun medico selezionato.',
    draft,
    seed,
  });

  if (loading) {
    return (
      <StatusMessage onBack={() => back({ name: 'doctors' })} backLabel="Torna ai medici">
        Caricamento medico...
      </StatusMessage>
    );
  }
  if (error || !data) {
    return (
      <StatusMessage
        onBack={() => back({ name: 'doctors' })}
        backLabel="Torna ai medici"
        tone="error"
      >
        {error ?? 'Nessun medico selezionato.'}
      </StatusMessage>
    );
  }

  const title = `${data.name} ${data.surname}`.trim() || `Medico ${data.idDoctor}`;
  const actions = doctorActions.map((action) => {
    if (action.id === 'edit') {
      return {
        ...action,
        active: isEditing,
        onClick: !isEditing ? () => startEdit(data.idDoctor) : undefined,
      };
    }
    return {
      ...action,
      onClick: !isEditing ? () => setDeleteDialogOpen(true) : undefined,
    };
  });

  return (
    <>
      <EntityDetailLayout
        header={
          <EntityPageHeader
            back={{ label: 'Torna indietro', onClick: () => back({ name: 'doctors' }) }}
            crumbs={[
              { label: 'Medici', onClick: () => navigate({ name: 'doctors' }) },
              { label: 'Dettaglio' },
            ]}
            title={title}
            subtitle={
              <>
                ID Medico: <span className="font-semibold text-on-surface">{data.idDoctor}</span>
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
          onChange={change}
        />

        <NoteCard
          value={data.note}
          editing={isEditing}
          onChange={(value) => change('note', value)}
          className="mt-[28px]"
        />
      </EntityDetailLayout>

      {deleteDialogOpen && (
        <DeleteConfirmationDialog
          title="Elimina Medico"
          message={`Confermi l'eliminazione del medico ${title}?`}
          confirmLabel="Elimina Medico"
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={async () => {
            await deleteDoctor(data.idDoctor);
            navigate({ name: 'doctors' });
          }}
        />
      )}
    </>
  );
}
