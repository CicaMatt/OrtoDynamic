import { useMemo } from 'react';
import type { AutocompleteFieldConfig } from '../../../shared/entity/DataCard';
import type { AutocompleteOption } from '../../../shared/ui/Autocomplete';
import { useApiData } from '../../../shared/hooks/useApiData';
import { formatBirthDate } from '../../../shared/format/format';
import { fetchClients } from '../api/clients';

/**
 * Autocomplete config for picking a client by name, sourced from `clienti`.
 *
 * The bound field stores the client's id, but the search matches and the input
 * shows "Nome Cognome — Nascita" (the birth date disambiguates same-named
 * clients): each option's value/label is that text and `meta.id` carries the id
 * persisted on select (`selectValue`), while `displayValue` maps a stored id back
 * to its label. `enabled` skips the fetch until the form needs it; the list is
 * fetched fresh so newly-created clients are selectable.
 *
 * Shared by every "Cliente" picker (quote create/detail); callers key the
 * returned config to their own client-id field.
 */
export function useClientAutocomplete(enabled: boolean): AutocompleteFieldConfig {
  const { data } = useApiData(
    () => (enabled ? fetchClients() : Promise.resolve([])),
    [enabled],
  );

  return useMemo<AutocompleteFieldConfig>(() => {
    const options: AutocompleteOption[] = [];
    const labelById = new Map<string, string>();
    for (const client of data ?? []) {
      const fullName = `${client.name} ${client.surname}`.trim();
      const birth = formatBirthDate(client.birthDate);
      const label = birth ? `${fullName} — ${birth}` : fullName;
      options.push({ value: label, label, meta: { id: client.idClient } });
      labelById.set(client.idClient, label);
    }
    return {
      options,
      placeholder: 'Cerca cliente per nome o cognome…',
      emptyLabel: 'Nessun cliente trovato.',
      selectValue: (option) => option.meta?.id ?? '',
      displayValue: (raw) => labelById.get(raw) ?? '',
    };
  }, [data]);
}
