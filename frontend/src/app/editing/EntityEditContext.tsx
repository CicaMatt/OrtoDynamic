import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createClient, updateClient, type ClientUpdate } from '../../features/clients/api/clients';
import { createDoctor, updateDoctor, type DoctorUpdate } from '../../features/doctors/api/doctors';
import {
  createHealthCompany,
  updateHealthCompany,
  type HealthCompanyUpdate,
} from '../../features/healthCompanies/api/healthCompanies';
import { createProduct, updateProduct, type ProductUpdate } from '../../features/products/api/products';
import {
  createQuote,
  updateQuote,
  type QuoteCreatePayload,
  type QuoteUpdate,
} from '../../features/quotes/api/quotes';
import { toNullableNumber } from '../../features/quotes/components/quoteItemMath';
import { updateWorkOrder, type WorkOrderUpdate } from '../../features/workOrders/api/workOrders';
import type { Client, ClientOrthopedic } from '../../features/clients/types';
import type { Doctor } from '../../features/doctors/types';
import type { HealthCompany } from '../../features/healthCompanies/types';
import type { Product } from '../../features/products/types';
import type { Quote, QuoteItemDraft } from '../../features/quotes/types';
import type { WorkOrder } from '../../features/workOrders/types';

const EDITABLE_CLIENT_KEYS = [
  'name', 'surname', 'fiscalCode', 'gender', 'birthMunicipality', 'birthDate',
  'address', 'city', 'province', 'postalCode', 'country', 'phone', 'mobile', 'email',
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

const EDITABLE_HEALTH_COMPANY_KEYS = [
  'municipalityCode', 'municipality', 'regionCode', 'regionName', 'companyCode',
  'companyName', 'year', 'males', 'females', 'total', 'district',
] as const satisfies readonly (keyof HealthCompany)[];

const EDITABLE_PRODUCT_KEYS = [
  'code', 'description', 'price', 'year',
] as const satisfies readonly (keyof Product)[];

// `status` is intentionally excluded: it changes only through the guarded
// transition endpoint, never as a free-form field edit or on create.
const EDITABLE_QUOTE_KEYS = [
  'clientId', 'doctorId', 'quoteNumber', 'quoteType', 'creationDate', 'quoteDate',
  'total', 'entryBy', 'diagnosis', 'therapeuticProgram', 'detailedPrescription',
  'authorizationNumber', 'acceptanceDate', 'authorizationReceiptDate', 'expiryDays', 'maxExpiry',
  'measurementsOk', 'commissionsPaid', 'orderNumber', 'model', 'measurements', 'invoiceNumber',
  'quote', 'note', 'privateNote', 'finalNote',
] as const satisfies readonly (keyof Quote)[];

// `status` is intentionally excluded: it changes only through the status
// endpoint (the "Cambia Stato" action), never as a free-form field edit.
const EDITABLE_WORK_ORDER_KEYS = [
  'quoteId', 'clientId', 'creationDate', 'completionDate', 'deliveryDate',
  'cancellationDate', 'maxExpiry', 'clientTrial', 'clientTrialOutcome', 'clientTrialDate',
  'clientCheck', 'clientCheckOutcome', 'clientCheckDate', 'doctorSignature', 'technicalService',
  'serviceStatus', 'complaintReason', 'device', 'warranty', 'serviceDeliveryDate', 'testOutcome',
  'testOutcomeDate', 'serviceDoctorSignature', 'technicianSignature', 'interventionDescription',
  'technicalNotes',
] as const satisfies readonly (keyof WorkOrder)[];

export type EditTarget =
  | { type: 'client'; id: string }
  | { type: 'doctor'; id: string }
  | { type: 'healthCompany'; id: string }
  | { type: 'product'; id: string }
  | { type: 'quote'; id: string }
  | { type: 'workOrder'; id: string };

export type EntityKind = EditTarget['type'];

/** `edit` updates an existing record; `create` inserts a new one. */
export type EditMode = 'edit' | 'create';

/** Result of a save: `created` is set only when a new record was inserted. */
export type SaveResult = { ok: boolean; created?: { type: EntityKind; id: string } };

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

function diff<T extends object>(draft: T | null, original: T | null, keys: readonly (keyof T)[]) {
  const changes: Record<string, unknown> = {};
  if (!draft || !original) return changes;
  for (const key of keys) {
    if (draft[key] !== original[key]) changes[key as string] = draft[key];
  }
  return changes;
}

/** Collect the given keys from a draft into a full (non-diff) payload, for creation. */
function buildCreatePayload<T extends object>(
  draft: T | null,
  keys: readonly (keyof T)[],
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  if (!draft) return payload;
  for (const key of keys) payload[key as string] = draft[key];
  return payload;
}

/** A blank client used to seed the creation form. */
function makeEmptyClient(): Client {
  return {
    idClient: '', name: '', surname: '', fiscalCode: '', phone: '', mobile: '', email: '',
    birthDate: '', birthMunicipality: '', address: '', city: '', province: '', postalCode: '',
    country: '', district: '', doctorId: '', gender: '', note: '',
  };
}

/** A blank doctor used to seed the creation form. */
function makeEmptyDoctor(): Doctor {
  return { idDoctor: '', surname: '', name: '', address: '', phone: '', email: '', note: '' };
}

/** A blank health company used to seed the creation form. */
function makeEmptyHealthCompany(): HealthCompany {
  return {
    idHealthCompany: '', municipalityCode: '', municipality: '', regionCode: '', regionName: '',
    companyCode: '', companyName: '', year: '', males: '', females: '', total: '', district: '',
  };
}

/** A blank product used to seed the creation form. */
function makeEmptyProduct(): Product {
  return { idProduct: '', code: '', description: '', price: '', year: '' };
}

/** A blank quote used to seed the creation form (status is server-assigned). */
function makeEmptyQuote(): Quote {
  return {
    idQuote: '', clientId: '', doctorId: '', clientName: '', doctorName: '', quoteNumber: '', quoteType: '', status: '',
    creationDate: '', quoteDate: '', total: '', entryBy: '', diagnosis: '',
    therapeuticProgram: '', detailedPrescription: '', authorizationNumber: '',
    acceptanceDate: '', authorizationReceiptDate: '', expiryDays: '', maxExpiry: '',
    measurementsOk: '', commissionsPaid: '', orderNumber: '', model: '', measurements: '',
    invoiceNumber: '', quote: '', note: '', privateNote: '', finalNote: '',
  };
}

/** Shared client conversions: blank birth date → null, doctor id → number/null. */
function normalizeClientPayload(payload: ClientUpdate): ClientUpdate {
  if (payload.birthDate === '') payload.birthDate = null;
  if ('doctorId' in payload) {
    payload.doctorId = payload.doctorId === '' ? null : Number(payload.doctorId);
  }
  return payload;
}

export function EntityEditProvider({ children }: { children: ReactNode }) {
  const [editing, setEditing] = useState(false);
  const [mode, setMode] = useState<EditMode>('edit');
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [clientDraft, setClientDraft] = useState<Client | null>(null);
  const [clientOriginal, setClientOriginal] = useState<Client | null>(null);
  const [clientOrthopedicDraft, setClientOrthopedicDraft] = useState<ClientOrthopedic | null>(null);
  const [clientOrthopedicOriginal, setClientOrthopedicOriginal] = useState<ClientOrthopedic | null>(null);
  const [doctorDraft, setDoctorDraft] = useState<Doctor | null>(null);
  const [doctorOriginal, setDoctorOriginal] = useState<Doctor | null>(null);
  const [healthCompanyDraft, setHealthCompanyDraft] = useState<HealthCompany | null>(null);
  const [healthCompanyOriginal, setHealthCompanyOriginal] = useState<HealthCompany | null>(null);
  const [productDraft, setProductDraft] = useState<Product | null>(null);
  const [productOriginal, setProductOriginal] = useState<Product | null>(null);
  const [quoteDraft, setQuoteDraft] = useState<Quote | null>(null);
  const [quoteOriginal, setQuoteOriginal] = useState<Quote | null>(null);
  const [quoteItemDrafts, setQuoteItemDrafts] = useState<QuoteItemDraft[]>([]);
  const [workOrderDraft, setWorkOrderDraft] = useState<WorkOrder | null>(null);
  const [workOrderOriginal, setWorkOrderOriginal] = useState<WorkOrder | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [dataVersion, setDataVersion] = useState(0);
  // Sub-editors (e.g. work order items) that persist as part of the next save.
  const saveHooksRef = useRef<Set<() => Promise<void>>>(new Set());
  const [extraDirty, setExtraDirty] = useState(false);

  const registerSaveHook = useCallback((hook: () => Promise<void>) => {
    saveHooksRef.current.add(hook);
    return () => {
      saveHooksRef.current.delete(hook);
    };
  }, []);

  const markExtraDirty = useCallback((dirty: boolean) => setExtraDirty(dirty), []);

  const reset = useCallback(() => {
    setClientDraft(null);
    setClientOriginal(null);
    setClientOrthopedicDraft(null);
    setClientOrthopedicOriginal(null);
    setDoctorDraft(null);
    setDoctorOriginal(null);
    setHealthCompanyDraft(null);
    setHealthCompanyOriginal(null);
    setProductDraft(null);
    setProductOriginal(null);
    setQuoteDraft(null);
    setQuoteOriginal(null);
    setQuoteItemDrafts([]);
    setWorkOrderDraft(null);
    setWorkOrderOriginal(null);
    setMode('edit');
    setRequiredFields([]);
    setInvalidFields([]);
    setSaveError(null);
    setExtraDirty(false);
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

  const startClientCreate = useCallback(
    (requiredKeys: ReadonlyArray<keyof Client>) => {
      reset();
      const empty = makeEmptyClient();
      setClientDraft(empty);
      setClientOriginal(empty);
      setRequiredFields(requiredKeys.map(String));
      setMode('create');
      setEditTarget({ type: 'client', id: '' });
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

  const startDoctorCreate = useCallback(
    (requiredKeys: ReadonlyArray<keyof Doctor>) => {
      reset();
      const empty = makeEmptyDoctor();
      setDoctorDraft(empty);
      setDoctorOriginal(empty);
      setRequiredFields(requiredKeys.map(String));
      setMode('create');
      setEditTarget({ type: 'doctor', id: '' });
      setEditing(true);
    },
    [reset],
  );

  const startHealthCompanyEdit = useCallback(
    (id: string) => {
      reset();
      setEditTarget({ type: 'healthCompany', id });
      setEditing(true);
    },
    [reset],
  );

  const startHealthCompanyCreate = useCallback(
    (requiredKeys: ReadonlyArray<keyof HealthCompany>) => {
      reset();
      const empty = makeEmptyHealthCompany();
      setHealthCompanyDraft(empty);
      setHealthCompanyOriginal(empty);
      setRequiredFields(requiredKeys.map(String));
      setMode('create');
      setEditTarget({ type: 'healthCompany', id: '' });
      setEditing(true);
    },
    [reset],
  );

  const startProductEdit = useCallback(
    (id: string) => {
      reset();
      setEditTarget({ type: 'product', id });
      setEditing(true);
    },
    [reset],
  );

  const startProductCreate = useCallback(
    (requiredKeys: ReadonlyArray<keyof Product>) => {
      reset();
      const empty = makeEmptyProduct();
      setProductDraft(empty);
      setProductOriginal(empty);
      setRequiredFields(requiredKeys.map(String));
      setMode('create');
      setEditTarget({ type: 'product', id: '' });
      setEditing(true);
    },
    [reset],
  );

  const startQuoteEdit = useCallback(
    (id: string) => {
      reset();
      setEditTarget({ type: 'quote', id });
      setEditing(true);
    },
    [reset],
  );

  const startQuoteCreate = useCallback(
    (requiredKeys: ReadonlyArray<keyof Quote>) => {
      reset();
      const empty = makeEmptyQuote();
      setQuoteDraft(empty);
      setQuoteOriginal(empty);
      setRequiredFields(requiredKeys.map(String));
      setMode('create');
      setEditTarget({ type: 'quote', id: '' });
      setEditing(true);
    },
    [reset],
  );

  const startWorkOrderEdit = useCallback(
    (id: string) => {
      reset();
      setEditTarget({ type: 'workOrder', id });
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

  const seedHealthCompany = useCallback((company: HealthCompany) => {
    setHealthCompanyDraft((prev) => prev ?? { ...company });
    setHealthCompanyOriginal((prev) => prev ?? { ...company });
  }, []);

  const seedProduct = useCallback((product: Product) => {
    setProductDraft((prev) => prev ?? { ...product });
    setProductOriginal((prev) => prev ?? { ...product });
  }, []);

  const seedQuote = useCallback((quote: Quote) => {
    setQuoteDraft((prev) => prev ?? { ...quote });
    setQuoteOriginal((prev) => prev ?? { ...quote });
  }, []);

  const seedWorkOrder = useCallback((workOrder: WorkOrder) => {
    setWorkOrderDraft((prev) => prev ?? { ...workOrder });
    setWorkOrderOriginal((prev) => prev ?? { ...workOrder });
  }, []);

  const setClientField = useCallback((key: keyof Client, value: string) => {
    setClientDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
    setInvalidFields((prev) => (prev.length ? prev.filter((k) => k !== key) : prev));
  }, []);

  const setClientOrthopedicField = useCallback((key: keyof ClientOrthopedic, value: string) => {
    setClientOrthopedicDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const setDoctorField = useCallback((key: keyof Doctor, value: string) => {
    setDoctorDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
    setInvalidFields((prev) => (prev.length ? prev.filter((k) => k !== key) : prev));
  }, []);

  const setHealthCompanyField = useCallback((key: keyof HealthCompany, value: string) => {
    setHealthCompanyDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
    setInvalidFields((prev) => (prev.length ? prev.filter((k) => k !== key) : prev));
  }, []);

  const setProductField = useCallback((key: keyof Product, value: string) => {
    setProductDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
    setInvalidFields((prev) => (prev.length ? prev.filter((k) => k !== key) : prev));
  }, []);

  const setQuoteField = useCallback((key: keyof Quote, value: string) => {
    setQuoteDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
    setInvalidFields((prev) => (prev.length ? prev.filter((k) => k !== key) : prev));
  }, []);

  const addQuoteItemDraft = useCallback((draft: QuoteItemDraft) => {
    setQuoteItemDrafts((prev) => [...prev, draft]);
  }, []);

  const removeQuoteItemDraft = useCallback((index: number) => {
    setQuoteItemDrafts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const setWorkOrderField = useCallback((key: keyof WorkOrder, value: string) => {
    setWorkOrderDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
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
  const healthCompanyChanges = useMemo(
    () => diff(healthCompanyDraft, healthCompanyOriginal, EDITABLE_HEALTH_COMPANY_KEYS),
    [healthCompanyDraft, healthCompanyOriginal],
  );
  const productChanges = useMemo(
    () => diff(productDraft, productOriginal, EDITABLE_PRODUCT_KEYS),
    [productDraft, productOriginal],
  );
  const quoteChanges = useMemo(
    () => diff(quoteDraft, quoteOriginal, EDITABLE_QUOTE_KEYS),
    [quoteDraft, quoteOriginal],
  );
  const workOrderChanges = useMemo(
    () => diff(workOrderDraft, workOrderOriginal, EDITABLE_WORK_ORDER_KEYS),
    [workOrderDraft, workOrderOriginal],
  );
  const isDirty =
    extraDirty ||
    Object.keys(clientChanges).length > 0 ||
    Object.keys(clientOrthopedicChanges).length > 0 ||
    Object.keys(doctorChanges).length > 0 ||
    Object.keys(healthCompanyChanges).length > 0 ||
    Object.keys(productChanges).length > 0 ||
    Object.keys(quoteChanges).length > 0 ||
    quoteItemDrafts.length > 0 ||
    Object.keys(workOrderChanges).length > 0;

  const save = useCallback(async (): Promise<SaveResult> => {
    if (!editTarget) return { ok: true };

    if (mode === 'create') {
      const draft = (
        editTarget.type === 'client'
          ? clientDraft
          : editTarget.type === 'doctor'
            ? doctorDraft
            : editTarget.type === 'healthCompany'
              ? healthCompanyDraft
              : editTarget.type === 'product'
                ? productDraft
                : editTarget.type === 'quote'
                  ? quoteDraft
                  : null
      ) as Record<string, unknown> | null;

      const missing = requiredFields.filter((key) => !String(draft?.[key] ?? '').trim());
      if (missing.length > 0) {
        setInvalidFields(missing);
        setSaveError('Compila i campi obbligatori evidenziati.');
        return { ok: false };
      }

      setSaving(true);
      setSaveError(null);
      try {
        let createdId: string;
        if (editTarget.type === 'client') {
          const created = await createClient(
            normalizeClientPayload(buildCreatePayload(clientDraft, EDITABLE_CLIENT_KEYS) as ClientUpdate),
          );
          createdId = created.idClient;
        } else if (editTarget.type === 'doctor') {
          const created = await createDoctor(
            buildCreatePayload(doctorDraft, EDITABLE_DOCTOR_KEYS) as DoctorUpdate,
          );
          createdId = created.idDoctor;
        } else if (editTarget.type === 'healthCompany') {
          const created = await createHealthCompany(
            normalizeHealthCompanyPayload(
              buildCreatePayload(healthCompanyDraft, EDITABLE_HEALTH_COMPANY_KEYS) as HealthCompanyUpdate,
            ),
          );
          createdId = created.idHealthCompany;
        } else if (editTarget.type === 'product') {
          const created = await createProduct(
            normalizeProductPayload(buildCreatePayload(productDraft, EDITABLE_PRODUCT_KEYS) as ProductUpdate),
          );
          createdId = created.idProduct;
        } else if (editTarget.type === 'quote') {
          const created = await createQuote(buildQuoteCreatePayload(quoteDraft, quoteItemDrafts));
          createdId = created.idQuote;
        } else {
          setSaveError('Creazione non supportata per questa entità.');
          return { ok: false };
        }
        endSession();
        setDataVersion((v) => v + 1);
        return { ok: true, created: { type: editTarget.type, id: createdId } };
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : 'Errore durante il salvataggio.');
        return { ok: false };
      } finally {
        setSaving(false);
      }
    }

    const payload = buildPayload(editTarget, {
      clientChanges,
      clientOrthopedicChanges,
      doctorChanges,
      healthCompanyChanges,
      productChanges,
      quoteChanges,
      workOrderChanges,
    });
    const hasFieldChanges = Object.keys(payload).length > 0;
    // Nothing changed (neither fields nor a sub-editor): just close the session.
    if (!hasFieldChanges && !extraDirty) {
      endSession();
      return { ok: true };
    }
    if (hasFieldChanges && editTarget.type === 'client') {
      normalizeClientPayload(payload as ClientUpdate);
    }

    setSaving(true);
    setSaveError(null);
    try {
      if (hasFieldChanges) {
        if (editTarget.type === 'client') {
          await updateClient(editTarget.id, payload as ClientUpdate);
        } else if (editTarget.type === 'doctor') {
          await updateDoctor(editTarget.id, payload as DoctorUpdate);
        } else if (editTarget.type === 'healthCompany') {
          await updateHealthCompany(editTarget.id, payload as HealthCompanyUpdate);
        } else if (editTarget.type === 'product') {
          await updateProduct(editTarget.id, payload as ProductUpdate);
        } else if (editTarget.type === 'quote') {
          await updateQuote(editTarget.id, payload as QuoteUpdate);
        } else {
          await updateWorkOrder(editTarget.id, payload as WorkOrderUpdate);
        }
      }
      // Persist any registered sub-editors (e.g. work order item edits).
      for (const hook of saveHooksRef.current) {
        await hook();
      }
      endSession();
      setDataVersion((v) => v + 1);
      return { ok: true };
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Errore durante il salvataggio.');
      return { ok: false };
    } finally {
      setSaving(false);
    }
  }, [
    editTarget,
    mode,
    clientDraft,
    doctorDraft,
    healthCompanyDraft,
    productDraft,
    quoteDraft,
    quoteItemDrafts,
    requiredFields,
    clientChanges,
    clientOrthopedicChanges,
    doctorChanges,
    healthCompanyChanges,
    productChanges,
    quoteChanges,
    workOrderChanges,
    extraDirty,
    endSession,
  ]);

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
    startClientEdit,
    startClientCreate,
    startDoctorEdit,
    startDoctorCreate,
    startHealthCompanyEdit,
    startHealthCompanyCreate,
    startProductEdit,
    startProductCreate,
    startQuoteEdit,
    startQuoteCreate,
    startWorkOrderEdit,
    seedClient,
    seedClientOrthopedic,
    seedDoctor,
    seedHealthCompany,
    seedProduct,
    seedQuote,
    seedWorkOrder,
    setClientField,
    setClientOrthopedicField,
    setDoctorField,
    setHealthCompanyField,
    setProductField,
    setQuoteField,
    addQuoteItemDraft,
    removeQuoteItemDraft,
    setWorkOrderField,
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

function buildPayload(
  target: EditTarget,
  changes: {
    clientChanges: Record<string, unknown>;
    clientOrthopedicChanges: Record<string, unknown>;
    doctorChanges: Record<string, unknown>;
    healthCompanyChanges: Record<string, unknown>;
    productChanges: Record<string, unknown>;
    quoteChanges: Record<string, unknown>;
    workOrderChanges: Record<string, unknown>;
  },
) {
  if (target.type === 'client') {
    return { ...changes.clientChanges, ...changes.clientOrthopedicChanges } as ClientUpdate;
  }
  if (target.type === 'doctor') {
    return { ...changes.doctorChanges } as DoctorUpdate;
  }
  if (target.type === 'healthCompany') {
    return normalizeHealthCompanyPayload({ ...changes.healthCompanyChanges } as HealthCompanyUpdate);
  }
  if (target.type === 'product') {
    return normalizeProductPayload({ ...changes.productChanges } as ProductUpdate);
  }

  if (target.type === 'quote') {
    return buildQuotePayload(changes.quoteChanges);
  }

  return buildWorkOrderPayload(changes.workOrderChanges);
}

/** Normalize health-company edits/creates: blank year → null, otherwise numeric. */
function normalizeHealthCompanyPayload(payload: HealthCompanyUpdate): HealthCompanyUpdate {
  if (payload.year === '') payload.year = null;
  if ('year' in payload && payload.year !== null) payload.year = Number(payload.year);
  return payload;
}

/** Normalize product edits/creates: blank year/price → null, price otherwise numeric. */
function normalizeProductPayload(payload: ProductUpdate): ProductUpdate {
  if (payload.year === '') payload.year = null;
  if (payload.price === '') payload.price = null;
  if ('price' in payload && payload.price !== null) payload.price = Number(payload.price);
  return payload;
}

/** Blank a set of date keys to null (native date inputs emit '', which the API rejects). */
function blankDatesToNull(payload: Record<string, unknown>, dateKeys: readonly string[]) {
  for (const key of dateKeys) {
    if (payload[key] === '') payload[key] = null;
  }
}

const QUOTE_DATE_KEYS = ['creationDate', 'quoteDate', 'acceptanceDate', 'authorizationReceiptDate'];

/** Normalize quote edits: blank dates/numbers become null, FK ids become numbers. */
function buildQuotePayload(quoteChanges: Record<string, unknown>): QuoteUpdate {
  const payload = { ...quoteChanges } as QuoteUpdate;
  blankDatesToNull(payload, QUOTE_DATE_KEYS);
  if ('clientId' in payload) {
    payload.clientId = payload.clientId === '' ? null : Number(payload.clientId);
  }
  if ('doctorId' in payload) {
    payload.doctorId = payload.doctorId === '' ? null : Number(payload.doctorId);
  }
  if ('total' in payload) {
    payload.total = payload.total === '' ? null : Number(payload.total);
  }
  return payload;
}

/**
 * Full create payload for a new quote, plus any pending line items. `status` is
 * not an editable field — the server assigns it (INSERITO) — so it is simply
 * absent. Blank dates/numbers become null and FK ids become numbers, reusing the
 * edit normalization. Items carry only the client-controlled inputs (the product
 * and the typed quantity/discount); prezzo and importo are derived server-side.
 * The `items` key is omitted when there are none, so quotes without lines send
 * exactly as before.
 */
function buildQuoteCreatePayload(
  draft: Quote | null,
  itemDrafts: QuoteItemDraft[],
): QuoteCreatePayload {
  const payload: QuoteCreatePayload = buildQuotePayload(buildCreatePayload(draft, EDITABLE_QUOTE_KEYS));
  const items = itemDrafts
    .filter((item) => item.productId.trim() !== '')
    .map((item) => ({
      productId: Number(item.productId),
      quantity: toNullableNumber(item.quantity),
      discount: toNullableNumber(item.discount),
    }));
  if (items.length > 0) payload.items = items;
  return payload;
}

const WORK_ORDER_DATE_KEYS = [
  'creationDate', 'completionDate', 'deliveryDate', 'cancellationDate', 'clientTrialDate',
  'clientCheckDate', 'serviceDeliveryDate', 'testOutcomeDate',
];

/** Normalize work-order edits: blank dates become null, FK ids become numbers. */
function buildWorkOrderPayload(workOrderChanges: Record<string, unknown>): WorkOrderUpdate {
  const payload = { ...workOrderChanges } as WorkOrderUpdate;
  blankDatesToNull(payload, WORK_ORDER_DATE_KEYS);
  if ('quoteId' in payload) {
    payload.quoteId = payload.quoteId === '' ? null : Number(payload.quoteId);
  }
  if ('clientId' in payload) {
    payload.clientId = payload.clientId === '' ? null : Number(payload.clientId);
  }
  return payload;
}
