import { describe, expect, it, vi } from 'vitest';

import {
  applySupplement,
  changeSession,
  isSessionDirty,
  prepareSessionSave,
  resetSessionParticipant,
  seedSession,
  startSession,
} from '../../../src/app/editing/editSession';
import type { ClientOrthopedic } from '../../../src/features/clients/types';
import type { Product } from '../../../src/features/products/types';

const product: Product = {
  idProduct: 'P-1',
  code: 'T-1',
  description: 'Tutore',
  price: '25',
  year: '2026',
};

const orthopedic = Object.fromEntries(
  [
    'idClient',
    'name',
    'surname',
    'shoeSize',
    'shoeModel',
    'width',
    'collar',
    'ankle',
    'spur',
    'lift',
    'inclinedPlane',
    'insoleType',
    'collarPassage',
    'anklePassage',
    'braceType',
    'shoulderStraps',
    'upToArmpit',
    'frontFabricHeight',
    'totalFrameHeight',
    'axillaryDistance',
    'waist',
    'pelvisSize',
    'measure24',
    'neck',
    'humerus',
    'arm',
    'wrist',
    'pelvis',
    'thigh',
    'leg',
    'clientNote',
    'other',
  ].map((key) => [key, key === 'idClient' ? 'C-1' : '']),
) as ClientOrthopedic;

describe('edit session transitions', () => {
  it('is clean after seeding and dirty only after a meaningful primary change', () => {
    const started = startSession({ type: 'product', id: 'P-1' }, 'edit');
    const seeded = seedSession(started, 'product', product);

    expect(isSessionDirty(seeded)).toBe(false);
    expect(isSessionDirty(changeSession(seeded, 'product', 'description', 'Tutore'))).toBe(false);
    expect(isSessionDirty(changeSession(seeded, 'product', 'description', 'Tutore lungo'))).toBe(
      true,
    );
    expect(prepareSessionSave(seeded!)).toEqual({ kind: 'empty' });
  });

  it('tracks client orthopedic changes inside the client session', () => {
    const started = startSession({ type: 'client', id: 'C-1' }, 'edit');
    const seeded = applySupplement(started, { type: 'seed-client-orthopedic', draft: orthopedic });

    expect(isSessionDirty(seeded)).toBe(false);
    expect(
      isSessionDirty(
        applySupplement(seeded, {
          type: 'change-client-orthopedic',
          key: 'shoeSize',
          value: '42',
        }),
      ),
    ).toBe(true);
  });

  it('uses config-owned create requirements and resets the work-order participant', () => {
    const quote = startSession({ type: 'quote', id: '' }, 'create');
    expect(prepareSessionSave(quote)).toMatchObject({
      kind: 'invalid',
      fields: ['clientId', 'quoteType', 'diagnosis', 'detailedPrescription'],
    });

    const reset = vi.fn();
    const workOrder = applySupplement(startSession({ type: 'workOrder', id: 'W-1' }, 'edit'), {
      type: 'set-work-order-items',
      participant: { dirty: true, reset, save: vi.fn() },
    });
    expect(isSessionDirty(workOrder)).toBe(true);
    resetSessionParticipant(workOrder);
    expect(reset).toHaveBeenCalledOnce();
  });
});
