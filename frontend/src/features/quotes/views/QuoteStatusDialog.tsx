import { StatusChangeDialog } from '../../../shared/entity/StatusChangeDialog';
import { useApiData } from '../../../shared/hooks/useApiData';
import { changeQuoteStatus, fetchQuoteStatusTransitions } from '../api/quotes';

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
      onClose={onClose}
      onChanged={onChanged}
    />
  );
}
