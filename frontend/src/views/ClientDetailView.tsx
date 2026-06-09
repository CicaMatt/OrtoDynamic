import { type ReactNode } from 'react';
import { fetchClient } from '../api/clients';
import { DataCard, InfoBlock, SectionTitle } from '../components/common/DataCard';
import { FieldValue } from '../components/common/FieldValue';
import { Icon } from '../components/common/Icon';
import { useNavigation } from '../contexts/NavigationContext';
import { useApiData } from '../hooks/useApiData';
import type { Client } from '../types';
import { formatBirthDate, formatGender } from '../utils/format';

const clientActions = [
  { icon: 'edit', label: 'Modifica Dati Cliente' },
  { icon: 'request_quote', label: 'Inserisci Preventivo' },
  { icon: 'privacy_tip', label: 'Genera Modulo Privacy' },
];

export function ClientDetailView() {
  const { selectedClientCode, navigate } = useNavigation();
  const { data: client, loading, error } = useApiData(
    () =>
      selectedClientCode
        ? fetchClient(selectedClientCode)
        : Promise.reject(new Error('Nessun cliente selezionato.')),
    [selectedClientCode],
  );

  if (loading) {
    return <StatusMessage onBack={() => navigate('clients')}>Caricamento cliente...</StatusMessage>;
  }
  if (error || !client) {
    return (
      <StatusMessage onBack={() => navigate('clients')} tone="error">
        {error ?? 'Nessun cliente selezionato.'}
      </StatusMessage>
    );
  }

  return (
    <div className="max-w-[1440px] -mt-1">
      <header className="mb-[28px] border-b border-[#dde1e7] pb-[20px]">
        <div className="flex items-center justify-between gap-[20px]">
          <button
            onClick={() => navigate('clients')}
            className="inline-flex items-center gap-[5px] font-body-sm text-body-sm text-[#3d434c] hover:text-black"
          >
            <Icon name="arrow_back" className="text-[16px]" />
            Torna indietro
          </button>

          <div className="flex items-center gap-[10px] font-body-md text-body-md">
            <button onClick={() => navigate('clients')} className="text-[#3d434c] hover:text-black">
              Clienti
            </button>
            <Icon name="chevron_right" className="text-[18px] text-[#3d434c]" />
            <span className="font-semibold text-black">Dettaglio</span>
          </div>
        </div>

        <h2 className="mt-[14px] font-headline-lg text-headline-lg font-bold text-black tracking-normal">
          {`${client.name} ${client.surname}`.trim()}
        </h2>
        <p className="mt-[6px] font-body-md text-body-md text-[#737780]">
          Codice: <span className="font-semibold text-[#343942]">{client.code}</span>
        </p>
      </header>

      <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-[28px] items-start">
        <main>
          <PersonalDataCard client={client} />

          <div className="grid grid-cols-2 gap-[28px] mt-[28px]">
            <AddressCard client={client} />
            <ContactCard client={client} />
          </div>

          <div className="mt-[28px]">
            <DataCard icon="sticky_note_2" title="Note">
              <p className="font-body-md text-body-md text-[#171a20] whitespace-pre-line">
                <FieldValue value={client.note} />
              </p>
            </DataCard>
          </div>
        </main>

        <aside className="space-y-[24px] border-l border-[#dde1e7] pl-[28px]">
          <button
            type="button"
            onClick={() => navigate('client-orthopedic')}
            className="inline-flex w-full items-center justify-center gap-[10px] h-[44px] rounded-[6px] bg-secondary px-[20px] font-body-md text-body-md font-semibold text-on-secondary hover:bg-secondary-container transition-colors"
          >
            <Icon name="medical_services" className="text-[20px]" />
            Visualizza Dati Ortopedici
          </button>

          <ActionsCard />
        </aside>
      </div>
    </div>
  );
}

function PersonalDataCard({ client }: { client: Client }) {
  return (
    <section className="rounded-[8px] border border-[#c9cdd4] bg-white px-[29px] py-[28px] shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
      <SectionTitle icon="person" title="Dati Anagrafici" />
      <div className="h-px bg-[#dde1e7] mt-[11px] mb-[20px]" />

      <div className="grid grid-cols-3 gap-[36px]">
        <InfoBlock label="Nome" value={client.name} />
        <InfoBlock label="Cognome" value={client.surname} />
        <InfoBlock label="Codice fiscale" value={client.fiscalCode} />
        <InfoBlock label="Sesso" value={formatGender(client.gender)} />
        <InfoBlock label="Comune Nascita" value={client.birthMunicipality} />
        <InfoBlock label="Data nascita" value={formatBirthDate(client.birthDate)} />
      </div>
    </section>
  );
}

function AddressCard({ client }: { client: Client }) {
  return (
    <section className="min-h-[300px] rounded-[8px] border border-[#c9cdd4] bg-white px-[29px] py-[28px]">
      <SectionTitle icon="home_pin" title="Residenza" />
      <div className="h-px bg-[#dde1e7] mt-[11px] mb-[22px]" />

      <dl className="space-y-[26px]">
        <SpecRow label="Indirizzo" value={client.address} />
        <SpecRow label="Citta" value={client.city} />
        <SpecRow label="CAP" value={client.postalCode} />
        <SpecRow label="Nazione" value={client.country} />
      </dl>
    </section>
  );
}

function ContactCard({ client }: { client: Client }) {
  return (
    <section className="min-h-[300px] rounded-[8px] border border-[#c9cdd4] bg-white px-[29px] py-[28px]">
      <SectionTitle icon="contact_phone" title="Contatti e Distretto" />
      <div className="h-px bg-[#dde1e7] mt-[11px] mb-[22px]" />

      <dl className="space-y-[26px]">
        <SpecRow label="Numero telefono" value={client.phone} />
        <SpecRow label="Numero cellulare" value={client.mobile} />
        <SpecRow label="Email" value={client.email} />
        <SpecRow label="Distretto appartenenza" value={client.district} />
        <SpecRow label="ID Medico" value={client.doctorId} />
      </dl>
    </section>
  );
}

function ActionsCard() {
  return (
    <section className="rounded-[10px] border border-[#e2e6ec] bg-white px-[24px] py-[25px]">
      <h3 className="font-label-caps text-label-caps font-bold uppercase text-[#737780]">
        Azioni cliente
      </h3>

      <div className="mt-[22px] space-y-[8px]">
        {clientActions.map((action) => (
          <button
            key={action.label}
            className="flex h-[46px] w-full items-center gap-[18px] rounded-[6px] text-left font-body-md text-body-md text-[#171a20] hover:bg-[#f4f6f9] transition-colors"
          >
            <Icon name={action.icon} className="text-[24px] text-secondary" />
            {action.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6">
      <dt className="font-label-caps text-label-caps font-bold uppercase text-[#737780]">
        {label}
      </dt>
      <dd className="max-w-[230px] text-right font-body-md text-body-md font-bold text-[#171a20]">
        <FieldValue value={value} />
      </dd>
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
        <Icon name="arrow_back" /> Torna ai clienti
      </button>
    </div>
  );
}
