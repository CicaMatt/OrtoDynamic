import { useState } from 'react';
import { useApiData } from '../../../shared/hooks/useApiData';
import { createQuoteItem, deleteQuoteItem, fetchQuoteItems, updateQuoteItem } from '../api/quotes';
import { ItemDraftRow, ItemEditRow, NewItemButton } from '../components/QuoteItemRow';
import {
  PERSISTED_ITEM_COLUMN_LABELS,
  PersistedQuoteItemRow,
  QuoteItemsTable,
} from '../components/QuoteItemsTable';
import { draftFromItem, quoteItemDraftError, toNullableNumber } from '../components/quoteItemMath';
import { useQuoteItemDraft } from '../components/useQuoteItemDraft';
import type { QuoteItemDraft } from '../types';

/** State of the one line being edited inline: its id plus the working draft. */
type EditState = { id: string; draft: QuoteItemDraft };
type ItemsMessage = { content: string; tone?: 'error' };

/**
 * Persistence controller for an existing quote's items. Mutations are immediate,
 * then both the item list and the quote total are refreshed from the server.
 */
export function QuoteItemsCard({
  quoteId,
  total,
  onChanged,
}: {
  quoteId: string;
  total: string;
  onChanged?: () => void;
}) {
  const { data, loading, error, reload } = useApiData(() => fetchQuoteItems(quoteId), [quoteId]);
  const add = useQuoteItemDraft();
  const [edit, setEdit] = useState<EditState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const items = data ?? [];
  const busy = submitting || deletingId !== null;
  const idle = add.draft === null && edit === null && !busy;
  const canAdd = !loading && !error && idle;

  const reloadItems = () => {
    reload();
    onChanged?.();
  };

  const runItemMutation = async (operation: () => Promise<void>, fallbackError: string) => {
    setSubmitting(true);
    setActionError(null);
    try {
      await operation();
      reloadItems();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : fallbackError);
    } finally {
      setSubmitting(false);
    }
  };

  const setEditField = (key: keyof QuoteItemDraft, value: string) =>
    setEdit((current) =>
      current ? { ...current, draft: { ...current.draft, [key]: value } } : current,
    );

  const confirmAdd = async () => {
    const draft = add.draft;
    if (!draft || draft.productId.trim() === '') return;
    const invalid = quoteItemDraftError(draft);
    if (invalid) {
      setActionError(invalid);
      return;
    }

    await runItemMutation(async () => {
      await createQuoteItem(quoteId, {
        productId: Number(draft.productId),
        quantity: toNullableNumber(draft.quantity),
        discount: toNullableNumber(draft.discount),
      });
      add.clear();
    }, 'Creazione articolo non riuscita.');
  };

  const confirmEdit = async () => {
    if (!edit) return;
    const invalid = quoteItemDraftError(edit.draft);
    if (invalid) {
      setActionError(invalid);
      return;
    }

    await runItemMutation(async () => {
      await updateQuoteItem(quoteId, edit.id, {
        quantity: toNullableNumber(edit.draft.quantity),
        discount: toNullableNumber(edit.draft.discount),
      });
      setEdit(null);
    }, 'Modifica articolo non riuscita.');
  };

  const removeItem = async (id: string) => {
    if (!window.confirm('Eliminare questo articolo dal preventivo?')) return;
    setDeletingId(id);
    setActionError(null);
    try {
      await deleteQuoteItem(quoteId, id);
      reloadItems();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Eliminazione articolo non riuscita.');
    } finally {
      setDeletingId(null);
    }
  };

  let message: ItemsMessage | undefined;
  if (loading) message = { content: 'Caricamento articoli...' };
  else if (error) message = { content: error, tone: 'error' };
  else if (items.length === 0 && add.draft === null) {
    message = { content: 'Nessun articolo per questo preventivo.' };
  }

  return (
    <QuoteItemsTable
      action={<NewItemButton disabled={!canAdd} onClick={add.begin} />}
      expanded={add.draft !== null || edit !== null}
      columnLabels={PERSISTED_ITEM_COLUMN_LABELS}
      message={message}
      actionError={actionError}
      total={total}
    >
      {!loading && !error && (
        <>
          {items.map((item) =>
            edit?.id === item.id ? (
              <ItemEditRow
                key={item.id}
                draft={edit.draft}
                submitting={submitting}
                onField={setEditField}
                onConfirm={confirmEdit}
                onCancel={() => setEdit(null)}
              />
            ) : (
              <PersistedQuoteItemRow
                key={item.id}
                item={item}
                onEdit={() => setEdit({ id: item.id, draft: draftFromItem(item) })}
                onDelete={() => removeItem(item.id)}
                deleting={deletingId === item.id}
                disabled={!idle}
              />
            ),
          )}
          {add.draft && (
            <ItemDraftRow
              draft={add.draft}
              submitting={submitting}
              onField={add.setField}
              onProductSelect={add.selectProduct}
              onConfirm={confirmAdd}
              onCancel={add.clear}
            />
          )}
        </>
      )}
    </QuoteItemsTable>
  );
}
