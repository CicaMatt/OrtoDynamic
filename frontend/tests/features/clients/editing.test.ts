import { describe, expect, it } from 'vitest';

import {
  toClientGeneralUpdatePayload,
  toClientOrthopedicUpdatePayload,
} from '../../../src/features/clients/editing';

describe('client editing payloads', () => {
  it('normalizes blank dates and numeric references without touching text fields', () => {
    expect(toClientGeneralUpdatePayload({ birthDate: '', doctorId: '21', phone: '' })).toEqual({
      birthDate: null,
      doctorId: 21,
      phone: '',
    });
    expect(toClientGeneralUpdatePayload({ doctorId: '' })).toEqual({ doctorId: null });
  });

  it('picks only orthopedic fields accepted by the client PATCH endpoint', () => {
    expect(toClientOrthopedicUpdatePayload({ idClient: 'C-1', shoeSize: '42', other: '' })).toEqual(
      { shoeSize: '42', other: '' },
    );
  });
});
