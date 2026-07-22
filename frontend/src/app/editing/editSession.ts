import type { ClientOrthopedic } from '../../features/clients/types';
import { diffClientOrthopedic } from '../../features/clients/editing';
import { changeQuoteDraft } from '../../features/quotes/editing';
import type { QuoteItemDraft } from '../../features/quotes/types';
import { editOperationsFor, editRegistry } from './editRegistry';
import {
  diffDraft,
  type EditMode,
  type EditTarget,
  type EntityDraftMap,
  type EntityEditOperations,
  type EntityKind,
  type SaveResult,
} from './types';

type DraftPair<T> = { draft: T; original: T };
type BaseSession<K extends EntityKind> = {
  type: K;
  id: string;
  mode: EditMode;
  draft: EntityDraftMap[K] | null;
  original: EntityDraftMap[K] | null;
  invalidFields: Array<keyof EntityDraftMap[K]>;
};

export type WorkOrderItemsParticipant = {
  dirty: boolean;
  reset: () => void;
  save: () => Promise<void>;
};

export type EditSessionMap = {
  client: BaseSession<'client'> & { orthopedic: DraftPair<ClientOrthopedic> | null };
  doctor: BaseSession<'doctor'>;
  healthCompany: BaseSession<'healthCompany'>;
  product: BaseSession<'product'>;
  quote: BaseSession<'quote'> & { items: QuoteItemDraft[] };
  workOrder: BaseSession<'workOrder'> & { items: WorkOrderItemsParticipant | null };
};
export type EditSession = EditSessionMap[EntityKind];

export type SupplementalEditAction =
  | { type: 'seed-client-orthopedic'; draft: ClientOrthopedic }
  | { type: 'change-client-orthopedic'; key: keyof ClientOrthopedic; value: string }
  | { type: 'add-quote-item'; draft: QuoteItemDraft }
  | { type: 'remove-quote-item'; index: number }
  | { type: 'set-work-order-items'; participant: WorkOrderItemsParticipant | null };

export type SavePreparation =
  | { kind: 'invalid'; fields: string[]; error: string }
  | { kind: 'empty' }
  | { kind: 'persist'; execute: () => Promise<SaveResult> };

const clone = <T extends object>(value: T): T => ({ ...value });

function sessionExtras(type: EntityKind) {
  if (type === 'client') return { orthopedic: null };
  if (type === 'quote') return { items: [] };
  if (type === 'workOrder') return { items: null };
  return {};
}

export function startSession<K extends EntityKind>(
  target: Extract<EditTarget, { type: K }>,
  mode: EditMode,
  initialValues?: Partial<EntityDraftMap[K]>,
): EditSession {
  const operations = editOperationsFor(target.type);
  const emptyDraft = mode === 'create' ? (operations.emptyDraft?.() ?? null) : null;
  const draft = emptyDraft && initialValues ? { ...emptyDraft, ...initialValues } : emptyDraft;
  return {
    ...target,
    mode,
    draft,
    original: draft ? clone(draft) : null,
    invalidFields: [],
    ...sessionExtras(target.type),
  } as EditSession;
}

/** Narrow the active session once for feature-owned editor hooks. */
export function sessionFor<K extends EntityKind>(
  session: EditSession | null,
  type: K,
): EditSessionMap[K] | null {
  return session?.type === type ? (session as EditSessionMap[K]) : null;
}

export function seedSession<K extends EntityKind>(
  session: EditSession | null,
  type: K,
  draft: EntityDraftMap[K],
): EditSession | null {
  const active = sessionFor(session, type);
  if (!active || active.draft) return session;
  return { ...active, draft: clone(draft), original: clone(draft) } as EditSession;
}

export function changeSession<K extends EntityKind>(
  session: EditSession | null,
  type: K,
  key: keyof EntityDraftMap[K],
  value: string,
): EditSession | null {
  if (type === 'quote') {
    const quote = sessionFor(session, 'quote');
    if (!quote?.draft) return session;
    const draft = changeQuoteDraft(quote.draft, key as keyof EntityDraftMap['quote'], value);
    return draft
      ? {
          ...quote,
          draft,
          invalidFields: quote.invalidFields.filter((field) => field !== key),
        }
      : session;
  }

  const active = sessionFor(session, type);
  if (!active?.draft) return session;
  return {
    ...active,
    draft: { ...active.draft, [key]: value },
    invalidFields: active.invalidFields.filter((field) => field !== key),
  } as EditSession;
}

export function applySupplement(
  session: EditSession | null,
  action: SupplementalEditAction,
): EditSession | null {
  switch (action.type) {
    case 'seed-client-orthopedic':
      return session?.type === 'client' && !session.orthopedic
        ? {
            ...session,
            orthopedic: { draft: clone(action.draft), original: clone(action.draft) },
          }
        : session;
    case 'change-client-orthopedic':
      return session?.type === 'client' && session.orthopedic
        ? {
            ...session,
            orthopedic: {
              ...session.orthopedic,
              draft: { ...session.orthopedic.draft, [action.key]: action.value },
            },
          }
        : session;
    case 'add-quote-item':
      return session?.type === 'quote'
        ? { ...session, items: [...session.items, action.draft] }
        : session;
    case 'remove-quote-item':
      return session?.type === 'quote'
        ? { ...session, items: session.items.filter((_, index) => index !== action.index) }
        : session;
    case 'set-work-order-items':
      return session?.type === 'workOrder' ? { ...session, items: action.participant } : session;
  }
}

