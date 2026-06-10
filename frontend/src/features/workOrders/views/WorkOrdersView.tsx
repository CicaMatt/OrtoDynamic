import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityListView, type EntityColumn } from '../../../shared/entity/EntityListView';
import { formatBirthDate } from '../../../shared/format/format';
import { fetchWorkOrders } from '../api/workOrders';
import type { WorkOrder } from '../types';

/** Trim long free-text cells so the table stays readable; full text lives in the detail view. */
function preview(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 60 ? `${trimmed.slice(0, 60)}…` : trimmed;
}

/**
 * Every column of `lavorazioni` is shown. The bounded categorical columns
 * (status, trial/check, technical service, complaint, device, warranty) are
 * filterable; dates render in Italian and are not searched; the long free-text
 * columns are previewed and excluded from search.
 */
const workOrderColumns: ReadonlyArray<EntityColumn<WorkOrder>> = [
  { key: 'id', label: 'ID', primary: true, filterable: false },
  { key: 'quoteId', label: 'ID Preventivo', muted: true, filterable: false },
  { key: 'clientId', label: 'ID Cliente', muted: true, filterable: false },
  { key: 'status', label: 'Stato' },
  {
    key: 'creationDate',
    label: 'Data Creazione',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  {
    key: 'completionDate',
    label: 'Data Fine Lavorazione',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  {
    key: 'deliveryDate',
    label: 'Data Consegna',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  {
    key: 'cancellationDate',
    label: 'Data Annullamento',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  { key: 'maxExpiry', label: 'Massima Scadenza', muted: true, filterable: false },
  { key: 'clientTrial', label: 'Prova Cliente' },
  { key: 'clientTrialOutcome', label: 'Esito Prova' },
  {
    key: 'clientTrialDate',
    label: 'Data Prova Cliente',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  { key: 'clientCheck', label: 'Verifica Cliente' },
  { key: 'clientCheckOutcome', label: 'Esito Verifica' },
  {
    key: 'clientCheckDate',
    label: 'Data Verifica Cliente',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  { key: 'doctorSignature', label: 'Firma Medico', muted: true, filterable: false },
  { key: 'technicalService', label: 'Assistenza Tecnica' },
  { key: 'serviceStatus', label: 'Stato Lavorazione Assistenza', muted: true, filterable: false },
  { key: 'complaintReason', label: 'Ragione Reclamo' },
  { key: 'device', label: 'Presidio' },
  { key: 'warranty', label: 'Garanzia' },
  {
    key: 'serviceDeliveryDate',
    label: 'Data Consegna Assistenza',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  { key: 'testOutcome', label: 'Esito Collaudo', muted: true, filterable: false },
  {
    key: 'testOutcomeDate',
    label: 'Data Esito Collaudo',
    muted: true,
    searchable: false,
    filterable: false,
    render: formatBirthDate,
  },
  { key: 'serviceDoctorSignature', label: 'Firma Medico Assistenza', muted: true, filterable: false },
  { key: 'technicianSignature', label: 'Firma Tecnico', muted: true },
  {
    key: 'interventionDescription',
    label: 'Descrizione Intervento',
    muted: true,
    searchable: false,
    filterable: false,
    render: preview,
  },
  {
    key: 'technicalNotes',
    label: 'Annotazioni Tecniche Assistenza',
    muted: true,
    searchable: false,
    filterable: false,
    render: preview,
  },
];

export function WorkOrdersView() {
  const { openWorkOrderDetail } = useNavigation();

  return (
    <EntityListView
      title="Lavorazioni"
      columns={workOrderColumns}
      fetchItems={fetchWorkOrders}
      rowKey={(workOrder) => workOrder.id}
      onRowClick={(workOrder) => openWorkOrderDetail(workOrder.id)}
      loadingLabel="Caricamento lavorazioni..."
      emptyLabel="Nessuna lavorazione trovata."
    />
  );
}
