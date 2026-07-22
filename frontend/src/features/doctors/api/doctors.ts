import type { Doctor, DoctorListItem } from '../types';
import { apiDelete, apiGet, apiPatch, apiPost } from '../../../shared/api/http';

/** Editable doctor fields, keyed exactly as the API accepts them. */
export type DoctorFieldsPayload = {
  surname: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  note: string;
};

export type DoctorCreatePayload = DoctorFieldsPayload;
export type DoctorUpdatePayload = Partial<DoctorFieldsPayload>;

/** All doctors, as shown in the Medici table. */
export function fetchDoctors(): Promise<DoctorListItem[]> {
  return apiGet<DoctorListItem[]>('/doctors/');
}

/** A single doctor with full detail, by id. */
export function fetchDoctor(id: string): Promise<Doctor> {
  return apiGet<Doctor>(`/doctors/${id}/`);
}

/** Persist edits to a doctor. */
export function updateDoctor(id: string, changes: DoctorUpdatePayload): Promise<unknown> {
  return apiPatch(`/doctors/${id}/`, changes);
}

export function deleteDoctor(id: string): Promise<void> {
  return apiDelete(`/doctors/${id}/`);
}

/** Create a new doctor; the API returns the created record (with its new id). */
export function createDoctor(values: DoctorCreatePayload): Promise<Doctor> {
  return apiPost<Doctor>('/doctors/', values);
}
