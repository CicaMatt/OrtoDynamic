import { markRequired, type FieldConfig } from '../../../shared/entity/DataCard';
import type { Product } from '../types';

export type ProductField = FieldConfig<Product>;

/** Fields shown in the product detail/edit form. */
export const productFields: ProductField[] = [
  { label: 'ID', key: 'id', readonly: true },
  { label: 'Codice', key: 'code' },
  { label: 'Descrizione', key: 'description', type: 'textarea' },
  { label: 'Prezzo', key: 'price', type: 'number' },
  { label: 'Anno', key: 'year' },
];

/** Fields required by the creation form (DB enforces Codice/Descrizione/Prezzo NOT NULL). */
export const PRODUCT_CREATE_REQUIRED = [
  'code', 'description', 'price',
] as const satisfies readonly (keyof Product)[];

/** Create form: drop the DB-assigned id, mark required fields. */
export const productCreateFields = markRequired(
  productFields.filter((field) => field.key !== 'id'),
  PRODUCT_CREATE_REQUIRED,
);
