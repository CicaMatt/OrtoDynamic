import {
  DataCard,
  FieldGrid,
  type AutocompleteFieldConfig,
  type FieldConfig,
} from './DataCard';

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
          icon={section.icon}
          title={section.title}
          data={data}
          fields={section.fields}
          columns={section.columns}
          editing={editing}
          onChange={onChange}
          format={section.format ?? format}
          invalidKeys={section.invalidKeys ?? invalidKeys}
          autocompleteFields={section.autocompleteFields ?? autocompleteFields}
          className={section.className}
        />
      ))}
    </div>
  );
}
