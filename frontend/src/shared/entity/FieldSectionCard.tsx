import {
  DataCard,
  FieldGrid,
  type AutocompleteFieldConfig,
  type FieldConfig,
} from './DataCard';

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
}: {
  icon: string;
  title: string;
  data: T;
  fields: FieldConfig<T>[];
  columns?: 1 | 2 | 3;
  editing: boolean;
  onChange: (key: keyof T, value: string) => void;
  format?: (field: FieldConfig<T>, raw: string) => string;
  invalidKeys?: ReadonlyArray<keyof T>;
  autocompleteFields?: Partial<Record<keyof T, AutocompleteFieldConfig>>;
  className?: string;
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
