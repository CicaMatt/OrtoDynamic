import type { EntityEditOperations } from '../../app/editing/types';
import { diffDraft, pickDefinedFields, pickFields } from '../../app/editing/types';
import {
  createClient,
  updateClient,
  type ClientCreatePayload,
  type ClientOrthopedicPayload,
  type ClientUpdatePayload,
} from './api/clients';
import { clientCreateRequiredKeys } from './components/clientFields';
import type { Client, ClientOrthopedic } from './types';

const clientEditableKeys = [
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

const clientTextKeys = [
  'name',
  'surname',
  'fiscalCode',
  'gender',
  'birthMunicipality',
  'address',
  'city',
  'province',
  'postalCode',
  'country',
  'phone',
  'mobile',
  'email',
  'district',
  'note',
] as const;

const clientOrthopedicEditableKeys = [
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

function emptyClient(): Client {
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

const nullableId = (value: string) => (value === '' ? null : Number(value));
const nullableDate = (value: string) => (value === '' ? null : value);

export function toClientCreatePayload(draft: Client): ClientCreatePayload {
  const values = pickFields(draft, clientEditableKeys);
  return {
    ...values,
    birthDate: nullableDate(values.birthDate),
    doctorId: nullableId(values.doctorId),
  };
}

export function toClientGeneralUpdatePayload(changes: Partial<Client>): ClientUpdatePayload {
  const payload: ClientUpdatePayload = pickDefinedFields(changes, clientTextKeys);
  if (changes.birthDate !== undefined) payload.birthDate = nullableDate(changes.birthDate);
  if (changes.doctorId !== undefined) payload.doctorId = nullableId(changes.doctorId);
  return payload;
}

export function toClientOrthopedicUpdatePayload(
  changes: Partial<ClientOrthopedic>,
): Partial<ClientOrthopedicPayload> {
  return pickDefinedFields(changes, clientOrthopedicEditableKeys);
}

export function diffClientOrthopedic(
  draft: ClientOrthopedic | null,
  original: ClientOrthopedic | null,
): Partial<ClientOrthopedic> {
  return diffDraft(draft, original, clientOrthopedicEditableKeys);
}

export const clientEditOperations: EntityEditOperations<'client'> = {
  editableKeys: clientEditableKeys,
  requiredKeys: clientCreateRequiredKeys,
  emptyDraft: emptyClient,
  create: async (draft) => {
    const created = await createClient(toClientCreatePayload(draft));
    return created.idClient;
  },
  update: async (id, changes, context) => {
    const payload: ClientUpdatePayload = {
      ...toClientGeneralUpdatePayload(changes),
      ...toClientOrthopedicUpdatePayload(context.clientOrthopedicChanges),
    };
    await updateClient(id, payload);
  },
};
