import { apiGet, apiPatch } from '../../../shared/api/http';
import type { HealthCompany, HealthCompanyListItem } from '../types';

export type HealthCompanyUpdate = Record<string, string | number | null>;

export function fetchHealthCompanies(): Promise<HealthCompanyListItem[]> {
  return apiGet<HealthCompanyListItem[]>('/health-companies/');
}

export function fetchHealthCompany(id: string): Promise<HealthCompany> {
  return apiGet<HealthCompany>(`/health-companies/${id}/`);
}

export function updateHealthCompany(id: string, changes: HealthCompanyUpdate): Promise<unknown> {
  return apiPatch(`/health-companies/${id}/`, changes);
}
