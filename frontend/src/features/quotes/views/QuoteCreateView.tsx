import { useEffect } from 'react';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityCreatePageHeader } from '../../../shared/entity/EntityPageHeader';
import { DataCard, InfoBlock } from '../../../shared/entity/DataCard';
import { FieldSectionList } from '../../../shared/entity/FieldSectionCard';
import { Autocomplete } from '../../../shared/ui/Autocomplete';
import { QUOTE_CREATE_REQUIRED, quoteCreateSections } from '../components/quoteCreateFields';
import { draftItemsTotal } from '../components/quoteItemMath';
import { useClientAutocomplete } from '../../clients/components/useClientAutocomplete';
import { useDoctorAutocomplete } from '../../doctors/components/useDoctorAutocomplete';
import { QuoteItemsDraftCard } from './QuoteItemsDraftCard';
import type { Quote } from '../types';

export function QuoteCreateView() {
  const { navigate } = useNavigation();
  const { editing, mode, editTarget, quoteDraft, quoteItemDrafts, invalidFields, startQuoteCreate, setQuoteField } =
    useEntityEdit();

  const isCreating = editing && mode === 'create' && editTarget?.type === 'quote';

  useEffect(() => {
    if (!isCreating) startQuoteCreate(QUOTE_CREATE_REQUIRED);
  }, [isCreating, startQuoteCreate]);

  const clientAutocomplete = useClientAutocomplete(isCreating);
  const doctorAutocomplete = useDoctorAutocomplete(isCreating);

  if (!isCreating || !quoteDraft) return null;

  const invalidKeys = invalidFields as Array<keyof Quote>;
  const clientInvalid = invalidKeys.includes('clientId');
  const selectedClientLabel = clientAutocomplete.displayValue?.(quoteDraft.clientId) ?? '';
  const selectedDoctorLabel = doctorAutocomplete.displayValue?.(quoteDraft.doctorId) ?? '';
  // Totale is derived: previewed from the pending items, set on the server on save.
  const quoteWithTotal = { ...quoteDraft, total: draftItemsTotal(quoteItemDrafts) };

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
                  options={clientAutocomplete.options}
                  invalid={clientInvalid}
                  onSelect={(option) =>
                    setQuoteField('clientId', clientAutocomplete.selectValue?.(option) ?? option.value)
                  }
                  placeholder={clientAutocomplete.placeholder}
                  emptyLabel={clientAutocomplete.emptyLabel}
                />
              }
            />
            <InfoBlock
              label="Medico"
              value={selectedDoctorLabel}
              editing
              control={
                <Autocomplete
                  value={selectedDoctorLabel}
                  options={doctorAutocomplete.options}
                  onSelect={(option) =>
                    setQuoteField('doctorId', doctorAutocomplete.selectValue?.(option) ?? option.value)
                  }
                  placeholder={doctorAutocomplete.placeholder}
                  emptyLabel={doctorAutocomplete.emptyLabel}
                />
              }
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
          data={quoteWithTotal}
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
