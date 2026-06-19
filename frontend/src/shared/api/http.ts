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

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

/**
 * Core request: sends the session cookie (`credentials: 'include'`), attaches the
 * CSRF token on unsafe methods, and normalises the backend's
 * `{ "error": { "message" } }` envelope into a thrown Error. A 401 means the
 * session is gone, so it notifies the auth layer before surfacing the error.
 */
async function performRequest(method: Method, path: string, body?: unknown): Promise<Response> {
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

  return response;
}

async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const response = await performRequest(method, path, body);
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

/** GET a JSON resource from the backend API. */
export function apiGet<T>(path: string): Promise<T> {
  return request<T>('GET', path);
}

/**
 * GET a binary resource (e.g. a generated PDF) as a Blob, with the same auth,
 * CSRF and error handling as the JSON helpers. Returns the blob and the filename
 * suggested by the response's `Content-Disposition` header (null if absent).
 */
export async function apiGetBlob(path: string): Promise<{ blob: Blob; filename: string | null }> {
  const response = await performRequest('GET', path);
  const blob = await response.blob();
  return { blob, filename: filenameFromContentDisposition(response.headers.get('Content-Disposition')) };
}

/** POST a JSON body to create a resource (body optional for action endpoints). */
export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>('POST', path, body);
}

/** PATCH a JSON body to the API. */
export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return request<T>('PATCH', path, body);
}

/** DELETE a resource; resolves with nothing on the backend's 204 response. */
export function apiDelete(path: string): Promise<void> {
  return request<void>('DELETE', path);
}

/** Pull the filename out of a `Content-Disposition` header, if it carries one. */
function filenameFromContentDisposition(header: string | null): string | null {
  if (!header) return null;
  const match = header.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  return match ? decodeURIComponent(match[1]) : null;
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
