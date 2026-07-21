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
export type EditTarget = { [K in EntityKind]: { type: K; id: string } }[EntityKind];
export type EditMode = 'edit' | 'create';
export type SaveResult = { ok: boolean; created?: EditTarget };

export type EditPayloadContext = {
  clientOrthopedicChanges: Record<string, unknown>;
  quoteItemDrafts: QuoteItemDraft[];
};

export type EntityEditConfig<K extends EntityKind> = {
  editableKeys: readonly (keyof EntityDraftMap[K])[];
  requiredKeys?: readonly (keyof EntityDraftMap[K])[];
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

export function diffDraft(
  draft: object | null,
  original: object | null,
  keys: readonly PropertyKey[],
) {
  const changes: Record<string, unknown> = {};
  if (!draft || !original) return changes;
  for (const key of keys) {
    if (Reflect.get(draft, key) !== Reflect.get(original, key)) {
      changes[String(key)] = Reflect.get(draft, key);
    }
  }
  return changes;
}

export function buildCreatePayload(
  draft: object | null,
  keys: readonly PropertyKey[],
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (!draft) return payload;
  for (const key of keys) payload[String(key)] = Reflect.get(draft, key);
  return payload;
}

export function blankDatesToNull(payload: Record<string, unknown>, dateKeys: readonly string[]) {
  for (const key of dateKeys) {
    if (payload[key] === '') payload[key] = null;
  }
}
