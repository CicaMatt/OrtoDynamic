import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityListView, type EntityColumn } from '../../../shared/entity/EntityListView';
import { formatBirthDate, previewText } from '../../../shared/format/format';
import { fetchQuotes } from '../api/quotes';
import type { Quote } from '../types';

/**
 * Every column of `preventivi` is shown. Categorical columns (type, status,
 * yes/no flags, operator) are filterable; dates render in Italian and are not
 * searched; long clinical/notes columns are previewed and excluded from search.
 */
const quoteColumns: ReadonlyArray<EntityColumn<Quote>> = [
  { key: 'id', label: 'ID', primary: true, filterable: false },
  { key: 'quoteNumber', label: 'Nº Preventivo', muted: true, filterable: false },
  { key: 'quoteType', label: 'Tipologia' },
  { key: 'status', label: 'Stato' },
  { key: 'clientId', label: 'ID Cliente', muted: true, filterable: false },
  { key: 'doctorId', label: 'ID Medico', muted: true, filterable: false },
  {
    key: 'creationDate',
    label: 'Data Creazione',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  {
    key: 'quoteDate',
    label: 'Data Preventivo',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  { key: 'total', label: 'Totale', muted: true, filterable: false },
  { key: 'entryBy', label: 'Inserito Da', muted: true },
  { key: 'authorizationNumber', label: 'Nº Autorizzazione', muted: true, filterable: false },
  {
    key: 'acceptanceDate',
    label: 'Data Accettazione',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  {
    key: 'authorizationReceiptDate',
    label: 'Ricezione Autorizzazione',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  { key: 'expiryDays', label: 'Giorni Scadenza', muted: true, filterable: false },
  { key: 'maxExpiry', label: 'Massima Scadenza', muted: true, filterable: false },
  { key: 'measurementsOk', label: 'Misure OK' },
  { key: 'commissionsPaid', label: 'Provvigioni Pagate' },
  { key: 'orderNumber', label: 'Nº Ordine', muted: true, filterable: false },
  { key: 'model', label: 'Modello', muted: true, filterable: false },
  { key: 'measurements', label: 'Misure', muted: true, filterable: false },
  { key: 'invoiceNumber', label: 'Nº Fattura', muted: true, filterable: false },
  {
    key: 'diagnosis',
    label: 'Diagnosi Circostanziata',
    muted: true,
    searchable: false,
    filterable: false,
    render: previewText,
  },
  {
    key: 'therapeuticProgram',
    label: 'Programma Terapeutico',
    muted: true,
    searchable: false,
    filterable: false,
    render: previewText,
  },
  {
    key: 'detailedPrescription',
    label: 'Prescrizione Dettagliata Protesi',
    muted: true,
    searchable: false,
    filterable: false,
    render: previewText,
  },
  {
    key: 'quote',
    label: 'Preventivo',
    muted: true,
    searchable: false,
    filterable: false,
    render: previewText,
  },
  { key: 'note', label: 'Note', muted: true, searchable: false, filterable: false, render: previewText },
  {
    key: 'privateNote',
    label: 'Note Private',
    muted: true,
    searchable: false,
    filterable: false,
    render: previewText,
  },
  {
    key: 'finalNote',
    label: 'Note Finali',
    muted: true,
    searchable: false,
    filterable: false,
    render: previewText,
  },
];

export function QuotesView() {
  const { openQuoteDetail } = useNavigation();

  return (
    <EntityListView
      title="Preventivi"
      columns={quoteColumns}
      fetchItems={fetchQuotes}
      rowKey={(quote) => quote.id}
      onRowClick={(quote) => openQuoteDetail(quote.id)}
      loadingLabel="Caricamento preventivi..."
      emptyLabel="Nessun preventivo trovato."
    />
  );
}
