import { Fragment } from 'react';
import { DataSwitchButton } from './DataSwitchButton';
import { Icon } from './Icon';

/** A breadcrumb step; intermediate steps are clickable, the last one is current. */
export type Crumb = { label: string; onClick?: () => void };

/**
 * Shared header for the client detail and orthopedic pages: a back action and
 * breadcrumb trail on top, then the client name / code with the view toggle.
 */
export function ClientPageHeader({
  back,
  crumbs,
  name,
  surname,
  code,
}: {
  back: { label: string; onClick: () => void };
  crumbs: Crumb[];
  name: string;
  surname: string;
  code: string;
}) {
  return (
    <header className="mb-[28px] border-b border-[#dde1e7] pb-[20px]">
      <div className="flex items-center justify-between gap-[20px]">
        <button
          onClick={back.onClick}
          className="inline-flex items-center gap-[5px] font-body-sm text-body-sm text-[#3d434c] hover:text-black"
        >
          <Icon name="arrow_back" className="text-[16px]" />
          {back.label}
        </button>

        <nav className="flex items-center gap-[10px] font-body-md text-body-md">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <Fragment key={crumb.label}>
                {index > 0 && <Icon name="chevron_right" className="text-[18px] text-[#3d434c]" />}
                {isLast || !crumb.onClick ? (
                  <span className="font-semibold text-black">{crumb.label}</span>
                ) : (
                  <button onClick={crumb.onClick} className="text-[#3d434c] hover:text-black">
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
            {`${name} ${surname}`.trim()}
          </h2>
          <p className="mt-[6px] font-body-md text-body-md text-[#737780]">
            Codice: <span className="font-semibold text-[#343942]">{code}</span>
          </p>
        </div>
        <DataSwitchButton />
      </div>
    </header>
  );
}
