import { markRequired, type FieldConfig } from '../../../shared/entity/DataCard';
import type { Product } from '../types';

export type ProductField = FieldConfig<Product>;

/** Fields shown in the product detail/edit form. */
export const productFields: ProductField[] = [
  { label: 'ID', key: 'idProduct', readonly: true },
  { label: 'Codice', key: 'code' },
  { label: 'Prezzo', key: 'price', type: 'number' },
  { label: 'Anno', key: 'year' },
  { label: 'Descrizione', key: 'description', type: 'textarea' },
];

/** Fields required by the creation form (DB enforces Codice/Descrizione/Prezzo NOT NULL). */
export const PRODUCT_CREATE_REQUIRED = [
  'code', 'description', 'price',
] as const satisfies readonly (keyof Product)[];

/** Create form: drop the DB-assigned id, mark required fields. */
export const productCreateFields = markRequired(
  productFields.filter((field) => field.key !== 'idProduct'),
  PRODUCT_CREATE_REQUIRED,
);
