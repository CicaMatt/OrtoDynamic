import type { Client, ClientOrthopedic } from '../../features/clients/types';
import type { Doctor } from '../../features/doctors/types';
import type { HealthCompany } from '../../features/healthCompanies/types';
import type { Product } from '../../features/products/types';
import type { Quote, QuoteItemDraft } from '../../features/quotes/types';
import type { WorkOrder } from '../../features/workOrders/types';

export type EditTarget =
  | { type: 'client'; id: string }
  | { type: 'doctor'; id: string }
  | { type: 'healthCompany'; id: string }
  | { type: 'product'; id: string }
  | { type: 'quote'; id: string }
  | { type: 'workOrder'; id: string };

export type EntityKind = EditTarget['type'];

/** `edit` updates an existing record; `create` inserts a new one. */
export type EditMode = 'edit' | 'create';

/** Result of a save: `created` is set only when a new record was inserted. */
export type SaveResult = { ok: boolean; created?: { type: EntityKind; id: string } };

export type EntityDraftMap = {
  client: Client;
  doctor: Doctor;
  healthCompany: HealthCompany;
  product: Product;
  quote: Quote;
  workOrder: WorkOrder;
};

export type EntityDraft = EntityDraftMap[EntityKind];

export type EditPayloadContext = {
  clientOrthopedicChanges: Record<string, unknown>;
  quoteItemDrafts: QuoteItemDraft[];
};

export type EntityEditConfig<K extends EntityKind> = {
  editableKeys: readonly (keyof EntityDraftMap[K])[];
  makeEmptyDraft?: () => EntityDraftMap[K];
  create?: (payload: Record<string, unknown>) => Promise<EntityDraftMap[K]>;
  update: (id: string, payload: Record<string, unknown>) => Promise<unknown>;
  getCreatedId?: (created: EntityDraftMap[K]) => string;
  buildCreatePayload?: (
    draft: EntityDraftMap[K],
    context: EditPayloadContext,
  ) => Record<string, unknown>;
  buildUpdatePayload?: (
    changes: Record<string, unknown>,
    context: EditPayloadContext,
  ) => Record<string, unknown>;
  applyFieldChange?: (
    draft: EntityDraftMap[K],
    key: keyof EntityDraftMap[K],
    value: string,
  ) => EntityDraftMap[K] | null;
  clientOrthopedicEditableKeys?: readonly (keyof ClientOrthopedic)[];
};

export function diffDraft<T extends object>(
  draft: T | null,
  original: T | null,
  keys: readonly (keyof T)[],
) {
  const changes: Record<string, unknown> = {};
  if (!draft || !original) return changes;
  for (const key of keys) {
    if (draft[key] !== original[key]) changes[key as string] = draft[key];
  }
  return changes;
}

/** Collect the given keys from a draft into a full (non-diff) payload. */
export function buildCreatePayload<T extends object>(
  draft: T | null,
  keys: readonly (keyof T)[],
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (!draft) return payload;
  for (const key of keys) payload[key as string] = draft[key];
  return payload;
}

/** Blank date inputs emit '', which the API expects as null. */
export function blankDatesToNull(payload: Record<string, unknown>, dateKeys: readonly string[]) {
  for (const key of dateKeys) {
    if (payload[key] === '') payload[key] = null;
  }
}
