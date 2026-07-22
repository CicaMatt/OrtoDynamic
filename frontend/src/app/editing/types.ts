import type { Client, ClientOrthopedic } from '../../features/clients/types';
import type { Doctor } from '../../features/doctors/types';
import type { HealthCompany } from '../../features/healthCompanies/types';
import type { Product } from '../../features/products/types';
import type { Quote, QuoteItemDraft } from '../../features/quotes/types';
import type { WorkOrder } from '../../features/workOrders/types';

export type EntityDraftMap = {
  client: Client;
  doctor: Doctor;
  healthCompany: HealthCompany;
  product: Product;
  quote: Quote;
  workOrder: WorkOrder;
};

export type EntityKind = keyof EntityDraftMap;
export type EntityDraft = EntityDraftMap[EntityKind];
export type EditTarget = { [K in EntityKind]: { type: K; id: string } }[EntityKind];
export type EditMode = 'edit' | 'create';
export type SaveResult = { ok: boolean; created?: EditTarget };

/** Domain extras carried by the three non-trivial edit sessions. */
export type EditOperationContext = {
  clientOrthopedicChanges: Partial<ClientOrthopedic>;
  quoteItemDrafts: readonly QuoteItemDraft[];
};

/**
 * The complete feature-owned edit flow used by the global session lifecycle.
 * `create` returns the new id directly; payload conversion and API calls stay
 * inside the feature instead of being reconstructed by the session.
 */
export type EntityEditOperations<K extends EntityKind> = {
  editableKeys: readonly (keyof EntityDraftMap[K])[];
  requiredKeys?: readonly (keyof EntityDraftMap[K])[];
  emptyDraft?: () => EntityDraftMap[K];
  create?: (draft: EntityDraftMap[K], context: EditOperationContext) => Promise<string>;
  update: (
    id: string,
    changes: Partial<EntityDraftMap[K]>,
    context: EditOperationContext,
  ) => Promise<void>;
};

/** Pick a known set of fields while preserving their actual key/value types. */
export function pickFields<T extends object, K extends keyof T>(
  value: T,
  keys: readonly K[],
): Pick<T, K> {
  const picked = {} as Pick<T, K>;
  for (const key of keys) picked[key] = value[key];
  return picked;
}

/** Pick only fields that are present in a PATCH-style partial value. */
export function pickDefinedFields<T extends object, K extends keyof T>(
  value: Partial<T>,
  keys: readonly K[],
): Partial<Pick<T, K>> {
  const picked: Partial<Pick<T, K>> = {};
  for (const key of keys) {
    if (value[key] !== undefined) picked[key] = value[key];
  }
  return picked;
}

/** Return only declared fields whose draft value differs from the original. */
export function diffDraft<T extends object, K extends keyof T>(
  draft: T | null,
  original: T | null,
  keys: readonly K[],
): Partial<Pick<T, K>> {
  const changes: Partial<Pick<T, K>> = {};
  if (!draft || !original) return changes;
  for (const key of keys) {
    if (draft[key] !== original[key]) changes[key] = draft[key];
  }
  return changes;
}
