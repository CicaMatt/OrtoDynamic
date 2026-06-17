import type { ReactNode } from 'react';
import { DetailActionsCard, type DetailAction } from './DetailActionsCard';

export function EntityDetailLayout({
  header,
  children,
  actionsTitle,
  actions,
}: {
  header: ReactNode;
  children: ReactNode;
  actionsTitle?: string;
  /** Omit (or pass empty) to render the form full-width with no actions sidebar. */
  actions?: DetailAction[];
}) {
  const hasActions = actions !== undefined && actions.length > 0;
  return (
    <div className="max-w-[1440px] -mt-1">
      {header}
      {hasActions ? (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-[28px] items-start">
          <main className="min-w-0">{children}</main>
          <aside className="border-t border-surface-variant pt-[28px] xl:border-t-0 xl:pt-0 xl:border-l xl:pl-[28px]">
            <DetailActionsCard title={actionsTitle ?? ''} actions={actions} />
          </aside>
        </div>
      ) : (
        <main className="min-w-0">{children}</main>
      )}
    </div>
  );
}
