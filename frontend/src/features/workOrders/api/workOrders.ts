import { apiGet, apiPatch } from '../../../shared/api/http';
import type { WorkOrder } from '../types';

export type WorkOrderUpdate = Record<string, string | number | null>;

export function fetchWorkOrders(): Promise<WorkOrder[]> {
  return apiGet<WorkOrder[]>('/work-orders/');
}

export function fetchWorkOrder(id: string): Promise<WorkOrder> {
  return apiGet<WorkOrder>(`/work-orders/${id}/`);
}

export function updateWorkOrder(id: string, changes: WorkOrderUpdate): Promise<unknown> {
  return apiPatch(`/work-orders/${id}/`, changes);
}
