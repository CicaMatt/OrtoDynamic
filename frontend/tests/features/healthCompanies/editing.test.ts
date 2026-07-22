import { describe, expect, it, vi } from 'vitest';

import type { EditOperationContext } from '../../../src/app/editing/types';
import { healthCompanyEditOperations } from '../../../src/features/healthCompanies/editing';
import type { HealthCompany } from '../../../src/features/healthCompanies/types';

const healthCompanyApi = vi.hoisted(() => ({
  createHealthCompany: vi.fn(),
  updateHealthCompany: vi.fn(),
}));
vi.mock('../../../src/features/healthCompanies/api/healthCompanies', () => healthCompanyApi);

const context: EditOperationContext = { clientOrthopedicChanges: {}, quoteItemDrafts: [] };
const company: HealthCompany = {
  idHealthCompany: '',
  municipalityCode: '001',
  municipality: 'Pagani',
  regionCode: '15',
  regionName: 'Campania',
  companyCode: 'ASL-1',
  companyName: 'ASL Salerno',
  year: '',
  males: '',
  females: '',
  total: '',
  district: '',
};

describe('health-company editing operations', () => {
  it('normalizes the year for create and update inside the feature operation', async () => {
    healthCompanyApi.createHealthCompany.mockResolvedValue({
      ...company,
      idHealthCompany: 'H-9',
    });
    healthCompanyApi.updateHealthCompany.mockResolvedValue({});

    await expect(healthCompanyEditOperations.create!(company, context)).resolves.toBe('H-9');
    await healthCompanyEditOperations.update('H-9', { year: '2026' }, context);

    expect(healthCompanyApi.createHealthCompany).toHaveBeenCalledWith(
      expect.objectContaining({ companyName: 'ASL Salerno', year: null }),
    );
    expect(healthCompanyApi.updateHealthCompany).toHaveBeenCalledWith('H-9', { year: 2026 });
  });
});
