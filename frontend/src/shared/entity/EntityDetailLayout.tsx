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
  actionsTitle: string;
  actions: DetailAction[];
}) {
  return (
    <div className="max-w-[1440px] -mt-1">
      {header}
      <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-[28px] items-start">
        <main>{children}</main>
        <aside className="border-l border-[#dde1e7] pl-[28px]">
          <DetailActionsCard title={actionsTitle} actions={actions} />
        </aside>
      </div>
    </div>
  );
}
