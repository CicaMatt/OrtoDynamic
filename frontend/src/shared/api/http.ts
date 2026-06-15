const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

/**
 * Called when the API reports the session is no longer valid (HTTP 401) so the
 * app can drop back to the login screen. Registered by the auth layer.
 */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

/** Read a readable (non-HttpOnly) cookie — used for Django's CSRF token. */
function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

type Method = 'GET' | 'POST' | 'PATCH';

/**
 * Core request: sends the session cookie (`credentials: 'include'`), attaches the
 * CSRF token on unsafe methods, and normalises the backend's
 * `{ "error": { "message" } }` envelope into a thrown Error. A 401 means the
 * session is gone, so it notifies the auth layer before surfacing the error.
 */
async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (method !== 'GET') {
    const csrfToken = readCookie('csrftoken');
    if (csrfToken) headers['X-CSRFToken'] = csrfToken;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Impossibile contattare il server.');
  }

  if (response.status === 401) {
    onUnauthorized?.();
  }

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

/** GET a JSON resource from the backend API. */
export function apiGet<T>(path: string): Promise<T> {
  return request<T>('GET', path);
}

/** POST a JSON body to create a resource (body optional for action endpoints). */
export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('POST', path, body);
}

/** PATCH a JSON body to the API. */
export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return request<T>('PATCH', path, body);
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    if (body?.error?.message) return body.error.message;
  } catch {
    // Response had no JSON body; fall through to a generic message.
  }
  return `Richiesta non riuscita (${response.status}).`;
}
