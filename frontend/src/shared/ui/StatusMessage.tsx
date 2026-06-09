import type { ReactNode } from 'react';
import { Icon } from './Icon';

/** Loading / error placeholder with a back action, shared by the client pages. */
export function StatusMessage({
  onBack,
  backLabel,
  tone = 'muted',
  children,
}: {
  onBack: () => void;
  backLabel: string;
  tone?: 'muted' | 'error';
  children: ReactNode;
}) {
  const toneClass = tone === 'error' ? 'text-error' : 'text-on-surface-variant';
  return (
    <div className="flex flex-col items-start gap-4">
      <p className={`font-body-md text-body-md ${toneClass}`}>{children}</p>
      <button
        onClick={onBack}
        className="text-on-surface-variant hover:text-primary flex items-center gap-2 font-body-md text-body-md"
      >
        <Icon name="arrow_back" /> {backLabel}
      </button>
    </div>
  );
}
