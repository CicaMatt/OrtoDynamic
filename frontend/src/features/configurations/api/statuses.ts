import { apiGet } from '../../../shared/api/http';
import type { Status, StatusTransition } from '../types';

/**
 * Workflow-table key for the Preventivi domain in the shared `stato` /
 * `stato_check` tables. Mirrors `Quote.STATUS_TABLE` on the backend.
 */
const QUOTE_STATUS_TABLE = 'PREVENTIVI';

/** The states defined for the Preventivi workflow. */
export function fetchQuoteStatuses(): Promise<Status[]> {
  return apiGet<Status[]>(`/statuses/?table=${QUOTE_STATUS_TABLE}`);
}

/** The permitted state transitions for the Preventivi workflow. */
export function fetchQuoteStatusTransitions(): Promise<StatusTransition[]> {
  return apiGet<StatusTransition[]>(`/statuses/transitions/?table=${QUOTE_STATUS_TABLE}`);
}
