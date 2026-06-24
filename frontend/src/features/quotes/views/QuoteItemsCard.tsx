import { useState } from 'react';
import { DataCard } from '../../../shared/entity/DataCard';
import { formatEuro, formatInteger } from '../../../shared/format/format';
import { FieldValue } from '../../../shared/ui/FieldValue';
import { ReferenceName } from '../../../shared/ui/ReferenceName';
import { useApiData } from '../../../shared/hooks/useApiData';
import type { Product } from '../../products/types';
import {
  createQuoteItem,
  deleteQuoteItem,
  fetchQuoteItems,
  updateQuoteItem,
} from '../api/quotes';
import type { QuoteItem, QuoteItemDraft } from '../types';
import {
  IconButton,
  ItemDraftRow,
  ItemEditRow,
  MessageRow,
  NewItemButton,
} from '../components/QuoteItemRow';
import {
  discountError,
  draftFromItem,
  EMPTY_ITEM_DRAFT,
  ITEM_COLUMN_COUNT,
  toNullableNumber,
} from '../components/quoteItemMath';

/**
 * Read-mode columns in display order; the value is read straight off the item.
 * `wrap` lets a long cell (the product description) flow onto multiple lines
 * instead of forcing the row onto a single, ever-widening line. `format` maps the
 * raw value to its display string (e.g. Euro formatting for prezzo/importo).
 */
const READ_COLUMNS: ReadonlyArray<{
  key: keyof QuoteItem;
  label: string;
  wrap?: boolean;
  format?: (raw: string) => string;
}> = [
  { key: 'productCode', label: 'Codice Nomenclatore' },
  { key: 'productDescription', label: 'Prodotto', wrap: true },
  { key: 'quantity', label: 'Quantità', format: formatInteger },
  { key: 'price', label: 'Prezzo', format: formatEuro },
  { key: 'amount', label: 'Importo', format: formatEuro },
  { key: 'discount', label: 'Sconto' },
];

/** State of the one line being edited inline: its id plus the working draft. */
type EditState = { id: string; draft: QuoteItemDraft };

/**
 * A quote's line items (`item_preventivi`), with inline add, edit, and delete.
 * "Aggiungi" opens an empty draft row: the product is picked from the live
 * `nomenclatore` lookup — by code or by description — and only quantity and
 * discount are typed, since prezzo and importo are derived by the backend.
 * Editing a row reopens its quantity/discount for the same recompute (sconto
 * being a 1–100 discount applied to the importo). Each mutation persists
 * immediately and refetches the list so the table always reflects the server.
 */
