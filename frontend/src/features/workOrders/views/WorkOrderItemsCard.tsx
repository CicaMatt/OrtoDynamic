import {
  DetailTableCard,
  type DetailTableColumn,
} from '../../../shared/entity/DetailTableCard';
import { useApiData } from '../../../shared/hooks/useApiData';
import { fetchWorkOrderItems } from '../api/workOrders';
import type { WorkOrderItem } from '../types';

/**
 * Columns shown for each quote line item linked to the work order. `productId`
 * is the raw `codice_nomenclatore` reference; the rest are the line's amounts.
 */
const itemColumns: ReadonlyArray<DetailTableColumn<WorkOrderItem>> = [
  { key: 'productId', label: 'Codice Nomenclatore' },
  { key: 'quantity', label: 'Quantità' },
  { key: 'price', label: 'Prezzo' },
  { key: 'amount', label: 'Importo' },
  { key: 'discount', label: 'Sconto' },
];

/** Read-only list of a work order's line items, shown as a box in the detail view. */
export function WorkOrderItemsCard({ workOrderId }: { workOrderId: string }) {
  const { data, loading, error } = useApiData(() => fetchWorkOrderItems(workOrderId), [workOrderId]);

  return (
    <DetailTableCard
      icon="inventory_2"
      title="Articoli Lavorazione"
      columns={itemColumns}
      items={data ?? []}
      loading={loading}
      error={error}
      rowKey={(item) => item.id}
      loadingLabel="Caricamento articoli..."
      emptyLabel="Nessun articolo per questa lavorazione."
    />
  );
}
