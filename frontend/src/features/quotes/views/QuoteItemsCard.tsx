import {
  DetailTableCard,
  type DetailTableColumn,
} from '../../../shared/entity/DetailTableCard';
import { useApiData } from '../../../shared/hooks/useApiData';
import { fetchQuoteItems } from '../api/quotes';
import type { QuoteItem } from '../types';

/**
 * Columns shown for each `item_preventivi` row. `productId` is the raw
 * `codice_nomenclatore` reference; the rest are the line's amounts.
 */
const itemColumns: ReadonlyArray<DetailTableColumn<QuoteItem>> = [
  { key: 'productId', label: 'Codice Nomenclatore' },
  { key: 'quantity', label: 'Quantità' },
  { key: 'price', label: 'Prezzo' },
  { key: 'amount', label: 'Importo' },
  { key: 'discount', label: 'Sconto' },
];

/** Read-only list of a quote's line items, shown as a box in the detail view. */
export function QuoteItemsCard({ quoteId }: { quoteId: string }) {
  const { data, loading, error } = useApiData(() => fetchQuoteItems(quoteId), [quoteId]);

  return (
    <DetailTableCard
      icon="inventory_2"
      title="Articoli Preventivo"
      columns={itemColumns}
      items={data ?? []}
      loading={loading}
      error={error}
      rowKey={(item) => item.id}
      loadingLabel="Caricamento articoli..."
      emptyLabel="Nessun articolo per questo preventivo."
    />
  );
}
