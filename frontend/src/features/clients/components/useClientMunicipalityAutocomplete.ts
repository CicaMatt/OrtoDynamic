import { useMemo } from 'react';
import type { AutocompleteFieldConfig } from '../../../shared/entity/DataCard';
import type { AutocompleteOption } from '../../../shared/ui/Autocomplete';
import { useMunicipalities } from '../../municipalities/useMunicipalities';
import type { Client } from '../types';

/**
 * Autocomplete config for the client's city fields, sourced from `comuni`.
 *
 * Both Comune Nascita and Città are restricted to municipalities from the
 * lookup. Selecting a Città also fills Provincia and CAP from that municipality
 * and sets Nazione to "Italia". `enabled` skips the (large) fetch until needed.
 */
export function useClientMunicipalityAutocomplete(
  setField: (key: keyof Client, value: string) => void,
  enabled: boolean,
): Partial<Record<keyof Client, AutocompleteFieldConfig>> {
  const { municipalities } = useMunicipalities(enabled);

  const options = useMemo<AutocompleteOption[]>(
    () =>
      municipalities.map((municipality) => ({
        value: municipality.name,
        // Province disambiguates the few same-name municipalities (e.g. Brione BS/TN).
        label: municipality.province ? `${municipality.name} (${municipality.province})` : municipality.name,
        meta: { province: municipality.province, cap: municipality.cap },
      })),
    [municipalities],
  );

  return useMemo(
    () => ({
      birthMunicipality: { options, emptyLabel: 'Nessun comune trovato.' },
      city: {
        options,
        emptyLabel: 'Nessun comune trovato.',
        onSelect: (option) => {
          setField('province', option.meta?.province ?? '');
          setField('postalCode', option.meta?.cap ?? '');
          setField('country', 'Italia');
        },
      },
    }),
    [options, setField],
  );
}