export function QuoteItemsCard({ quoteId }: { quoteId: string }) {
  const [reloadKey, setReloadKey] = useState(0);
  const { data, loading, error } = useApiData(
    () => fetchQuoteItems(quoteId),
    [quoteId, reloadKey],
  );

  const [addDraft, setAddDraft] = useState<QuoteItemDraft | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const items = data ?? [];
  const busy = submitting || deletingId !== null;
  // Only one inline operation (add / edit / delete) at a time.
  const idle = addDraft === null && edit === null && !busy;
  const canAdd = !loading && !error && idle;

  const setAddField = (key: keyof QuoteItemDraft, value: string) =>
    setAddDraft((current) => (current ? { ...current, [key]: value } : current));

  // Picking from either the code or the product field fills both, plus the price.
  const selectProduct = (product: Product) =>
    setAddDraft((current) =>
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

  const setEditField = (key: keyof QuoteItemDraft, value: string) =>
    setEdit((current) => (current ? { ...current, draft: { ...current.draft, [key]: value } } : current));

  const confirmAdd = async () => {
    if (!addDraft || addDraft.productId.trim() === '') return;
    const invalid = discountError(addDraft.discount);
    if (invalid) {
      setActionError(invalid);
      return;
    }
    setSubmitting(true);
    setActionError(null);
    try {
      await createQuoteItem(quoteId, {
        productId: Number(addDraft.productId),
        quantity: toNullableNumber(addDraft.quantity),
        discount: toNullableNumber(addDraft.discount),
      });
      setAddDraft(null);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Creazione articolo non riuscita.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmEdit = async () => {
    if (!edit) return;
    const invalid = discountError(edit.draft.discount);
    if (invalid) {
      setActionError(invalid);
      return;
    }
    setSubmitting(true);
    setActionError(null);
    try {
      await updateQuoteItem(quoteId, edit.id, {
        quantity: toNullableNumber(edit.draft.quantity),
        discount: toNullableNumber(edit.draft.discount),
      });
      setEdit(null);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Modifica articolo non riuscita.');
    } finally {
      setSubmitting(false);
    }
  };

  const removeItem = async (id: string) => {
    if (!window.confirm('Eliminare questo articolo dal preventivo?')) return;
    setDeletingId(id);
    setActionError(null);
    try {
      await deleteQuoteItem(quoteId, id);
      setReloadKey((key) => key + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Eliminazione articolo non riuscita.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DataCard
      icon="inventory_2"
      title="Articoli Preventivo"
      action={
        <NewItemButton disabled={!canAdd} onClick={() => setAddDraft({ ...EMPTY_ITEM_DRAFT })} />
      }
    >
      <div className="overflow-x-auto rounded-xl border border-outline-variant/50">
        <table className="w-full text-left font-body-md text-body-md">
          <thead className="bg-secondary font-label-caps text-label-caps text-on-secondary border-b border-outline-variant/50">
            <tr>
              {READ_COLUMNS.map((column) => (
                <th
                  key={column.key}
                  className="py-3 px-4 uppercase font-bold tracking-wider whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}
              <th className="py-3 px-4 w-px text-right uppercase font-bold tracking-wider">
                <span className="sr-only">Azioni</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <MessageRow colSpan={ITEM_COLUMN_COUNT}>Caricamento articoli...</MessageRow>
            ) : error ? (
              <MessageRow colSpan={ITEM_COLUMN_COUNT} tone="error">{error}</MessageRow>
            ) : (
              <>
                {items.length === 0 && addDraft === null && (
                  <MessageRow colSpan={ITEM_COLUMN_COUNT}>
                    Nessun articolo per questo preventivo.
                  </MessageRow>
                )}
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
                    <ReadRow
                      key={item.id}
                      item={item}
                      onEdit={() => setEdit({ id: item.id, draft: draftFromItem(item) })}
                      onDelete={() => removeItem(item.id)}
                      deleting={deletingId === item.id}
                      disabled={!idle}
                    />
                  ),
                )}
                {addDraft && (
                  <ItemDraftRow
                    draft={addDraft}
                    submitting={submitting}
                    onField={setAddField}
                    onProductSelect={selectProduct}
                    onConfirm={confirmAdd}
                    onCancel={() => setAddDraft(null)}
                  />
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {actionError && <p className="mt-[16px] font-body-sm text-body-sm text-error">{actionError}</p>}
    </DataCard>
  );
}

function ReadRow({
  item,
  onEdit,
  onDelete,
  deleting,
  disabled,
}: {
  item: QuoteItem;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
  disabled: boolean;
}) {
  return (
    <tr className="border-b border-surface-variant last:border-0 hover:bg-surface-container-low transition-colors duration-300">
      {READ_COLUMNS.map((column) => {
        const raw = item[column.key];
        const value = column.format ? column.format(raw) : raw;
        return (
          <td
            key={column.key}
            className={`py-3 px-4 ${column.wrap ? 'align-top' : 'whitespace-nowrap'}`}
          >
            {column.wrap ? (
              <div className="max-w-[360px] whitespace-normal break-words">
                {renderReadValue(column.key, value, item)}
              </div>
            ) : (
              renderReadValue(column.key, value, item)
            )}
          </td>
        );
      })}
      <td className="py-3 px-4 text-right">
        <div className="flex items-center justify-end gap-[4px]">
          <IconButton
            icon="edit"
            title="Modifica articolo"
            tone="neutral"
            onClick={onEdit}
            disabled={disabled}
          />
          <IconButton
            icon="delete"
            title="Elimina articolo"
            tone="danger"
            onClick={onDelete}
            disabled={disabled}
            busy={deleting}
          />
        </div>
      </td>
    </tr>
  );
}

function renderReadValue(key: keyof QuoteItem, value: string, item: QuoteItem) {
  if (key === 'productCode' || key === 'productDescription') {
    return <ReferenceName name={value} id={item.productId} entity="product" />;
  }
  return <FieldValue value={value} />;
}
