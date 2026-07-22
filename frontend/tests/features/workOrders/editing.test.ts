import { describe, expect, it } from 'vitest';

import {
  toWorkOrderItemUpdatePayload,
  toWorkOrderUpdatePayload,
} from '../../../src/features/workOrders/editing';

describe('work-order editing payloads', () => {
  it('normalizes ids and blank dates in the primary PATCH', () => {
    expect(
      toWorkOrderUpdatePayload({
        quoteId: '500',
        clientId: '',
        deliveryDate: '',
        technicalNotes: 'Controllare',
      }),
    ).toEqual({
      quoteId: 500,
      clientId: null,
      deliveryDate: null,
      technicalNotes: 'Controllare',
    });
  });

  it('normalizes only editable item fields', () => {
    expect(
      toWorkOrderItemUpdatePayload({
        productId: 'ignored',
        status: 'ANNULLATO',
        cancellationDate: '',
      }),
    ).toEqual({ status: 'ANNULLATO', cancellationDate: null });
  });
});
