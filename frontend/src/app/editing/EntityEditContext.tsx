import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { updateClient, type ClientUpdate } from '../../features/clients/api/clients';
import { updateDoctor, type DoctorUpdate } from '../../features/doctors/api/doctors';
import type { Client, ClientOrthopedic } from '../../features/clients/types';
import type { Doctor } from '../../features/doctors/types';

const EDITABLE_CLIENT_KEYS = [
  'name', 'surname', 'fiscalCode', 'gender', 'birthMunicipality', 'birthDate',
  'address', 'city', 'postalCode', 'country', 'phone', 'mobile', 'email',
  'district', 'doctorId', 'note',
] as const satisfies readonly (keyof Client)[];

const EDITABLE_CLIENT_ORTHO_KEYS = [
  'shoeSize', 'shoeModel', 'width', 'collar', 'ankle', 'spur', 'lift', 'inclinedPlane',
  'insoleType', 'collarPassage', 'anklePassage', 'braceType', 'shoulderStraps', 'upToArmpit',
  'frontFabricHeight', 'totalFrameHeight', 'axillaryDistance', 'waist', 'pelvisSize', 'measure24',
  'neck', 'humerus', 'arm', 'wrist', 'pelvis', 'thigh', 'leg', 'clientNote', 'other',
] as const satisfies readonly (keyof ClientOrthopedic)[];

const EDITABLE_DOCTOR_KEYS = [
  'surname', 'name', 'address', 'phone', 'email', 'note',
] as const satisfies readonly (keyof Doctor)[];

export type EditTarget = { type: 'client'; id: string } | { type: 'doctor'; id: string };

type EntityEditValue = {
  editing: boolean;
  editTarget: EditTarget | null;
  saving: boolean;
  saveError: string | null;
  isDirty: boolean;
  dataVersion: number;
  clientDraft: Client | null;
  clientOrthopedicDraft: ClientOrthopedic | null;
  doctorDraft: Doctor | null;
  startClientEdit: (code: string) => void;
  startDoctorEdit: (id: string) => void;
  seedClient: (client: Client) => void;
  seedClientOrthopedic: (ortho: ClientOrthopedic) => void;
  seedDoctor: (doctor: Doctor) => void;
  setClientField: (key: keyof Client, value: string) => void;
  setClientOrthopedicField: (key: keyof ClientOrthopedic, value: string) => void;
  setDoctorField: (key: keyof Doctor, value: string) => void;
  cancel: () => void;
  save: () => Promise<boolean>;
};

const EntityEditContext = createContext<EntityEditValue | null>(null);

function diff<T extends object>(draft: T | null, original: T | null, keys: readonly (keyof T)[]) {
  const changes: Record<string, unknown> = {};
  if (!draft || !original) return changes;
  for (const key of keys) {
    if (draft[key] !== original[key]) changes[key as string] = draft[key];
  }
  return changes;
}

