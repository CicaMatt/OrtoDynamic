import { useState } from 'react';
import { Icon } from '../components/common/Icon';
import { useNavigation } from '../contexts/NavigationContext';
import { workOrders } from '../data/workOrders';
import type { WorkOrderStatus } from '../types';

const patientDetails = {
  birthDate: '15 Maggio 1975 (48 anni)',
  fiscalCode: 'RSSMRA75E15H501Z',
  clinicalNotes:
    'Piede piatto valgo bilaterale. Riferisce dolore alla zona metatarsale durante la deambulazione prolungata. Precedente intervento al legamento crociato anteriore (ginocchio dx, 2018).',
};

const jobDetails = {
  createdAt: '12 Ottobre 2023',
  size: '42',
  side: 'Bilaterale',
  materials: ['EVA 35 Shore', 'Rinforzo in fibra di carbonio', 'Copertura in Alcantara'],
};

const measurements = [
  { label: 'Altezza volta (SX)', value: '12 mm' },
  { label: 'Altezza volta (DX)', value: '14 mm' },
  { label: 'Largh. avampiede (SX)', value: '9.5 cm' },
  { label: 'Largh. avampiede (DX)', value: '9.8 cm' },
];

const statusOptions = [
  { label: 'In Lavorazione', value: 'IN LAVORAZIONE' },
  { label: 'Terminato', value: 'TERMINATO' },
  { label: 'Consegnato', value: 'CONSEGNATO' },
] as const;

const actionGroups = [
  [
    { icon: 'edit', label: 'Modifica Dettagli' },
    { icon: 'verified', label: 'Scarica Certificato CE' },
    { icon: 'print', label: 'Stampa Scheda Tecnica' },
  ],
  [
    { icon: 'sms', label: 'Invia SMS al Paziente' },
    { icon: 'attach_file', label: 'Allega Documento' },
  ],
];

export function WorkDetailView() {
  const { selectedWorkOrderId, navigate } = useNavigation();
  const order = workOrders.find((w) => w.id === selectedWorkOrderId);
  const [selectedStatus, setSelectedStatus] = useState(statusToOption(order?.status));

  if (!order) {
    return <NotFound onBack={() => navigate('work-orders')} />;
  }

  return (
    <div className="max-w-[1440px]">
      <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-[28px] items-start">
        <main>
          <Breadcrumb onBack={() => navigate('work-orders')} />

          <header className="mb-[38px]">
            <h2 className="font-headline-lg text-headline-lg font-bold text-black tracking-normal">
              Dettaglio Lavoro: {order.id}
            </h2>
            <div className="flex items-center gap-[14px] mt-[7px]">
              <span className="inline-flex items-center h-[29px] rounded-[14px] bg-[#d8e8ff] px-[15px] font-body-md text-body-md font-bold uppercase text-[#00539f]">
                {selectedStatus}
              </span>
              <span className="font-body-md text-body-md text-[#343942]">Creato il: {jobDetails.createdAt}</span>
            </div>
          </header>

          <PatientCard patientName={order.patient} />

          <div className="grid grid-cols-2 gap-[28px] mt-[28px]">
            <TechnicalSpecsCard device={formatDeviceName(order.device)} />
            <MeasurementsCard />
          </div>
        </main>

        <aside className="space-y-[28px]">
          <StatusCard selectedStatus={selectedStatus} onSelect={setSelectedStatus} />
          <ActionsCard />
        </aside>
      </div>
    </div>
  );
}

function Breadcrumb({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center gap-[13px] mb-[10px] font-body-md text-body-md">
      <button onClick={onBack} className="text-[#3d434c] hover:text-black">
        Lavorazioni
      </button>
      <Icon name="chevron_right" className="text-[18px] text-[#3d434c]" />
      <span className="font-semibold text-black">Dettaglio</span>
    </div>
  );
}

function PatientCard({ patientName }: { patientName: string }) {
  return (
    <section className="rounded-[8px] border border-[#c9cdd4] bg-white px-[29px] py-[28px] shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
      <SectionTitle icon="person" title="Paziente" />
      <div className="h-px bg-[#dde1e7] mt-[11px] mb-[20px]" />

      <div className="grid grid-cols-3 gap-[36px]">
        <InfoBlock label="Nome completo" value={patientName} strong />
        <InfoBlock label="Data di nascita" value={patientDetails.birthDate} />
        <InfoBlock label="Codice fiscale" value={patientDetails.fiscalCode} />
      </div>

      <div className="mt-[29px]">
        <div className="font-label-caps text-label-caps font-bold uppercase text-[#737780]">
          Note cliniche
        </div>
        <div className="mt-[7px] rounded-[4px] border border-[#d8dce2] bg-[#e9edf2] px-[15px] py-[14px] font-body-md text-body-md text-[#3c424b]">
          {patientDetails.clinicalNotes}
        </div>
      </div>
    </section>
  );
}

