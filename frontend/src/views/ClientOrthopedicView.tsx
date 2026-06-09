import { useEffect } from 'react';
import { fetchClientOrthopedic } from '../api/clients';
import { ClientPageHeader } from '../components/common/ClientPageHeader';
import { DataCard, FieldGrid, type FieldConfig } from '../components/common/DataCard';
import { StatusMessage } from '../components/common/StatusMessage';
import { useClientEdit } from '../contexts/ClientEditContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useApiData } from '../hooks/useApiData';
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
  const { editing, orthoDraft, dataVersion, seedOrtho, setOrthoField } = useClientEdit();

  const { data: fetched, loading, error } = useApiData(
    () =>
      selectedClientCode
        ? fetchClientOrthopedic(selectedClientCode)
        : Promise.reject(new Error('Nessun cliente selezionato.')),
    [selectedClientCode, dataVersion],
  );

  useEffect(() => {
    if (editing && fetched) seedOrtho(fetched);
  }, [editing, fetched, seedOrtho]);

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

  const data = editing && orthoDraft ? orthoDraft : fetched;

  return (
    <div className="max-w-[1440px] -mt-1">
      <ClientPageHeader
        back={{ label: 'Torna al dettaglio', onClick: () => navigate('client-detail') }}
        crumbs={[
          { label: 'Clienti', onClick: () => navigate('clients') },
          { label: 'Dettaglio', onClick: () => navigate('client-detail') },
          { label: 'Dati Ortopedici' },
        ]}
        name={data.name}
        surname={data.surname}
        code={data.code}
      />

      <div className="space-y-[28px]">
        <DataCard icon="footprint" title="Calzatura e Plantare">
          <FieldGrid data={data} fields={footwearFields} editing={editing} onChange={setOrthoField} />
        </DataCard>

        <div className="grid grid-cols-2 gap-[28px]">
          <DataCard icon="straighten" title="Tutore e Armatura">
            <FieldGrid data={data} fields={braceFields} columns={2} editing={editing} onChange={setOrthoField} />
          </DataCard>
          <DataCard icon="accessibility_new" title="Misure Corporee">
            <FieldGrid data={data} fields={bodyFields} columns={2} editing={editing} onChange={setOrthoField} />
          </DataCard>
        </div>

        <DataCard icon="sticky_note_2" title="Note">
          <FieldGrid data={data} fields={noteFields} columns={1} editing={editing} onChange={setOrthoField} />
        </DataCard>
      </div>
    </div>
  );
}
