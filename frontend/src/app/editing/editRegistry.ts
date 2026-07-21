import { clientEditConfig } from '../../features/clients/editConfig';
import { doctorEditConfig } from '../../features/doctors/editConfig';
import { healthCompanyEditConfig } from '../../features/healthCompanies/editConfig';
import { productEditConfig } from '../../features/products/editConfig';
import { quoteEditConfig } from '../../features/quotes/editConfig';
import { workOrderEditConfig } from '../../features/workOrders/editConfig';
import type { EditPayloadContext, EntityEditConfig, EntityKind } from './types';

/** The application-level composition point for feature-owned edit behavior. */
export const editRegistry = {
  client: clientEditConfig,
  doctor: doctorEditConfig,
  healthCompany: healthCompanyEditConfig,
  product: productEditConfig,
  quote: quoteEditConfig,
  workOrder: workOrderEditConfig,
} satisfies { [K in EntityKind]: EntityEditConfig<K> };

type RuntimePayloadBuilder = (
  value: object,
  context: EditPayloadContext,
) => Record<string, unknown>;

export type RuntimeEditConfig = {
  editableKeys: readonly PropertyKey[];
  requiredKeys?: readonly PropertyKey[];
  makeEmptyDraft?: () => object;
  create?: (payload: Record<string, unknown>) => Promise<object>;
  update: (id: string, payload: Record<string, unknown>) => Promise<unknown>;
  getCreatedId?: (created: object) => string;
  buildCreatePayload?: RuntimePayloadBuilder;
  buildUpdatePayload?: RuntimePayloadBuilder;
  applyFieldChange?: (draft: object, key: PropertyKey, value: string) => object | null;
};

/** Domain types are checked above, then intentionally erased at this one runtime boundary. */
export function editConfigFor(type: EntityKind): RuntimeEditConfig {
  return editRegistry[type] as unknown as RuntimeEditConfig;
}
