import { markRequired, type FieldConfig } from '../../../shared/entity/DataCard';
import type { Doctor } from '../types';

export type DoctorField = FieldConfig<Doctor>;

/** Fields shown in the doctor detail/edit form. */
export const doctorFields: DoctorField[] = [
  { label: 'ID Medico', key: 'id', readonly: true },
  { label: 'Nome', key: 'name' },
  { label: 'Cognome', key: 'surname' },
  { label: 'Indirizzo', key: 'address' },
  { label: 'Telefono', key: 'phone' },
  { label: 'Email', key: 'email' },
];

/** Fields required by the creation form (DB enforces Cognome/Nome NOT NULL). */
export const DOCTOR_CREATE_REQUIRED = ['surname', 'name'] as const satisfies readonly (keyof Doctor)[];

/** Create form: drop the DB-assigned id, mark required fields. */
export const doctorCreateFields = markRequired(
  doctorFields.filter((field) => field.key !== 'id'),
  DOCTOR_CREATE_REQUIRED,
);
