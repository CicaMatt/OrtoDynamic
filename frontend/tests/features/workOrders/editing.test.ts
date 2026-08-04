import { describe, expect, it } from 'vitest';

import {
  toWorkOrderItemUpdatePayload,
  toWorkOrderUpdatePayload,
} from '../../../src/features/workOrders/editing';

describe('work-order editing payloads', () => {
  it('excludes immutable relationships and normalizes blank dates', () => {
    expect(
      toWorkOrderUpdatePayload({
        quoteId: '500',
        clientId: '',
        doctorSignature: 'Non modificabile',
        deliveryDate: '',
        technicalNotes: 'Controllare',
      }),
    ).toEqual({
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
