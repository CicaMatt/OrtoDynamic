import { useEffect, useState } from 'react';
import { deleteClient, fetchClientOrthopedic } from '../api/clients';
import { ClientPageHeader } from '../components/ClientPageHeader';
import { DeleteConfirmationDialog } from '../../../shared/entity/DeleteConfirmationDialog';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import type { FieldConfig } from '../../../shared/entity/DataCard';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { useNavigation, useRoute } from '../../../app/navigation/NavigationContext';
import { useApiData } from '../../../shared/hooks/useApiData';
import type { ClientOrthopedic } from '../types';
import { useClientEditor } from '../useClientEditor';

type Field = FieldConfig<ClientOrthopedic>;

const footwearFields: Field[] = [
  { label: 'Misura scarpa', key: 'shoeSize' },
  { label: 'Modello scarpa', key: 'shoeModel' },
  { label: 'Pianta', key: 'width' },
  { label: 'Collo', key: 'collar' },
  { label: 'Caviglia', key: 'ankle' },
  { label: 'Speronatura', key: 'spur' },
  { label: 'Rialzo', key: 'lift' },
  { label: 'Piano inclinato tot.', key: 'inclinedPlane' },
  { label: 'Tipo plantare', key: 'insoleType' },
  { label: 'Passaggio collo', key: 'collarPassage' },
  { label: 'Passaggio caviglie', key: 'anklePassage' },
];

const braceFields: Field[] = [
  { label: 'Tipo tutore', key: 'braceType' },
  { label: 'Spallacci', key: 'shoulderStraps' },
  { label: 'Fino ascella', key: 'upToArmpit' },
  { label: 'Alt. stoffa anteriore', key: 'frontFabricHeight' },
  { label: 'Alt. tot. armatura', key: 'totalFrameHeight' },
  { label: 'Distanza ascellare', key: 'axillaryDistance' },
];

const bodyFields: Field[] = [
  { label: 'Misura vita', key: 'waist' },
  { label: 'Misura bacino', key: 'pelvisSize' },
  { label: 'Misura 2/4', key: 'measure24' },
  { label: 'Collo', key: 'neck' },
  { label: 'Omero', key: 'humerus' },
  { label: 'Braccio', key: 'arm' },
  { label: 'Polso', key: 'wrist' },
  { label: 'Bacino', key: 'pelvis' },
  { label: 'Coscia', key: 'thigh' },
  { label: 'Gamba', key: 'leg' },
];

const noteFields: Field[] = [
  { label: 'Note cliente', key: 'clientNote', type: 'textarea' },
  { label: 'Altro', key: 'other', type: 'textarea' },
];

export function ClientOrthopedicView() {
  const { clientId } = useRoute('client-detail');
  const { navigate } = useNavigation();
  const { orthopedicDraft, dataVersion, isEditing, seedOrthopedic, changeOrthopedic } =
    useClientEditor();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const isEditingClient = isEditing(clientId);

  const {
    data: fetched,
    loading,
    error,
  } = useApiData(
    () =>
      clientId
        ? fetchClientOrthopedic(clientId)
        : Promise.reject(new Error('Nessun cliente selezionato.')),
    [clientId, dataVersion],
  );

  useEffect(() => {
    if (isEditingClient && fetched) seedOrthopedic(fetched);
  }, [isEditingClient, fetched, seedOrthopedic]);

  if (loading) {
    return (
      <StatusMessage
        onBack={() => navigate({ name: 'client-detail', clientId, tab: 'general' })}
        backLabel="Torna al dettaglio"
      >
        Caricamento dati...
      </StatusMessage>
    );
  }
  if (error || !fetched) {
    return (
      <StatusMessage
        onBack={() => navigate({ name: 'client-detail', clientId, tab: 'general' })}
        backLabel="Torna al dettaglio"
        tone="error"
      >
        {error ?? 'Nessun cliente selezionato.'}
      </StatusMessage>
    );
  }

  const data = isEditingClient && orthopedicDraft ? orthopedicDraft : fetched;
  const deleteActions = [
    {
      id: 'delete',
      icon: 'delete',
      label: 'Elimina Cliente',
      tone: 'danger' as const,
      onClick: !isEditingClient ? () => setDeleteDialogOpen(true) : undefined,
    },
  ];

  return (
    <>
      <EntityDetailLayout
        header={
          <ClientPageHeader
            back={{
              label: 'Torna al dettaglio',
              onClick: () => navigate({ name: 'client-detail', clientId, tab: 'general' }),
            }}
            crumbs={[
              { label: 'Clienti', onClick: () => navigate({ name: 'clients' }) },
              {
                label: 'Dettaglio',
                onClick: () => navigate({ name: 'client-detail', clientId, tab: 'general' }),
              },
              { label: 'Dati Ortopedici' },
            ]}
            client={data}
          />
        }
        actionsTitle="Azioni cliente"
        actions={deleteActions}
      >
        <div className="space-y-[28px]">
          <FieldSectionCard
            icon="footprint"
            title="Calzatura e Plantare"
            data={data}
            fields={footwearFields}
            editing={isEditingClient}
            onChange={changeOrthopedic}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[28px]">
            <FieldSectionCard
              icon="straighten"
              title="Tutore e Armatura"
              data={data}
              fields={braceFields}
              columns={2}
              editing={isEditingClient}
              onChange={changeOrthopedic}
            />
            <FieldSectionCard
              icon="accessibility_new"
              title="Misure Corporee"
              data={data}
              fields={bodyFields}
              columns={2}
              editing={isEditingClient}
              onChange={changeOrthopedic}
            />
          </div>

          <FieldSectionCard
            icon="sticky_note_2"
            title="Note"
            data={data}
            fields={noteFields}
            columns={1}
            editing={isEditingClient}
            onChange={changeOrthopedic}
          />
        </div>
      </EntityDetailLayout>

      {deleteDialogOpen && (
        <DeleteConfirmationDialog
          title="Elimina Cliente"
          message={`Confermi l'eliminazione del cliente ${data.surname} ${data.name}?`}
          confirmLabel="Elimina Cliente"
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={async () => {
            await deleteClient(data.idClient);
            navigate({ name: 'clients' });
          }}
        />
      )}
    </>
  );
}
