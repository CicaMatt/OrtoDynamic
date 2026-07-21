import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { clientEditConfig } from '../../features/clients/editConfig';
import { doctorEditConfig } from '../../features/doctors/editConfig';
import { healthCompanyEditConfig } from '../../features/healthCompanies/editConfig';
import { productEditConfig } from '../../features/products/editConfig';
import { quoteEditConfig } from '../../features/quotes/editConfig';
import { workOrderEditConfig } from '../../features/workOrders/editConfig';
import type { Client, ClientOrthopedic } from '../../features/clients/types';
import type { Doctor } from '../../features/doctors/types';
import type { HealthCompany } from '../../features/healthCompanies/types';
import type { Product } from '../../features/products/types';
import type { Quote, QuoteItemDraft } from '../../features/quotes/types';
import type { WorkOrder } from '../../features/workOrders/types';
import type {
  EditMode,
  EditPayloadContext,
  EditTarget,
  EntityDraft,
  EntityDraftMap,
  EntityEditConfig,
  EntityKind,
  SaveResult,
} from './types';
import { buildCreatePayload, diffDraft } from './types';

export type { EditMode, EditTarget, EntityKind, SaveResult } from './types';

const entityEditConfigs = {
  client: clientEditConfig,
  doctor: doctorEditConfig,
  healthCompany: healthCompanyEditConfig,
  product: productEditConfig,
  quote: quoteEditConfig,
  workOrder: workOrderEditConfig,
} satisfies { [K in EntityKind]: EntityEditConfig<K> };

type EditSession = {
  target: EditTarget;
  mode: EditMode;
  draft: EntityDraft | null;
  original: EntityDraft | null;
  requiredFields: string[];
};

type EntityEditValue = {
  editing: boolean;
  mode: EditMode;
  editTarget: EditTarget | null;
  saving: boolean;
  saveError: string | null;
  /** Field keys that failed required-validation on the last create attempt. */
  invalidFields: string[];
  isDirty: boolean;
  dataVersion: number;
  clientDraft: Client | null;
  clientOrthopedicDraft: ClientOrthopedic | null;
  doctorDraft: Doctor | null;
  healthCompanyDraft: HealthCompany | null;
  productDraft: Product | null;
  quoteDraft: Quote | null;
  /** Pending line items for a quote being created (empty otherwise). */
  quoteItemDrafts: QuoteItemDraft[];
  workOrderDraft: WorkOrder | null;
  startClientEdit: (code: string) => void;
  startClientCreate: (requiredKeys: ReadonlyArray<keyof Client>) => void;
  startDoctorEdit: (id: string) => void;
  startDoctorCreate: (requiredKeys: ReadonlyArray<keyof Doctor>) => void;
  startHealthCompanyEdit: (id: string) => void;
  startHealthCompanyCreate: (requiredKeys: ReadonlyArray<keyof HealthCompany>) => void;
  startProductEdit: (id: string) => void;
  startProductCreate: (requiredKeys: ReadonlyArray<keyof Product>) => void;
  startQuoteEdit: (id: string) => void;
  startQuoteCreate: (requiredKeys: ReadonlyArray<keyof Quote>) => void;
  startWorkOrderEdit: (id: string) => void;
  seedClient: (client: Client) => void;
  seedClientOrthopedic: (ortho: ClientOrthopedic) => void;
  seedDoctor: (doctor: Doctor) => void;
  seedHealthCompany: (company: HealthCompany) => void;
  seedProduct: (product: Product) => void;
  seedQuote: (quote: Quote) => void;
  seedWorkOrder: (workOrder: WorkOrder) => void;
  setClientField: (key: keyof Client, value: string) => void;
  setClientOrthopedicField: (key: keyof ClientOrthopedic, value: string) => void;
  setDoctorField: (key: keyof Doctor, value: string) => void;
  setHealthCompanyField: (key: keyof HealthCompany, value: string) => void;
  setProductField: (key: keyof Product, value: string) => void;
  setQuoteField: (key: keyof Quote, value: string) => void;
  /** Append a pending line item to the quote being created. */
  addQuoteItemDraft: (draft: QuoteItemDraft) => void;
  /** Remove a pending line item (by position) from the quote being created. */
  removeQuoteItemDraft: (index: number) => void;
  setWorkOrderField: (key: keyof WorkOrder, value: string) => void;
  cancel: () => void;
  save: () => Promise<SaveResult>;
  /**
   * Register an extra persistence step run as part of the next save (e.g. a
   * collection sub-editor like the work order items). Returns an unregister fn.
   */
  registerSaveHook: (hook: () => Promise<void>) => () => void;
  /** Report that a sub-editor has unsaved changes, so the edit counts as dirty. */
  markExtraDirty: (dirty: boolean) => void;
};

