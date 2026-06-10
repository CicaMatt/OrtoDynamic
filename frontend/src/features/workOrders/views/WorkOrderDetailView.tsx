import { useEffect } from 'react';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityPageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionCard } from '../../../shared/entity/FieldSectionCard';
import type { FieldConfig, SelectOption } from '../../../shared/entity/DataCard';
import { useApiData } from '../../../shared/hooks/useApiData';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import { formatBirthDate } from '../../../shared/format/format';
import { fetchWorkOrder } from '../api/workOrders';
import type { WorkOrder } from '../types';

type WorkOrderField = FieldConfig<WorkOrder>;

const sameLabel = (value: string): SelectOption => ({ value, label: value });

// Stored verbatim in their columns — option values must match the database exactly.
const statusOptions: SelectOption[] = [
  'PRONTO PRIMA PROVA',
  'PRONTO SECONDA PROVA',
  'PRONTO TERZA PROVA',
  'IN LAVORAZIONE',
  'IN FINITURA',
  'LAVORATO PARZIALE',
  'LAVORATO',
  'INVIATE A LACO PER MODIFICA',
  'IN REVISIONE DOPO CONSEGNA',
  'ANNULLATO',
].map(sameLabel);

const trialOptions: SelectOption[] = ['ESTETICO', 'TECNICO'].map(sameLabel);
const checkOptions: SelectOption[] = ['ESTETICO', 'FUNZIONALE', 'TECNICO'].map(sameLabel);
const outcomeOptions: SelectOption[] = ['POSITIVO', 'RILAVORAZIONE'].map(sameLabel);
const yesNoOptions: SelectOption[] = ['SI', 'NO'].map(sameLabel);
const complaintOptions: SelectOption[] = ['MANUTENZIONE', 'RINNOVO FORNITURA'].map(sameLabel);
const deviceOptions: SelectOption[] = ['INTERNO', 'ESTERNO'].map(sameLabel);

const lifecycleFields: WorkOrderField[] = [
  { label: 'ID', key: 'id', readonly: true },
  { label: 'Stato', key: 'status', type: 'select', options: statusOptions },
  { label: 'Data Creazione', key: 'creationDate', type: 'date' },
  { label: 'Data Fine Lavorazione', key: 'completionDate', type: 'date' },
  { label: 'Data Consegna', key: 'deliveryDate', type: 'date' },
  { label: 'Data Annullamento', key: 'cancellationDate', type: 'date' },
];

const referenceFields: WorkOrderField[] = [
  { label: 'ID Preventivo', key: 'quoteId', type: 'number' },
  { label: 'ID Cliente', key: 'clientId', type: 'number' },
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
];

const interventionFields: WorkOrderField[] = [
  { label: 'Descrizione Intervento', key: 'interventionDescription', type: 'textarea' },
  { label: 'Annotazioni Tecniche Assistenza', key: 'technicalNotes', type: 'textarea' },
];

const workOrderActions = [{ id: 'edit', icon: 'edit', label: 'Modifica Dati Lavorazione' }];

function displayWorkOrderValue(field: WorkOrderField, raw: string): string {
  if (field.type === 'date') return formatBirthDate(raw);
  return raw;
}

export function WorkOrderDetailView() {
  const { selectedWorkOrderId, navigate } = useNavigation();
  const {
    editing,
    editTarget,
    workOrderDraft,
    dataVersion,
    startWorkOrderEdit,
    seedWorkOrder,
    setWorkOrderField,
  } = useEntityEdit();

  const isEditingWorkOrder =
    editing && editTarget?.type === 'workOrder' && editTarget.id === selectedWorkOrderId;

  const { data: workOrder, loading, error } = useApiData(
    () =>
      selectedWorkOrderId
        ? fetchWorkOrder(selectedWorkOrderId)
        : Promise.reject(new Error('Nessuna lavorazione selezionata.')),
    [selectedWorkOrderId, dataVersion],
  );

  useEffect(() => {
    if (isEditingWorkOrder && workOrder) seedWorkOrder(workOrder);
  }, [isEditingWorkOrder, workOrder, seedWorkOrder]);

  if (loading) {
    return (
      <StatusMessage onBack={() => navigate('work-orders')} backLabel="Torna alle lavorazioni">
        Caricamento lavorazione...
      </StatusMessage>
    );
  }
  if (error || !workOrder) {
    return (
      <StatusMessage
        onBack={() => navigate('work-orders')}
        backLabel="Torna alle lavorazioni"
        tone="error"
      >
        {error ?? 'Nessuna lavorazione selezionata.'}
      </StatusMessage>
    );
  }

  const data = isEditingWorkOrder && workOrderDraft ? workOrderDraft : workOrder;
  const title = `Lavorazione ${data.id}`;
  const actions = workOrderActions.map((action) => ({
    ...action,
    active: isEditingWorkOrder,
    onClick: !isEditingWorkOrder ? () => startWorkOrderEdit(data.id) : undefined,
  }));

  return (
    <EntityDetailLayout
      header={
        <EntityPageHeader
          back={{ label: 'Torna indietro', onClick: () => navigate('work-orders') }}
          crumbs={[
            { label: 'Lavorazioni', onClick: () => navigate('work-orders') },
            { label: 'Dettaglio' },
          ]}
          title={title}
          subtitle={
            <>
              ID: <span className="font-semibold text-[#343942]">{data.id}</span>
              {data.status && (
                <>
                  {' · Stato: '}
                  <span className="font-semibold text-[#343942]">{data.status}</span>
                </>
              )}
            </>
          }
        />
      }
      actionsTitle="Azioni lavorazione"
      actions={actions}
    >
      <FieldSectionCard
        icon="engineering"
        title="Dati Lavorazione"
        data={data}
        fields={lifecycleFields}
        editing={isEditingWorkOrder}
        onChange={setWorkOrderField}
        format={displayWorkOrderValue}
      />

      <div className="mt-[28px]">
        <FieldSectionCard
          icon="link"
          title="Riferimenti"
          data={data}
          fields={referenceFields}
          editing={isEditingWorkOrder}
          onChange={setWorkOrderField}
        />
      </div>

      <div className="mt-[28px]">
        <FieldSectionCard
          icon="how_to_reg"
          title="Prova e Verifica Cliente"
          data={data}
          fields={trialFields}
          editing={isEditingWorkOrder}
          onChange={setWorkOrderField}
          format={displayWorkOrderValue}
        />
      </div>

      <div className="mt-[28px]">
        <FieldSectionCard
          icon="build"
          title="Assistenza Tecnica"
          data={data}
          fields={serviceFields}
          editing={isEditingWorkOrder}
          onChange={setWorkOrderField}
          format={displayWorkOrderValue}
        />
      </div>

      <div className="mt-[28px]">
        <FieldSectionCard
          icon="description"
          title="Intervento e Annotazioni"
          data={data}
          fields={interventionFields}
          columns={1}
          editing={isEditingWorkOrder}
          onChange={setWorkOrderField}
        />
      </div>
    </EntityDetailLayout>
  );
}
