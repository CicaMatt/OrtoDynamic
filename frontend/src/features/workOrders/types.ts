/**
 * Work order shape mirrored from the API (`lavorazioni`). Every field is a
 * string — the backend renders NULLs as empty strings and dates as text — so the
 * same type drives the list, the detail view, and the edit draft.
 */
export type WorkOrder = {
  id: string;

  // Links
  quoteId: string;
  clientId: string;
  /** Display name for the linked client, resolved by the API (read-only). */
  clientName: string;

  // Lifecycle
  status: string;
  creationDate: string;
  completionDate: string;
  deliveryDate: string;
  cancellationDate: string;
  maxExpiry: string;

  // Client trial & check
  clientTrial: string;
  clientTrialOutcome: string;
  clientTrialDate: string;
  clientCheck: string;
  clientCheckOutcome: string;
  clientCheckDate: string;
  doctorSignature: string;

  // Technical service
  technicalService: string;
  serviceStatus: string;
  complaintReason: string;
  device: string;
  warranty: string;
  serviceDeliveryDate: string;
  testOutcome: string;
  testOutcomeDate: string;
  serviceDoctorSignature: string;
  technicianSignature: string;

  // Free text
  interventionDescription: string;
  technicalNotes: string;
};

/**
 * A work order line (`item_lavorazioni`). `id` is the line's own id (the PATCH
 * target). The product/amount fields are joined from the linked quote line
 * (`item_preventivi`); `status`, `production` and the dates are the line's own.
 * All-strings like {@link WorkOrder}; `productId` is the raw `codice_nomenclatore`.
 */
export type WorkOrderItem = {
  id: string;
  productId: string;
  quantity: string;
  price: string;
  amount: string;
  discount: string;
  status: string;
  production: string;
  cancellationDate: string;
  orderDate: string;
  partialDeliveryDate: string;
  deliveryDate: string;
};
