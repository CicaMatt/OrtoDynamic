import type { EntityEditOperations } from '../../app/editing/types';
import { pickDefinedFields } from '../../app/editing/types';
import {
  createProduct,
  updateProduct,
  type ProductCreatePayload,
  type ProductUpdatePayload,
} from './api/products';
import { productCreateRequiredKeys } from './components/productFields';
import type { Product } from './types';

const productTextKeys = ['code', 'description'] as const;
const productEditableKeys = [
  ...productTextKeys,
  'price',
  'year',
] as const satisfies readonly (keyof Product)[];

function emptyProduct(): Product {
  return { idProduct: '', code: '', description: '', price: '', year: '' };
}

export function toProductCreatePayload(draft: Product): ProductCreatePayload {
  return {
    code: draft.code,
    description: draft.description,
    price: draft.price === '' ? null : Number(draft.price),
    year: draft.year === '' ? null : draft.year,
  };
}

export function toProductUpdatePayload(changes: Partial<Product>): ProductUpdatePayload {
  const payload: ProductUpdatePayload = pickDefinedFields(changes, productTextKeys);
  if (changes.price !== undefined) {
    payload.price = changes.price === '' ? null : Number(changes.price);
  }
  if (changes.year !== undefined) payload.year = changes.year === '' ? null : changes.year;
  return payload;
}

export const productEditOperations = {
  editableKeys: productEditableKeys,
  requiredKeys: productCreateRequiredKeys,
  emptyDraft: emptyProduct,
  create: async (draft) => {
    const created = await createProduct(toProductCreatePayload(draft));
    return created.idProduct;
  },
  update: async (id, changes) => {
    await updateProduct(id, toProductUpdatePayload(changes));
  },
} satisfies EntityEditOperations<'product'>;
