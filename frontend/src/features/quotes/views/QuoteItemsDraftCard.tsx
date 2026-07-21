import { useState } from 'react';
import { ItemDraftRow, NewItemButton } from '../components/QuoteItemRow';
import { PendingQuoteItemRow, QuoteItemsTable } from '../components/QuoteItemsTable';
import { quoteItemDraftError } from '../components/quoteItemMath';
import { useQuoteItemDraft } from '../components/useQuoteItemDraft';
import { useQuoteEditor } from '../useQuoteEditor';

/**
 * Local controller for items belonging to a quote that has not been saved yet.
 * Confirmed rows stay in the edit session and are persisted with the quote.
 */
export function QuoteItemsDraftCard({ total }: { total: string }) {
  const { items, addItem, removeItem } = useQuoteEditor();
  const itemDraft = useQuoteItemDraft();
  const [actionError, setActionError] = useState<string | null>(null);

  const confirmDraft = () => {
    if (!itemDraft.draft || itemDraft.draft.productId.trim() === '') return;
    const invalid = quoteItemDraftError(itemDraft.draft);
    if (invalid) {
      setActionError(invalid);
      return;
    }
    addItem(itemDraft.draft);
    itemDraft.clear();
    setActionError(null);
  };

  const message =
    items.length === 0 && itemDraft.draft === null
      ? { content: 'Nessun articolo. Aggiungine uno con «Aggiungi».' }
      : undefined;

  return (
    <QuoteItemsTable
      action={<NewItemButton disabled={itemDraft.draft !== null} onClick={itemDraft.begin} />}
      expanded={itemDraft.draft !== null}
      message={message}
      actionError={actionError}
      total={total}
    >
      {items.map((item, index) => (
        <PendingQuoteItemRow key={index} item={item} onDelete={() => removeItem(index)} />
      ))}
      {itemDraft.draft && (
        <ItemDraftRow
          draft={itemDraft.draft}
          submitting={false}
          onField={itemDraft.setField}
          onProductSelect={itemDraft.selectProduct}
          onConfirm={confirmDraft}
          onCancel={itemDraft.clear}
        />
      )}
    </QuoteItemsTable>
  );
}
