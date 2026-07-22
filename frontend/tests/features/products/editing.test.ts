import { describe, expect, it, vi } from 'vitest';

import {
  productEditOperations,
  toProductCreatePayload,
  toProductUpdatePayload,
} from '../../../src/features/products/editing';
import type { Product } from '../../../src/features/products/types';

const productApi = vi.hoisted(() => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
}));
vi.mock('../../../src/features/products/api/products', () => productApi);

const product: Product = {
  idProduct: '',
  code: 'T-7',
  description: 'Tutore',
  price: '40.5',
  year: '',
};

describe('product editing operations', () => {
  it('normalizes complete create and partial update payloads', () => {
    expect(toProductCreatePayload(product)).toEqual({
      code: 'T-7',
      description: 'Tutore',
      price: 40.5,
      year: null,
    });
    expect(toProductUpdatePayload({ price: '', year: '2026' })).toEqual({
      price: null,
      year: '2026',
    });
  });

  it('owns the API calls and returns the created id', async () => {
    productApi.createProduct.mockResolvedValue({ ...product, idProduct: 'P-9' });
    productApi.updateProduct.mockResolvedValue({});

    await expect(productEditOperations.create(product)).resolves.toBe('P-9');
    await productEditOperations.update('P-9', { price: '25' });

    expect(productApi.createProduct).toHaveBeenCalledWith({
      code: 'T-7',
      description: 'Tutore',
      price: 40.5,
      year: null,
    });
    expect(productApi.updateProduct).toHaveBeenCalledWith('P-9', { price: 25 });
  });
});
