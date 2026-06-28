import { apiGet, apiPost, setAuthToken } from '../../../shared/api/http';
import type { AuthUser } from '../types';

type LoginResponse = { token: string; user: AuthUser };

/** Restore the current user from the stored token. Resolves to the user or null. */
export async function fetchSession(): Promise<AuthUser | null> {
  const data = await apiGet<{ user: AuthUser | null }>('/auth/session/');
  return data.user;
}

/** Authenticate with username + password; stores the token and resolves to the user. */
export async function login(username: string, password: string): Promise<AuthUser> {
  const { token, user } = await apiPost<LoginResponse>('/auth/login/', { username, password });
  setAuthToken(token);
  return user;
}

/** End the session: notify the server, then discard the token regardless. */
export async function logout(): Promise<void> {
  try {
    await apiPost<void>('/auth/logout/');
  } finally {
    setAuthToken(null);
  }
}
