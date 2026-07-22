import { describe, expect, it } from 'vitest';

import {
  changeQuoteDraft,
  previewMaxExpiryFromDays,
  quoteEditableKeys,
} from '../../../src/features/quotes/editing';
import type { Quote } from '../../../src/features/quotes/types';

describe('quote expiry contract', () => {
  it('keeps an immediate local preview for valid whole-day counts', () => {
    expect(previewMaxExpiryFromDays('0', '2026-07-22')).toBe('2026-07-22');
    expect(previewMaxExpiryFromDays('10', '2026-07-22')).toBe('2026-08-01');
    expect(previewMaxExpiryFromDays('', '2026-07-22')).toBe('');
    expect(previewMaxExpiryFromDays('-1', '2026-07-22')).toBe('');
    expect(previewMaxExpiryFromDays('1.5', '2026-07-22')).toBe('');
  });

  it('does not include the derived stored date in client-controlled fields', () => {
    expect(quoteEditableKeys).toContain('expiryDays');
    expect(quoteEditableKeys).not.toContain('maxExpiry');
  });

  it('rejects non-digit expiry input and updates the preview with the draft', () => {
    const quote = { expiryDays: '', maxExpiry: '' } as Quote;
    expect(changeQuoteDraft(quote, 'expiryDays', 'abc')).toBeNull();
    expect(changeQuoteDraft(quote, 'expiryDays', '10')).toMatchObject({
      expiryDays: '10',
      maxExpiry: previewMaxExpiryFromDays('10'),
    });
  });
});
