import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EmployeesView } from '../../../src/features/employees/views/EmployeesView';

const employeeApi = vi.hoisted(() => ({ fetchEmployees: vi.fn() }));

vi.mock('../../../src/features/employees/api/employees', () => employeeApi);

beforeEach(() => {
  vi.resetAllMocks();
  employeeApi.fetchEmployees.mockResolvedValue([
    {
      idEmployee: '1',
      username: 'matteo',
      email: 'matteo@example.test',
      firstName: 'Matteo',
      lastName: 'Rossi',
    },
    {
      idEmployee: '2',
      username: 'lucia',
      email: 'lucia@example.test',
      firstName: 'Lucia',
      lastName: 'Bianchi',
    },
  ]);
});

describe('EmployeesView', () => {
  it('offers and applies filters for username and email', async () => {
    render(<EmployeesView />);
    await screen.findByText('matteo');

    fireEvent.click(screen.getByRole('button', { name: /Filtra/ }));
    const usernameFilter = screen.getByLabelText('Nome Utente');
    const emailFilter = screen.getByLabelText('Email');

    fireEvent.change(usernameFilter, { target: { value: 'matt' } });
    fireEvent.keyDown(usernameFilter, { key: 'Enter' });
    await waitFor(() => expect(screen.queryByText('lucia')).toBeNull());
    expect(screen.getByText('matteo')).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Rimuovi' }));
    fireEvent.change(emailFilter, { target: { value: 'lucia@' } });
    fireEvent.keyDown(emailFilter, { key: 'Enter' });
    await waitFor(() => expect(screen.queryByText('matteo')).toBeNull());
    expect(screen.getByText('lucia')).not.toBeNull();
  });
});
