import { useEffect } from 'react';
import { fetchClientOrthopedic } from '../api/clients';
import { ClientPageHeader } from '../components/ClientPageHeader';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import type { FieldConfig } from '../../../shared/entity/DataCard';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { useApiData } from '../../../shared/hooks/useApiData';
import type { ClientOrthopedic } from '../types';

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
  const { selectedClientCode, navigate } = useNavigation();
  const {
    editing,
    editTarget,
    clientOrthopedicDraft,
    dataVersion,
    seedClientOrthopedic,
    setClientOrthopedicField,
  } = useEntityEdit();
  const isEditingClient = editing && editTarget?.type === 'client' && editTarget.id === selectedClientCode;

  const { data: fetched, loading, error } = useApiData(
    () =>
      selectedClientCode
        ? fetchClientOrthopedic(selectedClientCode)
        : Promise.reject(new Error('Nessun cliente selezionato.')),
    [selectedClientCode, dataVersion],
  );

  useEffect(() => {
    if (isEditingClient && fetched) seedClientOrthopedic(fetched);
  }, [isEditingClient, fetched, seedClientOrthopedic]);

  if (loading) {
    return (
      <StatusMessage onBack={() => navigate('client-detail')} backLabel="Torna al dettaglio">
        Caricamento dati...
      </StatusMessage>
    );
  }
  if (error || !fetched) {
    return (
      <StatusMessage onBack={() => navigate('client-detail')} backLabel="Torna al dettaglio" tone="error">
        {error ?? 'Nessun cliente selezionato.'}
      </StatusMessage>
    );
  }

  const data = isEditingClient && clientOrthopedicDraft ? clientOrthopedicDraft : fetched;

  return (
    <EntityDetailLayout
      header={
        <ClientPageHeader
          back={{ label: 'Torna al dettaglio', onClick: () => navigate('client-detail') }}
          crumbs={[
            { label: 'Clienti', onClick: () => navigate('clients') },
            { label: 'Dettaglio', onClick: () => navigate('client-detail') },
            { label: 'Dati Ortopedici' },
          ]}
          client={data}
        />
      }
    >
      <div className="space-y-[28px]">
        <FieldSectionCard
          icon="footprint"
          title="Calzatura e Plantare"
          data={data}
          fields={footwearFields}
          editing={isEditingClient}
          onChange={setClientOrthopedicField}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[28px]">
          <FieldSectionCard
            icon="straighten"
            title="Tutore e Armatura"
            data={data}
            fields={braceFields}
            columns={2}
            editing={isEditingClient}
            onChange={setClientOrthopedicField}
          />
          <FieldSectionCard
            icon="accessibility_new"
            title="Misure Corporee"
            data={data}
            fields={bodyFields}
            columns={2}
            editing={isEditingClient}
            onChange={setClientOrthopedicField}
          />
        </div>

        <FieldSectionCard
          icon="sticky_note_2"
          title="Note"
          data={data}
          fields={noteFields}
          columns={1}
          editing={isEditingClient}
          onChange={setClientOrthopedicField}
        />
      </div>
    </EntityDetailLayout>
  );
}