function TechnicalSpecsCard({ device }: { device: string }) {
  return (
    <section className="min-h-[398px] rounded-[8px] border border-[#c9cdd4] bg-white px-[29px] py-[28px]">
      <SectionTitle icon="orthopedics" title="Specifiche Tecniche" />
      <div className="h-px bg-[#dde1e7] mt-[11px] mb-[22px]" />

      <dl className="space-y-[31px]">
        <SpecRow label="Dispositivo" value={device} />
        <SpecRow label="Taglia" value={jobDetails.size} />
        <SpecRow label="Lato" value={jobDetails.side} />
      </dl>

      <div className="mt-[32px]">
        <div className="font-label-caps text-label-caps font-bold uppercase text-[#737780]">
          Materiali
        </div>
        <div className="mt-[11px] flex flex-wrap gap-[8px]">
          {jobDetails.materials.map((material) => (
            <span
              key={material}
              className="rounded-[5px] border border-[#d8dce2] bg-[#eceff3] px-[11px] py-[7px] font-body-md text-body-md text-[#171a20]"
            >
              {material}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function MeasurementsCard() {
  return (
    <section className="min-h-[398px] rounded-[8px] border border-[#c9cdd4] bg-white px-[29px] py-[28px]">
      <SectionTitle icon="straighten" title="Misure Rilevate" />
      <div className="h-px bg-[#dde1e7] mt-[11px] mb-[19px]" />

      <div className="grid grid-cols-2 gap-[19px]">
        {measurements.map((measurement) => (
          <div
            key={measurement.label}
            className="flex h-[88px] flex-col items-center justify-center rounded-[5px] border border-[#d8dce2] bg-[#f6f8fb] text-center"
          >
            <div className="max-w-[150px] font-label-caps text-label-caps font-bold uppercase text-[#737780]">
              {measurement.label}
            </div>
            <div className="mt-[7px] font-headline-md text-headline-md font-bold text-black">
              {measurement.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatusCard({
  selectedStatus,
  onSelect,
}: {
  selectedStatus: string;
  onSelect: (status: string) => void;
}) {
  return (
    <section className="rounded-[8px] border border-[#c9cdd4] bg-white px-[24px] py-[24px]">
      <h3 className="font-label-caps text-label-caps font-bold uppercase text-[#737780]">
        Aggiorna stato
      </h3>
      <div className="mt-[20px] space-y-[11px]">
        {statusOptions.map((status) => {
          const selected = selectedStatus === status.value;
          return (
            <button
              key={status.value}
              onClick={() => onSelect(status.value)}
              className={`flex h-[46px] w-full items-center justify-between rounded-[4px] border px-[19px] text-left font-body-md text-body-md ${
                selected
                  ? 'border-[#005eb8] bg-[#f0f6ff] font-semibold text-[#00539f]'
                  : 'border-[#c9cdd4] bg-white text-[#1a1f27] hover:border-[#005eb8]'
              }`}
            >
              {status.label}
              {selected && <Icon name="check_circle" filled className="text-[21px] text-[#00539f]" />}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ActionsCard() {
  return (
    <section className="rounded-[8px] border border-[#c9cdd4] bg-white px-[24px] py-[25px]">
      <h3 className="font-label-caps text-label-caps font-bold uppercase text-[#737780]">
        Azioni lavoro
      </h3>

      <div className="mt-[22px]">
        {actionGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {groupIndex > 0 && <div className="my-[19px] h-px bg-[#dde1e7]" />}
            <div className="space-y-[13px]">
              {group.map((action) => (
                <button
                  key={action.label}
                  className="flex h-[46px] w-full items-center gap-[18px] rounded-[4px] px-[18px] text-left font-body-md text-body-md text-[#171a20] hover:bg-[#f4f6f9]"
                >
                  <Icon name={action.icon} className="text-[24px] text-[#707781]" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-[13px]">
      <Icon name={icon} className="text-[28px] text-[#005eb8]" />
      <h3 className="font-headline-md text-headline-md font-bold text-black">{title}</h3>
    </div>
  );
}

function InfoBlock({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div>
      <dt className="font-label-caps text-label-caps font-bold uppercase text-[#737780]">
        {label}
      </dt>
      <dd className={`mt-[8px] font-body-md text-body-md text-[#171a20] ${strong ? 'font-bold' : 'font-medium'}`}>
        {value}
      </dd>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <dt className="font-label-caps text-label-caps font-bold uppercase text-[#737780]">
        {label}
      </dt>
      <dd className="text-right font-body-md text-body-md font-bold text-[#171a20]">{value}</dd>
    </div>
  );
}

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-start gap-4">
      <p className="font-body-md text-body-md text-on-surface-variant">Nessuna lavorazione selezionata.</p>
      <button
        onClick={onBack}
        className="text-on-surface-variant hover:text-primary flex items-center gap-2 font-body-md text-body-md"
      >
        <Icon name="arrow_back" /> Torna alle lavorazioni
      </button>
    </div>
  );
}

function statusToOption(status?: WorkOrderStatus) {
  if (status === 'TERMINATO') return 'TERMINATO';
  return 'IN LAVORAZIONE';
}

function formatDeviceName(device: string) {
  return device
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
