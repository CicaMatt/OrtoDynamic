import { useState } from 'react';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useEntityDetail } from '../../../app/editing/useEntityDetail';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityPageHeader } from '../../../shared/entity/EntityPageHeader';
import {
  FieldSectionList,
  type FieldSectionConfig,
} from '../../../shared/entity/FieldSectionCard';
import { optionsFromValues, type FieldConfig } from '../../../shared/entity/DataCard';
import { useInlineDocument } from '../../../shared/files/useInlineDocument';
import { Icon } from '../../../shared/ui/Icon';
import { ReferenceName } from '../../../shared/ui/ReferenceName';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { fetchWorkOrder, fetchWorkOrderCollaudi } from '../api/workOrders';
import type { WorkOrder } from '../types';
import { WorkOrderItemsCard } from './WorkOrderItemsCard';
import { WorkOrderStatusDialog } from './WorkOrderStatusDialog';

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
  { label: 'ID', key: 'id', readonly: true },
  { label: 'Stato', key: 'status', readonly: true },
  { label: 'Data Creazione', key: 'creationDate', type: 'date' },
  { label: 'Data Fine Lavorazione', key: 'completionDate', type: 'date' },
  { label: 'Data Consegna', key: 'deliveryDate', type: 'date' },
  { label: 'Data Annullamento', key: 'cancellationDate', type: 'date' },
];

// In read mode the client shows by name with its id revealed on hover; edit mode
// keeps the numeric id input, since the reference is still set by id.
const referenceFields: WorkOrderField[] = [
  {
    label: 'ID Preventivo',
    key: 'quoteId',
    type: 'number',
    renderValue: (id) => <ReferenceName name={id} id={id} entity="quote" />,
  },
  {
    label: 'Cliente',
    key: 'clientId',
    type: 'number',
    renderValue: (id, workOrder) => (
      <ReferenceName name={workOrder.clientName} id={id} entity="client" />
    ),
  },
  { label: 'Massima Scadenza', key: 'maxExpiry' },
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
  const { selectedWorkOrderId, navigate, goBack } = useNavigation();
  const { workOrderDraft, startWorkOrderEdit, seedWorkOrder, setWorkOrderField } = useEntityEdit();

  const { data, loading, error, isEditing, reload } = useEntityDetail({
    type: 'workOrder',
    selectedId: selectedWorkOrderId,
    fetcher: fetchWorkOrder,
    missingMessage: 'Nessuna lavorazione selezionata.',
    draft: workOrderDraft,
    seed: seedWorkOrder,
  });

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const { generating, error: docError, clearError, open: openDocument } = useInlineDocument<'collaudi'>();

  if (loading) {
    return (
      <StatusMessage onBack={() => goBack('work-orders')} backLabel="Torna alle lavorazioni">
        Caricamento lavorazione...
      </StatusMessage>
    );
  }
  if (error || !data) {
    return (
      <StatusMessage
        onBack={() => goBack('work-orders')}
        backLabel="Torna alle lavorazioni"
        tone="error"
      >
        {error ?? 'Nessuna lavorazione selezionata.'}
      </StatusMessage>
    );
  }

  const title = `Lavorazione ${data.id}`;
  const actions = [
    {
      id: 'edit',
      icon: 'edit',
      label: 'Modifica Dati Lavorazione',
      active: isEditing,
      onClick: !isEditing ? () => startWorkOrderEdit(data.id) : undefined,
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
      label: generating === 'collaudi' ? 'Generazione scheda…' : 'Scheda Rischi e Collaudi',
      onClick:
        !isEditing && !generating
          ? () => openDocument('collaudi', () => fetchWorkOrderCollaudi(data.id))
          : undefined,
    },
  ];

  return (
    <>
      <EntityDetailLayout
        header={
          <EntityPageHeader
            back={{ label: 'Torna indietro', onClick: () => goBack('work-orders') }}
            crumbs={[
              { label: 'Lavorazioni', onClick: () => navigate('work-orders') },
              { label: 'Dettaglio' },
            ]}
            title={title}
            subtitle={
              <>
                ID: <span className="font-semibold text-on-surface">{data.id}</span>
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
          {docError && (
            <div
              role="alert"
              className="flex items-start justify-between gap-3 rounded-[10px] border border-error bg-error/10 px-[20px] py-[14px]"
            >
              <span className="font-body-sm text-body-sm text-error">{docError}</span>
              <button
                type="button"
                onClick={clearError}
                aria-label="Chiudi"
                className="text-error/70 hover:text-error"
              >
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
          )}
          <FieldSectionList
            data={data}
            sections={workOrderSections}
            editing={isEditing}
            onChange={setWorkOrderField}
          />
          <WorkOrderItemsCard workOrderId={data.id} />
        </div>
      </EntityDetailLayout>

      {statusDialogOpen && (
        <WorkOrderStatusDialog
          workOrderId={data.id}
          currentStatus={data.status}
          onClose={() => setStatusDialogOpen(false)}
          onChanged={reload}
        />
      )}
    </>
  );
}
