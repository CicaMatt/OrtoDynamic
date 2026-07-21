import type { EntityEditConfig } from '../../app/editing/types';
import { createDoctor, updateDoctor, type DoctorUpdate } from './api/doctors';
import type { Doctor } from './types';

const editableDoctorKeys = [
  'surname',
  'name',
  'address',
  'phone',
  'email',
  'note',
] as const satisfies readonly (keyof Doctor)[];

export const doctorCreateRequiredKeys = [
  'surname',
  'name',
] as const satisfies readonly (keyof Doctor)[];

function makeEmptyDoctor(): Doctor {
  return { idDoctor: '', surname: '', name: '', address: '', phone: '', email: '', note: '' };
}

export const doctorEditConfig: EntityEditConfig<'doctor'> = {
  editableKeys: editableDoctorKeys,
  requiredKeys: doctorCreateRequiredKeys,
  makeEmptyDraft: makeEmptyDoctor,
  create: (payload) => createDoctor(payload as DoctorUpdate),
  update: (id, payload) => updateDoctor(id, payload as DoctorUpdate),
  getCreatedId: (created) => created.idDoctor,
};
