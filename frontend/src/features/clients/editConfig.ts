import type { EntityEditConfig } from '../../app/editing/types';
import { createClient, updateClient, type ClientUpdate } from './api/clients';
import type { Client, ClientOrthopedic } from './types';

const editableClientKeys = [
  'name',
  'surname',
  'fiscalCode',
  'gender',
  'birthMunicipality',
  'birthDate',
  'address',
  'city',
  'province',
  'postalCode',
  'country',
  'phone',
  'mobile',
  'email',
  'district',
  'doctorId',
  'note',
] as const satisfies readonly (keyof Client)[];

const editableClientOrthopedicKeys = [
  'shoeSize',
  'shoeModel',
  'width',
  'collar',
  'ankle',
  'spur',
  'lift',
  'inclinedPlane',
  'insoleType',
  'collarPassage',
  'anklePassage',
  'braceType',
  'shoulderStraps',
  'upToArmpit',
  'frontFabricHeight',
  'totalFrameHeight',
  'axillaryDistance',
  'waist',
  'pelvisSize',
  'measure24',
  'neck',
  'humerus',
  'arm',
  'wrist',
  'pelvis',
  'thigh',
  'leg',
  'clientNote',
  'other',
] as const satisfies readonly (keyof ClientOrthopedic)[];

export const clientCreateRequiredKeys = [
  'name',
  'surname',
  'birthDate',
  'gender',
  'address',
  'province',
  'city',
  'phone',
] as const satisfies readonly (keyof Client)[];

function makeEmptyClient(): Client {
  return {
    idClient: '',
    name: '',
    surname: '',
    fiscalCode: '',
    phone: '',
    mobile: '',
    email: '',
    birthDate: '',
    birthMunicipality: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: '',
    district: '',
    doctorId: '',
    gender: '',
    note: '',
  };
}

/** Shared client conversions: blank birth date -> null, doctor id -> number/null. */
function normalizeClientPayload(payload: Record<string, unknown>): ClientUpdate {
  const next = { ...payload } as ClientUpdate;
  if (next.birthDate === '') next.birthDate = null;
  if ('doctorId' in next) {
    next.doctorId = next.doctorId === '' ? null : Number(next.doctorId);
  }
  return next;
}

export const clientEditConfig: EntityEditConfig<'client'> = {
  editableKeys: editableClientKeys,
  requiredKeys: clientCreateRequiredKeys,
  clientOrthopedicEditableKeys: editableClientOrthopedicKeys,
  makeEmptyDraft: makeEmptyClient,
  create: (payload) => createClient(normalizeClientPayload(payload)),
  update: (id, payload) => updateClient(id, payload as ClientUpdate),
  getCreatedId: (created) => created.idClient,
  buildUpdatePayload: (changes, context) =>
    normalizeClientPayload({ ...changes, ...context.clientOrthopedicChanges }),
};
