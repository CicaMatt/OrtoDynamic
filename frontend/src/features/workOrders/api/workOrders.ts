import { apiGet, apiPatch } from '../../../shared/api/http';
import type { WorkOrder, WorkOrderItem } from '../types';

export type WorkOrderUpdate = Record<string, string | number | null>;

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
  changes: Record<string, string | null>,
): Promise<unknown> {
  return apiPatch(`/work-orders/${workOrderId}/items/${itemId}/`, changes);
}

export function updateWorkOrder(id: string, changes: WorkOrderUpdate): Promise<unknown> {
  return apiPatch(`/work-orders/${id}/`, changes);
}

/** Set a work order's status (free choice among the fixed states). */
export function changeWorkOrderStatus(id: string, status: string): Promise<WorkOrder> {
  return apiPatch<WorkOrder>(`/work-orders/${id}/status/`, { status });
}
