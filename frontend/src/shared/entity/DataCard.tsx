import type { ReactNode } from 'react';
import { FieldValue } from '../ui/FieldValue';
import { Icon } from '../ui/Icon';
import { Autocomplete, type AutocompleteOption } from '../ui/Autocomplete';
import { formatBirthDate, formatGender } from '../format/format';

export type FieldInputType = 'text' | 'date' | 'gender' | 'number' | 'textarea' | 'select' | 'autocomplete';

/** Option for a `select` field; `value` is persisted, `label` is shown. */
export type SelectOption = { value: string; label: string };

/** Build select options where the stored value and visible label are identical. */
export function optionsFromValues(values: readonly string[]): SelectOption[] {
  return values.map((value) => ({ value, label: value }));
}

/** Runtime config for an `autocomplete` field: its options and an optional select side effect. */
export type AutocompleteFieldConfig = {
  options: ReadonlyArray<AutocompleteOption>;
  /** Called when an option is picked — used to fill related fields. */
  onSelect?: (option: AutocompleteOption) => void;
  /** Message shown when the query matches no option. */
  emptyLabel?: string;
  /** Placeholder for the search input (defaults to the {@link Autocomplete} default). */
  placeholder?: string;
  /**
   * Value persisted to the field when an option is picked. Defaults to the
   * option's `value`. Use for id-referenced fields, where the field stores a
   * reference id (carried in the option's `meta`) rather than the shown text.
   */
  selectValue?: (option: AutocompleteOption) => string;
  /**
   * Maps the field's raw stored value to the text shown in the search input.
   * Defaults to the raw value. Pair with `valueOf` so an id-referenced field
   * displays the referenced entity's name, not its id.
   */
  displayValue?: (raw: string) => string;
};

const baseInputClass =
  'w-full rounded-[6px] border bg-white px-[11px] py-[8px] font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1';
const validBorderClass = 'border-outline-variant focus:border-secondary focus:ring-secondary';
const invalidBorderClass = 'border-error focus:border-error focus:ring-error';

