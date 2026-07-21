import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  apiDelete,
  apiGet,
  apiPost,
  setAuthToken,
  setUnauthorizedHandler,
} from '../../../src/shared/api/http';

describe('HTTP client', () => {
  beforeEach(() => {
    setAuthToken(null);
  });

  afterEach(() => {
    setUnauthorizedHandler(null);
  });

  it('returns JSON and sends the token and request body', async () => {
    setAuthToken('secret-token');
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ id: 42 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(apiPost('/products/', { code: 'P-42' })).resolves.toEqual({ id: 42 });
    expect(fetchMock).toHaveBeenCalledWith('http://127.0.0.1:8000/api/v1/products/', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer secret-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: 'P-42' }),
    });
  });

  it('normalizes the backend error envelope and notifies on unauthorized', async () => {
    const unauthorized = vi.fn();
    setUnauthorizedHandler(unauthorized);
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: { message: 'Sessione scaduta.' } }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(apiGet('/clients/')).rejects.toThrow('Sessione scaduta.');
    expect(unauthorized).toHaveBeenCalledOnce();
  });

  it('falls back to a status message for malformed error bodies', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('broken', { status: 500 }));

    await expect(apiGet('/clients/')).rejects.toThrow('Richiesta non riuscita (500).');
  });

  it('returns undefined for successful 204 responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 204 }));

    await expect(apiDelete('/products/42/')).resolves.toBeUndefined();
  });

  it('turns network failures into a stable user-facing error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('network down'));

    await expect(apiGet('/clients/')).rejects.toThrow('Impossibile contattare il server.');
  });
});
