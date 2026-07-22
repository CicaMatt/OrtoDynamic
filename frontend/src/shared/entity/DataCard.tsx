import type { ReactNode } from 'react';
import { Icon } from '../ui/Icon';

/** Section heading with a blue icon. */
function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-[13px]">
      <Icon name={icon} className="text-[28px] text-secondary" />
      <h3 className="font-headline-md text-headline-md font-bold text-black">{title}</h3>
    </div>
  );
}

/** White card with a section title, a divider, and arbitrary content below. */
export function DataCard({
  icon,
  title,
  action,
  className = '',
  children,
}: {
  icon: string;
  title: string;
  /** Optional control shown at the top-right of the header. */
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-[8px] border border-outline-variant bg-white px-[29px] py-[28px] ${className}`}
    >
      <div className="flex items-center justify-between gap-[16px]">
        <SectionTitle icon={icon} title={title} />
        {action}
      </div>
      <div className="h-px bg-surface-variant mt-[11px] mb-[20px]" />
      {children}
    </section>
  );
}
