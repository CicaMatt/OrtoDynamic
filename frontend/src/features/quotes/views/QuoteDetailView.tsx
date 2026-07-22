import { useState } from 'react';
import { useEntityDetail } from '../../../app/editing/useEntityDetail';
import { useNavigation, useRoute } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { DeleteConfirmationDialog } from '../../../shared/entity/DeleteConfirmationDialog';
import { EntityPageHeader } from '../../../shared/entity/EntityPageHeader';
import { FieldSectionList } from '../../../shared/entity/EntityFields';
import {
  DocumentErrorAlert,
  DocumentOptionsDialog,
  documentActionState,
} from '../../../shared/files/DocumentActions';
import { useInlineDocument } from '../../../shared/files/useInlineDocument';
import { todayIso } from '../../../shared/format/format';
import { Icon } from '../../../shared/ui/Icon';
import { StatusMessage } from '../../../shared/ui/StatusMessage';
import {
  deleteQuote,
  fetchQuote,
  fetchQuoteDdt,
  fetchQuoteDeliveryForm,
  fetchQuoteScheda,
} from '../api/quotes';
import { useClientAutocomplete } from '../../clients/components/useClientAutocomplete';
import { useDoctorAutocomplete } from '../../doctors/components/useDoctorAutocomplete';
import { quoteDetailNoteSections, quoteDetailSectionsBeforeNotes } from '../components/quoteFields';
import { QuoteItemsCard } from './QuoteItemsCard';
import { QuoteStatusDialog } from './QuoteStatusDialog';
import { useQuoteEditor } from '../useQuoteEditor';