export function EntityEditProvider({ children }: { children: ReactNode }) {
  const [editing, setEditing] = useState(false);
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [clientDraft, setClientDraft] = useState<Client | null>(null);
  const [clientOriginal, setClientOriginal] = useState<Client | null>(null);
  const [clientOrthopedicDraft, setClientOrthopedicDraft] = useState<ClientOrthopedic | null>(null);
  const [clientOrthopedicOriginal, setClientOrthopedicOriginal] = useState<ClientOrthopedic | null>(null);
  const [doctorDraft, setDoctorDraft] = useState<Doctor | null>(null);
  const [doctorOriginal, setDoctorOriginal] = useState<Doctor | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [dataVersion, setDataVersion] = useState(0);

  const reset = useCallback(() => {
    setClientDraft(null);
    setClientOriginal(null);
    setClientOrthopedicDraft(null);
    setClientOrthopedicOriginal(null);
    setDoctorDraft(null);
    setDoctorOriginal(null);
    setSaveError(null);
  }, []);

  const endSession = useCallback(() => {
    setEditing(false);
    setEditTarget(null);
    reset();
  }, [reset]);

  const startClientEdit = useCallback(
    (code: string) => {
      reset();
      setEditTarget({ type: 'client', id: code });
      setEditing(true);
    },
    [reset],
  );

  const startDoctorEdit = useCallback(
    (id: string) => {
      reset();
      setEditTarget({ type: 'doctor', id });
      setEditing(true);
    },
    [reset],
  );

  const seedClient = useCallback((client: Client) => {
    setClientDraft((prev) => prev ?? { ...client });
    setClientOriginal((prev) => prev ?? { ...client });
  }, []);

  const seedClientOrthopedic = useCallback((ortho: ClientOrthopedic) => {
    setClientOrthopedicDraft((prev) => prev ?? { ...ortho });
    setClientOrthopedicOriginal((prev) => prev ?? { ...ortho });
  }, []);

  const seedDoctor = useCallback((doctor: Doctor) => {
    setDoctorDraft((prev) => prev ?? { ...doctor });
    setDoctorOriginal((prev) => prev ?? { ...doctor });
  }, []);

  const setClientField = useCallback((key: keyof Client, value: string) => {
    setClientDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const setClientOrthopedicField = useCallback((key: keyof ClientOrthopedic, value: string) => {
    setClientOrthopedicDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const setDoctorField = useCallback((key: keyof Doctor, value: string) => {
    setDoctorDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const clientChanges = useMemo(
    () => diff(clientDraft, clientOriginal, EDITABLE_CLIENT_KEYS),
    [clientDraft, clientOriginal],
  );
  const clientOrthopedicChanges = useMemo(
    () => diff(clientOrthopedicDraft, clientOrthopedicOriginal, EDITABLE_CLIENT_ORTHO_KEYS),
    [clientOrthopedicDraft, clientOrthopedicOriginal],
  );
  const doctorChanges = useMemo(
    () => diff(doctorDraft, doctorOriginal, EDITABLE_DOCTOR_KEYS),
    [doctorDraft, doctorOriginal],
  );
  const isDirty =
    Object.keys(clientChanges).length > 0 ||
    Object.keys(clientOrthopedicChanges).length > 0 ||
    Object.keys(doctorChanges).length > 0;

  const save = useCallback(async () => {
    if (!editTarget) return true;

    const payload =
      editTarget.type === 'client'
        ? ({ ...clientChanges, ...clientOrthopedicChanges } as ClientUpdate)
        : ({ ...doctorChanges } as DoctorUpdate);
    if (Object.keys(payload).length === 0) {
      endSession();
      return true;
    }
    if (editTarget.type === 'client') {
      const clientPayload = payload as ClientUpdate;
      if (clientPayload.birthDate === '') clientPayload.birthDate = null;
      if ('doctorId' in clientPayload) {
        clientPayload.doctorId = clientPayload.doctorId === '' ? null : Number(clientPayload.doctorId);
      }
    }

    setSaving(true);
    setSaveError(null);
    try {
      if (editTarget.type === 'client') {
        await updateClient(editTarget.id, payload as ClientUpdate);
      } else {
        await updateDoctor(editTarget.id, payload as DoctorUpdate);
      }
      endSession();
      setDataVersion((v) => v + 1);
      return true;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Errore durante il salvataggio.');
      return false;
    } finally {
      setSaving(false);
    }
  }, [editTarget, clientChanges, clientOrthopedicChanges, doctorChanges, endSession]);

  const value: EntityEditValue = {
    editing,
    editTarget,
    saving,
    saveError,
    isDirty,
    dataVersion,
    clientDraft,
    clientOrthopedicDraft,
    doctorDraft,
    startClientEdit,
    startDoctorEdit,
    seedClient,
    seedClientOrthopedic,
    seedDoctor,
    setClientField,
    setClientOrthopedicField,
    setDoctorField,
    cancel: endSession,
    save,
  };

  return <EntityEditContext.Provider value={value}>{children}</EntityEditContext.Provider>;
}

export function useEntityEdit() {
  const ctx = useContext(EntityEditContext);
  if (!ctx) throw new Error('useEntityEdit must be used inside EntityEditProvider');
  return ctx;
}
