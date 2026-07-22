import type { ReactNode } from 'react';
import { formatBirthDate, formatGender } from '../format/format';
import { Autocomplete, type AutocompleteOption } from '../ui/Autocomplete';
import { FieldValue } from '../ui/FieldValue';
import { DataCard } from './DataCard';

export type FieldInputType =
  'text' | 'date' | 'gender' | 'number' | 'textarea' | 'select' | 'autocomplete';

/** Option for a `select` field; `value` is persisted, `label` is shown. */
export type SelectOption = { value: string; label: string };

export function optionsFromValues(values: readonly string[]): SelectOption[] {
  return values.map((value) => ({ value, label: value }));
}

/** Runtime behavior for an autocomplete presentation field. */
export type AutocompleteFieldConfig = {
  options: ReadonlyArray<AutocompleteOption>;
  onSelect?: (option: AutocompleteOption) => void;
  emptyLabel?: string;
  placeholder?: string;
  selectValue?: (option: AutocompleteOption) => string;
  displayValue?: (raw: string) => string;
};

const baseInputClass =
  'w-full rounded-[6px] border bg-white px-[11px] py-[8px] font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1';
const validBorderClass = 'border-outline-variant focus:border-secondary focus:ring-secondary';
const invalidBorderClass = 'border-error focus:border-error focus:ring-error';

/** Input control shared by entity forms and editable detail tables. */
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
  options?: ReadonlyArray<SelectOption>;
  invalid?: boolean;
  min?: number;
  onChange: (value: string) => void;
}) {
  const inputClass = `${baseInputClass} ${invalid ? invalidBorderClass : validBorderClass}`;
  const selectClass = `${inputClass} pr-[36px]`;
  if (type === 'textarea') {
    return (
      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    );
  }
  if (type === 'gender') {
    return (
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={selectClass}
      >
        <option value="">—</option>
        <option value="M">Maschile</option>
        <option value="F">Femminile</option>
      </select>
    );
  }
  if (type === 'select') {
    const choices = options ?? [];
    const hasCurrent = value === '' || choices.some((option) => option.value === value);
    return (
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={selectClass}
      >
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
      onChange={(event) => onChange(event.target.value)}
      className={inputClass}
    />
  );
}

type InfoBlockProps = {
  label: string;
  value: string;
  strong?: boolean;
  editing?: boolean;
  editValue?: string;
  inputType?: FieldInputType;
  inputOptions?: ReadonlyArray<SelectOption>;
  required?: boolean;
  invalid?: boolean;
  control?: ReactNode;
  valueNode?: ReactNode;
  onChange?: (value: string) => void;
};

/** Stacked label + value; renders an input in edit mode and N/D for missing reads. */
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
          (control ?? (
            <EditInput
              type={inputType}
              value={editValue ?? value}
              options={inputOptions}
              invalid={invalid}
              onChange={onChange!}
            />
          ))
        ) : (
          <span
            className={`font-body-md text-body-md text-on-surface ${strong ? 'font-bold' : 'font-medium'}`}
          >
            {valueNode ?? <FieldValue value={value} />}
          </span>
        )}
      </dd>
    </div>
  );
}

/** Presentation metadata for one entity field. */
export type FieldConfig<T> = {
  label: string;
  key: keyof T;
  type?: FieldInputType;
  readonly?: boolean;
  options?: ReadonlyArray<SelectOption>;
  required?: boolean;
  renderValue?: (raw: string, item: T) => ReactNode;
};

export function formatFieldValue<T>(field: FieldConfig<T>, raw: string): string {
  if (field.type === 'date') return formatBirthDate(raw);
  if (field.type === 'gender') return formatGender(raw);
  return raw;
}

export function markRequired<T>(
  fields: FieldConfig<T>[],
  required: ReadonlyArray<keyof T>,
): FieldConfig<T>[] {
  return fields.map((field) =>
    required.includes(field.key) ? { ...field, required: true } : field,
  );
}

/** Render feature-owned field declarations as a responsive grid. */
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
  invalidKeys?: ReadonlyArray<keyof T>;
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
        const autocomplete =
          field.type === 'autocomplete' ? autocompleteFields?.[field.key] : undefined;
        const control =
          canEdit && autocomplete ? (
            <Autocomplete
              value={autocomplete.displayValue ? autocomplete.displayValue(raw) : raw}
              options={autocomplete.options}
              invalid={invalid}
              placeholder={autocomplete.placeholder}
              emptyLabel={autocomplete.emptyLabel}
              onSelect={(option) => {
                onChange(
                  field.key,
                  autocomplete.selectValue ? autocomplete.selectValue(option) : option.value,
                );
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

export type FieldSectionConfig<T extends object> = {
  icon: string;
  title: string;
  fields: FieldConfig<T>[];
  columns?: 1 | 2 | 3;
  className?: string;
  format?: (field: FieldConfig<T>, raw: string) => string;
  invalidKeys?: ReadonlyArray<keyof T>;
  autocompleteFields?: Partial<Record<keyof T, AutocompleteFieldConfig>>;
};

export function FieldSectionCard<T extends object>({
  icon,
  title,
  data,
  fields,
  columns = 3,
  editing,
  onChange,
  format,
  invalidKeys,
  autocompleteFields,
  className,
}: FieldSectionConfig<T> & {
  data: T;
  editing: boolean;
  onChange: (key: keyof T, value: string) => void;
}) {
  return (
    <DataCard icon={icon} title={title} className={className}>
      <FieldGrid
        data={data}
        fields={fields}
        columns={columns}
        editing={editing}
        onChange={onChange}
        format={format}
        invalidKeys={invalidKeys}
        autocompleteFields={autocompleteFields}
      />
    </DataCard>
  );
}

export function FieldSectionList<T extends object>({
  data,
  sections,
  editing,
  onChange,
  format,
  invalidKeys,
  autocompleteFields,
  className = 'space-y-[28px]',
}: {
  data: T;
  sections: FieldSectionConfig<T>[];
  editing: boolean;
  onChange: (key: keyof T, value: string) => void;
  format?: (field: FieldConfig<T>, raw: string) => string;
  invalidKeys?: ReadonlyArray<keyof T>;
  autocompleteFields?: Partial<Record<keyof T, AutocompleteFieldConfig>>;
  className?: string;
}) {
  return (
    <div className={className}>
      {sections.map((section) => (
        <FieldSectionCard
          key={section.title}
          {...section}
          data={data}
          editing={editing}
          onChange={onChange}
          format={section.format ?? format}
          invalidKeys={section.invalidKeys ?? invalidKeys}
          autocompleteFields={section.autocompleteFields ?? autocompleteFields}
        />
      ))}
    </div>
  );
}
