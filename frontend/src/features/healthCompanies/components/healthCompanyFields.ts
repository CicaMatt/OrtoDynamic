import { markRequired, type FieldConfig } from '../../../shared/entity/DataCard';
import type { HealthCompany } from '../types';

export type HealthCompanyField = FieldConfig<HealthCompany>;

/** Fields shown in the health-company detail/edit form. */
export const healthCompanyFields: HealthCompanyField[] = [
  { label: 'ID', key: 'idHealthCompany', readonly: true },
  { label: 'Anno', key: 'year', type: 'number' },
  { label: 'Distretto', key: 'district' },
  { label: 'Codice Comune', key: 'municipalityCode' },
  { label: 'Codice Regione', key: 'regionCode' },
  { label: 'Codice Azienda', key: 'companyCode' },
  { label: 'Nome Comune', key: 'municipality' },
  { label: 'Nome Regione', key: 'regionName' },
  { label: 'Nome Azienda', key: 'companyName' },
  { label: 'Maschi', key: 'males' },
  { label: 'Femmine', key: 'females' },
  { label: 'Totale', key: 'total' },
];

/** Fields required by the creation form (the company name identifies the record). */
export const HEALTH_COMPANY_CREATE_REQUIRED = [
  'companyName',
] as const satisfies readonly (keyof HealthCompany)[];

/** Create form: drop the DB-assigned id, mark required fields. */
export const healthCompanyCreateFields = markRequired(
  healthCompanyFields.filter((field) => field.key !== 'idHealthCompany'),
  HEALTH_COMPANY_CREATE_REQUIRED,
);
