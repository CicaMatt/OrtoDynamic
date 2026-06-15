import { StatusChangeDialog } from '../../../shared/entity/StatusChangeDialog';
import { changeWorkOrderStatus } from '../api/workOrders';

/**
 * Work order states, freely selectable with no transition rules. Kept in sync
 * with the backend's `WorkOrder.STATUSES` (the server validates against it).
 */
const WORK_ORDER_STATUSES = [
  'IN LAVORAZIONE',
  'IN FINITURA',
  'LAVORATO',
  'LAVORATO PARZIALE',
  'ANNULLATO',
  'DA CONSEGNARE',
  'PRONTO PRIMA PROVA',
  'PRONTO SECONDA PROVA',
  'PRONTO TERZA PROVA',
  'IN REVISIONE DOPO CONSEGNA',
  'INVIATE A LACO PER MODIFICA',
] as const;

/** Status dialog for a work order: any of the fixed states may be chosen. */
export function WorkOrderStatusDialog({
  workOrderId,
  currentStatus,
  onClose,
  onChanged,
}: {
  workOrderId: string;
  currentStatus: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  return (
    <StatusChangeDialog
      title="Cambia Stato Lavorazione"
      currentStatus={currentStatus}
      available={WORK_ORDER_STATUSES}
      emptyLabel="Nessuno stato disponibile."
      onApply={(target) => changeWorkOrderStatus(workOrderId, target)}
      onClose={onClose}
      onChanged={onChanged}
    />
  );
}
