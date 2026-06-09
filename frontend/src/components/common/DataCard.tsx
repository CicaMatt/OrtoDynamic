import type { ReactNode } from 'react';
import { FieldValue } from './FieldValue';
import { Icon } from './Icon';

export type FieldInputType = 'text' | 'date' | 'gender' | 'number' | 'textarea';

const inputClass =
  'w-full rounded-[6px] border border-[#c9cdd4] bg-white px-[11px] py-[8px] font-body-md text-body-md text-[#171a20] focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary';

/** Input control used when a field is in edit mode. */
export function EditInput({
  type = 'text',
  value,
  onChange,
}: {
  type?: FieldInputType;
  value: string;
  onChange: (value: string) => void;
}) {
  if (type === 'textarea') {
    return (
      <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
    );
  }
  if (type === 'gender') {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        <option value="">—</option>
        <option value="M">Maschile</option>
        <option value="F">Femminile</option>
      </select>
    );
  }
  const htmlType = type === 'date' ? 'date' : type === 'number' ? 'number' : 'text';
  return (
    <input type={htmlType} value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
  );
}

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

type InfoBlockProps = {
  label: string;
  /** Display value (already formatted) shown in read mode. */
  value: string;
  strong?: boolean;
  /** When true, render an input bound to `editValue`/`onChange` instead of the value. */
  editing?: boolean;
  /** Raw value bound to the input in edit mode (defaults to `value`). */
  editValue?: string;
  inputType?: FieldInputType;
  onChange?: (value: string) => void;
};

/** Stacked label + value; renders an input in edit mode, "N/D" for missing reads. */
export function InfoBlock({
  label,
  value,
  strong = false,
  editing = false,
  editValue,
  inputType = 'text',
  onChange,
}: InfoBlockProps) {
  return (
    <div>
      <dt className="font-label-caps text-label-caps font-bold uppercase text-[#737780]">{label}</dt>
      <dd className="mt-[8px]">
        {editing && onChange ? (
          <EditInput type={inputType} value={editValue ?? value} onChange={onChange} />
        ) : (
          <span className={`font-body-md text-body-md text-[#171a20] ${strong ? 'font-bold' : 'font-medium'}`}>
            <FieldValue value={value} />
          </span>
        )}
      </dd>
    </div>
  );
}

/** A single field in a {@link FieldGrid}: its label, the data key, and input type. */
export type FieldConfig<T> = { label: string; key: keyof T; type?: FieldInputType };

/**
 * Grid of {@link InfoBlock}s built from a field config. The raw value is read
 * from `data[key]`; `format` (when given) maps it to the read-mode display
 * string, while the input always edits the raw value.
 */
export function FieldGrid<T extends Record<string, string>>({
  data,
  fields,
  columns = 3,
  editing,
  onChange,
  format,
}: {
  data: T;
  fields: FieldConfig<T>[];
  columns?: 1 | 2 | 3;
  editing: boolean;
  onChange: (key: keyof T, value: string) => void;
  format?: (field: FieldConfig<T>, raw: string) => string;
}) {
  const columnsClass = columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-2' : 'grid-cols-3';
  return (
    <div className={`grid ${columnsClass} gap-x-[36px] gap-y-[24px]`}>
      {fields.map((field) => {
        const raw = String(data[field.key] ?? '');
        return (
          <InfoBlock
            key={String(field.key)}
            label={field.label}
            value={format ? format(field, raw) : raw}
            editing={editing}
            editValue={raw}
            inputType={field.type}
            onChange={(value) => onChange(field.key, value)}
          />
        );
      })}
    </div>
  );
}
