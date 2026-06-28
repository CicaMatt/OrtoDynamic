import { useMemo } from 'react';
import type { AutocompleteFieldConfig } from '../../../shared/entity/DataCard';
import type { AutocompleteOption } from '../../../shared/ui/Autocomplete';
import { useApiData } from '../../../shared/hooks/useApiData';
import { fetchDoctors } from '../api/doctors';

/**
 * Autocomplete config for picking a doctor by name, sourced from `medici`.
 *
 * The bound field stores the doctor's id, but the search matches and the input
 * shows "Nome Cognome": each option's value/label is the full name and `meta.id`
 * carries the id persisted on select (`selectValue`), while `displayValue` maps a
 * stored id back to its name. `enabled` skips the fetch until the form needs it;
 * the list is fetched fresh so newly-created doctors are selectable.
 *
 * Shared by every "Medico" picker (clients, quotes); callers key the returned
 * config to their own doctor-id field.
 */
export function useDoctorAutocomplete(enabled: boolean): AutocompleteFieldConfig {
  const { data } = useApiData(
    () => (enabled ? fetchDoctors() : Promise.resolve([])),
    [enabled],
  );

  return useMemo<AutocompleteFieldConfig>(() => {
    const options: AutocompleteOption[] = [];
    const nameById = new Map<string, string>();
    for (const doctor of data ?? []) {
      const fullName = `${doctor.name} ${doctor.surname}`.trim();
      options.push({ value: fullName, label: fullName, meta: { id: doctor.idDoctor } });
      nameById.set(doctor.idDoctor, fullName);
    }
    return {
      options,
      placeholder: 'Cerca medico per nome o cognome…',
      emptyLabel: 'Nessun medico trovato.',
      selectValue: (option) => option.meta?.id ?? '',
      displayValue: (raw) => nameById.get(raw) ?? '',
    };
  }, [data]);
}
