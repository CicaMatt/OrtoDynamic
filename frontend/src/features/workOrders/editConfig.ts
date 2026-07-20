import { blankDatesToNull, type EntityEditConfig } from '../../app/editing/types';
import { updateWorkOrder, type WorkOrderUpdate } from './api/workOrders';
import type { WorkOrder } from './types';

// `status` changes only through the guarded status endpoint.
const editableWorkOrderKeys = [
  'quoteId', 'clientId', 'creationDate', 'completionDate', 'deliveryDate',
  'cancellationDate', 'maxExpiry', 'clientTrial', 'clientTrialOutcome', 'clientTrialDate',
  'clientCheck', 'clientCheckOutcome', 'clientCheckDate', 'doctorSignature', 'technicalService',
  'serviceStatus', 'complaintReason', 'device', 'warranty', 'serviceDeliveryDate', 'testOutcome',
  'testOutcomeDate', 'serviceDoctorSignature', 'technicianSignature', 'interventionDescription',
  'technicalNotes',
] as const satisfies readonly (keyof WorkOrder)[];

const workOrderDateKeys = [
  'creationDate', 'completionDate', 'deliveryDate', 'cancellationDate', 'clientTrialDate',
  'clientCheckDate', 'serviceDeliveryDate', 'testOutcomeDate',
];

function buildWorkOrderPayload(changes: Record<string, unknown>): WorkOrderUpdate {
  const payload = { ...changes } as WorkOrderUpdate;
  blankDatesToNull(payload, workOrderDateKeys);
  if ('quoteId' in payload) {
    payload.quoteId = payload.quoteId === '' ? null : Number(payload.quoteId);
  }
  if ('clientId' in payload) {
    payload.clientId = payload.clientId === '' ? null : Number(payload.clientId);
  }
  return payload;
}

export const workOrderEditConfig: EntityEditConfig<'workOrder'> = {
  editableKeys: editableWorkOrderKeys,
  update: (id, payload) => updateWorkOrder(id, payload as WorkOrderUpdate),
  buildUpdatePayload: buildWorkOrderPayload,
};
