import { useMemo } from 'react';
import { fetchClients } from '../../clients/api/clients';
import { useApiData } from '../../../shared/hooks/useApiData';
import { formatBirthDate } from '../../../shared/format/format';
import type { AutocompleteOption } from '../../../shared/ui/Autocomplete';

const NO_OPTIONS: AutocompleteOption[] = [];

/**
 * Client options for the quote's Cliente lookup, sourced from `clienti`.
 *
 * Each option's `label` is "Nome Cognome — Nascita" (what the search matches and
 * displays) and `meta.id` carries the client's id (what the quote stores in
 * `id_cliente`). `enabled` skips the fetch until the create form needs it; the
 * list is fetched fresh each time so newly-created clients are selectable.
 */
export function useClientOptions(enabled: boolean): AutocompleteOption[] {
  const { data } = useApiData(
    () => (enabled ? fetchClients() : Promise.resolve([])),
    [enabled],
  );

  return useMemo<AutocompleteOption[]>(() => {
    if (!data) return NO_OPTIONS;
    return data.map((client) => {
      const fullName = `${client.name} ${client.surname}`.trim();
      const birth = formatBirthDate(client.birthDate);
      const label = birth ? `${fullName} — ${birth}` : fullName;
      return { value: label, label, meta: { id: client.idClient } };
    });
  }, [data]);
}
