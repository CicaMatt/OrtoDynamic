import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityListView, type EntityColumn } from '../../../shared/entity/EntityListView';
import { formatBirthDate, formatEuro, previewText } from '../../../shared/format/format';
import { ReferenceName } from '../../../shared/ui/ReferenceName';
import { fetchQuotes } from '../api/quotes';
import type { Quote } from '../types';

/**
 * Every column of `preventivi` is shown. Categorical columns (type, status,
 * yes/no flags, operator) are filterable; dates render in Italian and are not
 * searched; long clinical/notes columns are previewed and excluded from search.
 */
const quoteColumns: ReadonlyArray<EntityColumn<Quote>> = [
  { key: 'idQuote', label: 'ID Preventivo', primary: true, filterable: false },
  { key: 'quoteType', label: 'Tipologia', searchable: false },
  { key: 'status', label: 'Stato', searchable: false },
  {
    key: 'clientName',
    label: 'Cliente',
    muted: true,
    renderCell: (quote) => <ReferenceName name={quote.clientName} id={quote.clientId} />,
  },
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
    key: 'doctorName',
    label: 'Medico',
    muted: true,
    renderCell: (quote) => <ReferenceName name={quote.doctorName} id={quote.doctorId} />,
  },
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
  { key: 'total', label: 'Totale', muted: true, filterable: false, render: formatEuro },
  { key: 'entryBy', label: 'Inserito Da', muted: true },
  { key: 'authorizationNumber', label: 'Nº Autorizzazione', muted: true},
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
    label: 'Data Ricezione Autorizzazione',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  { key: 'expiryDays', label: 'Giorni Massima Scadenza', muted: true, filterable: false },
  {
    key: 'maxExpiry',
    label: 'Data Massima Scadenza',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  { key: 'measurementsOk', label: 'Misure OK', searchable: false },
  { key: 'commissionsPaid', label: 'Provvigioni Pagate' },
  { key: 'orderNumber', label: 'Nº Ordine', muted: true},
  { key: 'model', label: 'Modello', muted: true, filterable: false },
  { key: 'measurements', label: 'Misure', muted: true, filterable: false },
  { key: 'invoiceNumber', label: 'Nº Fattura', muted: true},
  {
    key: 'quote',
    label: 'Preventivo',
    muted: true,
    searchable: false,
    filterable: false,
    render: previewText,
  },
  { key: 'quoteNumber', label: 'Nº Preventivo', muted: true, filterable: false },
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
  const { openQuoteDetail, openQuoteCreate } = useNavigation();

  return (
    <EntityListView
      title="Preventivi"
      columns={quoteColumns}
      fetchItems={fetchQuotes}
      rowKey={(quote) => quote.idQuote}
      onRowClick={(quote) => openQuoteDetail(quote.idQuote)}
      onCreate={openQuoteCreate}
      categoricalFiltersFirst
      loadingLabel="Caricamento preventivi..."
      emptyLabel="Nessun preventivo trovato."
    />
  );
}
