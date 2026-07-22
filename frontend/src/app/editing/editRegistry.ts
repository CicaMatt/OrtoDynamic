import { clientEditOperations } from '../../features/clients/editing';
import { doctorEditOperations } from '../../features/doctors/editing';
import { healthCompanyEditOperations } from '../../features/healthCompanies/editing';
import { productEditOperations } from '../../features/products/editing';
import { quoteEditOperations } from '../../features/quotes/editing';
import { workOrderEditOperations } from '../../features/workOrders/editing';
import type { EntityEditOperations, EntityKind } from './types';

/** The single application composition point for feature-owned edit operations. */
export const editRegistry = {
  client: clientEditOperations,
  doctor: doctorEditOperations,
  healthCompany: healthCompanyEditOperations,
  product: productEditOperations,
  quote: quoteEditOperations,
  workOrder: workOrderEditOperations,
} satisfies { [K in EntityKind]: EntityEditOperations<K> };

/**
 * Preserve the selected feature's type at the heterogeneous registry boundary.
 * The registry is fully checked above; this is the only cast needed for lookup.
 */
export function editOperationsFor<K extends EntityKind>(type: K): EntityEditOperations<K> {
  return editRegistry[type] as unknown as EntityEditOperations<K>;
}
