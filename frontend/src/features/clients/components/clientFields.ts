import { markRequired, type FieldConfig } from '../../../shared/entity/DataCard';
import { clientCreateRequiredKeys } from '../editConfig';
import type { Client } from '../types';

export type ClientField = FieldConfig<Client>;

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
  // Stored as the doctor's id, but searched and shown by name (see useClientDoctorAutocomplete).
  { label: 'Medico', key: 'doctorId', type: 'autocomplete' },
];

export const personalCreateFields = markRequired(personalFields, clientCreateRequiredKeys);
export const addressCreateFields = markRequired(addressFields, clientCreateRequiredKeys);
export const contactCreateFields = markRequired(contactFields, clientCreateRequiredKeys);

export const clientFieldGroups = {
  personal: personalFields,
  address: addressFields,
  contact: contactFields,
} as const;

export const clientCreateFieldGroups = {
  personal: personalCreateFields,
  address: addressCreateFields,
  contact: contactCreateFields,
} as const;
