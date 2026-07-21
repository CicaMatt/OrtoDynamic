import type { EntityEditConfig } from '../../app/editing/types';
import { createProduct, updateProduct, type ProductUpdate } from './api/products';
import type { Product } from './types';

const editableProductKeys = [
  'code',
  'description',
  'price',
  'year',
] as const satisfies readonly (keyof Product)[];

export const productCreateRequiredKeys = [
  'code',
  'description',
  'price',
] as const satisfies readonly (keyof Product)[];

function makeEmptyProduct(): Product {
  return { idProduct: '', code: '', description: '', price: '', year: '' };
}

/** Normalize product edits/creates: blank year/price -> null, price otherwise numeric. */
function normalizeProductPayload(payload: Record<string, unknown>): ProductUpdate {
  const next = { ...payload } as ProductUpdate;
  if (next.year === '') next.year = null;
  if (next.price === '') next.price = null;
  if ('price' in next && next.price !== null) next.price = Number(next.price);
  return next;
}

export const productEditConfig: EntityEditConfig<'product'> = {
  editableKeys: editableProductKeys,
  requiredKeys: productCreateRequiredKeys,
  makeEmptyDraft: makeEmptyProduct,
  create: (payload) => createProduct(normalizeProductPayload(payload)),
  update: (id, payload) => updateProduct(id, payload as ProductUpdate),
  getCreatedId: (created) => created.idProduct,
  buildUpdatePayload: normalizeProductPayload,
};
