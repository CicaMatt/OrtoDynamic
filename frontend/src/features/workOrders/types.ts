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
