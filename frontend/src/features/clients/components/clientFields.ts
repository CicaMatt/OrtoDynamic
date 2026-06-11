import { markRequired, type FieldConfig } from '../../../shared/entity/DataCard';
import { formatBirthDate, formatGender } from '../../../shared/format/format';
import type { Client } from '../types';

export type ClientField = FieldConfig<Client>;

export { markRequired };

/** Anagrafica, address, and contact field groups — shared by the detail and create forms. */
export const personalFields: ClientField[] = [
  { label: 'Nome', key: 'name' },
  { label: 'Cognome', key: 'surname' },
  { label: 'Codice fiscale', key: 'fiscalCode' },
  { label: 'Sesso', key: 'gender', type: 'gender' },
  { label: 'Comune Nascita', key: 'birthMunicipality', type: 'autocomplete' },
  { label: 'Data nascita', key: 'birthDate', type: 'date' },
];

export const addressFields: ClientField[] = [
  { label: 'Indirizzo', key: 'address' },
  { label: 'Citta', key: 'city', type: 'autocomplete' },
  // Locked: these are filled automatically from the selected Città, not typed.
  { label: 'Provincia', key: 'province', readonly: true },
  { label: 'CAP', key: 'postalCode', readonly: true },
  { label: 'Nazione', key: 'country', readonly: true },
];

export const contactFields: ClientField[] = [
  { label: 'Numero telefono', key: 'phone' },
  { label: 'Numero cellulare', key: 'mobile' },
  { label: 'Email', key: 'email' },
  { label: 'Distretto appartenenza', key: 'district' },
  { label: 'ID Medico', key: 'doctorId', type: 'number' },
];

/** Fields required by the creation form (UX-level only; the DB stays permissive). */
export const CLIENT_CREATE_REQUIRED = [
  'name', 'surname', 'birthDate', 'gender', 'address', 'province', 'city', 'phone',
] as const satisfies readonly (keyof Client)[];

/** Read-mode display: map gender code and ISO date to their Italian labels. */
export function displayClientValue(field: ClientField, raw: string): string {
  if (field.type === 'gender') return formatGender(raw);
  if (field.type === 'date') return formatBirthDate(raw);
  return raw;
}
