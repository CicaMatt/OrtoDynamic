import { useState } from 'react';
import { DataCard } from '../../../shared/entity/DataCard';
import { ScrollableTable } from '../../../shared/entity/ScrollableTable';
import { formatEuro } from '../../../shared/format/format';
import { FieldValue } from '../../../shared/ui/FieldValue';
import { useEntityEdit } from '../../../app/editing/EntityEditContext';
import type { Product } from '../../products/types';
import type { QuoteItemDraft } from '../types';
import { IconButton, ItemDraftRow, MessageRow, NewItemButton } from '../components/QuoteItemRow';
import {
  discountError,
  EMPTY_ITEM_DRAFT,
  ITEM_COLUMN_COUNT,
  ITEM_COLUMN_LABELS,
  previewAmount,
} from '../components/quoteItemMath';

/**
 * Pending line items for a quote being created. The quote has no id yet, so
 * these are held in the edit session (not posted per row) and sent together with
 * the quote on Save, which the backend inserts in one transaction. The UI mirrors
 * the detail view's items card: "Aggiungi" opens a draft row picked from the live
 * `nomenclatore` lookup; confirmed rows are listed and can be removed before
 * saving. Importo is previewed locally (prezzo × quantità less the sconto %).
 */
export function QuoteItemsDraftCard() {
  const { quoteItemDrafts, addQuoteItemDraft, removeQuoteItemDraft } = useEntityEdit();
  const [draft, setDraft] = useState<QuoteItemDraft | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const setField = (key: keyof QuoteItemDraft, value: string) =>
    setDraft((current) => (current ? { ...current, [key]: value } : current));

  const selectProduct = (product: Product) =>
    setDraft((current) =>
      current
        ? {
            ...current,
            productId: product.idProduct,
            code: product.code,
            description: product.description,
            price: product.price,
          }
        : current,
    );

  const confirmDraft = () => {
    if (!draft || draft.productId.trim() === '') return;
    const invalid = discountError(draft.discount);
    if (invalid) {
      setActionError(invalid);
      return;
    }
    addQuoteItemDraft(draft);
    setDraft(null);
    setActionError(null);
  };

  return (
    <DataCard
      icon="inventory_2"
      title="Articoli Preventivo"
      action={
        <NewItemButton disabled={draft !== null} onClick={() => setDraft({ ...EMPTY_ITEM_DRAFT })} />
      }
    >
      <ScrollableTable surfaceClassName="rounded-xl border border-outline-variant/50">
        <table className="w-full text-left font-body-md text-body-md">
          <thead className="bg-secondary font-label-caps text-label-caps text-on-secondary border-b border-outline-variant/50">
            <tr>
              {ITEM_COLUMN_LABELS.map((label) => (
                <th key={label} className="py-3 px-4 uppercase font-bold tracking-wider whitespace-nowrap">
                  {label}
                </th>
              ))}
              <th className="py-3 px-4 w-px text-right uppercase font-bold tracking-wider">
                <span className="sr-only">Azioni</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {quoteItemDrafts.length === 0 && draft === null && (
              <MessageRow colSpan={ITEM_COLUMN_COUNT}>
                Nessun articolo. Aggiungine uno con «Aggiungi».
              </MessageRow>
            )}
            {quoteItemDrafts.map((item, index) => (
              <DraftReadRow
                key={index}
                item={item}
                onDelete={() => removeQuoteItemDraft(index)}
              />
            ))}
            {draft && (
              <ItemDraftRow
                draft={draft}
                submitting={false}
                onField={setField}
                onProductSelect={selectProduct}
                onConfirm={confirmDraft}
                onCancel={() => setDraft(null)}
              />
            )}
          </tbody>
        </table>
      </ScrollableTable>

      {actionError && <p className="mt-[16px] font-body-sm text-body-sm text-error">{actionError}</p>}
    </DataCard>
  );
}

/** A confirmed pending item: read-only values (importo computed) plus a remove action. */
function DraftReadRow({ item, onDelete }: { item: QuoteItemDraft; onDelete: () => void }) {
  return (
    <tr className="border-b border-surface-variant last:border-0 hover:bg-surface-container-low transition-colors duration-300">
      <td className="py-3 px-4 whitespace-nowrap">
        <FieldValue value={item.code} />
      </td>
      <td className="py-3 px-4 align-top">
        <div className="max-w-[360px] whitespace-normal break-words">
          <FieldValue value={item.description} />
        </div>
      </td>
      <td className="py-3 px-4 whitespace-nowrap">
        <FieldValue value={item.quantity} />
      </td>
      <td className="py-3 px-4 whitespace-nowrap">
        <FieldValue value={formatEuro(item.price)} />
      </td>
      <td className="py-3 px-4 whitespace-nowrap">
        <FieldValue value={formatEuro(previewAmount(item.price, item.quantity, item.discount))} />
      </td>
      <td className="py-3 px-4 whitespace-nowrap">
        <FieldValue value={item.discount} />
      </td>
      <td className="py-3 px-4 text-right">
        <IconButton icon="delete" title="Rimuovi articolo" tone="danger" onClick={onDelete} />
      </td>
    </tr>
  );
}
