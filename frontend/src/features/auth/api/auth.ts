import { apiGet, apiPost } from '../../../shared/api/http';
import type { AuthUser } from '../types';

/** Restore an existing session and seed the CSRF cookie. Resolves to the user or null. */
export async function fetchSession(): Promise<AuthUser | null> {
  const data = await apiGet<{ user: AuthUser | null }>('/auth/session/');
  return data.user;
}

/** Authenticate with username + password; resolves to the signed-in user. */
export function login(username: string, password: string): Promise<AuthUser> {
  return apiPost<AuthUser>('/auth/login/', { username, password });
}

/** End the current session. */
export async function logout(): Promise<void> {
  await apiPost<void>('/auth/logout/');
}
