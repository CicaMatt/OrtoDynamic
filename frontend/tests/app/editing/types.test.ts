import { describe, expect, it } from 'vitest';

import { diffDraft, pickDefinedFields, pickFields } from '../../../src/app/editing/types';

describe('edit payload helpers', () => {
  it('returns only editable values that changed', () => {
    const original = { code: 'A-1', description: 'Tutore', internal: 'keep' };
    const draft = { code: 'A-1', description: 'Tutore lungo', internal: 'changed' };

    expect(diffDraft(draft, original, ['code', 'description'])).toEqual({
      description: 'Tutore lungo',
    });
    expect(diffDraft(null, original, ['code'])).toEqual({});
  });

  it('picks create fields without erasing their types', () => {
    const draft = { code: 'A-1', description: 'Tutore', generatedId: 'ignore' };

    expect(pickFields(draft, ['code', 'description'])).toEqual({
      code: 'A-1',
      description: 'Tutore',
    });
  });

  it('picks only defined PATCH fields', () => {
    expect(
      pickDefinedFields({ code: undefined, description: 'Tutore', note: '' }, [
        'code',
        'description',
      ]),
    ).toEqual({
      description: 'Tutore',
    });
  });
});
