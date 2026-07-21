import { markRequired, type FieldConfig } from '../../../shared/entity/DataCard';
import { doctorCreateRequiredKeys } from '../editConfig';
import type { Doctor } from '../types';

export type DoctorField = FieldConfig<Doctor>;

/** Fields shown in the doctor detail/edit form. */
export const doctorFields: DoctorField[] = [
  { label: 'ID Medico', key: 'idDoctor', readonly: true },
  { label: 'Nome', key: 'name' },
  { label: 'Cognome', key: 'surname' },
  { label: 'Indirizzo', key: 'address' },
  { label: 'Telefono', key: 'phone' },
  { label: 'Email', key: 'email' },
];

/** Create form: drop the DB-assigned id, mark required fields. */
export const doctorCreateFields = markRequired(
  doctorFields.filter((field) => field.key !== 'idDoctor'),
  doctorCreateRequiredKeys,
);
