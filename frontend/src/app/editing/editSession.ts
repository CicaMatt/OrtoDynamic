import type { ClientOrthopedic } from '../../features/clients/types';
import { diffClientOrthopedic } from '../../features/clients/editing';
import { changeQuoteDraft } from '../../features/quotes/editing';
import type { QuoteItemDraft } from '../../features/quotes/types';
import { editOperationsFor, editRegistry } from './editRegistry';
import {
  diffDraft,
  type EditMode,
  type EditOperationContext,
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

const emptyContext: EditOperationContext = {
  clientOrthopedicChanges: {},
  quoteItemDrafts: [],
};
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

function hasPrimaryChanges<K extends EntityKind>(
  session: BaseSession<K>,
  operations: EntityEditOperations<K>,
) {
  return (
    Object.keys(
      diffDraft<EntityDraftMap[K], keyof EntityDraftMap[K]>(
        session.draft,
        session.original,
        operations.editableKeys,
      ),
    ).length > 0
  );
}

function orthopedicChanges(session: EditSessionMap['client']) {
  return diffClientOrthopedic(
    session.orthopedic?.draft ?? null,
    session.orthopedic?.original ?? null,
  );
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
  context: EditOperationContext,
): SavePreparation {
  const draft: EntityDraftMap[K] | null = session.draft;

  if (session.mode === 'create') {
    const missing = (operations.requiredKeys ?? []).filter(
      (key) => !String(draft?.[key] ?? '').trim(),
    );
    if (missing.length) {
      return {
        kind: 'invalid',
        fields: missing.map(String),
        error: 'Compila i campi obbligatori evidenziati.',
      };
    }
    const create = operations.create;
    if (!create || !draft) {
      return { kind: 'invalid', fields: [], error: 'Creazione non supportata per questa entità.' };
    }
    return {
      kind: 'persist',
      execute: async () => ({
        ok: true,
        created: { type: session.type, id: await create(draft, context) } as EditTarget,
      }),
    };
  }

  const changes = diffDraft<EntityDraftMap[K], keyof EntityDraftMap[K]>(
    session.draft,
    session.original,
    operations.editableKeys,
  );
  if (Object.keys(changes).length === 0) return { kind: 'empty' };
  return {
    kind: 'persist',
    execute: async () => {
      await operations.update(session.id, changes, context);
      return { ok: true };
    },
  };
}

function prepareClientSave(session: EditSessionMap['client']): SavePreparation {
  const context: EditOperationContext = {
    ...emptyContext,
    clientOrthopedicChanges: orthopedicChanges(session),
  };
  if (session.mode === 'create') {
    return prepareEntitySave(session, editRegistry.client, context);
  }

  const generalChanges = diffDraft(
    session.draft,
    session.original,
    editRegistry.client.editableKeys,
  );
  const hasGeneralChanges = Object.keys(generalChanges).length > 0;
  const hasOrthopedicChanges = Object.keys(context.clientOrthopedicChanges).length > 0;
  if (!hasGeneralChanges && !hasOrthopedicChanges) return { kind: 'empty' };

  return {
    kind: 'persist',
    execute: async () => {
      await editRegistry.client.update(session.id, generalChanges, context);
      return { ok: true };
    },
  };
}

function prepareWorkOrderSave(session: EditSessionMap['workOrder']): SavePreparation {
  if (session.mode === 'create') {
    return prepareEntitySave(session, editRegistry.workOrder, emptyContext);
  }

  const changes = diffDraft(session.draft, session.original, editRegistry.workOrder.editableKeys);
  const hasFields = Object.keys(changes).length > 0;
  const participant = session.items;
  if (!hasFields && !participant?.dirty) return { kind: 'empty' };
  return {
    kind: 'persist',
    execute: async () => {
      if (hasFields) await editRegistry.workOrder.update(session.id, changes, emptyContext);
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
      return prepareEntitySave(session, editRegistry.doctor, emptyContext);
    case 'healthCompany':
      return prepareEntitySave(session, editRegistry.healthCompany, emptyContext);
    case 'product':
      return prepareEntitySave(session, editRegistry.product, emptyContext);
    case 'quote':
      return prepareEntitySave(session, editRegistry.quote, {
        ...emptyContext,
        quoteItemDrafts: session.items,
      });
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
