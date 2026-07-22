import { useNavigation } from '../../../app/navigation/NavigationContext';
import { EntityDetailLayout } from '../../../shared/entity/EntityDetailLayout';
import { EntityCreatePageHeader } from '../../../shared/entity/EntityPageHeader';
import { DataCard } from '../../../shared/entity/DataCard';
import { FieldSectionList, InfoBlock } from '../../../shared/entity/EntityFields';
import { Autocomplete } from '../../../shared/ui/Autocomplete';
import { quoteCreateNoteSections, quoteCreateSectionsBeforeNotes } from '../components/quoteFields';
import { draftItemsTotal } from '../components/quoteItemMath';
import { useClientAutocomplete } from '../../clients/components/useClientAutocomplete';
import { useDoctorAutocomplete } from '../../doctors/components/useDoctorAutocomplete';
import { QuoteItemsDraftCard } from './QuoteItemsDraftCard';
import { useQuoteEditor } from '../useQuoteEditor';

export function QuoteCreateView() {
  const { navigate } = useNavigation();
  const { draft, items, invalidFields, change } = useQuoteEditor();
  const clientAutocomplete = useClientAutocomplete(true);
  const doctorAutocomplete = useDoctorAutocomplete(true);

  if (!draft) throw new Error('Quote create route requires an active create session.');

  const clientInvalid = invalidFields.includes('clientId');
  const selectedClientLabel = clientAutocomplete.displayValue?.(draft.clientId) ?? '';
  const selectedDoctorLabel = doctorAutocomplete.displayValue?.(draft.doctorId) ?? '';
  // Totale is derived: previewed from the pending items, set on the server on save.
  const total = draftItemsTotal(items);

  return (
    <EntityDetailLayout
      header={
        <EntityCreatePageHeader
          backLabel="Torna ai preventivi"
          listLabel="Preventivi"
          title="Nuovo Preventivo"
          onBack={() => navigate({ name: 'quotes' })}
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
                    change('clientId', clientAutocomplete.selectValue?.(option) ?? option.value)
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
                    change('doctorId', doctorAutocomplete.selectValue?.(option) ?? option.value)
                  }
                  placeholder={doctorAutocomplete.placeholder}
                  emptyLabel={doctorAutocomplete.emptyLabel}
                />
              }
            />
            <InfoBlock
              label="Inserito Da"
              value={draft.entryBy}
              editing
              onChange={(value) => change('entryBy', value)}
            />
          </div>
        </DataCard>

        <FieldSectionList
          data={draft}
          sections={quoteCreateSectionsBeforeNotes}
          editing
          onChange={change}
          invalidKeys={invalidFields}
        />

        <QuoteItemsDraftCard total={total} />

        <FieldSectionList
          data={draft}
          sections={quoteCreateNoteSections}
          editing
          onChange={change}
          invalidKeys={invalidFields}
        />
      </div>
    </EntityDetailLayout>
  );
}
