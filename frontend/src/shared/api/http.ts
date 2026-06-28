// Fall back on a blank/whitespace value, not just an absent one: an empty
// VITE_API_BASE_URL would otherwise make every request a same-origin relative
// path (which silently hits the static host, not the API).
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE_URL = configuredApiBaseUrl || 'http://localhost:8000/api/v1';
const TOKEN_STORAGE_KEY = 'ortodynamic.authToken';

/**
 * Called when the API reports the session is no longer valid (HTTP 401) so the
 * app can drop back to the login screen. Registered by the auth layer.
 */
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

/**
 * The bearer token sent on every request. Kept in memory and mirrored to
 * localStorage so a reload restores the session. Reads/writes to storage are
 * guarded: in private-mode browsers it may be unavailable, and the in-memory
 * copy still works for the current page.
 */
let authToken: string | null = readStoredToken();

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

export function setAuthToken(token: string | null): void {
  authToken = token;
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Persisting failed; the in-memory token remains valid for this session.
  }
}

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

/**
 * Core request: attaches the bearer token, sets the JSON content type when there
 * is a body, and normalises the backend's `{ "error": { "message" } }` envelope
 * into a thrown Error. A 401 means the token is gone or expired, so it notifies
 * the auth layer before surfacing the error.
 */
async function performRequest(method: Method, path: string, body?: unknown): Promise<Response> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
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
