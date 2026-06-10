import type { FieldConfig } from '../../../shared/entity/DataCard';
import { formatBirthDate, formatGender } from '../../../shared/format/format';
import type { Client } from '../types';

export type ClientField = FieldConfig<Client>;

/** Anagrafica, address, and contact field groups — shared by the detail and create forms. */
export const personalFields: ClientField[] = [
  { label: 'Nome', key: 'name' },
  { label: 'Cognome', key: 'surname' },
  { label: 'Codice fiscale', key: 'fiscalCode' },
  { label: 'Sesso', key: 'gender', type: 'gender' },
  { label: 'Comune Nascita', key: 'birthMunicipality' },
  { label: 'Data nascita', key: 'birthDate', type: 'date' },
];

export const addressFields: ClientField[] = [
  { label: 'Indirizzo', key: 'address' },
  { label: 'Citta', key: 'city' },
  { label: 'Provincia', key: 'province' },
  { label: 'CAP', key: 'postalCode' },
  { label: 'Nazione', key: 'country' },
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

/** Return a copy of the configs with `required` set on the given keys. */
export function markRequired(
  fields: ClientField[],
  required: ReadonlyArray<keyof Client>,
): ClientField[] {
  return fields.map((field) => (required.includes(field.key) ? { ...field, required: true } : field));
}

/** Read-mode display: map gender code and ISO date to their Italian labels. */
export function displayClientValue(field: ClientField, raw: string): string {
  if (field.type === 'gender') return formatGender(raw);
  if (field.type === 'date') return formatBirthDate(raw);
  return raw;
}
