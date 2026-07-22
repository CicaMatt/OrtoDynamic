import { markRequired, type FieldConfig } from '../../../shared/entity/EntityFields';
import { formatEuro } from '../../../shared/format/format';
import type { Product } from '../types';

export type ProductField = FieldConfig<Product>;

export const productCreateRequiredKeys = [
  'code',
  'description',
  'price',
] as const satisfies readonly (keyof Product)[];

/** Fields shown in the product detail/edit form. */
export const productFields: ProductField[] = [
  { label: 'ID', key: 'idProduct', readonly: true },
  { label: 'Codice', key: 'code' },
  { label: 'Prezzo', key: 'price', type: 'number', renderValue: formatEuro },
  { label: 'Anno', key: 'year' },
  { label: 'Descrizione', key: 'description', type: 'textarea' },
];

/** Create form: drop the DB-assigned id, mark required fields. */
export const productCreateFields = markRequired(
  productFields.filter((field) => field.key !== 'idProduct'),
  productCreateRequiredKeys,
);
