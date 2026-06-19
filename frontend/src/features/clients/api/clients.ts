import type { Client, ClientListItem, ClientOrthopedic } from '../types';
import { apiGet, apiGetBlob, apiPatch, apiPost } from '../../../shared/api/http';

/** Editable client fields, keyed as the API expects (camelCase). */
export type ClientUpdate = Record<string, string | number | null>;

/** All clients, as shown in the Clienti table. */
export function fetchClients(): Promise<ClientListItem[]> {
  return apiGet<ClientListItem[]>('/clients/');
}

/** A single client with full detail, by its code. */
export function fetchClient(code: string): Promise<Client> {
  return apiGet<Client>(`/clients/${code}/`);
}

/** Orthopedic data for a single client, by its code. */
export function fetchClientOrthopedic(code: string): Promise<ClientOrthopedic> {
  return apiGet<ClientOrthopedic>(`/clients/${code}/orthopedic/`);
}

/** Persist edits to a client (anagrafica + orthopedic fields) in one PATCH. */
export function updateClient(code: string, changes: ClientUpdate): Promise<unknown> {
  return apiPatch(`/clients/${code}/`, changes);
}

/** Create a new client; the API returns the created record (with its new code). */
export function createClient(values: ClientUpdate): Promise<Client> {
  return apiPost<Client>('/clients/', values);
}

/** Fetch the client's "Modulo di privacy" consent form as an inline PDF blob. */
export function fetchClientPrivacyForm(code: string): Promise<{ blob: Blob; filename: string | null }> {
  return apiGetBlob(`/clients/${code}/privacy-form/`);
}
