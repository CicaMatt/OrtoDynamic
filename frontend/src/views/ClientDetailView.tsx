import { useEffect } from 'react';
import { fetchClient } from '../api/clients';
import { ClientPageHeader } from '../components/common/ClientPageHeader';
import {
  DataCard,
  EditInput,
  FieldGrid,
  SectionTitle,
  type FieldConfig,
  type FieldInputType,
} from '../components/common/DataCard';
import { FieldValue } from '../components/common/FieldValue';
import { Icon } from '../components/common/Icon';
import { StatusMessage } from '../components/common/StatusMessage';
import { useClientEdit } from '../contexts/ClientEditContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useApiData } from '../hooks/useApiData';
import type { Client } from '../types';
import { formatBirthDate, formatGender } from '../utils/format';

type DetailField = FieldConfig<Client>;

const personalFields: DetailField[] = [
  { label: 'Nome', key: 'name' },
  { label: 'Cognome', key: 'surname' },
  { label: 'Codice fiscale', key: 'fiscalCode' },
  { label: 'Sesso', key: 'gender', type: 'gender' },
  { label: 'Comune Nascita', key: 'birthMunicipality' },
  { label: 'Data nascita', key: 'birthDate', type: 'date' },
];

const addressFields: DetailField[] = [
  { label: 'Indirizzo', key: 'address' },
  { label: 'Citta', key: 'city' },
  { label: 'CAP', key: 'postalCode' },
  { label: 'Nazione', key: 'country' },
];

const contactFields: DetailField[] = [
  { label: 'Numero telefono', key: 'phone' },
  { label: 'Numero cellulare', key: 'mobile' },
  { label: 'Email', key: 'email' },
  { label: 'Distretto appartenenza', key: 'district' },
  { label: 'ID Medico', key: 'doctorId', type: 'number' },
];

const clientActions = [
  { id: 'edit', icon: 'edit', label: 'Modifica Dati Cliente' },
  { id: 'quote', icon: 'request_quote', label: 'Inserisci Preventivo' },
  { id: 'privacy', icon: 'privacy_tip', label: 'Genera Modulo Privacy' },
];

type CardProps = {
  data: Client;
  editing: boolean;
  setField: (key: keyof Client, value: string) => void;
};

function rawOf(data: Client, field: DetailField): string {
  return String(data[field.key] ?? '');
}

function displayOf(field: DetailField, raw: string): string {
  if (field.type === 'gender') return formatGender(raw);
  if (field.type === 'date') return formatBirthDate(raw);
  return raw;
}

export function ClientDetailView() {
  const { selectedClientCode, navigate } = useNavigation();
  const { editing, detailDraft, dataVersion, startEdit, seedDetail, setDetailField } = useClientEdit();

  const { data: client, loading, error } = useApiData(
    () =>
      selectedClientCode
        ? fetchClient(selectedClientCode)
        : Promise.reject(new Error('Nessun cliente selezionato.')),
    [selectedClientCode, dataVersion],
  );

  useEffect(() => {
    if (editing && client) seedDetail(client);
  }, [editing, client, seedDetail]);

  if (loading) {
    return (
      <StatusMessage onBack={() => navigate('clients')} backLabel="Torna ai clienti">
        Caricamento cliente...
      </StatusMessage>
    );
  }
  if (error || !client) {
    return (
      <StatusMessage onBack={() => navigate('clients')} backLabel="Torna ai clienti" tone="error">
        {error ?? 'Nessun cliente selezionato.'}
      </StatusMessage>
    );
  }

  const data = editing && detailDraft ? detailDraft : client;

  return (
    <div className="max-w-[1440px] -mt-1">
      <ClientPageHeader
        back={{ label: 'Torna indietro', onClick: () => navigate('clients') }}
        crumbs={[
          { label: 'Clienti', onClick: () => navigate('clients') },
          { label: 'Dettaglio' },
        ]}
        name={data.name}
        surname={data.surname}
        code={data.code}
      />

      <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-[28px] items-start">
        <main>
          <PersonalDataCard data={data} editing={editing} setField={setDetailField} />

          <div className="grid grid-cols-2 gap-[28px] mt-[28px]">
            <AddressCard data={data} editing={editing} setField={setDetailField} />
            <ContactCard data={data} editing={editing} setField={setDetailField} />
          </div>

          <div className="mt-[28px]">
            <DataCard icon="sticky_note_2" title="Note">
              {editing ? (
                <EditInput type="textarea" value={data.note} onChange={(value) => setDetailField('note', value)} />
              ) : (
                <p className="font-body-md text-body-md text-[#171a20] whitespace-pre-line">
                  <FieldValue value={data.note} />
                </p>
              )}
            </DataCard>
          </div>
        </main>

        <aside className="border-l border-[#dde1e7] pl-[28px]">
          <ActionsCard editing={editing} onEdit={() => startEdit(data.code)} />
        </aside>
      </div>
    </div>
  );
}

