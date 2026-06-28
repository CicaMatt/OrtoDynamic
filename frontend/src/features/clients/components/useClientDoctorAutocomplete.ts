import { useMemo } from 'react';
import type { AutocompleteFieldConfig } from '../../../shared/entity/DataCard';
import { useDoctorAutocomplete } from '../../doctors/components/useDoctorAutocomplete';
import type { Client } from '../types';

/**
 * Keys the client form's Medico field (`doctorId`) to the shared doctor-by-name
 * picker. See {@link useDoctorAutocomplete} for the search/display behaviour.
 */
export function useClientDoctorAutocomplete(
  enabled: boolean,
): Partial<Record<keyof Client, AutocompleteFieldConfig>> {
  const doctor = useDoctorAutocomplete(enabled);
  return useMemo(() => ({ doctorId: doctor }), [doctor]);
}
