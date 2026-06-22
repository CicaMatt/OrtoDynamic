import { useState } from 'react';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useEntityDetail } from '../../../app/editing/useEntityDetail';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityPageHeader } from '../../../shared/entity/EntityPageHeader';
import {
  FieldSectionList,
  type FieldSectionConfig,
} from '../../../shared/entity/FieldSectionCard';
import { optionsFromValues, type FieldConfig } from '../../../shared/entity/DataCard';
import { formatEuro } from '../../../shared/format/format';
import { useInlineDocument } from '../../../shared/files/useInlineDocument';
import { FieldValue } from '../../../shared/ui/FieldValue';
import { Icon } from '../../../shared/ui/Icon';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { ReferenceName } from '../../../shared/ui/ReferenceName';
import { fetchQuote, fetchQuoteDdt, fetchQuoteDeliveryForm, fetchQuoteScheda } from '../api/quotes';
import type { Quote } from '../types';
import { QuoteItemsCard } from './QuoteItemsCard';
import { QuoteStatusDialog } from './QuoteStatusDialog';

type QuoteField = FieldConfig<Quote>;

const typeOptions = optionsFromValues(['Asl', 'Privato', 'Inail']);
const yesNoOptions = optionsFromValues(['Si', 'No']);

// `Stato` is read-only here: it changes only via the guarded "Cambia Stato"
// action, which follows the `stato_check` transition rules.
const identityFields: QuoteField[] = [
  { label: 'ID', key: 'id', readonly: true },
  { label: 'Nº Preventivo', key: 'quoteNumber' },
  { label: 'Data Creazione', key: 'creationDate', type: 'date' },
  { label: 'Tipologia', key: 'quoteType', type: 'select', options: typeOptions },
  { label: 'Stato', key: 'status', readonly: true },
  { label: 'Data Preventivo', key: 'quoteDate', type: 'date' },
  {
    label: 'Totale',
    key: 'total',
    type: 'number',
    renderValue: (raw) => <FieldValue value={formatEuro(raw)} />,
  },
];

// In read mode the client/doctor show by name with their id revealed on hover;
// edit mode keeps the numeric id input, since references are still set by id.
const referenceFields: QuoteField[] = [
  {
    label: 'Cliente',
    key: 'clientId',
    type: 'number',
    renderValue: (id, quote) => <ReferenceName name={quote.clientName} id={id} entity="client" />,
  },
  {
    label: 'Medico',
    key: 'doctorId',
    type: 'number',
    renderValue: (id, quote) => <ReferenceName name={quote.doctorName} id={id} entity="doctor" />,
  },
  { label: 'Inserito Da', key: 'entryBy' },
];

const clinicalFields: QuoteField[] = [
  { label: 'Diagnosi Circostanziata', key: 'diagnosis', type: 'textarea' },
  { label: 'Programma Terapeutico', key: 'therapeuticProgram', type: 'textarea' },
  { label: 'Prescrizione Dettagliata Protesi', key: 'detailedPrescription', type: 'textarea' },
];

const authorizationFields: QuoteField[] = [
  { label: 'Nº Autorizzazione', key: 'authorizationNumber' },
  { label: 'Data Accettazione', key: 'acceptanceDate', type: 'date' },
  { label: 'Data Ricezione Autorizzazione', key: 'authorizationReceiptDate', type: 'date' },
  { label: 'Giorni Scadenza', key: 'expiryDays' },
  { label: 'Massima Scadenza', key: 'maxExpiry' },
];

const supplyFields: QuoteField[] = [
  { label: 'Nº Ordine', key: 'orderNumber' },
  { label: 'Nº Fattura', key: 'invoiceNumber' },
  { label: 'Provvigioni Pagate', key: 'commissionsPaid', type: 'select', options: yesNoOptions },
  { label: 'Misure OK', key: 'measurementsOk', type: 'select', options: yesNoOptions },
  { label: 'Modello', key: 'model' },
  { label: 'Misure', key: 'measurements' },
];

const quoteTextFields: QuoteField[] = [{ label: 'Preventivo', key: 'quote', type: 'textarea' }];

const noteFields: QuoteField[] = [
  { label: 'Note', key: 'note', type: 'textarea' },
  { label: 'Note Private', key: 'privateNote', type: 'textarea' },
  { label: 'Note Finali', key: 'finalNote', type: 'textarea' },
];

const quoteSections: FieldSectionConfig<Quote>[] = [
  { icon: 'request_quote', title: 'Dati Preventivo', fields: identityFields },
  { icon: 'group', title: 'Riferimenti', fields: referenceFields },
  { icon: 'clinical_notes', title: 'Dati Clinici', fields: clinicalFields, columns: 1 },
  { icon: 'fact_check', title: 'Autorizzazione e Scadenze', fields: authorizationFields },
  { icon: 'receipt_long', title: 'Fornitura e Fatturazione', fields: supplyFields },
  { icon: 'description', title: 'Dettaglio Preventivo', fields: quoteTextFields, columns: 1 },
  { icon: 'sticky_note_2', title: 'Note', fields: noteFields, columns: 1 },
];

