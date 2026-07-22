import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { ApiError } from '../../shared/api/http';
import {
  applySupplement,
  changeSession,
  isSessionDirty,
  prepareSessionSave,
  resetSessionParticipant,
  seedSession,
  sessionFor,
  startSession,
  withInvalidFields,
  type EditSession,
  type EditSessionMap,
  type SupplementalEditAction,
} from './editSession';
import type { EditMode, EditTarget, EntityDraftMap, EntityKind, SaveResult } from './types';

export type { EditMode, EditTarget, EntityKind, SaveResult } from './types';

type EntityEditValue = {
  session: EditSession | null;
  saving: boolean;
  error: string | null;
  isDirty: boolean;
  dataVersion: number;
  start: <K extends EntityKind>(
    target: Extract<EditTarget, { type: K }>,
    mode: EditMode,
    initialValues?: Partial<EntityDraftMap[K]>,
  ) => void;
  seed: <K extends EntityKind>(type: K, draft: EntityDraftMap[K]) => void;
  change: <K extends EntityKind>(type: K, key: keyof EntityDraftMap[K], value: string) => void;
  supplement: (action: SupplementalEditAction) => void;
  cancel: () => void;
  save: (onCreated?: (target: EditTarget) => void) => Promise<SaveResult>;
};

const EntityEditContext = createContext<EntityEditValue | null>(null);

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Errore durante il salvataggio.';
}

export function EntityEditProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<EditSession | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataVersion, setDataVersion] = useState(0);
  const saveInFlight = useRef<Promise<SaveResult> | null>(null);

  const closeSession = () => {
    resetSessionParticipant(session);
    setSessionState(null);
    setError(null);
  };

  const cancel = () => {
    if (saveInFlight.current) return;
    closeSession();
  };

  const start = <K extends EntityKind>(
    target: Extract<EditTarget, { type: K }>,
    mode: EditMode,
    initialValues?: Partial<EntityDraftMap[K]>,
  ) => {
    if (saveInFlight.current) return;
    resetSessionParticipant(session);
    setSessionState(startSession(target, mode, initialValues));
    setError(null);
  };

  const seed = <K extends EntityKind>(type: K, draft: EntityDraftMap[K]) => {
    if (saveInFlight.current) return;
    setSessionState((current) => seedSession(current, type, draft));
  };

  const change = <K extends EntityKind>(type: K, key: keyof EntityDraftMap[K], value: string) => {
    if (saveInFlight.current) return;
    setSessionState((current) => changeSession(current, type, key, value));
  };

  const supplement = useCallback((action: SupplementalEditAction) => {
    if (saveInFlight.current) return;
    setSessionState((current) => applySupplement(current, action));
  }, []);

  const save = (onCreated?: (target: EditTarget) => void): Promise<SaveResult> => {
    if (saveInFlight.current) return saveInFlight.current;
    if (!session) return Promise.resolve({ ok: true });

    const preparation = prepareSessionSave(session);
    if (preparation.kind === 'invalid') {
      setSessionState((current) =>
        current ? withInvalidFields(current, preparation.fields) : current,
      );
      setError(preparation.error);
      return Promise.resolve({ ok: false });
    }
    if (preparation.kind === 'empty') {
      cancel();
      return Promise.resolve({ ok: true });
    }

    setSaving(true);
    setError(null);
    const operation = (async () => {
      try {
        const result = await preparation.execute();
        if (result.created) onCreated?.(result.created);
        closeSession();
        setDataVersion((version) => version + 1);
        return result;
      } catch (cause) {
        if (cause instanceof ApiError) {
          setSessionState((current) => {
            const matchingFields = Object.keys(cause.fields).filter(
              (field) => current?.draft && field in current.draft,
            );
            return current ? withInvalidFields(current, matchingFields) : current;
          });
        }
        setError(errorMessage(cause));
        return { ok: false };
      } finally {
        saveInFlight.current = null;
        setSaving(false);
      }
    })();
    saveInFlight.current = operation;
    return operation;
  };

  const value: EntityEditValue = {
    session,
    saving,
    error,
    isDirty: isSessionDirty(session),
    dataVersion,
    start,
    seed,
    change,
    supplement,
    cancel,
    save,
  };

  return <EntityEditContext.Provider value={value}>{children}</EntityEditContext.Provider>;
}

export function useEntityEdit() {
  const context = useContext(EntityEditContext);
  if (!context) throw new Error('useEntityEdit must be used inside EntityEditProvider');
  return context;
}

type EntityEditor<K extends EntityKind> = {
  session: EditSessionMap[K] | null;
  draft: EntityDraftMap[K] | null;
  invalidFields: Array<keyof EntityDraftMap[K]>;
  dataVersion: number;
  isEditing: (id: string) => boolean;
  startEdit: (id: string) => void;
  seed: (draft: EntityDraftMap[K]) => void;
  change: (key: keyof EntityDraftMap[K], value: string) => void;
};

/** Shared typed core used by the small feature-owned editor hooks. */
export function useEntityEditor<K extends EntityKind>(type: K): EntityEditor<K> {
  const { session, dataVersion, start, seed: seedDraft, change: changeField } = useEntityEdit();
  const active = sessionFor(session, type);
  return {
    session: active,
    draft: (active?.draft ?? null) as EntityDraftMap[K] | null,
    invalidFields: (active?.invalidFields ?? []) as Array<keyof EntityDraftMap[K]>,
    dataVersion,
    isEditing: (id) => active?.mode === 'edit' && active.id === id,
    startEdit: (id) => start({ type, id } as Extract<EditTarget, { type: K }>, 'edit'),
    seed: (draft) => seedDraft(type, draft),
    change: (key, value) => changeField(type, key, value),
  };
}
