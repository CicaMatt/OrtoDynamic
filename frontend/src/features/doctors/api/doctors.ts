import type { Doctor, DoctorListItem } from '../types';
import { apiGet, apiPatch } from '../../../shared/api/http';

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