function primaryChanges<K extends EntityKind>(
  session: BaseSession<K>,
  operations: EntityEditOperations<K>,
) {
  return diffDraft<EntityDraftMap[K], keyof EntityDraftMap[K]>(
    session.draft,
    session.original,
    operations.editableKeys,
  );
}

function hasPrimaryChanges<K extends EntityKind>(
  session: BaseSession<K>,
  operations: EntityEditOperations<K>,
) {
  return Object.keys(primaryChanges(session, operations)).length > 0;
}

function orthopedicChanges(session: EditSessionMap['client']) {
  return diffClientOrthopedic(
    session.orthopedic?.draft ?? null,
    session.orthopedic?.original ?? null,
  );
}

function requiredFieldError<T extends object>(draft: T | null, requiredKeys: readonly (keyof T)[]) {
  const fields = requiredKeys.filter((key) => !String(draft?.[key] ?? '').trim()).map(String);
  return fields.length
    ? ({ kind: 'invalid', fields, error: 'Compila i campi obbligatori evidenziati.' } as const)
    : null;
}

export function isSessionDirty(session: EditSession | null): boolean {
  if (!session) return false;
  switch (session.type) {
    case 'client':
      return (
        hasPrimaryChanges(session, editRegistry.client) ||
        Object.keys(orthopedicChanges(session)).length > 0
      );
    case 'doctor':
      return hasPrimaryChanges(session, editRegistry.doctor);
    case 'healthCompany':
      return hasPrimaryChanges(session, editRegistry.healthCompany);
    case 'product':
      return hasPrimaryChanges(session, editRegistry.product);
    case 'quote':
      return hasPrimaryChanges(session, editRegistry.quote) || session.items.length > 0;
    case 'workOrder':
      return hasPrimaryChanges(session, editRegistry.workOrder) || Boolean(session.items?.dirty);
  }
}

function prepareEntitySave<K extends EntityKind>(
  session: BaseSession<K>,
  operations: EntityEditOperations<K>,
): SavePreparation {
  const draft: EntityDraftMap[K] | null = session.draft;

  if (session.mode === 'create') {
    const invalid = requiredFieldError(draft, operations.requiredKeys ?? []);
    if (invalid) return invalid;
    const create = operations.create;
    if (!create || !draft) {
      return { kind: 'invalid', fields: [], error: 'Creazione non supportata per questa entità.' };
    }
    return {
      kind: 'persist',
      execute: async () => ({
        ok: true,
        created: { type: session.type, id: await create(draft) } as EditTarget,
      }),
    };
  }

  const changes = primaryChanges(session, operations);
  if (Object.keys(changes).length === 0) return { kind: 'empty' };
  return {
    kind: 'persist',
    execute: async () => {
      await operations.update(session.id, changes);
      return { ok: true };
    },
  };
}

function prepareClientSave(session: EditSessionMap['client']): SavePreparation {
  if (session.mode === 'create') {
    return prepareEntitySave(session, editRegistry.client);
  }

  const generalChanges = primaryChanges(session, editRegistry.client);
  const orthopedic = orthopedicChanges(session);
  const hasGeneralChanges = Object.keys(generalChanges).length > 0;
  const hasOrthopedicChanges = Object.keys(orthopedic).length > 0;
  if (!hasGeneralChanges && !hasOrthopedicChanges) return { kind: 'empty' };

  return {
    kind: 'persist',
    execute: async () => {
      await editRegistry.client.update(session.id, generalChanges, orthopedic);
      return { ok: true };
    },
  };
}

function prepareQuoteSave(session: EditSessionMap['quote']): SavePreparation {
  if (session.mode !== 'create') {
    return prepareEntitySave(session, editRegistry.quote);
  }

  const draft = session.draft;
  const invalid = requiredFieldError(draft, editRegistry.quote.requiredKeys);
  if (invalid) return invalid;
  if (!draft) {
    return { kind: 'invalid', fields: [], error: 'Creazione non supportata per questa entità.' };
  }
  return {
    kind: 'persist',
    execute: async () => ({
      ok: true,
      created: {
        type: 'quote',
        id: await editRegistry.quote.create(draft, session.items),
      },
    }),
  };
}

function prepareWorkOrderSave(session: EditSessionMap['workOrder']): SavePreparation {
  if (session.mode === 'create') {
    return prepareEntitySave(session, editRegistry.workOrder);
  }

  const changes = primaryChanges(session, editRegistry.workOrder);
  const hasFields = Object.keys(changes).length > 0;
  const participant = session.items;
  if (!hasFields && !participant?.dirty) return { kind: 'empty' };
  return {
    kind: 'persist',
    execute: async () => {
      if (hasFields) await editRegistry.workOrder.update(session.id, changes);
      if (participant?.dirty) await participant.save();
      return { ok: true };
    },
  };
}

export function prepareSessionSave(session: EditSession): SavePreparation {
  switch (session.type) {
    case 'client':
      return prepareClientSave(session);
    case 'doctor':
      return prepareEntitySave(session, editRegistry.doctor);
    case 'healthCompany':
      return prepareEntitySave(session, editRegistry.healthCompany);
    case 'product':
      return prepareEntitySave(session, editRegistry.product);
    case 'quote':
      return prepareQuoteSave(session);
    case 'workOrder':
      return prepareWorkOrderSave(session);
  }
}

export function withInvalidFields(session: EditSession, fields: string[]): EditSession {
  return { ...session, invalidFields: fields } as EditSession;
}

export function resetSessionParticipant(session: EditSession | null) {
  if (session?.type === 'workOrder') session.items?.reset();
}