const EntityEditContext = createContext<EntityEditValue | null>(null);

function cloneDraft<T extends object>(draft: T): T {
  return { ...draft };
}

function sessionDraft<K extends EntityKind>(session: EditSession | null, type: K): EntityDraftMap[K] | null {
  return session?.target.type === type ? (session.draft as EntityDraftMap[K] | null) : null;
}

export function EntityEditProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<EditSession | null>(null);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [clientOrthopedicDraft, setClientOrthopedicDraft] = useState<ClientOrthopedic | null>(null);
  const [clientOrthopedicOriginal, setClientOrthopedicOriginal] = useState<ClientOrthopedic | null>(null);
  const [quoteItemDrafts, setQuoteItemDrafts] = useState<QuoteItemDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [dataVersion, setDataVersion] = useState(0);
  // Sub-editors (e.g. work order items) that persist as part of the next save.
  const saveHooksRef = useRef<Set<() => Promise<void>>>(new Set());
  const [extraDirty, setExtraDirty] = useState(false);

  const editing = session !== null;
  const mode = session?.mode ?? 'edit';
  const editTarget = session?.target ?? null;

  const clientDraft = sessionDraft(session, 'client');
  const doctorDraft = sessionDraft(session, 'doctor');
  const healthCompanyDraft = sessionDraft(session, 'healthCompany');
  const productDraft = sessionDraft(session, 'product');
  const quoteDraft = sessionDraft(session, 'quote');
  const workOrderDraft = sessionDraft(session, 'workOrder');

  const registerSaveHook = useCallback((hook: () => Promise<void>) => {
    saveHooksRef.current.add(hook);
    return () => {
      saveHooksRef.current.delete(hook);
    };
  }, []);

  const markExtraDirty = useCallback((dirty: boolean) => setExtraDirty(dirty), []);

  const resetSubEditors = useCallback(() => {
    setClientOrthopedicDraft(null);
    setClientOrthopedicOriginal(null);
    setQuoteItemDrafts([]);
    setInvalidFields([]);
    setSaveError(null);
    setExtraDirty(false);
  }, []);

  const endSession = useCallback(() => {
    setSession(null);
    resetSubEditors();
  }, [resetSubEditors]);

  const startEdit = useCallback(
    (type: EntityKind, id: string) => {
      resetSubEditors();
      setSession({ target: { type, id } as EditTarget, mode: 'edit', draft: null, original: null, requiredFields: [] });
    },
    [resetSubEditors],
  );

  const startCreate = useCallback(
    <K extends EntityKind>(type: K, requiredKeys: ReadonlyArray<keyof EntityDraftMap[K]>) => {
      resetSubEditors();
      const config = entityEditConfigs[type];
      if (!config.makeEmptyDraft) {
        setSaveError('Creazione non supportata per questa entità.');
        setSession({ target: { type, id: '' } as EditTarget, mode: 'create', draft: null, original: null, requiredFields: [] });
        return;
      }
      const empty = config.makeEmptyDraft();
      setSession({
        target: { type, id: '' } as EditTarget,
        mode: 'create',
        draft: empty,
        original: cloneDraft(empty),
        requiredFields: requiredKeys.map(String),
      });
    },
    [resetSubEditors],
  );

  const seedDraft = useCallback(<K extends EntityKind>(type: K, draft: EntityDraftMap[K]) => {
    setSession((prev) => {
      if (!prev || prev.target.type !== type) return prev;
      return {
        ...prev,
        draft: prev.draft ?? cloneDraft(draft),
        original: prev.original ?? cloneDraft(draft),
      };
    });
  }, []);

  const setEntityField = useCallback(
    <K extends EntityKind>(type: K, key: keyof EntityDraftMap[K], value: string) => {
      setSession((prev) => {
        if (!prev || prev.target.type !== type || !prev.draft) return prev;
        const config = entityEditConfigs[type] as unknown as EntityEditConfig<K>;
        const draft = prev.draft as EntityDraftMap[K];
        const nextDraft = config.applyFieldChange
          ? config.applyFieldChange(draft, key, value)
          : { ...draft, [key]: value };
        if (!nextDraft) return prev;
        return { ...prev, draft: nextDraft };
      });
      setInvalidFields((prev) => (prev.length ? prev.filter((field) => field !== key) : prev));
    },
    [],
  );

  const setClientOrthopedicField = useCallback((key: keyof ClientOrthopedic, value: string) => {
    setClientOrthopedicDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const addQuoteItemDraft = useCallback((draft: QuoteItemDraft) => {
    setQuoteItemDrafts((prev) => [...prev, draft]);
  }, []);

  const removeQuoteItemDraft = useCallback((index: number) => {
    setQuoteItemDrafts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const startActions = useMemo(
    () => ({
      startClientEdit: (code: string) => startEdit('client', code),
      startClientCreate: (requiredKeys: ReadonlyArray<keyof Client>) =>
        startCreate('client', requiredKeys),
      startDoctorEdit: (id: string) => startEdit('doctor', id),
      startDoctorCreate: (requiredKeys: ReadonlyArray<keyof Doctor>) =>
        startCreate('doctor', requiredKeys),
      startHealthCompanyEdit: (id: string) => startEdit('healthCompany', id),
      startHealthCompanyCreate: (requiredKeys: ReadonlyArray<keyof HealthCompany>) =>
        startCreate('healthCompany', requiredKeys),
      startProductEdit: (id: string) => startEdit('product', id),
      startProductCreate: (requiredKeys: ReadonlyArray<keyof Product>) =>
        startCreate('product', requiredKeys),
      startQuoteEdit: (id: string) => startEdit('quote', id),
      startQuoteCreate: (requiredKeys: ReadonlyArray<keyof Quote>) =>
        startCreate('quote', requiredKeys),
      startWorkOrderEdit: (id: string) => startEdit('workOrder', id),
    }),
    [startCreate, startEdit],
  );

  const seedActions = useMemo(
    () => ({
      seedClient: (client: Client) => seedDraft('client', client),
      seedClientOrthopedic: (ortho: ClientOrthopedic) => {
        setClientOrthopedicDraft((prev) => prev ?? cloneDraft(ortho));
        setClientOrthopedicOriginal((prev) => prev ?? cloneDraft(ortho));
      },
      seedDoctor: (doctor: Doctor) => seedDraft('doctor', doctor),
      seedHealthCompany: (company: HealthCompany) => seedDraft('healthCompany', company),
      seedProduct: (product: Product) => seedDraft('product', product),
      seedQuote: (quote: Quote) => seedDraft('quote', quote),
      seedWorkOrder: (workOrder: WorkOrder) => seedDraft('workOrder', workOrder),
    }),
    [seedDraft],
  );

  const fieldActions = useMemo(
    () => ({
      setClientField: (key: keyof Client, value: string) => setEntityField('client', key, value),
      setClientOrthopedicField,
      setDoctorField: (key: keyof Doctor, value: string) => setEntityField('doctor', key, value),
      setHealthCompanyField: (key: keyof HealthCompany, value: string) =>
        setEntityField('healthCompany', key, value),
      setProductField: (key: keyof Product, value: string) => setEntityField('product', key, value),
      setQuoteField: (key: keyof Quote, value: string) => setEntityField('quote', key, value),
      setWorkOrderField: (key: keyof WorkOrder, value: string) =>
        setEntityField('workOrder', key, value),
    }),
    [setClientOrthopedicField, setEntityField],
  );

  const primaryChanges = useMemo(() => {
    if (!session) return {};
    const config = entityEditConfigs[session.target.type];
    return diffDraft(
      session.draft as Record<string, unknown> | null,
      session.original as Record<string, unknown> | null,
      config.editableKeys as readonly string[],
    );
  }, [session]);

  const clientOrthopedicChanges = useMemo(
    () =>
      diffDraft(
        clientOrthopedicDraft,
        clientOrthopedicOriginal,
        entityEditConfigs.client.clientOrthopedicEditableKeys ?? [],
      ),
    [clientOrthopedicDraft, clientOrthopedicOriginal],
  );

  const isDirty =
    extraDirty ||
    Object.keys(primaryChanges).length > 0 ||
    Object.keys(clientOrthopedicChanges).length > 0 ||
    quoteItemDrafts.length > 0;

  const payloadContext: EditPayloadContext = useMemo(
    () => ({ clientOrthopedicChanges, quoteItemDrafts }),
    [clientOrthopedicChanges, quoteItemDrafts],
  );

  const save = useCallback(async (): Promise<SaveResult> => {
    if (!session) return { ok: true };

    const { target } = session;
    const config = entityEditConfigs[target.type];

    if (session.mode === 'create') {
      const draft = session.draft as Record<string, unknown> | null;
      const missing = session.requiredFields.filter((key) => !String(draft?.[key] ?? '').trim());
      if (missing.length > 0) {
        setInvalidFields(missing);
        setSaveError('Compila i campi obbligatori evidenziati.');
        return { ok: false };
      }

      if (!config.create || !session.draft) {
        setSaveError('Creazione non supportata per questa entità.');
        return { ok: false };
      }

      setSaving(true);
      setSaveError(null);
      try {
        const createPayload = config.buildCreatePayload
          ? config.buildCreatePayload(session.draft as never, payloadContext)
          : buildCreatePayload(session.draft as Record<string, unknown>, config.editableKeys as readonly string[]);
        const created = await config.create(createPayload);
        const createdId = config.getCreatedId?.(created as never) ?? '';
        endSession();
        setDataVersion((version) => version + 1);
        return { ok: true, created: { type: target.type, id: createdId } };
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : 'Errore durante il salvataggio.');
        return { ok: false };
      } finally {
        setSaving(false);
      }
    }

    const payload = config.buildUpdatePayload
      ? config.buildUpdatePayload(primaryChanges, payloadContext)
      : { ...primaryChanges };
    const hasFieldChanges = Object.keys(payload).length > 0;
    // Nothing changed (neither fields nor a sub-editor): just close the session.
    if (!hasFieldChanges && !extraDirty) {
      endSession();
      return { ok: true };
    }

    setSaving(true);
    setSaveError(null);
    try {
      if (hasFieldChanges) await config.update(target.id, payload);
      // Persist any registered sub-editors (e.g. work order item edits).
      for (const hook of saveHooksRef.current) {
        await hook();
      }
      endSession();
      setDataVersion((version) => version + 1);
      return { ok: true };
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Errore durante il salvataggio.');
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }, [endSession, extraDirty, payloadContext, primaryChanges, session]);

  const value: EntityEditValue = {
    editing,
    mode,
    editTarget,
    saving,
    saveError,
    invalidFields,
    isDirty,
    dataVersion,
    clientDraft,
    clientOrthopedicDraft,
    doctorDraft,
    healthCompanyDraft,
    productDraft,
    quoteDraft,
    quoteItemDrafts,
    workOrderDraft,
    ...startActions,
    ...seedActions,
    ...fieldActions,
    addQuoteItemDraft,
    removeQuoteItemDraft,
    cancel: endSession,
    save,
    registerSaveHook,
    markExtraDirty,
  };

  return <EntityEditContext.Provider value={value}>{children}</EntityEditContext.Provider>;
}

export function useEntityEdit() {
  const ctx = useContext(EntityEditContext);
  if (!ctx) throw new Error('useEntityEdit must be used inside EntityEditProvider');
  return ctx;
}