function PersonalDataCard({ data, editing, setField }: CardProps) {
  return (
    <section className="rounded-[8px] border border-[#c9cdd4] bg-white px-[29px] py-[28px] shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
      <SectionTitle icon="person" title="Dati Anagrafici" />
      <div className="h-px bg-[#dde1e7] mt-[11px] mb-[20px]" />
      <FieldGrid data={data} fields={personalFields} editing={editing} onChange={setField} format={displayOf} />
    </section>
  );
}

function AddressCard({ data, editing, setField }: CardProps) {
  return (
    <section className="min-h-[300px] rounded-[8px] border border-[#c9cdd4] bg-white px-[29px] py-[28px]">
      <SectionTitle icon="home_pin" title="Residenza" />
      <div className="h-px bg-[#dde1e7] mt-[11px] mb-[22px]" />

      <dl className="space-y-[22px]">
        {addressFields.map((field) => {
          const raw = rawOf(data, field);
          return (
            <SpecRow
              key={field.key}
              label={field.label}
              value={displayOf(field, raw)}
              editing={editing}
              editValue={raw}
              inputType={field.type}
              onChange={(value) => setField(field.key, value)}
            />
          );
        })}
      </dl>
    </section>
  );
}

function ContactCard({ data, editing, setField }: CardProps) {
  return (
    <section className="min-h-[300px] rounded-[8px] border border-[#c9cdd4] bg-white px-[29px] py-[28px]">
      <SectionTitle icon="contact_phone" title="Contatti e Distretto" />
      <div className="h-px bg-[#dde1e7] mt-[11px] mb-[22px]" />

      <dl className="space-y-[22px]">
        {contactFields.map((field) => {
          const raw = rawOf(data, field);
          return (
            <SpecRow
              key={field.key}
              label={field.label}
              value={displayOf(field, raw)}
              editing={editing}
              editValue={raw}
              inputType={field.type}
              onChange={(value) => setField(field.key, value)}
            />
          );
        })}
      </dl>
    </section>
  );
}

function ActionsCard({ editing, onEdit }: { editing: boolean; onEdit: () => void }) {
  return (
    <section className="rounded-[10px] border border-[#e2e6ec] bg-white px-[24px] py-[25px]">
      <h3 className="font-label-caps text-label-caps font-bold uppercase text-[#737780]">Azioni cliente</h3>

      <div className="mt-[22px] space-y-[8px]">
        {clientActions.map((action) => {
          const selected = editing && action.id === 'edit';
          return (
            <button
              key={action.id}
              onClick={action.id === 'edit' && !editing ? onEdit : undefined}
              className={`flex h-[46px] w-full items-center gap-[18px] rounded-[6px] text-left font-body-md text-body-md transition-colors ${
                selected ? 'bg-secondary/10 font-semibold text-secondary' : 'text-[#171a20] hover:bg-[#f4f6f9]'
              }`}
            >
              <Icon name={action.icon} className="text-[24px] text-secondary" />
              {action.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function SpecRow({
  label,
  value,
  editing,
  editValue,
  inputType,
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  editValue: string;
  inputType?: FieldInputType;
  onChange: (value: string) => void;
}) {
  if (editing) {
    return (
      <div>
        <dt className="mb-[8px] font-label-caps text-label-caps font-bold uppercase text-[#737780]">{label}</dt>
        <dd>
          <EditInput type={inputType} value={editValue} onChange={onChange} />
        </dd>
      </div>
    );
  }
  return (
    <div className="flex items-start justify-between gap-6">
      <dt className="font-label-caps text-label-caps font-bold uppercase text-[#737780]">{label}</dt>
      <dd className="max-w-[230px] text-right font-body-md text-body-md font-bold text-[#171a20]">
        <FieldValue value={value} />
      </dd>
    </div>
  );
}
