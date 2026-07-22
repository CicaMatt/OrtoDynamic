import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from '../src/App';
import type { AuthUser } from '../src/features/auth/types';
import { setAuthToken } from '../src/shared/api/http';

const authApi = vi.hoisted(() => ({
  fetchSession: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
}));

vi.mock('../src/features/auth/api/auth', () => authApi);

const user: AuthUser = {
  id: '7',
  username: 'matteo',
  email: 'matteo@example.test',
  firstName: 'Matteo',
  lastName: 'Cicalese',
};

beforeEach(() => {
  vi.resetAllMocks();
  setAuthToken(null);
  authApi.fetchSession.mockResolvedValue(user);
  authApi.login.mockResolvedValue(user);
  authApi.logout.mockResolvedValue(undefined);
});

describe('App authentication flow', () => {
  it('signs in once while a request is pending, shows the user, and logs out', async () => {
    let resolveLogin: (signedIn: AuthUser) => void = () => {};
    authApi.login.mockReturnValue(
      new Promise<AuthUser>((resolve) => {
        resolveLogin = resolve;
      }),
    );
    render(<App />);

    await screen.findByText('Accedi per continuare');
    fireEvent.change(screen.getByLabelText('Nome utente o email'), {
      target: { value: '  matteo  ' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'segreta' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Accedi' }));

    const pendingButton = screen.getByRole('button', { name: 'Accesso in corso…' });
    expect((pendingButton as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(pendingButton);
    expect(authApi.login).toHaveBeenCalledOnce();
    expect(authApi.login).toHaveBeenCalledWith('matteo', 'segreta');

    await act(async () => resolveLogin(user));
    expect(await screen.findByRole('heading', { name: 'Dashboard' })).not.toBeNull();
    expect(screen.getByText('Matteo Cicalese')).not.toBeNull();
    expect(screen.getByText('@matteo')).not.toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Logout/ }));
    await waitFor(() => expect(authApi.logout).toHaveBeenCalledOnce());
    expect(await screen.findByText('Accedi per continuare')).not.toBeNull();
  });

  it('shows a login error and unlocks the form for another attempt', async () => {
    authApi.login.mockRejectedValue(new Error('Credenziali non valide.'));
    render(<App />);

    await screen.findByText('Accedi per continuare');
    fireEvent.change(screen.getByLabelText('Nome utente o email'), {
      target: { value: 'matteo' },
    });
    const password = screen.getByLabelText('Password');
    fireEvent.change(password, { target: { value: 'errata' } });
    fireEvent.keyDown(password, { key: 'Enter' });

    expect(await screen.findByText('Credenziali non valide.')).not.toBeNull();
    const retryButton = screen.getByRole('button', { name: 'Accedi' });
    expect((retryButton as HTMLButtonElement).disabled).toBe(false);
    expect(authApi.login).toHaveBeenCalledOnce();
  });

  it('keeps the loading gate visible until a stored session is restored', async () => {
    let resolveSession: (restored: AuthUser | null) => void = () => {};
    setAuthToken('stored-token');
    authApi.fetchSession.mockReturnValue(
      new Promise<AuthUser | null>((resolve) => {
        resolveSession = resolve;
      }),
    );
    render(<App />);

    expect(screen.getByText('Caricamento…')).not.toBeNull();
    expect(screen.queryByText('Accedi per continuare')).toBeNull();
    await act(async () => resolveSession(user));

    expect(await screen.findByRole('heading', { name: 'Dashboard' })).not.toBeNull();
    expect(authApi.fetchSession).toHaveBeenCalledOnce();
  });

  it('falls back to login when a stored session is expired', async () => {
    setAuthToken('expired-token');
    authApi.fetchSession.mockRejectedValue(new Error('Sessione scaduta.'));
    render(<App />);

    expect(await screen.findByText('Accedi per continuare')).not.toBeNull();
    expect(screen.queryByRole('heading', { name: 'Dashboard' })).toBeNull();
  });
});
