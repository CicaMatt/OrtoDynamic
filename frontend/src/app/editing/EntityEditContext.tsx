import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { updateClient, type ClientUpdate } from '../../features/clients/api/clients';
import { updateDoctor, type DoctorUpdate } from '../../features/doctors/api/doctors';
import {
  updateHealthCompany,
  type HealthCompanyUpdate,
} from '../../features/healthCompanies/api/healthCompanies';
import { updateProduct, type ProductUpdate } from '../../features/products/api/products';
import { updateQuote, type QuoteUpdate } from '../../features/quotes/api/quotes';
import { updateWorkOrder, type WorkOrderUpdate } from '../../features/workOrders/api/workOrders';
import type { Client, ClientOrthopedic } from '../../features/clients/types';
import type { Doctor } from '../../features/doctors/types';
import type { HealthCompany } from '../../features/healthCompanies/types';
import type { Product } from '../../features/products/types';
import type { Quote } from '../../features/quotes/types';
import type { WorkOrder } from '../../features/workOrders/types';

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

const EDITABLE_HEALTH_COMPANY_KEYS = [
  'municipalityCode', 'municipality', 'regionCode', 'regionName', 'companyCode',
  'companyName', 'year', 'males', 'females', 'total', 'district',
] as const satisfies readonly (keyof HealthCompany)[];

const EDITABLE_PRODUCT_KEYS = [
  'code', 'description', 'price', 'year',
] as const satisfies readonly (keyof Product)[];

const EDITABLE_QUOTE_KEYS = [
  'clientId', 'doctorId', 'quoteNumber', 'quoteType', 'status', 'creationDate', 'quoteDate',
  'total', 'entryBy', 'diagnosis', 'therapeuticProgram', 'detailedPrescription',
  'authorizationNumber', 'acceptanceDate', 'authorizationReceiptDate', 'expiryDays', 'maxExpiry',
  'measurementsOk', 'commissionsPaid', 'orderNumber', 'model', 'measurements', 'invoiceNumber',
  'quote', 'note', 'privateNote', 'finalNote',
] as const satisfies readonly (keyof Quote)[];

const EDITABLE_WORK_ORDER_KEYS = [
  'quoteId', 'clientId', 'status', 'creationDate', 'completionDate', 'deliveryDate',
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
  healthCompanyDraft: HealthCompany | null;
  productDraft: Product | null;
  quoteDraft: Quote | null;
  workOrderDraft: WorkOrder | null;
  startClientEdit: (code: string) => void;
  startDoctorEdit: (id: string) => void;
  startHealthCompanyEdit: (id: string) => void;
  startProductEdit: (id: string) => void;
  startQuoteEdit: (id: string) => void;
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
  setWorkOrderField: (key: keyof WorkOrder, value: string) => void;
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
  const [healthCompanyDraft, setHealthCompanyDraft] = useState<HealthCompany | null>(null);
  const [healthCompanyOriginal, setHealthCompanyOriginal] = useState<HealthCompany | null>(null);
  const [productDraft, setProductDraft] = useState<Product | null>(null);
  const [productOriginal, setProductOriginal] = useState<Product | null>(null);
  const [quoteDraft, setQuoteDraft] = useState<Quote | null>(null);
  const [quoteOriginal, setQuoteOriginal] = useState<Quote | null>(null);
  const [workOrderDraft, setWorkOrderDraft] = useState<WorkOrder | null>(null);
  const [workOrderOriginal, setWorkOrderOriginal] = useState<WorkOrder | null>(null);
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
    setHealthCompanyDraft(null);
    setHealthCompanyOriginal(null);
    setProductDraft(null);
    setProductOriginal(null);
    setQuoteDraft(null);
    setQuoteOriginal(null);
    setWorkOrderDraft(null);
    setWorkOrderOriginal(null);
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

  const startHealthCompanyEdit = useCallback(
    (id: string) => {
      reset();
      setEditTarget({ type: 'healthCompany', id });
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

  const startQuoteEdit = useCallback(
    (id: string) => {
      reset();
      setEditTarget({ type: 'quote', id });
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
  }, []);

  const setClientOrthopedicField = useCallback((key: keyof ClientOrthopedic, value: string) => {
    setClientOrthopedicDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const setDoctorField = useCallback((key: keyof Doctor, value: string) => {
    setDoctorDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const setHealthCompanyField = useCallback((key: keyof HealthCompany, value: string) => {
    setHealthCompanyDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const setProductField = useCallback((key: keyof Product, value: string) => {
    setProductDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const setQuoteField = useCallback((key: keyof Quote, value: string) => {
    setQuoteDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
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
    Object.keys(clientChanges).length > 0 ||
    Object.keys(clientOrthopedicChanges).length > 0 ||
    Object.keys(doctorChanges).length > 0 ||
    Object.keys(healthCompanyChanges).length > 0 ||
    Object.keys(productChanges).length > 0 ||
    Object.keys(quoteChanges).length > 0 ||
    Object.keys(workOrderChanges).length > 0;

  const save = useCallback(async () => {
    if (!editTarget) return true;

    const payload = buildPayload(editTarget, {
      clientChanges,
      clientOrthopedicChanges,
      doctorChanges,
      healthCompanyChanges,
      productChanges,
      quoteChanges,
      workOrderChanges,
    });
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
      endSession();
      setDataVersion((v) => v + 1);
      return true;
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Errore durante il salvataggio.');
      return false;
    } finally {
      setSaving(false);
    }
  }, [
    editTarget,
    clientChanges,
    clientOrthopedicChanges,
    doctorChanges,
    healthCompanyChanges,
    productChanges,
    quoteChanges,
    workOrderChanges,
    endSession,
  ]);

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
    healthCompanyDraft,
    productDraft,
    quoteDraft,
    workOrderDraft,
    startClientEdit,
    startDoctorEdit,
    startHealthCompanyEdit,
    startProductEdit,
    startQuoteEdit,
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
    setWorkOrderField,
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
    const payload = { ...changes.healthCompanyChanges } as HealthCompanyUpdate;
    if (payload.year === '') payload.year = null;
    if ('year' in payload && payload.year !== null) payload.year = Number(payload.year);
    return payload;
  }
  if (target.type === 'product') {
    const payload = { ...changes.productChanges } as ProductUpdate;
    if (payload.year === '') payload.year = null;
    if (payload.price === '') payload.price = null;
    if ('price' in payload && payload.price !== null) payload.price = Number(payload.price);
    return payload;
  }

  if (target.type === 'quote') {
    return buildQuotePayload(changes.quoteChanges);
  }

  return buildWorkOrderPayload(changes.workOrderChanges);
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
