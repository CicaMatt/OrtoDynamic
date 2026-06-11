import { useEffect } from 'react';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityPageHeader } from '../../../shared/entity/EntityPageHeader';
import {
  FieldSectionList,
  type FieldSectionConfig,
} from '../../../shared/entity/FieldSectionCard';
import { optionsFromValues, type FieldConfig } from '../../../shared/entity/DataCard';
import { useApiData } from '../../../shared/hooks/useApiData';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { fetchQuote } from '../api/quotes';
import type { Quote } from '../types';

type QuoteField = FieldConfig<Quote>;

// Stored verbatim in the `stato` column — values must match the database exactly.
const statusOptions = optionsFromValues([
  'IN BOZZA',
  'INSERITO',
  'IN LAVORAZIONE',
  'IN LAVORAZIONE SENZA AUTORIZZAZIONE',
  'AUTORIZZATO',
  'INVIATO',
  'CONSEGNATO',
  'FATTURATO',
  'RISCOSSO',
  'SOSPESO',
  'ANNULLATO',
  'RIFIUTATO',
]);

const typeOptions = optionsFromValues(['Asl', 'Privato', 'Inail']);
const yesNoOptions = optionsFromValues(['Si', 'No']);

const identityFields: QuoteField[] = [
  { label: 'ID', key: 'id', readonly: true },
  { label: 'Nº Preventivo', key: 'quoteNumber' },
  { label: 'Stato', key: 'status', type: 'select', options: statusOptions },
  { label: 'Tipologia', key: 'quoteType', type: 'select', options: typeOptions },
  { label: 'Data Creazione', key: 'creationDate', type: 'date' },
  { label: 'Data Preventivo', key: 'quoteDate', type: 'date' },
  { label: 'Totale', key: 'total', type: 'number' },
];

const referenceFields: QuoteField[] = [
  { label: 'ID Cliente', key: 'clientId', type: 'number' },
  { label: 'ID Medico', key: 'doctorId', type: 'number' },
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
  { label: 'Misure OK', key: 'measurementsOk', type: 'select', options: yesNoOptions },
  { label: 'Provvigioni Pagate', key: 'commissionsPaid', type: 'select', options: yesNoOptions },
  { label: 'Nº Ordine', key: 'orderNumber' },
  { label: 'Modello', key: 'model' },
  { label: 'Misure', key: 'measurements' },
  { label: 'Nº Fattura', key: 'invoiceNumber' },
];

const quoteTextFields: QuoteField[] = [{ label: 'Preventivo', key: 'quote', type: 'textarea' }];

const noteFields: QuoteField[] = [
  { label: 'Note', key: 'note', type: 'textarea' },
  { label: 'Note Private', key: 'privateNote', type: 'textarea' },
  { label: 'Note Finali', key: 'finalNote', type: 'textarea' },
];

const quoteActions = [{ id: 'edit', icon: 'edit', label: 'Modifica Dati Preventivo' }];

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
  const { selectedQuoteId, navigate } = useNavigation();
  const {
    editing,
    editTarget,
    quoteDraft,
    dataVersion,
    startQuoteEdit,
    seedQuote,
    setQuoteField,
  } = useEntityEdit();

  const isEditingQuote = editing && editTarget?.type === 'quote' && editTarget.id === selectedQuoteId;

  const { data: quote, loading, error } = useApiData(
    () =>
      selectedQuoteId
        ? fetchQuote(selectedQuoteId)
        : Promise.reject(new Error('Nessun preventivo selezionato.')),
    [selectedQuoteId, dataVersion],
  );

  useEffect(() => {
    if (isEditingQuote && quote) seedQuote(quote);
  }, [isEditingQuote, quote, seedQuote]);

  if (loading) {
    return (
      <StatusMessage onBack={() => navigate('quotes')} backLabel="Torna ai preventivi">
        Caricamento preventivo...
      </StatusMessage>
    );
  }
  if (error || !quote) {
    return (
      <StatusMessage onBack={() => navigate('quotes')} backLabel="Torna ai preventivi" tone="error">
        {error ?? 'Nessun preventivo selezionato.'}
      </StatusMessage>
    );
  }

  const data = isEditingQuote && quoteDraft ? quoteDraft : quote;
  const title = data.quoteNumber ? `Preventivo Nº ${data.quoteNumber}` : `Preventivo ${data.id}`;
  const actions = quoteActions.map((action) => ({
    ...action,
    active: isEditingQuote,
    onClick: !isEditingQuote ? () => startQuoteEdit(data.id) : undefined,
  }));

  return (
    <EntityDetailLayout
      header={
        <EntityPageHeader
          back={{ label: 'Torna indietro', onClick: () => navigate('quotes') }}
          crumbs={[
            { label: 'Preventivi', onClick: () => navigate('quotes') },
            { label: 'Dettaglio' },
          ]}
          title={title}
          subtitle={
            <>
              ID: <span className="font-semibold text-[#343942]">{data.id}</span>
              {data.status && (
                <>
                  {' · Stato: '}
                  <span className="font-semibold text-[#343942]">{data.status}</span>
                </>
              )}
            </>
          }
        />
      }
      actionsTitle="Azioni preventivo"
      actions={actions}
    >
      <FieldSectionList
        data={data}
        sections={quoteSections}
        editing={isEditingQuote}
        onChange={setQuoteField}
      />
    </EntityDetailLayout>
  );
}
