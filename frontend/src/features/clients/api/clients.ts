import type { Client, ClientListItem, ClientOrthopedic } from '../types';
import { apiDelete, apiGet, apiGetBlob, apiPatch, apiPost } from '../../../shared/api/http';

/** General client fields accepted by create and PATCH endpoints. */
export type ClientGeneralPayload = {
  name: string;
  surname: string;
  fiscalCode: string;
  gender: string;
  birthMunicipality: string;
  birthDate: string | null;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  mobile: string;
  email: string;
  district: string;
  doctorId: number | null;
  note: string;
};

/** Orthopedic fields accepted by the same client PATCH endpoint. */
export type ClientOrthopedicPayload = {
  shoeSize: string;
  shoeModel: string;
  width: string;
  collar: string;
  ankle: string;
  spur: string;
  lift: string;
  inclinedPlane: string;
  insoleType: string;
  collarPassage: string;
  anklePassage: string;
  braceType: string;
  shoulderStraps: string;
  upToArmpit: string;
  frontFabricHeight: string;
  totalFrameHeight: string;
  axillaryDistance: string;
  waist: string;
  pelvisSize: string;
  measure24: string;
  neck: string;
  humerus: string;
  arm: string;
  wrist: string;
  pelvis: string;
  thigh: string;
  leg: string;
  clientNote: string;
  other: string;
};

export type ClientCreatePayload = ClientGeneralPayload;
export type ClientUpdatePayload = Partial<ClientGeneralPayload & ClientOrthopedicPayload>;

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
export function updateClient(code: string, changes: ClientUpdatePayload): Promise<unknown> {
  return apiPatch(`/clients/${code}/`, changes);
}

export function deleteClient(code: string): Promise<void> {
  return apiDelete(`/clients/${code}/`);
}

/** Create a new client; the API returns the created record (with its new code). */
export function createClient(values: ClientCreatePayload): Promise<Client> {
  return apiPost<Client>('/clients/', values);
}

/** Fetch the client's "Modulo di privacy" consent form as an inline PDF blob. */
export function fetchClientPrivacyForm(
  code: string,
): Promise<{ blob: Blob; filename: string | null }> {
  return apiGetBlob(`/clients/${code}/privacy-form/`);
}
