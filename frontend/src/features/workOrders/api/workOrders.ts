import { apiDelete, apiGet, apiGetBlob, apiPatch } from '../../../shared/api/http';
import type { WorkOrder, WorkOrderItem } from '../types';

export type WorkOrderFieldsPayload = {
  creationDate: string | null;
  completionDate: string | null;
  deliveryDate: string | null;
  cancellationDate: string | null;
  maxExpiry: string;
  clientTrial: string;
  clientTrialOutcome: string;
  clientTrialDate: string | null;
  clientCheck: string;
  clientCheckOutcome: string;
  clientCheckDate: string | null;
  technicalService: string;
  serviceStatus: string;
  complaintReason: string;
  device: string;
  warranty: string;
  serviceDeliveryDate: string | null;
  testOutcome: string;
  testOutcomeDate: string | null;
  serviceDoctorSignature: string;
  technicianSignature: string;
  interventionDescription: string;
  technicalNotes: string;
};

export type WorkOrderUpdatePayload = Partial<WorkOrderFieldsPayload>;

export type WorkOrderItemUpdatePayload = {
  status?: string;
  production?: string;
  cancellationDate?: string | null;
  orderDate?: string | null;
  partialDeliveryDate?: string | null;
  deliveryDate?: string | null;
};

export function fetchWorkOrders(): Promise<WorkOrder[]> {
  return apiGet<WorkOrder[]>('/work-orders/');
}

export function fetchWorkOrder(id: string): Promise<WorkOrder> {
  return apiGet<WorkOrder>(`/work-orders/${id}/`);
}

export function fetchWorkOrderItems(workOrderId: string): Promise<WorkOrderItem[]> {
  return apiGet<WorkOrderItem[]>(`/work-orders/${workOrderId}/items/`);
}

/** Persist edits to a single work order line (status/production/dates; '' dates → null). */
export function updateWorkOrderItem(
  workOrderId: string,
  itemId: string,
  changes: WorkOrderItemUpdatePayload,
): Promise<unknown> {
  return apiPatch(`/work-orders/${workOrderId}/items/${itemId}/`, changes);
}

export function updateWorkOrder(id: string, changes: WorkOrderUpdatePayload): Promise<unknown> {
  return apiPatch(`/work-orders/${id}/`, changes);
}

export function deleteWorkOrder(id: string): Promise<void> {
  return apiDelete(`/work-orders/${id}/`);
}

/** Set a work order's status (free choice among the fixed states). */
export function changeWorkOrderStatus(id: string, status: string): Promise<WorkOrder> {
  return apiPatch<WorkOrder>(`/work-orders/${id}/status/`, { status });
}

/** Fetch the work order's "Scheda valutazione rischi e collaudi" as an inline PDF blob. */
export function fetchWorkOrderCollaudi(
  id: string,
): Promise<{ blob: Blob; filename: string | null }> {
  return apiGetBlob(`/work-orders/${id}/collaudi/`);
}
