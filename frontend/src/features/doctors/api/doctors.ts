import type { Doctor, DoctorListItem } from '../types';
import { apiGet, apiPatch, apiPost } from '../../../shared/api/http';

/** Editable doctor fields, keyed as the API expects (camelCase). */
export type DoctorUpdate = Record<string, string | null>;

/** All doctors, as shown in the Medici table. */
export function fetchDoctors(): Promise<DoctorListItem[]> {
  return apiGet<DoctorListItem[]>('/doctors/');
}

/** A single doctor with full detail, by id. */
export function fetchDoctor(id: string): Promise<Doctor> {
  return apiGet<Doctor>(`/doctors/${id}/`);
}

/** Persist edits to a doctor. */
export function updateDoctor(id: string, changes: DoctorUpdate): Promise<unknown> {
  return apiPatch(`/doctors/${id}/`, changes);
}

/** Create a new doctor; the API returns the created record (with its new id). */
export function createDoctor(values: DoctorUpdate): Promise<Doctor> {
  return apiPost<Doctor>('/doctors/', values);
}
