import { type ReactNode } from 'react';
import { fetchClientOrthopedic } from '../api/clients';
import { DataCard, InfoBlock } from '../components/common/DataCard';
import { Icon } from '../components/common/Icon';
import { useNavigation } from '../contexts/NavigationContext';
import { useApiData } from '../hooks/useApiData';
import type { ClientOrthopedic } from '../types';

type Field = { label: string; key: keyof ClientOrthopedic };

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
  { label: 'Note cliente', key: 'clientNote' },
  { label: 'Altro', key: 'other' },
];

export function ClientOrthopedicView() {
  const { selectedClientCode, navigate } = useNavigation();
  const { data, loading, error } = useApiData(
    () =>
      selectedClientCode
        ? fetchClientOrthopedic(selectedClientCode)
        : Promise.reject(new Error('Nessun cliente selezionato.')),
    [selectedClientCode],
  );

  if (loading) {
    return <StatusMessage onBack={() => navigate('client-detail')}>Caricamento dati...</StatusMessage>;
  }
  if (error || !data) {
    return (
      <StatusMessage onBack={() => navigate('client-detail')} tone="error">
        {error ?? 'Nessun cliente selezionato.'}
      </StatusMessage>
    );
  }

  return (
    <div className="max-w-[1440px] -mt-1">
      <header className="mb-[28px] border-b border-[#dde1e7] pb-[20px]">
        <div className="flex items-center justify-between gap-[20px]">
          <button
            onClick={() => navigate('client-detail')}
            className="inline-flex items-center gap-[5px] font-body-sm text-body-sm text-[#3d434c] hover:text-black"
          >
            <Icon name="arrow_back" className="text-[16px]" />
            Torna al dettaglio
          </button>

          <div className="flex items-center gap-[10px] font-body-md text-body-md">
            <button onClick={() => navigate('clients')} className="text-[#3d434c] hover:text-black">
              Clienti
            </button>
            <Icon name="chevron_right" className="text-[18px] text-[#3d434c]" />
            <button onClick={() => navigate('client-detail')} className="text-[#3d434c] hover:text-black">
              Dettaglio
            </button>
            <Icon name="chevron_right" className="text-[18px] text-[#3d434c]" />
            <span className="font-semibold text-black">Dati Ortopedici</span>
          </div>
        </div>

        <h2 className="mt-[14px] font-headline-lg text-headline-lg font-bold text-black tracking-normal">
          {`${data.name} ${data.surname}`.trim()}
        </h2>
        <p className="mt-[6px] font-body-md text-body-md text-[#737780]">
          Codice: <span className="font-semibold text-[#343942]">{data.code}</span>
        </p>
      </header>

      <div className="space-y-[28px]">
        <DataCard icon="footprint" title="Calzatura e Plantare">
          <FieldGrid data={data} fields={footwearFields} />
        </DataCard>

        <div className="grid grid-cols-2 gap-[28px]">
          <DataCard icon="straighten" title="Tutore e Armatura">
            <FieldGrid data={data} fields={braceFields} columns={2} />
          </DataCard>
          <DataCard icon="accessibility_new" title="Misure Corporee">
            <FieldGrid data={data} fields={bodyFields} columns={2} />
          </DataCard>
        </div>

        <DataCard icon="sticky_note_2" title="Note">
          <FieldGrid data={data} fields={noteFields} columns={1} />
        </DataCard>
      </div>
    </div>
  );
}

function FieldGrid({
  data,
  fields,
  columns = 3,
}: {
  data: ClientOrthopedic;
  fields: Field[];
  columns?: 1 | 2 | 3;
}) {
  const columnsClass = columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-2' : 'grid-cols-3';
  return (
    <div className={`grid ${columnsClass} gap-x-[36px] gap-y-[24px]`}>
      {fields.map((field) => (
        <InfoBlock key={field.key} label={field.label} value={data[field.key]} />
      ))}
    </div>
  );
}

function StatusMessage({
  onBack,
  tone = 'muted',
  children,
}: {
  onBack: () => void;
  tone?: 'muted' | 'error';
  children: ReactNode;
}) {
  const toneClass = tone === 'error' ? 'text-error' : 'text-on-surface-variant';
  return (
    <div className="flex flex-col items-start gap-4">
      <p className={`font-body-md text-body-md ${toneClass}`}>{children}</p>
      <button
        onClick={onBack}
        className="text-on-surface-variant hover:text-primary flex items-center gap-2 font-body-md text-body-md"
      >
        <Icon name="arrow_back" /> Torna al dettaglio
      </button>
    </div>
  );
}
