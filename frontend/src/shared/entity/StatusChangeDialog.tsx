import { useState } from 'react';
import { Icon } from '../ui/Icon';

/**
 * Modal for changing an entity's status. Presentational: the caller supplies the
 * selectable states (static or fetched) and the `onApply` action, so the same
 * dialog serves both rule-driven (quotes) and free-choice (work orders) flows.
 * Picking a state applies it, then reports back so the detail view can refresh.
 */
export function StatusChangeDialog({
  title,
  currentStatus,
  available,
  loading = false,
  error = null,
  emptyLabel,
  onApply,
  onClose,
  onChanged,
}: {
  title: string;
  currentStatus: string;
  available: ReadonlyArray<string>;
  /** Whether the selectable states are still being loaded. */
  loading?: boolean;
  /** Error from loading the selectable states, if any. */
  error?: string | null;
  /** Message shown when no state is selectable. */
  emptyLabel: string;
  onApply: (target: string) => Promise<unknown>;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const apply = async (target: string) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onApply(target);
      onChanged();
      onClose();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Errore durante il cambio di stato.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-[440px] max-w-full rounded-[12px] bg-white p-[28px] shadow-[0_16px_48px_rgba(0,0,0,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="font-headline-md text-headline-md font-bold text-black">{title}</h3>
        <p className="mt-[10px] font-body-md text-body-md text-on-surface-variant">
          Stato attuale: <span className="font-semibold text-on-surface">{currentStatus || '—'}</span>
        </p>

        <div className="mt-[20px]">
          {loading ? (
            <p className="font-body-md text-body-md text-on-surface-variant">Caricamento stati…</p>
          ) : error ? (
            <p className="font-body-md text-body-md text-error">{error}</p>
          ) : available.length === 0 ? (
            <p className="font-body-md text-body-md text-on-surface-variant">{emptyLabel}</p>
          ) : (
            <div className="space-y-[8px]">
              {available.map((target) => (
                <button
                  key={target}
                  type="button"
                  disabled={submitting}
                  onClick={() => apply(target)}
                  className="flex w-full items-center justify-between rounded-[6px] border border-outline-variant px-[16px] py-[12px] text-left font-body-md text-body-md text-on-surface hover:bg-surface-container-low disabled:opacity-50"
                >
                  {target}
                  <Icon name="arrow_forward" className="text-[18px] text-secondary" />
                </button>
              ))}
            </div>
          )}
        </div>

        {submitError && <p className="mt-[14px] font-body-sm text-body-sm text-error">{submitError}</p>}

        <div className="mt-[24px] flex justify-end">
          <button
            onClick={onClose}
            disabled={submitting}
            className="h-[40px] rounded-[6px] border border-outline-variant px-[18px] font-body-md text-body-md font-semibold text-on-surface hover:bg-surface-container-high disabled:opacity-50"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
}
