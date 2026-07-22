import type { EntityEditOperations } from '../../app/editing/types';
import { pickDefinedFields, pickFields } from '../../app/editing/types';
import {
  createDoctor,
  updateDoctor,
  type DoctorCreatePayload,
  type DoctorUpdatePayload,
} from './api/doctors';
import { doctorCreateRequiredKeys } from './components/doctorFields';
import type { Doctor } from './types';

const doctorEditableKeys = [
  'surname',
  'name',
  'address',
  'phone',
  'email',
  'note',
] as const satisfies readonly (keyof Doctor)[];

function emptyDoctor(): Doctor {
  return { idDoctor: '', surname: '', name: '', address: '', phone: '', email: '', note: '' };
}

export function toDoctorCreatePayload(draft: Doctor): DoctorCreatePayload {
  return pickFields(draft, doctorEditableKeys);
}

export function toDoctorUpdatePayload(changes: Partial<Doctor>): DoctorUpdatePayload {
  return pickDefinedFields(changes, doctorEditableKeys);
}

export const doctorEditOperations: EntityEditOperations<'doctor'> = {
  editableKeys: doctorEditableKeys,
  requiredKeys: doctorCreateRequiredKeys,
  emptyDraft: emptyDoctor,
  create: async (draft) => {
    const created = await createDoctor(toDoctorCreatePayload(draft));
    return created.idDoctor;
  },
  update: async (id, changes) => {
    await updateDoctor(id, toDoctorUpdatePayload(changes));
  },
};