export function QuoteDetailView() {
  const { quoteId } = useRoute('quote-detail');
  const { navigate, back } = useNavigation();
  const { draft, startEdit, seed, change } = useQuoteEditor();

  const { data, loading, error, isEditing, reload } = useEntityDetail({
    type: 'quote',
    selectedId: quoteId,
    fetcher: fetchQuote,
    missingMessage: 'Nessun preventivo selezionato.',
    draft,
    seed,
  });

  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [ddtOptionsOpen, setDdtOptionsOpen] = useState(false);
  const [deliveryFormOptionsOpen, setDeliveryFormOptionsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const {
    generating,
    error: docError,
    clearError,
    open: openDocument,
  } = useInlineDocument<'consegna' | 'ddt' | 'scheda'>();
  const clientAutocomplete = useClientAutocomplete(isEditing);
  const doctorAutocomplete = useDoctorAutocomplete(isEditing);

  if (loading) {
    return (
      <StatusMessage onBack={() => back({ name: 'quotes' })} backLabel="Torna ai preventivi">
        Caricamento preventivo...
      </StatusMessage>
    );
  }
  if (error || !data) {
    return (
      <StatusMessage
        onBack={() => back({ name: 'quotes' })}
        backLabel="Torna ai preventivi"
        tone="error"
      >
        {error ?? 'Nessun preventivo selezionato.'}
      </StatusMessage>
    );
  }

  const title = data.quoteNumber
    ? `Preventivo Nº ${data.quoteNumber}`
    : `Preventivo ${data.idQuote}`;
  const deliveryFormState = documentActionState({
    generating,
    kind: 'consegna',
    idleLabel: 'Modulo di Consegna',
    busyLabel: 'Generazione modulo…',
    disabled: isEditing,
  });
  const ddtState = documentActionState({
    generating,
    kind: 'ddt',
    idleLabel: 'Genera DDT',
    busyLabel: 'Generazione DDT…',
    disabled: isEditing,
  });
  const schedaState = documentActionState({
    generating,
    kind: 'scheda',
    idleLabel: 'Scheda Progetto',
    busyLabel: 'Generazione scheda…',
    disabled: isEditing,
  });

  const actions = [
    {
      id: 'edit',
      icon: 'edit',
      label: 'Modifica Dati Preventivo',
      active: isEditing,
      onClick: !isEditing ? () => startEdit(data.idQuote) : undefined,
    },
    {
      id: 'status',
      icon: 'sync_alt',
      label: 'Cambia Stato',
      onClick: !isEditing ? () => setStatusDialogOpen(true) : undefined,
    },
    {
      id: 'delivery-form',
      icon: 'picture_as_pdf',
      label: deliveryFormState.label,
      onClick: !deliveryFormState.disabled ? () => setDeliveryFormOptionsOpen(true) : undefined,
    },
    {
      id: 'ddt',
      icon: 'local_shipping',
      label: ddtState.label,
      onClick: !ddtState.disabled ? () => setDdtOptionsOpen(true) : undefined,
    },
    {
      id: 'scheda',
      icon: 'assignment',
      label: schedaState.label,
      onClick: !schedaState.disabled
        ? () => openDocument('scheda', () => fetchQuoteScheda(data.idQuote))
        : undefined,
    },
    {
      id: 'delete',
      icon: 'delete',
      label: 'Elimina Preventivo',
      tone: 'danger' as const,
      onClick: !isEditing && !generating ? () => setDeleteDialogOpen(true) : undefined,
    },
  ];

  return (
    <>
      <EntityDetailLayout
        header={
          <EntityPageHeader
            back={{ label: 'Torna indietro', onClick: () => back({ name: 'quotes' }) }}
            crumbs={[
              { label: 'Preventivi', onClick: () => navigate({ name: 'quotes' }) },
              { label: 'Dettaglio' },
            ]}
            title={title}
            subtitle={
              <>
                ID: <span className="font-semibold text-on-surface">{data.idQuote}</span>
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
        actionsTitle="Azioni preventivo"
        actions={actions}
      >
        <div className="space-y-[28px]">
          {docError && <DocumentErrorAlert error={docError} onClose={clearError} />}
          <FieldSectionList
            data={data}
            sections={quoteDetailSectionsBeforeNotes}
            editing={isEditing}
            onChange={change}
            autocompleteFields={{ clientId: clientAutocomplete, doctorId: doctorAutocomplete }}
          />
          <QuoteItemsCard quoteId={data.idQuote} total={data.total} onChanged={reload} />
          <FieldSectionList
            data={data}
            sections={quoteDetailNoteSections}
            editing={isEditing}
            onChange={change}
          />
        </div>
      </EntityDetailLayout>

      {statusDialogOpen && (
        <QuoteStatusDialog
          quoteId={data.idQuote}
          currentStatus={data.status}
          onClose={() => setStatusDialogOpen(false)}
          onChanged={reload}
        />
      )}
      {ddtOptionsOpen && (
        <DdtOptionsDialog
          generating={generating === 'ddt'}
          onClose={() => setDdtOptionsOpen(false)}
          onGenerate={(includePrices) => {
            setDdtOptionsOpen(false);
            openDocument('ddt', () => fetchQuoteDdt(data.idQuote, includePrices));
          }}
        />
      )}
      {deliveryFormOptionsOpen && (
        <DeliveryFormOptionsDialog
          generating={generating === 'consegna'}
          onClose={() => setDeliveryFormOptionsOpen(false)}
          onGenerate={(deliveryDate) => {
            setDeliveryFormOptionsOpen(false);
            openDocument('consegna', () => fetchQuoteDeliveryForm(data.idQuote, deliveryDate));
          }}
        />
      )}
      {deleteDialogOpen && (
        <DeleteConfirmationDialog
          title="Elimina Preventivo"
          message={`Confermi l'eliminazione del preventivo ${data.quoteNumber || data.idQuote}?`}
          warnings={[
            'Saranno eliminati anche gli articoli associati al preventivo.',
            ...(data.workOrderId
              ? [
                  `Sarà eliminata anche la Lavorazione associata ${data.workOrderId}, con i suoi articoli.`,
                ]
              : []),
          ]}
          confirmLabel="Elimina Preventivo"
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={async () => {
            await deleteQuote(data.idQuote);
            navigate({ name: 'quotes' });
          }}
        />
      )}
    </>
  );
}

function DeliveryFormOptionsDialog({
  generating,
  onClose,
  onGenerate,
}: {
  generating: boolean;
  onClose: () => void;
  onGenerate: (deliveryDate: string) => void;
}) {
  const [deliveryDate, setDeliveryDate] = useState(todayIso);

  return (
    <DocumentOptionsDialog
      titleId="delivery-form-options-title"
      title="Modulo di Consegna"
      description="Scegli la data da stampare in fondo al documento."
      onClose={onClose}
    >
      <label className="mt-[22px] block">
        <span className="font-label-caps text-label-caps font-bold uppercase text-outline">
          Data
        </span>
        <input
          type="date"
          value={deliveryDate}
          onChange={(event) => setDeliveryDate(event.target.value)}
          className="mt-[8px] h-[42px] w-full rounded-[6px] border border-outline-variant bg-white px-[11px] font-body-md text-body-md text-on-surface focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
        />
      </label>

      <div className="mt-[24px] flex justify-end gap-[10px]">
        <button
          type="button"
          disabled={generating}
          onClick={onClose}
          className="h-[40px] rounded-[6px] border border-outline-variant px-[18px] font-body-md text-body-md font-semibold text-on-surface hover:bg-surface-container-high disabled:opacity-50"
        >
          Annulla
        </button>
        <button
          type="button"
          disabled={generating || !deliveryDate}
          onClick={() => onGenerate(deliveryDate)}
          className="h-[40px] rounded-[6px] bg-secondary px-[20px] font-body-md text-body-md font-semibold text-on-secondary hover:bg-secondary-hover disabled:opacity-50"
        >
          Genera
        </button>
      </div>
    </DocumentOptionsDialog>
  );
}

function DdtOptionsDialog({
  generating,
  onClose,
  onGenerate,
}: {
  generating: boolean;
  onClose: () => void;
  onGenerate: (includePrices: boolean) => void;
}) {
  return (
    <DocumentOptionsDialog
      titleId="ddt-options-title"
      title="Genera DDT"
      description="Scegli se includere prezzo unitario e totale riga per ogni articolo."
      onClose={onClose}
    >
      <div className="mt-[24px] grid gap-[10px]">
        <button
          type="button"
          disabled={generating}
          onClick={() => onGenerate(false)}
          className="flex h-[46px] items-center justify-between rounded-[6px] border border-outline-variant px-[16px] font-body-md text-body-md font-semibold text-on-surface hover:bg-surface-container-high disabled:opacity-50"
        >
          Senza prezzi
          <Icon name="visibility_off" className="text-[20px] text-secondary" />
        </button>
        <button
          type="button"
          disabled={generating}
          onClick={() => onGenerate(true)}
          className="flex h-[46px] items-center justify-between rounded-[6px] bg-secondary px-[16px] font-body-md text-body-md font-semibold text-on-secondary hover:bg-secondary-hover disabled:opacity-50"
        >
          Con prezzi
          <Icon name="euro" className="text-[20px]" />
        </button>
      </div>

      <div className="mt-[22px] flex justify-end">
        <button
          type="button"
          disabled={generating}
          onClick={onClose}
          className="h-[40px] rounded-[6px] border border-outline-variant px-[18px] font-body-md text-body-md font-semibold text-on-surface hover:bg-surface-container-high disabled:opacity-50"
        >
          Annulla
        </button>
      </div>
    </DocumentOptionsDialog>
  );
}
