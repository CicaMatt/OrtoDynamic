import { useState } from 'react';
import { useEntityDetail } from '../../../app/editing/useEntityDetail';
import { useNavigation, useRoute } from '../../../app/navigation/NavigationContext';
import { DeleteConfirmationDialog } from '../../../shared/entity/DeleteConfirmationDialog';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityPageHeader } from '../../../shared/entity/EntityPageHeader';
import {
  FieldSectionList,
  optionsFromValues,
  type FieldConfig,
  type FieldSectionConfig,
} from '../../../shared/entity/EntityFields';
import { DocumentErrorAlert, documentActionState } from '../../../shared/files/DocumentActions';
import { useInlineDocument } from '../../../shared/files/useInlineDocument';
import { EntityReference } from '../../../app/navigation/EntityReference';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { deleteWorkOrder, fetchWorkOrder, fetchWorkOrderCollaudi } from '../api/workOrders';
import type { WorkOrder } from '../types';
import { WorkOrderItemsCard } from './WorkOrderItemsCard';
import { WorkOrderStatusDialog } from './WorkOrderStatusDialog';
import { useWorkOrderEditor } from '../useWorkOrderEditor';

type WorkOrderField = FieldConfig<WorkOrder>;

// Stored verbatim in their columns — option values must match the database exactly.
const trialOptions = optionsFromValues(['ESTETICO', 'TECNICO']);
const checkOptions = optionsFromValues(['ESTETICO', 'FUNZIONALE', 'TECNICO']);
const outcomeOptions = optionsFromValues(['POSITIVO', 'RILAVORAZIONE']);
const yesNoOptions = optionsFromValues(['SI', 'NO']);
const complaintOptions = optionsFromValues(['MANUTENZIONE', 'RINNOVO FORNITURA']);
const deviceOptions = optionsFromValues(['INTERNO', 'ESTERNO']);

// `Stato` is read-only here: it changes only via the "Cambia Stato" action.
const lifecycleFields: WorkOrderField[] = [
  { label: 'ID', key: 'idWorkOrder', readonly: true },
  { label: 'Stato', key: 'status', readonly: true },
  { label: 'Data Creazione', key: 'creationDate', type: 'date' },
  { label: 'Data Fine Lavorazione', key: 'completionDate', type: 'date' },
  { label: 'Data Consegna', key: 'deliveryDate', type: 'date' },
  { label: 'Data Annullamento', key: 'cancellationDate', type: 'date' },
];

// These ownership references are fixed when the work order is created from its quote.
const referenceFields: WorkOrderField[] = [
  {
    label: 'ID Preventivo',
    key: 'quoteId',
    readonly: true,
    renderValue: (id) => <EntityReference name={id} id={id} entity="quote" />,
  },
  {
    label: 'Cliente',
    key: 'clientId',
    readonly: true,
    renderValue: (id, workOrder) => (
      <EntityReference name={workOrder.clientName} id={id} entity="client" />
    ),
  },
];

const trialFields: WorkOrderField[] = [
  { label: 'Prova Cliente', key: 'clientTrial', type: 'select', options: trialOptions },
  { label: 'Esito Prova', key: 'clientTrialOutcome', type: 'select', options: outcomeOptions },
  { label: 'Data Prova Cliente', key: 'clientTrialDate', type: 'date' },
  { label: 'Verifica Cliente', key: 'clientCheck', type: 'select', options: checkOptions },
  { label: 'Esito Verifica', key: 'clientCheckOutcome', type: 'select', options: outcomeOptions },
  { label: 'Data Verifica Cliente', key: 'clientCheckDate', type: 'date' },
  { label: 'Firma Medico', key: 'doctorSignature' },
];

const serviceFields: WorkOrderField[] = [
  { label: 'Assistenza Tecnica', key: 'technicalService', type: 'select', options: yesNoOptions },
  { label: 'Stato Lavorazione Assistenza', key: 'serviceStatus' },
  { label: 'Ragione Reclamo', key: 'complaintReason', type: 'select', options: complaintOptions },
  { label: 'Presidio', key: 'device', type: 'select', options: deviceOptions },
  { label: 'Garanzia', key: 'warranty' },
  { label: 'Data Consegna Assistenza', key: 'serviceDeliveryDate', type: 'date' },
  { label: 'Esito Collaudo', key: 'testOutcome' },
  { label: 'Data Esito Collaudo', key: 'testOutcomeDate', type: 'date' },
  { label: 'Firma Medico Assistenza', key: 'serviceDoctorSignature' },
  { label: 'Firma Tecnico', key: 'technicianSignature' },
  { label: 'Descrizione Intervento', key: 'interventionDescription', type: 'textarea' },
  { label: 'Annotazioni Tecniche Assistenza', key: 'technicalNotes', type: 'textarea' },
];

