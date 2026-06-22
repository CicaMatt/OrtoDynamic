import { useEffect, useRef, useState } from 'react';
import {
  DetailTableCard,
  type DetailTableColumn,
} from '../../../shared/entity/DetailTableCard';
import { useApiData } from '../../../shared/hooks/useApiData';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { formatBirthDate, formatEuro, formatInteger } from '../../../shared/format/format';
import { ReferenceName } from '../../../shared/ui/ReferenceName';
import { fetchWorkOrderItems, updateWorkOrderItem } from '../api/workOrders';
import type { WorkOrderItem } from '../types';

const ITEM_STATUSES = ['IN LAVORAZIONE', 'ORDINATO', 'PRONTO', 'CONSEGNATO', 'ANNULLATO'];
const ITEM_PRODUCTIONS = ['ESTERNA', 'INTERNA'];

// The backend stores the line status as a numeric code; map it to its label for display.
const STATUS_CODE_LABELS: Record<string, string> = {
  '5': 'IN LAVORAZIONE',
};
const renderStatus = (value: string) => STATUS_CODE_LABELS[value] ?? value;

// Statuses that gate the two conditional dates, and the date keys to null-blank.
const CANCELLED = 'ANNULLATO';
const DELIVERED = 'CONSEGNATO';
const DATE_KEYS = ['cancellationDate', 'orderDate', 'partialDeliveryDate', 'deliveryDate'];

/**
 * Columns shown for each work order line. The first group is joined from the
 * quote line (`item_preventivi`); the rest are the line's own. In edit mode
 * `status`/`production` are selects and the dates are date inputs;
 * `cancellationDate`/`deliveryDate` are editable (and required) only for their
 * matching status.
 */
const itemColumns: ReadonlyArray<DetailTableColumn<WorkOrderItem>> = [
  { key: 'productId', label: 'Codice Nomenclatore' },
  { key: 'quantity', label: 'Quantità', render: formatInteger },
  { key: 'price', label: 'Prezzo', render: formatEuro },
  { key: 'amount', label: 'Importo', render: formatEuro },
  { key: 'discount', label: 'Sconto' },
  { key: 'status', label: 'Stato', render: renderStatus, editOptions: ITEM_STATUSES },
  { key: 'production', label: 'Produzione', editOptions: ITEM_PRODUCTIONS },
  {
    key: 'cancellationDate',
    label: 'Data Annullamento',
    render: formatBirthDate,
    editDate: true,
    editableWhen: (item) => item.status === CANCELLED,
    invalidWhen: (item) => item.status === CANCELLED && !item.cancellationDate,
  },
  { key: 'orderDate', label: 'Data Ordine', render: formatBirthDate, editDate: true },
  { key: 'partialDeliveryDate', label: 'Data Consegna Parziale', render: formatBirthDate, editDate: true },
  {
    key: 'deliveryDate',
    label: 'Data Consegna',
    render: formatBirthDate,
    editDate: true,
    editableWhen: (item) => item.status === DELIVERED,
    invalidWhen: (item) => item.status === DELIVERED && !item.deliveryDate,
  },
];

/** Pending edits (status/production/dates) keyed by line id. */
type ItemEdits = Record<string, Record<string, string>>;

/**
 * Read-only list of a work order's lines; in the work order's edit mode the
 * status/production cells become editable and persist with the global Save.
 */
export function WorkOrderItemsCard({ workOrderId }: { workOrderId: string }) {
  const { editing, editTarget, dataVersion, registerSaveHook, markExtraDirty } = useEntityEdit();
  const isEditing = editing && editTarget?.type === 'workOrder' && editTarget.id === workOrderId;

  const { data, loading, error } = useApiData(
    () => fetchWorkOrderItems(workOrderId),
    [workOrderId, dataVersion],
  );

  const [edits, setEdits] = useState<ItemEdits>({});

  // Discard pending edits when leaving edit mode or when fresh data arrives.
  useEffect(() => {
    if (!isEditing) setEdits({});
  }, [isEditing]);
  useEffect(() => {
    setEdits({});
  }, [data]);

  const items: WorkOrderItem[] = (data ?? []).map((item) => ({ ...item, ...edits[item.id] }));
  const isDirty = Object.keys(edits).length > 0;

  // Report dirtiness so the global Save button and the unsaved-changes guard
  // account for pending item edits.
  useEffect(() => {
    if (!isEditing) return;
    markExtraDirty(isDirty);
    return () => markExtraDirty(false);
  }, [isEditing, isDirty, markExtraDirty]);

  // Persist the edits as part of the global Save. The hook reads the latest
  // edits/items via refs, since it is registered once per edit session.
  const editsRef = useRef(edits);
  editsRef.current = edits;
  const itemsRef = useRef(items);
  itemsRef.current = items;
  useEffect(() => {
    if (!isEditing) return;
    return registerSaveHook(async () => {
      // The conditional dates are required for their matching status.
      for (const item of itemsRef.current) {
        if (!editsRef.current[item.id]) continue;
        if (item.status === CANCELLED && !item.cancellationDate) {
          throw new Error(`Articolo ${item.productId || item.id}: indicare la Data Annullamento.`);
        }
        if (item.status === DELIVERED && !item.deliveryDate) {
          throw new Error(`Articolo ${item.productId || item.id}: indicare la Data Consegna.`);
        }
      }
      for (const [id, change] of Object.entries(editsRef.current)) {
        const payload: Record<string, string | null> = {};
        for (const [key, value] of Object.entries(change)) {
          payload[key] = DATE_KEYS.includes(key) && value === '' ? null : value;
        }
        await updateWorkOrderItem(workOrderId, id, payload);
      }
    });
  }, [isEditing, registerSaveHook, workOrderId]);

  const onCellChange = (item: WorkOrderItem, key: keyof WorkOrderItem, value: string) => {
    setEdits((prev) => {
      const itemEdits = { ...prev[item.id], [key]: value };
      // A conditional date exists only for its status, so clear it when the
      // status moves away (its cell also becomes read-only).
      if (key === 'status') {
        if (value !== CANCELLED) itemEdits.cancellationDate = '';
        if (value !== DELIVERED) itemEdits.deliveryDate = '';
      }
      return { ...prev, [item.id]: itemEdits };
    });
  };
  const columns = itemColumns.map((column) =>
    column.key === 'productId'
      ? {
          ...column,
          renderNode: (value: string, item: WorkOrderItem) => (
            <ReferenceName name={value} id={item.productId} entity="product" />
          ),
        }
      : column,
  );

  return (
    <DetailTableCard
      icon="inventory_2"
      title="Articoli Lavorazione"
      columns={columns}
      items={items}
      loading={loading}
      error={error}
      rowKey={(item) => item.id}
      loadingLabel="Caricamento articoli..."
      emptyLabel="Nessun articolo per questa lavorazione."
      editing={isEditing}
      onCellChange={onCellChange}
    />
  );
}
