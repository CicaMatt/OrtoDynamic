import { useNavigation, useRoute } from '../../../app/navigation/NavigationContext';
import { entityCreateRoute, entityDetailRoute } from '../../../app/navigation/routes';
import { EntityListView, type EntityColumn } from '../../../shared/entity/EntityListView';
import { formatBirthDate, formatEuro, previewText } from '../../../shared/format/format';
import { ReferenceLabel } from '../../../shared/ui/ReferenceLabel';
import { fetchQuotes } from '../api/quotes';
import type { Quote } from '../types';

/**
 * Every column of `preventivi` is shown. Categorical columns (type, status,
 * yes/no flags, operator, notes) are filterable; dates render in Italian and are
 * not searched; long clinical columns are previewed and excluded from search.
 */
const quoteColumns: ReadonlyArray<EntityColumn<Quote>> = [
  { key: 'idQuote', label: 'ID Preventivo', primary: true, filterable: false },
  { key: 'quoteType', label: 'Tipologia', searchable: false },
  {
    key: 'clientName',
    label: 'Cliente',
    muted: true,
    cell: (quote) => <ReferenceLabel name={quote.clientName} id={quote.clientId} />,
  },
  { key: 'status', label: 'Stato', searchable: false },
  {
    key: 'quoteDate',
    label: 'Data Preventivo',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  {
    key: 'creationDate',
    label: 'Data Prescrizione',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
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
    key: 'acceptanceDate',
    label: 'Data Accettazione',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  { key: 'orderNumber', label: 'N. Ordine', muted: true, filterable: false },
  { key: 'clientCity', label: 'Città Cliente', muted: true },
  {
    key: 'maxExpiry',
    label: 'Data Massima Scadenza',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  {
    key: 'diagnosis',
    label: 'Diagnosi Circostanziata',
    muted: true,
    searchable: false,
    filterable: false,
    render: previewText,
  },
  { key: 'note', label: 'Note', muted: true, render: previewText },
  {
    key: 'doctorName',
    label: 'Medico',
    muted: true,
    cell: (quote) => <ReferenceLabel name={quote.doctorName} id={quote.doctorId} />,
  },
  { key: 'total', label: 'Totale', muted: true, filterable: false, render: formatEuro },
  { key: 'entryBy', label: 'Inserito Da', muted: true },
  { key: 'authorizationNumber', label: 'Nº Autorizzazione', muted: true },
  {
    key: 'authorizationReceiptDate',
    label: 'Data Ricezione Autorizzazione',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  { key: 'expiryDays', label: 'Giorni Massima Scadenza', muted: true, filterable: false },
  { key: 'measurementsOk', label: 'Misure OK', searchable: false },
  { key: 'commissionsPaid', label: 'Provvigioni Pagate' },
  { key: 'model', label: 'Modello', muted: true, filterable: false },
  { key: 'measurements', label: 'Misure', muted: true, filterable: false },
  { key: 'invoiceNumber', label: 'Nº Fattura', muted: true, filterable: false },
  {
    key: 'quote',
    label: 'Preventivo',
    muted: true,
    searchable: false,
    filterable: false,
    render: previewText,
  },
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
  const { navigate } = useNavigation();
  const { status } = useRoute('quotes');

  return (
    <EntityListView
      key={status ?? 'all'}
      title="Preventivi"
      columns={quoteColumns}
      fetchItems={fetchQuotes}
      initialFilters={status ? { status } : undefined}
      rowKey={(quote) => quote.idQuote}
      onRowClick={(quote) => navigate(entityDetailRoute('quote', quote.idQuote))}
      onCreate={() => navigate(entityCreateRoute('quote'))}
      categoricalFiltersFirst
      loadingLabel="Caricamento preventivi..."
      emptyLabel="Nessun preventivo trovato."
    />
  );
}
