import { Fragment, type ReactNode } from 'react';
import { Icon } from '../ui/Icon';

export type Crumb = { label: string; onClick?: () => void };

export function EntityPageHeader({
  back,
  crumbs,
  title,
  subtitle,
  rightSlot,
}: {
  back: { label: string; onClick: () => void };
  crumbs: Crumb[];
  title: string;
  subtitle: ReactNode;
  rightSlot?: ReactNode;
}) {
  return (
    <header className="mb-[28px] border-b border-surface-variant pb-[20px]">
      <div className="flex items-center justify-between gap-[20px]">
        <button
          onClick={back.onClick}
          className="inline-flex items-center gap-[5px] font-body-sm text-body-sm text-on-surface-variant hover:text-black"
        >
          <Icon name="arrow_back" className="text-[16px]" />
          {back.label}
        </button>

        <nav className="flex items-center gap-[10px] font-body-md text-body-md">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <Fragment key={crumb.label}>
                {index > 0 && <Icon name="chevron_right" className="text-[18px] text-on-surface-variant" />}
                {isLast || !crumb.onClick ? (
                  <span className="font-semibold text-black">{crumb.label}</span>
                ) : (
                  <button onClick={crumb.onClick} className="text-on-surface-variant hover:text-black">
                    {crumb.label}
                  </button>
                )}
              </Fragment>
            );
          })}
        </nav>
      </div>

      <div className="mt-[14px] flex items-end justify-between gap-[20px]">
        <div>
          <h2 className="font-headline-lg text-headline-lg font-bold text-black tracking-normal">
            {title}
          </h2>
          <p className="mt-[6px] font-body-md text-body-md text-outline">{subtitle}</p>
        </div>
        {rightSlot}
      </div>
    </header>
  );
}

export function EntityCreatePageHeader({
  backLabel,
  listLabel,
  title,
  onBack,
}: {
  backLabel: string;
  listLabel: string;
  title: string;
  onBack: () => void;
}) {
  return (
    <EntityPageHeader
      back={{ label: backLabel, onClick: onBack }}
      crumbs={[{ label: listLabel, onClick: onBack }, { label: 'Nuovo' }]}
      title={title}
      subtitle={<>I campi contrassegnati con * sono obbligatori.</>}
    />
  );
}
