import { describe, expect, it, vi } from 'vitest';

import { doctorEditOperations } from '../../../src/features/doctors/editing';
import type { Doctor } from '../../../src/features/doctors/types';

const doctorApi = vi.hoisted(() => ({ createDoctor: vi.fn(), updateDoctor: vi.fn() }));
vi.mock('../../../src/features/doctors/api/doctors', () => doctorApi);

const doctor: Doctor = {
  idDoctor: '',
  surname: 'Rossi',
  name: 'Mario',
  address: '',
  phone: '0811234567',
  email: '',
  note: '',
};

describe('doctor editing operations', () => {
  it('sends only accepted fields and returns the created id', async () => {
    doctorApi.createDoctor.mockResolvedValue({ ...doctor, idDoctor: 'D-9' });
    doctorApi.updateDoctor.mockResolvedValue({});

    await expect(doctorEditOperations.create(doctor)).resolves.toBe('D-9');
    await doctorEditOperations.update('D-9', { phone: '0897654321' });

    expect(doctorApi.createDoctor).toHaveBeenCalledWith({
      surname: 'Rossi',
      name: 'Mario',
      address: '',
      phone: '0811234567',
      email: '',
      note: '',
    });
    expect(doctorApi.updateDoctor).toHaveBeenCalledWith('D-9', { phone: '0897654321' });
  });
});
