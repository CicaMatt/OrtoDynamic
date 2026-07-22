import type { ReactNode } from 'react';
import { Icon } from '../ui/Icon';

export function DocumentErrorAlert({
  error,
  onClose,
  className = '',
}: {
  error: string;
  onClose: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={`${className} flex items-start justify-between gap-3 rounded-[10px] border border-error bg-error/10 px-[20px] py-[14px]`}
    >
      <span className="font-body-sm text-body-sm text-error">{error}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Chiudi"
        className="text-error/70 hover:text-error"
      >
        <Icon name="close" className="text-[20px]" />
      </button>
    </div>
  );
}

export function DocumentOptionsDialog({
  titleId,
  title,
  description,
  onClose,
  children,
}: {
  titleId: string;
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-[460px] max-w-full rounded-[12px] bg-white p-[28px] shadow-[0_16px_48px_rgba(0,0,0,0.22)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id={titleId} className="font-headline-md text-headline-md font-bold text-black">
          {title}
        </h3>
        <p className="mt-[10px] font-body-md text-body-md text-on-surface-variant">{description}</p>
        {children}
      </div>
    </div>
  );
}

export function documentActionState<K extends string>({
  generating,
  kind,
  idleLabel,
  busyLabel,
  disabled,
}: {
  generating: K | null;
  kind: K;
  idleLabel: string;
  busyLabel: string;
  disabled: boolean;
}) {
  return {
    label: generating === kind ? busyLabel : idleLabel,
    disabled: disabled || Boolean(generating),
  };
}
