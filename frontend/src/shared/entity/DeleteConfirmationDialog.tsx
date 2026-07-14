import { useState } from 'react';

export function DeleteConfirmationDialog({
  title,
  message,
  warnings = [],
  confirmLabel,
  onConfirm,
  onClose,
}: {
  title: string;
  message: string;
  warnings?: string[];
  confirmLabel: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eliminazione non riuscita.');
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      onClick={submitting ? undefined : onClose}
    >
      <div
        className="w-[460px] max-w-full rounded-[12px] bg-white p-[28px] shadow-[0_16px_48px_rgba(0,0,0,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="font-headline-md text-headline-md font-bold text-black">{title}</h3>
        <p className="mt-[14px] font-body-md text-body-md text-on-surface">{message}</p>

        {warnings.length > 0 && (
          <div className="mt-[18px] rounded-[8px] border border-error/30 bg-error/10 px-[16px] py-[12px]">
            {warnings.map((warning) => (
              <p key={warning} className="font-body-sm text-body-sm text-error">
                {warning}
              </p>
            ))}
          </div>
        )}

        {error && <p className="mt-[14px] font-body-sm text-body-sm text-error">{error}</p>}

        <div className="mt-[24px] flex justify-end gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="h-[40px] rounded-[6px] border border-outline-variant px-[18px] font-body-md text-body-md font-semibold text-on-surface hover:bg-surface-container-high disabled:opacity-50"
          >
            Annulla
          </button>
          <button
            type="button"
            onClick={confirm}
            disabled={submitting}
            className="h-[40px] rounded-[6px] bg-error px-[20px] font-body-md text-body-md font-semibold text-white hover:bg-error/90 disabled:opacity-50"
          >
            {submitting ? 'Eliminazione…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