const workOrderSections: FieldSectionConfig<WorkOrder>[] = [
  { icon: 'engineering', title: 'Dati Lavorazione', fields: lifecycleFields },
  { icon: 'link', title: 'Riferimenti', fields: referenceFields },
  { icon: 'how_to_reg', title: 'Prova e Verifica Cliente', fields: trialFields },
  { icon: 'build', title: 'Assistenza Tecnica', fields: serviceFields },
];

export function WorkOrderDetailView() {
  const { workOrderId } = useRoute('work-order-detail');
  const { navigate, back } = useNavigation();
  const { draft, startEdit, seed, change } = useWorkOrderEditor();

  const { data, loading, error, isEditing, reload } = useEntityDetail({
    type: 'workOrder',
    selectedId: workOrderId,
    fetcher: fetchWorkOrder,
    missingMessage: 'Nessuna lavorazione selezionata.',
    draft,
    seed,
  });

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const {
    generating,
    error: docError,
    clearError,
    open: openDocument,
  } = useInlineDocument<'collaudi'>();

  if (loading) {
    return (
      <StatusMessage
        onBack={() => back({ name: 'work-orders' })}
        backLabel="Torna alle lavorazioni"
      >
        Caricamento lavorazione...
      </StatusMessage>
    );
  }
  if (error || !data) {
    return (
      <StatusMessage
        onBack={() => back({ name: 'work-orders' })}
        backLabel="Torna alle lavorazioni"
        tone="error"
      >
        {error ?? 'Nessuna lavorazione selezionata.'}
      </StatusMessage>
    );
  }

  const title = `Lavorazione ${data.idWorkOrder}`;
  const collaudiState = documentActionState({
    generating,
    kind: 'collaudi',
    idleLabel: 'Scheda Rischi e Collaudi',
    busyLabel: 'Generazione scheda…',
    disabled: isEditing,
  });
  const actions = [
    {
      id: 'edit',
      icon: 'edit',
      label: 'Modifica Dati Lavorazione',
      active: isEditing,
      onClick: !isEditing ? () => startEdit(data.idWorkOrder) : undefined,
    },
    {
      id: 'status',
      icon: 'sync_alt',
      label: 'Cambia Stato',
      onClick: !isEditing ? () => setStatusDialogOpen(true) : undefined,
    },
    {
      id: 'collaudi',
      icon: 'fact_check',
      label: collaudiState.label,
      onClick: !collaudiState.disabled
        ? () => openDocument('collaudi', () => fetchWorkOrderCollaudi(data.idWorkOrder))
        : undefined,
    },
    {
      id: 'delete',
      icon: 'delete',
      label: 'Elimina Lavorazione',
      tone: 'danger' as const,
      onClick: !isEditing && !generating ? () => setDeleteDialogOpen(true) : undefined,
    },
  ];

  return (
    <>
      <EntityDetailLayout
        header={
          <EntityPageHeader
            back={{ label: 'Torna indietro', onClick: () => back({ name: 'work-orders' }) }}
            crumbs={[
              { label: 'Lavorazioni', onClick: () => navigate({ name: 'work-orders' }) },
              { label: 'Dettaglio' },
            ]}
            title={title}
            subtitle={
              <>
                ID: <span className="font-semibold text-on-surface">{data.idWorkOrder}</span>
                {data.status && (
                  <>
                    {' · Stato: '}
                    <span className="font-semibold text-on-surface">{data.status}</span>
                  </>
                )}
              </>
            }
          />
        }
        actionsTitle="Azioni lavorazione"
        actions={actions}
      >
        <div className="space-y-[28px]">
          {docError && <DocumentErrorAlert error={docError} onClose={clearError} />}
          <FieldSectionList
            data={data}
            sections={workOrderSections}
            editing={isEditing}
            onChange={change}
          />
          <WorkOrderItemsCard workOrderId={data.idWorkOrder} />
        </div>
      </EntityDetailLayout>

      {statusDialogOpen && (
        <WorkOrderStatusDialog
          workOrderId={data.idWorkOrder}
          currentStatus={data.status}
          onClose={() => setStatusDialogOpen(false)}
          onChanged={reload}
        />
      )}
      {deleteDialogOpen && (
        <DeleteConfirmationDialog
          title="Elimina Lavorazione"
          message={`Confermi l'eliminazione della lavorazione ${data.idWorkOrder}?`}
          warnings={[
            'Saranno eliminati anche gli articoli associati alla lavorazione.',
            ...(data.quoteId
              ? [
                  `Sarà eliminato anche il Preventivo associato ${data.quoteId}, con i suoi articoli.`,
                ]
              : []),
          ]}
          confirmLabel="Elimina Lavorazione"
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={async () => {
            await deleteWorkOrder(data.idWorkOrder);
            navigate({ name: 'work-orders' });
          }}
        />
      )}
    </>
  );
}
