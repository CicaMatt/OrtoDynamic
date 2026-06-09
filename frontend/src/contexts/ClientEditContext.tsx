import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { updateClient, type ClientUpdate } from '../api/clients';
import type { Client, ClientOrthopedic } from '../types';

// Editable fields per view (the client `code` is never editable).
const EDITABLE_DETAIL_KEYS = [
  'name', 'surname', 'fiscalCode', 'gender', 'birthMunicipality', 'birthDate',
  'address', 'city', 'postalCode', 'country', 'phone', 'mobile', 'email',
  'district', 'doctorId', 'note',
] as const satisfies readonly (keyof Client)[];

const EDITABLE_ORTHO_KEYS = [
  'shoeSize', 'shoeModel', 'width', 'collar', 'ankle', 'spur', 'lift', 'inclinedPlane',
  'insoleType', 'collarPassage', 'anklePassage', 'braceType', 'shoulderStraps', 'upToArmpit',
  'frontFabricHeight', 'totalFrameHeight', 'axillaryDistance', 'waist', 'pelvisSize', 'measure24',
  'neck', 'humerus', 'arm', 'wrist', 'pelvis', 'thigh', 'leg', 'clientNote', 'other',
] as const satisfies readonly (keyof ClientOrthopedic)[];

type ClientEditValue = {
  editing: boolean;
  saving: boolean;
  saveError: string | null;
  isDirty: boolean;
  /** Incremented after a successful save so views can refetch fresh data. */
  dataVersion: number;
  detailDraft: Client | null;
  orthoDraft: ClientOrthopedic | null;
  startEdit: (code: string) => void;
  seedDetail: (client: Client) => void;
  seedOrtho: (ortho: ClientOrthopedic) => void;
  setDetailField: (key: keyof Client, value: string) => void;
  setOrthoField: (key: keyof ClientOrthopedic, value: string) => void;
  cancel: () => void;
  /** Persists changes; resolves true on success, false on failure. */
  save: () => Promise<boolean>;
};

const ClientEditContext = createContext<ClientEditValue | null>(null);

function diff<T extends object>(draft: T | null, original: T | null, keys: readonly (keyof T)[]) {
  const changes: Record<string, unknown> = {};
  if (!draft || !original) return changes;
  for (const key of keys) {
    if (draft[key] !== original[key]) changes[key as string] = draft[key];
  }
  return changes;
}

export function ClientEditProvider({ children }: { children: ReactNode }) {
  const [editing, setEditing] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [detailDraft, setDetailDraft] = useState<Client | null>(null);
  const [detailOriginal, setDetailOriginal] = useState<Client | null>(null);
  const [orthoDraft, setOrthoDraft] = useState<ClientOrthopedic | null>(null);
  const [orthoOriginal, setOrthoOriginal] = useState<ClientOrthopedic | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [dataVersion, setDataVersion] = useState(0);

  const reset = useCallback(() => {
    setDetailDraft(null);
    setDetailOriginal(null);
    setOrthoDraft(null);
    setOrthoOriginal(null);
    setSaveError(null);
  }, []);

  /** Leave edit mode and drop all session state (drafts, code, errors). */
  const endSession = useCallback(() => {
    setEditing(false);
    setCode(null);
    reset();
  }, [reset]);

  const startEdit = useCallback(
    (clientCode: string) => {
      reset();
      setCode(clientCode);
      setEditing(true);
    },
    [reset],
  );

  const seedDetail = useCallback((client: Client) => {
    setDetailDraft((prev) => prev ?? { ...client });
    setDetailOriginal((prev) => prev ?? { ...client });
  }, []);

  const seedOrtho = useCallback((ortho: ClientOrthopedic) => {
    setOrthoDraft((prev) => prev ?? { ...ortho });
    setOrthoOriginal((prev) => prev ?? { ...ortho });
  }, []);

  const setDetailField = useCallback((key: keyof Client, value: string) => {
    setDetailDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const setOrthoField = useCallback((key: keyof ClientOrthopedic, value: string) => {
    setOrthoDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const detailChanges = useMemo(
    () => diff(detailDraft, detailOriginal, EDITABLE_DETAIL_KEYS),
    [detailDraft, detailOriginal],
  );
  const orthoChanges = useMemo(
    () => diff(orthoDraft, orthoOriginal, EDITABLE_ORTHO_KEYS),
    [orthoDraft, orthoOriginal],
  );
  const isDirty = Object.keys(detailChanges).length > 0 || Object.keys(orthoChanges).length > 0;

  const cancel = endSession;

  const save = useCallback(async () => {
    if (!code) return true;

    const payload: ClientUpdate = { ...detailChanges, ...orthoChanges } as ClientUpdate;
    if (Object.keys(payload).length === 0) {
      endSession();
      return true;
    }
    // Normalise fields whose column is not a plain string.
    if (payload.birthDate === '') payload.birthDate = null;
    if ('doctorId' in payload) {
      payload.doctorId = payload.doctorId === '' ? null : Number(payload.doctorId);
    }

    setSaving(true);
    setSaveError(null);
    try {
      await updateClient(code, payload);
      endSession();
      setDataVersion((v) => v + 1);
      return true;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Errore durante il salvataggio.');
      return false;
    } finally {
      setSaving(false);
    }
  }, [code, detailChanges, orthoChanges, endSession]);

  const value: ClientEditValue = {
    editing,
    saving,
    saveError,
    isDirty,
    dataVersion,
    detailDraft,
    orthoDraft,
    startEdit,
    seedDetail,
    seedOrtho,
    setDetailField,
    setOrthoField,
    cancel,
    save,
  };

  return <ClientEditContext.Provider value={value}>{children}</ClientEditContext.Provider>;
}

export function useClientEdit() {
  const ctx = useContext(ClientEditContext);
  if (!ctx) throw new Error('useClientEdit must be used inside ClientEditProvider');
  return ctx;
}
