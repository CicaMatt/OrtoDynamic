import type { EntityEditConfig } from '../../app/editing/types';
import {
  createHealthCompany,
  updateHealthCompany,
  type HealthCompanyUpdate,
} from './api/healthCompanies';
import type { HealthCompany } from './types';

const editableHealthCompanyKeys = [
  'municipalityCode',
  'municipality',
  'regionCode',
  'regionName',
  'companyCode',
  'companyName',
  'year',
  'males',
  'females',
  'total',
  'district',
] as const satisfies readonly (keyof HealthCompany)[];

export const healthCompanyCreateRequiredKeys = [
  'companyName',
] as const satisfies readonly (keyof HealthCompany)[];

function makeEmptyHealthCompany(): HealthCompany {
  return {
    idHealthCompany: '',
    municipalityCode: '',
    municipality: '',
    regionCode: '',
    regionName: '',
    companyCode: '',
    companyName: '',
    year: '',
    males: '',
    females: '',
    total: '',
    district: '',
  };
}

/** Normalize health-company edits/creates: blank year -> null, otherwise numeric. */
function normalizeHealthCompanyPayload(payload: Record<string, unknown>): HealthCompanyUpdate {
  const next = { ...payload } as HealthCompanyUpdate;
  if (next.year === '') next.year = null;
  if ('year' in next && next.year !== null) next.year = Number(next.year);
  return next;
}

export const healthCompanyEditConfig: EntityEditConfig<'healthCompany'> = {
  editableKeys: editableHealthCompanyKeys,
  requiredKeys: healthCompanyCreateRequiredKeys,
  makeEmptyDraft: makeEmptyHealthCompany,
  create: (payload) => createHealthCompany(normalizeHealthCompanyPayload(payload)),
  update: (id, payload) => updateHealthCompany(id, payload as HealthCompanyUpdate),
  getCreatedId: (created) => created.idHealthCompany,
  buildUpdatePayload: normalizeHealthCompanyPayload,
};
