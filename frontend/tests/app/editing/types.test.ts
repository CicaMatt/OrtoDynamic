import { describe, expect, it } from 'vitest';

import { blankDatesToNull, buildCreatePayload, diffDraft } from '../../../src/app/editing/types';

describe('edit payload helpers', () => {
  it('returns only editable values that changed', () => {
    const original = { code: 'A-1', description: 'Tutore', internal: 'keep' };
    const draft = { code: 'A-1', description: 'Tutore lungo', internal: 'changed' };

    expect(diffDraft(draft, original, ['code', 'description'])).toEqual({
      description: 'Tutore lungo',
    });
    expect(diffDraft(null, original, ['code'])).toEqual({});
  });

  it('builds a create payload from only the declared keys', () => {
    const draft = { code: 'A-1', description: 'Tutore', generatedId: 'ignore' };

    expect(buildCreatePayload(draft, ['code', 'description'])).toEqual({
      code: 'A-1',
      description: 'Tutore',
    });
    expect(buildCreatePayload(null, ['code'])).toEqual({});
  });

  it('normalizes only blank declared date fields to null', () => {
    const payload: Record<string, unknown> = {
      deliveryDate: '',
      cancellationDate: '2026-07-21',
      description: '',
    };

    blankDatesToNull(payload, ['deliveryDate', 'cancellationDate']);

    expect(payload).toEqual({
      deliveryDate: null,
      cancellationDate: '2026-07-21',
      description: '',
    });
  });
});
