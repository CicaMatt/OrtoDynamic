import { describe, expect, it } from 'vitest';

import { previewMaxExpiryFromDays, quoteEditConfig } from '../../../src/features/quotes/editConfig';

describe('quote expiry contract', () => {
  it('keeps an immediate local preview for valid whole-day counts', () => {
    expect(previewMaxExpiryFromDays('0', '2026-07-22')).toBe('2026-07-22');
    expect(previewMaxExpiryFromDays('10', '2026-07-22')).toBe('2026-08-01');
    expect(previewMaxExpiryFromDays('', '2026-07-22')).toBe('');
    expect(previewMaxExpiryFromDays('-1', '2026-07-22')).toBe('');
    expect(previewMaxExpiryFromDays('1.5', '2026-07-22')).toBe('');
  });

  it('does not include the derived stored date in client-controlled fields', () => {
    expect(quoteEditConfig.editableKeys).toContain('expiryDays');
    expect(quoteEditConfig.editableKeys).not.toContain('maxExpiry');
  });
});
