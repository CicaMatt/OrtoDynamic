import { apiGet } from '../../../shared/api/http';
import type { Municipality } from '../types';

/** The full `comuni` lookup list, used to populate the city pickers. */
export function fetchMunicipalities(): Promise<Municipality[]> {
  return apiGet<Municipality[]>('/municipalities/');
}
