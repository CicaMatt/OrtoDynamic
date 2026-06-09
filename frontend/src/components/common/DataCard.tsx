import type { ReactNode } from 'react';
import { FieldValue } from './FieldValue';
import { Icon } from './Icon';

/** Section heading with a blue icon, shared by the client cards. */
export function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-[13px]">
      <Icon name={icon} className="text-[28px] text-[#005eb8]" />
      <h3 className="font-headline-md text-headline-md font-bold text-black">{title}</h3>
    </div>
  );
}

/** White card with a section title, a divider, and arbitrary content below. */
export function DataCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[8px] border border-[#c9cdd4] bg-white px-[29px] py-[28px]">
      <SectionTitle icon={icon} title={title} />
      <div className="h-px bg-[#dde1e7] mt-[11px] mb-[20px]" />
      {children}
    </section>
  );
}

/** Stacked label + value, rendering "N/D" for missing values via {@link FieldValue}. */
export function InfoBlock({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div>
      <dt className="font-label-caps text-label-caps font-bold uppercase text-[#737780]">{label}</dt>
      <dd
        className={`mt-[8px] font-body-md text-body-md text-[#171a20] ${strong ? 'font-bold' : 'font-medium'}`}
      >
        <FieldValue value={value} />
      </dd>
    </div>
  );
}
