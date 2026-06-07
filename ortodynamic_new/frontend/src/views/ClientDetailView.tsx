import { Icon } from '../components/common/Icon';
import { useNavigation } from '../contexts/NavigationContext';
import { clients } from '../data/clients';
import type { Client } from '../types';

const actionGroups = [
  [
    { icon: 'edit', label: 'Modifica Dati Cliente' },
    { icon: 'assignment_ind', label: 'Apri Anagrafica Completa' },
    { icon: 'print', label: 'Stampa Scheda Cliente' },
  ],
  [
    { icon: 'sms', label: 'Invia SMS' },
    { icon: 'mail', label: 'Invia Email' },
    { icon: 'attach_file', label: 'Allega Documento' },
  ],
];

export function ClientDetailView() {
  const { selectedClientCode, navigate } = useNavigation();
  const client = clients.find((item) => item.code === selectedClientCode);

  if (!client) {
    return <NotFound onBack={() => navigate('clients')} />;
  }

  return (
    <div className="max-w-[1440px]">
      <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-[28px] items-start">
        <main>
          <Breadcrumb onBack={() => navigate('clients')} />

          <header className="mb-[38px]">
            <h2 className="font-headline-lg text-headline-lg font-bold text-black tracking-normal">
              Dettaglio Cliente: {client.code}
            </h2>
            <div className="flex items-center gap-[14px] mt-[7px]">
              <span className="inline-flex items-center h-[29px] rounded-[14px] bg-[#d8e8ff] px-[15px] font-body-md text-body-md font-bold uppercase text-[#00539f]">
                {client.surname} {client.name}
              </span>
              <span className="font-body-md text-body-md text-[#343942]">
                Codice fiscale: {client.fiscalCode}
              </span>
            </div>
          </header>

          <PersonalDataCard client={client} />

          <div className="grid grid-cols-2 gap-[28px] mt-[28px]">
            <AddressCard client={client} />
            <ContactCard client={client} />
          </div>
        </main>

        <aside className="space-y-[28px]">
          <SummaryCard client={client} />
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
        Clienti
      </button>
      <Icon name="chevron_right" className="text-[18px] text-[#3d434c]" />
      <span className="font-semibold text-black">Dettaglio</span>
    </div>
  );
}

function PersonalDataCard({ client }: { client: Client }) {
  return (
    <section className="rounded-[8px] border border-[#c9cdd4] bg-white px-[29px] py-[28px] shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
      <SectionTitle icon="person" title="Dati Anagrafici" />
      <div className="h-px bg-[#dde1e7] mt-[11px] mb-[20px]" />

      <div className="grid grid-cols-3 gap-[36px]">
        <InfoBlock label="Codice" value={client.code} strong />
        <InfoBlock label="Nome" value={client.name} />
        <InfoBlock label="Cognome" value={client.surname} />
        <InfoBlock label="Data nascita" value={client.birthDate} />
        <InfoBlock label="Sesso" value={client.gender} />
        <InfoBlock label="Codice fiscale" value={client.fiscalCode} />
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
        <SpecRow label="Comune" value={client.municipality} />
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
        <SpecRow label="Email" value={client.email} />
        <SpecRow label="Distretto appartenenza" value={client.district} />
      </dl>
    </section>
  );
}

function SummaryCard({ client }: { client: Client }) {
  return (
    <section className="rounded-[8px] border border-[#c9cdd4] bg-white px-[24px] py-[24px]">
      <h3 className="font-label-caps text-label-caps font-bold uppercase text-[#737780]">
        Riepilogo cliente
      </h3>
      <div className="mt-[20px] space-y-[18px]">
        <InfoBlock label="Cliente" value={`${client.name} ${client.surname}`} strong />
        <InfoBlock label="Codice" value={client.code} />
        <InfoBlock label="Distretto" value={client.district} />
      </div>
    </section>
  );
}

function ActionsCard() {
  return (
    <section className="rounded-[8px] border border-[#c9cdd4] bg-white px-[24px] py-[25px]">
      <h3 className="font-label-caps text-label-caps font-bold uppercase text-[#737780]">
        Azioni cliente
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
      <dd className="max-w-[230px] text-right font-body-md text-body-md font-bold text-[#171a20]">{value}</dd>
    </div>
  );
}

function NotFound({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col items-start gap-4">
      <p className="font-body-md text-body-md text-on-surface-variant">Nessun cliente selezionato.</p>
      <button
        onClick={onBack}
        className="text-on-surface-variant hover:text-primary flex items-center gap-2 font-body-md text-body-md"
      >
        <Icon name="arrow_back" /> Torna ai clienti
      </button>
    </div>
  );
}
