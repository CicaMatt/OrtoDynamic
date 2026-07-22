import type { EntityEditOperations } from '../../app/editing/types';
import { pickDefinedFields, pickFields } from '../../app/editing/types';
import {
  createHealthCompany,
  updateHealthCompany,
  type HealthCompanyCreatePayload,
  type HealthCompanyUpdatePayload,
} from './api/healthCompanies';
import { healthCompanyCreateRequiredKeys } from './components/healthCompanyFields';
import type { HealthCompany } from './types';

const healthCompanyEditableKeys = [
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

const healthCompanyTextKeys = [
  'municipalityCode',
  'municipality',
  'regionCode',
  'regionName',
  'companyCode',
  'companyName',
  'males',
  'females',
  'total',
  'district',
] as const;

function emptyHealthCompany(): HealthCompany {
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

export function toHealthCompanyCreatePayload(draft: HealthCompany): HealthCompanyCreatePayload {
  const values = pickFields(draft, healthCompanyEditableKeys);
  return { ...values, year: values.year === '' ? null : Number(values.year) };
}

export function toHealthCompanyUpdatePayload(
  changes: Partial<HealthCompany>,
): HealthCompanyUpdatePayload {
  const payload: HealthCompanyUpdatePayload = pickDefinedFields(changes, healthCompanyTextKeys);
  if (changes.year !== undefined) {
    payload.year = changes.year === '' ? null : Number(changes.year);
  }
  return payload;
}

export const healthCompanyEditOperations: EntityEditOperations<'healthCompany'> = {
  editableKeys: healthCompanyEditableKeys,
  requiredKeys: healthCompanyCreateRequiredKeys,
  emptyDraft: emptyHealthCompany,
  create: async (draft) => {
    const created = await createHealthCompany(toHealthCompanyCreatePayload(draft));
    return created.idHealthCompany;
  },
  update: async (id, changes) => {
    await updateHealthCompany(id, toHealthCompanyUpdatePayload(changes));
  },
};
