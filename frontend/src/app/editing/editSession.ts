import type { ClientOrthopedic } from '../../features/clients/types';
import type { QuoteItemDraft } from '../../features/quotes/types';
import { editConfigFor, editRegistry } from './editRegistry';
import {
  buildCreatePayload,
  diffDraft,
  type EditMode,
  type EditPayloadContext,
  type EntityDraftMap,
  type EntityKind,
  type EditTarget,
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

const emptyContext: EditPayloadContext = { clientOrthopedicChanges: {}, quoteItemDrafts: [] };
const clone = <T extends object>(value: T): T => ({ ...value });

function sessionExtras(type: EntityKind) {
  if (type === 'client') return { orthopedic: null };
  if (type === 'quote') return { items: [] };
  if (type === 'workOrder') return { items: null };
  return {};
}

export function startSession(target: EditTarget, mode: EditMode): EditSession {
  const config = editConfigFor(target.type);
  const draft = mode === 'create' ? (config.makeEmptyDraft?.() ?? null) : null;
  return {
    ...target,
    mode,
    draft,
    original: draft ? clone(draft) : null,
    invalidFields: [],
    ...sessionExtras(target.type),
  } as EditSession;
}

/** Narrow the session once for feature-owned editor hooks. */
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
  const active = sessionFor(session, type);
  if (!active?.draft) return session;
  const config = editConfigFor(type);
  const current = active.draft;
  const draft = config.applyFieldChange
    ? config.applyFieldChange(current, key, value)
    : { ...current, [key]: value };
  return draft
    ? ({
        ...active,
        draft,
        invalidFields: active.invalidFields.filter((field) => field !== key),
      } as EditSession)
    : session;
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

function primaryChanges(session: EditSession) {
  const config = editConfigFor(session.type);
  return diffDraft(session.draft, session.original, config.editableKeys);
}

function orthopedicChanges(session: EditSessionMap['client']) {
  return diffDraft(
    session.orthopedic?.draft ?? null,
    session.orthopedic?.original ?? null,
    editRegistry.client.clientOrthopedicEditableKeys ?? [],
  );
}

function payloadContext(session: EditSession): EditPayloadContext {
  if (session.type === 'client') {
    return { ...emptyContext, clientOrthopedicChanges: orthopedicChanges(session) };
  }
  if (session.type === 'quote') return { ...emptyContext, quoteItemDrafts: session.items };
  return emptyContext;
}

export function isSessionDirty(session: EditSession | null): boolean {
  if (!session) return false;
  if (Object.keys(primaryChanges(session)).length > 0) return true;
  if (session.type === 'client') return Object.keys(orthopedicChanges(session)).length > 0;
  if (session.type === 'quote') return session.items.length > 0;
  return session.type === 'workOrder' && Boolean(session.items?.dirty);
}

export function prepareSessionSave(session: EditSession): SavePreparation {
  const config = editConfigFor(session.type);
  const context = payloadContext(session);
  const draft = session.draft;

  if (session.mode === 'create') {
    const missing = (config.requiredKeys ?? []).filter(
      (key) => !String(draft ? Reflect.get(draft, key) : '').trim(),
    );
    if (missing.length) {
      return {
        kind: 'invalid',
        fields: missing.map(String),
        error: 'Compila i campi obbligatori evidenziati.',
      };
    }
    if (!config.create || !draft) {
      return { kind: 'invalid', fields: [], error: 'Creazione non supportata per questa entità.' };
    }
    const create = config.create;
    return {
      kind: 'persist',
      execute: async () => {
        const payload = config.buildCreatePayload
          ? config.buildCreatePayload(draft, context)
          : buildCreatePayload(draft, config.editableKeys);
        const created = await create(payload);
        return {
          ok: true,
          created: { type: session.type, id: config.getCreatedId?.(created) ?? '' },
        };
      },
    };
  }

  const changes = primaryChanges(session);
  const payload = config.buildUpdatePayload ? config.buildUpdatePayload(changes, context) : changes;
  const participant = session.type === 'workOrder' ? session.items : null;
  const hasFields = Object.keys(payload).length > 0;
  if (!hasFields && !participant?.dirty) return { kind: 'empty' };
  return {
    kind: 'persist',
    execute: async () => {
      if (hasFields) await config.update(session.id, payload);
      if (participant?.dirty) await participant.save();
      return { ok: true };
    },
  };
}

export function withInvalidFields(session: EditSession, fields: string[]): EditSession {
  return { ...session, invalidFields: fields } as EditSession;
}

export function resetSessionParticipant(session: EditSession | null) {
  if (session?.type === 'workOrder') session.items?.reset();
}
