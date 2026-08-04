import type { EntityEditOperations } from '../../app/editing/types';
import { pickDefinedFields } from '../../app/editing/types';
import {
  updateWorkOrder,
  type WorkOrderItemUpdatePayload,
  type WorkOrderUpdatePayload,
} from './api/workOrders';
import type { WorkOrder, WorkOrderItem } from './types';

const workOrderTextKeys = [
  'maxExpiry',
  'clientTrial',
  'clientTrialOutcome',
  'clientCheck',
  'clientCheckOutcome',
  'technicalService',
  'serviceStatus',
  'complaintReason',
  'device',
  'warranty',
  'testOutcome',
  'serviceDoctorSignature',
  'technicianSignature',
  'interventionDescription',
  'technicalNotes',
] as const;

const workOrderDateKeys = [
  'creationDate',
  'completionDate',
  'deliveryDate',
  'cancellationDate',
  'clientTrialDate',
  'clientCheckDate',
  'serviceDeliveryDate',
  'testOutcomeDate',
] as const;

// `status` changes only through the guarded status endpoint.
const workOrderEditableKeys = [
  ...workOrderTextKeys,
  ...workOrderDateKeys,
] as const satisfies readonly (keyof WorkOrder)[];

const itemTextKeys = ['status', 'production'] as const;
const itemDateKeys = [
  'cancellationDate',
  'orderDate',
  'partialDeliveryDate',
  'deliveryDate',
] as const;

const nullableDate = (value: string) => (value === '' ? null : value);

export function toWorkOrderUpdatePayload(changes: Partial<WorkOrder>): WorkOrderUpdatePayload {
  const payload: WorkOrderUpdatePayload = pickDefinedFields(changes, workOrderTextKeys);
  for (const key of workOrderDateKeys) {
    const value = changes[key];
    if (value !== undefined) payload[key] = nullableDate(value);
  }
  return payload;
}

export function toWorkOrderItemUpdatePayload(
  changes: Partial<WorkOrderItem>,
): WorkOrderItemUpdatePayload {
  const payload: WorkOrderItemUpdatePayload = pickDefinedFields(changes, itemTextKeys);
  for (const key of itemDateKeys) {
    const value = changes[key];
    if (value !== undefined) payload[key] = nullableDate(value);
  }
  return payload;
}

export const workOrderEditOperations = {
  editableKeys: workOrderEditableKeys,
  update: async (id, changes) => {
    await updateWorkOrder(id, toWorkOrderUpdatePayload(changes));
  },
} satisfies EntityEditOperations<'workOrder'>;