/** Input control used when a field is in edit mode. */
export function EditInput({
  type = 'text',
  value,
  options,
  invalid = false,
  min,
  onChange,
}: {
  type?: FieldInputType;
  value: string;
  /** Choices for the `select` type; ignored otherwise. */
  options?: ReadonlyArray<SelectOption>;
  /** Highlight the control as failing validation. */
  invalid?: boolean;
  /** Minimum value for the `number` type; ignored otherwise. */
  min?: number;
  onChange: (value: string) => void;
}) {
  const inputClass = `${baseInputClass} ${invalid ? invalidBorderClass : validBorderClass}`;
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
  if (type === 'select') {
    const choices = options ?? [];
    // Preserve a stored value that predates (or falls outside) the known options
    // so editing an unrelated field never silently drops it.
    const hasCurrent = value === '' || choices.some((option) => option.value === value);
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
        <option value="">—</option>
        {!hasCurrent && <option value={value}>{value}</option>}
        {choices.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
  const htmlType = type === 'date' ? 'date' : type === 'number' ? 'number' : 'text';
  return (
    <input
      type={htmlType}
      value={value}
      min={type === 'number' ? min : undefined}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  );
}

/** Section heading with a blue icon, shared by the client cards. */
export function SectionTitle({ icon, title }: { icon: string; title: string }) {
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
  /** Optional control shown at the top-right of the header, aligned with the title. */
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={`rounded-[8px] border border-outline-variant bg-white px-[29px] py-[28px] ${className}`}>
      <div className="flex items-center justify-between gap-[16px]">
        <SectionTitle icon={icon} title={title} />
        {action}
      </div>
      <div className="h-px bg-surface-variant mt-[11px] mb-[20px]" />
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
  /** Choices for a `select` input type. */
  inputOptions?: ReadonlyArray<SelectOption>;
  /** Mark the field as required (shows an asterisk on the label). */
  required?: boolean;
  /** Highlight the field as failing validation. */
  invalid?: boolean;
  /** Custom edit-mode control (e.g. an autocomplete) replacing the default input. */
  control?: ReactNode;
  /** Custom read-mode content replacing the default value display. */
  valueNode?: ReactNode;
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
  inputOptions,
  required = false,
  invalid = false,
  control,
  valueNode,
  onChange,
}: InfoBlockProps) {
  return (
    <div>
      <dt className="font-label-caps text-label-caps font-bold uppercase text-outline">
        {label}
        {required && <span className="text-error"> *</span>}
      </dt>
      <dd className="mt-[8px]">
        {editing && (control || onChange) ? (
          control ?? (
            <EditInput
              type={inputType}
              value={editValue ?? value}
              options={inputOptions}
              invalid={invalid}
              onChange={onChange!}
            />
          )
        ) : (
          <span className={`font-body-md text-body-md text-on-surface ${strong ? 'font-bold' : 'font-medium'}`}>
            {valueNode ?? <FieldValue value={value} />}
          </span>
        )}
      </dd>
    </div>
  );
}

/** A single field in a {@link FieldGrid}: its label, the data key, and input type. */
export type FieldConfig<T> = {
  label: string;
  key: keyof T;
  type?: FieldInputType;
  readonly?: boolean;
  /** Choices for a `select` field type. */
  options?: ReadonlyArray<SelectOption>;
  /** Required in the form; shows an asterisk and participates in validation. */
  required?: boolean;
  /** Custom read-mode rendering for this field's value (ignored in edit mode). */
  renderValue?: (raw: string, item: T) => ReactNode;
};

export function formatFieldValue<T>(field: FieldConfig<T>, raw: string): string {
  if (field.type === 'date') return formatBirthDate(raw);
  if (field.type === 'gender') return formatGender(raw);
  return raw;
}

/** Return a copy of `fields` with `required` set on the given keys. */
export function markRequired<T>(
  fields: FieldConfig<T>[],
  required: ReadonlyArray<keyof T>,
): FieldConfig<T>[] {
  return fields.map((field) => (required.includes(field.key) ? { ...field, required: true } : field));
}

/**
 * Grid of {@link InfoBlock}s built from a field config. The raw value is read
 * from `data[key]`; `format` (when given) maps it to the read-mode display
 * string, while the input always edits the raw value.
 */
export function FieldGrid<T extends object>({
  data,
  fields,
  columns = 3,
  editing,
  onChange,
  format,
  invalidKeys,
  autocompleteFields,
}: {
  data: T;
  fields: FieldConfig<T>[];
  columns?: 1 | 2 | 3;
  editing: boolean;
  onChange: (key: keyof T, value: string) => void;
  format?: (field: FieldConfig<T>, raw: string) => string;
  /** Field keys currently failing validation (highlighted in edit mode). */
  invalidKeys?: ReadonlyArray<keyof T>;
  /** Runtime config for `autocomplete` fields, keyed by field key. */
  autocompleteFields?: Partial<Record<keyof T, AutocompleteFieldConfig>>;
}) {
  const columnsClass =
    columns === 1
      ? 'grid-cols-1'
      : columns === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
  return (
    <div className={`grid ${columnsClass} gap-x-[36px] gap-y-[24px]`}>
      {fields.map((field) => {
        const raw = String(data[field.key] ?? '');
        const canEdit = editing && !field.readonly;
        const invalid = canEdit && (invalidKeys?.includes(field.key) ?? false);
        const autocomplete = field.type === 'autocomplete' ? autocompleteFields?.[field.key] : undefined;
        const control =
          canEdit && autocomplete ? (
            <Autocomplete
              value={autocomplete.displayValue ? autocomplete.displayValue(raw) : raw}
              options={autocomplete.options}
              invalid={invalid}
              placeholder={autocomplete.placeholder}
              emptyLabel={autocomplete.emptyLabel}
              onSelect={(option) => {
                onChange(field.key, autocomplete.selectValue ? autocomplete.selectValue(option) : option.value);
                autocomplete.onSelect?.(option);
              }}
            />
          ) : undefined;
        return (
          <InfoBlock
            key={String(field.key)}
            label={field.label}
            value={format ? format(field, raw) : formatFieldValue(field, raw)}
            editing={canEdit}
            editValue={raw}
            inputType={field.type}
            inputOptions={field.options}
            required={field.required}
            invalid={invalid}
            control={control}
            valueNode={field.renderValue ? field.renderValue(raw, data) : undefined}
            onChange={canEdit ? (value) => onChange(field.key, value) : undefined}
          />
        );
      })}
    </div>
  );
}
