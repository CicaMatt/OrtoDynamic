import { useEffect } from 'react';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityCreatePageHeader } from '../../../shared/entity/EntityPageHeader';
import { DataCard, InfoBlock } from '../../../shared/entity/DataCard';
import { FieldSectionList } from '../../../shared/entity/FieldSectionCard';
import { Autocomplete } from '../../../shared/ui/Autocomplete';
import { QUOTE_CREATE_REQUIRED, quoteCreateSections } from '../components/quoteCreateFields';
import { useClientOptions } from '../components/useClientOptions';
import { QuoteItemsDraftCard } from './QuoteItemsDraftCard';
import type { Quote } from '../types';

export function QuoteCreateView() {
  const { navigate } = useNavigation();
  const { editing, mode, editTarget, quoteDraft, invalidFields, startQuoteCreate, setQuoteField } =
    useEntityEdit();

  const isCreating = editing && mode === 'create' && editTarget?.type === 'quote';

  useEffect(() => {
    if (!isCreating) startQuoteCreate(QUOTE_CREATE_REQUIRED);
  }, [isCreating, startQuoteCreate]);

  const clientOptions = useClientOptions(isCreating);

  if (!isCreating || !quoteDraft) return null;

  const invalidKeys = invalidFields as Array<keyof Quote>;
  const clientInvalid = invalidKeys.includes('clientId');
  const selectedClientLabel =
    clientOptions.find((option) => option.meta?.id === quoteDraft.clientId)?.value ?? '';

  return (
    <EntityDetailLayout
      header={
        <EntityCreatePageHeader
          backLabel="Torna ai preventivi"
          listLabel="Preventivi"
          title="Nuovo Preventivo"
          onBack={() => navigate('quotes')}
        />
      }
    >
      <div className="space-y-[28px]">
        <DataCard icon="group" title="Riferimenti">
          <div className="grid grid-cols-3 gap-x-[36px] gap-y-[24px]">
            <InfoBlock
              label="Cliente"
              value={selectedClientLabel}
              editing
              required
              invalid={clientInvalid}
              control={
                <Autocomplete
                  value={selectedClientLabel}
                  options={clientOptions}
                  invalid={clientInvalid}
                  onSelect={(option) => setQuoteField('clientId', option.meta?.id ?? '')}
                  placeholder="Cerca cliente per nome o cognome…"
                  emptyLabel="Nessun cliente trovato."
                />
              }
            />
            <InfoBlock
              label="ID Medico"
              value={quoteDraft.doctorId}
              editing
              inputType="number"
              onChange={(value) => setQuoteField('doctorId', value)}
            />
            <InfoBlock
              label="Inserito Da"
              value={quoteDraft.entryBy}
              editing
              onChange={(value) => setQuoteField('entryBy', value)}
            />
          </div>
        </DataCard>

        <FieldSectionList
          data={quoteDraft}
          sections={quoteCreateSections}
          editing
          onChange={setQuoteField}
          invalidKeys={invalidKeys}
        />

        <QuoteItemsDraftCard />
      </div>
    </EntityDetailLayout>
  );
}
