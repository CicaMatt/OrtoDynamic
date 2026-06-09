import type { Client, ClientListItem, ClientOrthopedic } from '../types';
import { apiGet } from './client';

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