export function QuoteDetailView() {
  const { selectedQuoteId, navigate, goBack } = useNavigation();
  const { quoteDraft, startQuoteEdit, seedQuote, setQuoteField } = useEntityEdit();

  const { data, loading, error, isEditing, reload } = useEntityDetail({
    type: 'quote',
    selectedId: selectedQuoteId,
    fetcher: fetchQuote,
    missingMessage: 'Nessun preventivo selezionato.',
    draft: quoteDraft,
    seed: seedQuote,
  });

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [ddtOptionsOpen, setDdtOptionsOpen] = useState(false);
  const { generating, error: docError, clearError, open: openDocument } =
    useInlineDocument<'consegna' | 'ddt' | 'scheda'>();

  if (loading) {
    return (
      <StatusMessage onBack={() => goBack('quotes')} backLabel="Torna ai preventivi">
        Caricamento preventivo...
      </StatusMessage>
    );
  }
  if (error || !data) {
    return (
      <StatusMessage onBack={() => goBack('quotes')} backLabel="Torna ai preventivi" tone="error">
        {error ?? 'Nessun preventivo selezionato.'}
      </StatusMessage>
    );
  }

  const title = data.quoteNumber ? `Preventivo Nº ${data.quoteNumber}` : `Preventivo ${data.id}`;

  const actions = [
    {
      id: 'edit',
      icon: 'edit',
      label: 'Modifica Dati Preventivo',
      active: isEditing,
      onClick: !isEditing ? () => startQuoteEdit(data.id) : undefined,
    },
    {
      id: 'status',
      icon: 'sync_alt',
      label: 'Cambia Stato',
      onClick: !isEditing ? () => setStatusDialogOpen(true) : undefined,
    },
    {
      id: 'delivery-form',
      icon: 'picture_as_pdf',
      label: generating === 'consegna' ? 'Generazione modulo…' : 'Modulo di Consegna',
      onClick:
        !isEditing && !generating
          ? () => openDocument('consegna', () => fetchQuoteDeliveryForm(data.id))
          : undefined,
    },
    {
      id: 'ddt',
      icon: 'local_shipping',
      label: generating === 'ddt' ? 'Generazione DDT…' : 'Genera DDT',
      onClick: !isEditing && !generating ? () => setDdtOptionsOpen(true) : undefined,
    },
    {
      id: 'scheda',
      icon: 'assignment',
      label: generating === 'scheda' ? 'Generazione scheda…' : 'Scheda Progetto',
      onClick:
        !isEditing && !generating
          ? () => openDocument('scheda', () => fetchQuoteScheda(data.id))
          : undefined,
    },
  ];

  return (
    <>
      <EntityDetailLayout
        header={
          <EntityPageHeader
            back={{ label: 'Torna indietro', onClick: () => goBack('quotes') }}
            crumbs={[
              { label: 'Preventivi', onClick: () => navigate('quotes') },
              { label: 'Dettaglio' },
            ]}
            title={title}
            subtitle={
              <>
                ID: <span className="font-semibold text-on-surface">{data.id}</span>
                {data.status && (
                  <>
                    {' · Stato: '}
                    <span className="font-semibold text-on-surface">{data.status}</span>
                  </>
                )}
              </>
            }
          />
        }
        actionsTitle="Azioni preventivo"
        actions={actions}
      >
        <div className="space-y-[28px]">
          {docError && (
            <div
              role="alert"
              className="flex items-start justify-between gap-3 rounded-[10px] border border-error bg-error/10 px-[20px] py-[14px]"
            >
              <span className="font-body-sm text-body-sm text-error">{docError}</span>
              <button
                type="button"
                onClick={clearError}
                aria-label="Chiudi"
                className="text-error/70 hover:text-error"
              >
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
          )}
          <FieldSectionList
            data={data}
            sections={quoteSections}
            editing={isEditing}
            onChange={setQuoteField}
          />
          <QuoteItemsCard quoteId={data.id} />
        </div>
      </EntityDetailLayout>

      {statusDialogOpen && (
        <QuoteStatusDialog
          quoteId={data.id}
          currentStatus={data.status}
          onClose={() => setStatusDialogOpen(false)}
          onChanged={reload}
        />
      )}
      {ddtOptionsOpen && (
        <DdtOptionsDialog
          generating={generating === 'ddt'}
          onClose={() => setDdtOptionsOpen(false)}
          onGenerate={(includePrices) => {
            setDdtOptionsOpen(false);
            openDocument('ddt', () => fetchQuoteDdt(data.id, includePrices));
          }}
        />
      )}
    </>
  );
}

function DdtOptionsDialog({
  generating,
  onClose,
  onGenerate,
}: {
  generating: boolean;
  onClose: () => void;
  onGenerate: (includePrices: boolean) => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ddt-options-title"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-[460px] max-w-full rounded-[12px] bg-white p-[28px] shadow-[0_16px_48px_rgba(0,0,0,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="ddt-options-title" className="font-headline-md text-headline-md font-bold text-black">
          Genera DDT
        </h3>
        <p className="mt-[10px] font-body-md text-body-md text-on-surface-variant">
          Scegli se includere prezzo unitario e totale riga per ogni articolo.
        </p>

        <div className="mt-[24px] grid gap-[10px]">
          <button
            type="button"
            disabled={generating}
            onClick={() => onGenerate(false)}
            className="flex h-[46px] items-center justify-between rounded-[6px] border border-outline-variant px-[16px] font-body-md text-body-md font-semibold text-on-surface hover:bg-surface-container-high disabled:opacity-50"
          >
            Senza prezzi
            <Icon name="visibility_off" className="text-[20px] text-secondary" />
          </button>
          <button
            type="button"
            disabled={generating}
            onClick={() => onGenerate(true)}
            className="flex h-[46px] items-center justify-between rounded-[6px] bg-secondary px-[16px] font-body-md text-body-md font-semibold text-on-secondary hover:bg-secondary-hover disabled:opacity-50"
          >
            Con prezzi
            <Icon name="euro" className="text-[20px]" />
          </button>
        </div>

        <div className="mt-[22px] flex justify-end">
          <button
            type="button"
            disabled={generating}
            onClick={onClose}
            className="h-[40px] rounded-[6px] border border-outline-variant px-[18px] font-body-md text-body-md font-semibold text-on-surface hover:bg-surface-container-high disabled:opacity-50"
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
}
