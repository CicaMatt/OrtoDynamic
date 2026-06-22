import { StatusChangeDialog } from '../../../shared/entity/StatusChangeDialog';
import { useApiData } from '../../../shared/hooks/useApiData';
import { changeQuoteStatus, fetchQuoteStatusTransitions } from '../api/quotes';

// Target states that also create a work order (lavorazioni) on the backend — mirror
// of apps.work_orders.services.WORK_ORDER_TRIGGER_STATES. Selecting one asks for
// confirmation first, since it creates entities beyond the status change.
const WORK_ORDER_TRIGGER_STATES = new Set([
  'IN LAVORAZIONE',
  'IN LAVORAZIONE SENZA AUTORIZZAZIONE',
]);

/**
 * Status dialog for a quote: the selectable states are the transitions the
 * backend permits from the current state (`stato_check`), fetched on open.
 */
export function QuoteStatusDialog({
  quoteId,
  currentStatus,
  onClose,
  onChanged,
}: {
  quoteId: string;
  currentStatus: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { data, loading, error } = useApiData(
    () => fetchQuoteStatusTransitions(quoteId),
    [quoteId],
  );

  return (
    <StatusChangeDialog
      title="Cambia Stato Preventivo"
      currentStatus={currentStatus}
      available={data?.available ?? []}
      loading={loading}
      error={error}
      emptyLabel="Nessuna transizione disponibile da questo stato."
      onApply={(target) => changeQuoteStatus(quoteId, target)}
      confirmTarget={(target) =>
        WORK_ORDER_TRIGGER_STATES.has(target)
          ? `Passando a «${target}» verrà creata la relativa lavorazione con le sue righe. Procedere?`
          : null
      }
      onClose={onClose}
      onChanged={onChanged}
    />
  );
}
