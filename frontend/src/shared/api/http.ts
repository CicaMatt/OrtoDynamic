const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

/**
 * GET a JSON resource from the backend API.
 *
 * On a non-2xx response it reads the backend's `{ "error": { "message" } }`
 * envelope and throws an Error carrying that message, so callers can surface a
 * meaningful reason to the user.
 */
export async function apiGet<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`);
  } catch {
    throw new Error('Impossibile contattare il server.');
  }

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return (await response.json()) as T;
}

/** Send a JSON body with the given method, sharing {@link apiGet}'s error handling. */
async function sendJson<T>(method: 'POST' | 'PATCH', path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Impossibile contattare il server.');
  }

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return (await response.json()) as T;
}

/** POST a JSON body to create a resource. */
export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return sendJson<T>('POST', path, body);
}

/** PATCH a JSON body to the API. */
export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return sendJson<T>('PATCH', path, body);
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
