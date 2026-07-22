import { apiDelete, apiGet, apiPatch, apiPost } from '../../../shared/api/http';
import type { HealthCompany, HealthCompanyListItem } from '../types';

export type HealthCompanyFieldsPayload = {
  municipalityCode: string;
  municipality: string;
  regionCode: string;
  regionName: string;
  companyCode: string;
  companyName: string;
  year: number | null;
  males: string;
  females: string;
  total: string;
  district: string;
};

export type HealthCompanyCreatePayload = HealthCompanyFieldsPayload;
export type HealthCompanyUpdatePayload = Partial<HealthCompanyFieldsPayload>;

export function fetchHealthCompanies(): Promise<HealthCompanyListItem[]> {
  return apiGet<HealthCompanyListItem[]>('/health-companies/');
}

export function fetchHealthCompany(id: string): Promise<HealthCompany> {
  return apiGet<HealthCompany>(`/health-companies/${id}/`);
}

export function updateHealthCompany(
  id: string,
  changes: HealthCompanyUpdatePayload,
): Promise<unknown> {
  return apiPatch(`/health-companies/${id}/`, changes);
}

export function deleteHealthCompany(id: string): Promise<void> {
  return apiDelete(`/health-companies/${id}/`);
}

/** Create a new health company; the API returns the created record (with its new id). */
export function createHealthCompany(values: HealthCompanyCreatePayload): Promise<HealthCompany> {
  return apiPost<HealthCompany>('/health-companies/', values);
}
